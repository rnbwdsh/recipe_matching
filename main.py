from ast import literal_eval
from collections import Counter, OrderedDict
from typing import Optional, Dict

import pandas as pd
from fastapi import FastAPI, Cookie, HTTPException
from starlette.responses import HTMLResponse, Response
from starlette.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
# only read 10 rows
list_columns = ["ingredients", "ingredients_raw_str", "steps", "tags", "search_terms"]
# data from https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions
df = pd.read_csv('recipes_w_search_terms_10k.csv', converters={k: lambda a: list(literal_eval(a)) for k in list_columns}, index_col=0)  # for debugging purposes, only work with 10 recipes

# create all_ingredients sets
df.ingredients = df.ingredients.apply(lambda x: set(x))
all_ingredients = Counter([item for sublist in df.ingredients for item in sublist])
all_ingredients = OrderedDict(sorted(all_ingredients.items(), key=lambda x: x[1], reverse=True))
# same for search_terms
df.search_terms = df.search_terms.apply(lambda x: set(x))
all_search_terms = Counter([item for sublist in df.search_terms for item in sublist])
all_search_terms = OrderedDict(sorted(all_search_terms.items(), key=lambda x: x[1], reverse=True))
# same for tags
df.tags = df.tags.apply(lambda x: set(x))
all_tags = Counter([item for sublist in df.tags for item in sublist])
all_tags = OrderedDict(sorted(all_tags.items(), key=lambda x: x[1], reverse=True))

# weighting of positive and negative score
SCALE = 1
print("loaded data")


@app.get("/")
def root():
    with open("index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)


@app.get("/search")
def search(ingredients: Optional[str] = Cookie(default=None),
           q: Optional[str] = None,
           selected: str = ""):
    print(ingredients, q, selected)
    ing = set(ingredients.split(",") if ingredients else [])
    selected = set([int(s) for s in selected.split(",")] if selected else [])

    # filter for ingredients that have at least one ingredient in common
    mask = df["ingredients"].apply(lambda x: any(item in x for item in ing))
    dfc = df[mask].copy()  # masked dataframe copy

    if q:  # filter by search terms, tags and name
        a = dfc["search_terms"].apply(lambda searchterms: q in searchterms)
        b = dfc["tags"].apply(lambda tags: q in tags)
        c = dfc["name"].apply(lambda name: q in name)
        dfc = dfc[a | b | c]

    # calculate score, and sort results by it
    selected_recipes = df.loc[list(selected)].ingredients
    used_ingredients = set([ss for s in selected_recipes for ss in s])
    dfc["posScore"] = dfc.apply(lambda row: score(row.ingredients, ing), axis=1)
    dfc["negScore"] = dfc.apply(lambda row: score(row.ingredients, used_ingredients), axis=1)
    dfc["score"] = dfc.posScore - dfc.negScore * SCALE
    dfc.sort_values(by="score", ascending=False, inplace=True)
    dfc.reset_index(inplace=True)  # to return index

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


@app.get("/search_terms")
async def all_search_terms_() -> Dict[str, int]:
    return all_search_terms


@app.get("/tags")
async def all_tags_() -> Dict[str, int]:
    return all_tags


def score(a, b):
    if not b:
        return 0
    return len(a & b) / len(b)
