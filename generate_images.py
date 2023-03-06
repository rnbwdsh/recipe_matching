import base64
import os
from ast import literal_eval
from multiprocessing import Pool
from typing import Set

import pandas as pd
import requests

# requires AUTOMATIC1111/stable-diffusion-webui (stable diffusion web api) to runhttps://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API
list_columns = ["ingredients", "ingredients_raw_str", "steps", "tags", "search_terms"]
df = pd.read_csv('recipes_w_search_terms_10k.csv',
                 converters={k: lambda a: list(literal_eval(a)) for k in list_columns},
                 index_col=0)
REQ_ALL = {"steps": 20, "batch_size": 1, "cfg_scale": 15, "width": 420, "height": 420,
           "negative_prompt": "text, cartoon, illustration, drawing, sketch, doodle, hand"}
URL = 'http://127.0.0.1:7860/sdapi/v1/txt2img'
# df =  df.loc[list(sorted(df.index))[:10_000]].to_csv("recipes_w_search_terms_10k.csv")


def create_images(name: str, ingredients: Set, idx: int):
    prompt = f"High res, top down image of prepared ingredients in appropriate containers on a plain white background: {ingredients}. No extra ingredients."
    food = requests.post(url=URL, json={"prompt": prompt, **REQ_ALL})
    prompt = f"High res cookbook image of {name} with ingredients: {ingredients}"
    ing = requests.post(url=URL, json={"prompt": prompt, **REQ_ALL})
    for i, img in enumerate(ing.json()["images"] + food.json()["images"]):
        with open(f"static/images/{idx}/{'ingedients' if i else 'meal'}.jpg", "wb") as f:
            f.write(base64.b64decode(img))


with Pool(10) as p:
    for idx in list(sorted(df.index))[:10_000]:
        path = f"static/images/{idx}"
        if not os.path.exists(path + "/meal.jpg"):
            os.makedirs(path, exist_ok=True)
            recipe = df.loc[idx]
            name, ingredients = recipe["name"], ", ".join(recipe.ingredients)
            # run request in process
            p.apply_async(create_images, args=(name, ingredients, idx))
    p.close()
    p.join()
