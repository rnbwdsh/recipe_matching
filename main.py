from ast import literal_eval
from collections import Counter, OrderedDict
from typing import Optional, Dict

import pandas as pd
from fastapi import FastAPI, Cookie, HTTPException
from starlette.responses import HTMLResponse, JSONResponse, Response
from starlette.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
# only read 10 rows
list_columns = ["ingredients", "ingredients_raw_str", "steps", "tags", "search_terms"]
# data from https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions
df = pd.read_csv('../recipes_w_search_terms.csv', converters={k: lambda a: list(literal_eval(a)) for k in list_columns}, index_col=0,
                 nrows=10)  # for debugging purposes, only work with 10 recipes
ingredients = Counter([item for sublist in df["ingredients"] for item in sublist])
ingredients = OrderedDict(sorted(ingredients.items(), key=lambda x: x[1], reverse=True))


@app.get("/")
async def root():
    with open("index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)


@app.get("/search")
# async def search(cookie: Optional[str] = Cookie(default=None), q: Optional[str] = None):
async def search(cookie: Optional[str] = Cookie(default=None), q: Optional[str] = None):
    ing = cookie.split(",") if cookie else []
    mask = df["ingredients"].apply(lambda x: all(item in x for item in ing))
    dfc = df[mask]
    if q:
        dfc = dfc[dfc["search_terms"].apply(lambda searchterms: q in searchterms) |
                  dfc["tags"].apply(lambda tags: q in tags) |
                  dfc["name"].apply(lambda name: q in name)]
    return Response(content=dfc.to_json(orient="records"), media_type="application/json")


@app.get("/recipe/{rid}")
async def recipe(rid: int):
    if rid not in df.index:
        raise HTTPException(status_code=404, detail=f"Recipe with id {rid} not found")
    return Response(content=df.loc[rid].to_dict(), media_type="application/json")


@app.get("/ingredients")
async def all_ingredients() -> Dict[str, int]:
    return ingredients
