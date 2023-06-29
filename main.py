from re import findall
from ast import literal_eval
from collections import Counter, OrderedDict
from typing import Optional, Dict
from functools import reduce
from operator import or_

import pandas as pd
from fastapi import FastAPI, Cookie, HTTPException, Query
from starlette.responses import HTMLResponse, Response
from starlette.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
# only read 10 rows
list_columns = ["ingredients", "ingredients_raw_str", "steps", "tags", "search_terms"]
# data from https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions
df = pd.read_csv('recipes_w_search_terms_10k.csv', converters={k: lambda a: list(literal_eval(a)) for k in list_columns}, index_col=0)  # for debugging purposes, only work with 10 recipes

# create all_ingredients sets
df.search_terms = df.search_terms.apply(lambda x: set(x))
df.tags = df.tags.apply(lambda x: set(x))
df.ingredients = df.ingredients.apply(lambda x: set(x))
all_ingredients = Counter([item for sublist in df.ingredients for item in sublist])
all_ingredients = OrderedDict(sorted(all_ingredients.items(), key=lambda x: x[1], reverse=True))
# similar for name: find all [a-z] words via regex, then create a set of all words
df["_nameset"] = df.name.apply(lambda x: set(findall(r"[a-z]+", x.lower())))

# weighting of positive and negative score
SCALE = 1
print("loaded data")


@app.get("/")
def root():
    with open("index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)


@app.get("/search")
def search(ingredients: Optional[str] = Cookie(default=None, description="Comma separated list of ingredients. Only one has to match, higher matching ones get a higher score.", example="salt,water"),
           q: Optional[str] = Query(default=None, description="Comma separated search query, exact-matching tags, search_terms and [a-z] parts of names", example="dinner"),
           selected: Optional[str] = Query(default=None, description="Comma separated list of recipe ids, used for negative scoring ingredients already used in those recipes to increase variety.", example="38,39")):
    ing = set(map(str.strip, ingredients.split(",")) if ingredients else [])
    selected = set([int(s) for s in selected.split(",")] if selected else [])
    q = set(map(str.strip, q.split(","))) if q else set()

    # filter for ingredients that have at least one ingredient in common
    if ing:
        mask = df["ingredients"].apply(lambda x: any(item in x for item in ing))
        dfc = df[mask].copy()  # masked dataframe copy
    else:
        dfc = df.copy()

    if q:  # filter by search terms, tags and name
        search_cols = ["search_terms", "tags", "_nameset"]
        search_bools = [dfc[col].apply(lambda x: bool(q & x)) for col in search_cols]
        dfc = dfc[reduce(or_, search_bools)]  # or-combine all search_bools, so if any of the columns match, keep row

    # calculate score, and sort results by it
    selected_recipes = df.loc[list(selected)].ingredients
    used_ingredients = set([ss for s in selected_recipes for ss in s])
    dfc["posScore"] = dfc.apply(lambda row: score(row.ingredients, ing), axis=1)
    dfc["negScore"] = dfc.apply(lambda row: score(row.ingredients, used_ingredients), axis=1)
    dfc["score"] = dfc.posScore - dfc.negScore * SCALE
    dfc.sort_values(by="score", ascending=False, inplace=True)
    dfc.reset_index(inplace=True)  # to return index
    del dfc["_nameset"]  # don't return nameset to user

    # return the top 100 results as json
    return Response(content=dfc.head(100).to_json(orient="records", index=True), media_type="application/json")


@app.get("/recipe/{rid}")
def recipe(rid: int):
    if rid not in df.index:
        raise HTTPException(status_code=404, detail=f"Recipe with id {rid} not found")
    return Response(content=df.loc[rid].to_dict(), media_type="application/json")


@app.get("/ingredients")
def all_ingredients_() -> Dict[str, int]:
    return all_ingredients


def score(a, b):
    if not b:
        return 0
    return len(a & b) / len(b)
