function getCookies() {
    let defaultValues = [];
    document.cookie
        .split("; ")
        .find((row) => row.startsWith("ingredients="))
        ?.split("=")[1]
        .split(",")
        .forEach((value) => defaultValues.push(value));
    return (defaultValues[0] === "") ? [] : defaultValues;
}

function calcIngredients(recipe) {
    var missingIngs = [];
    if(recipe !== undefined){
        recipe.ingredients.map(ing => {
            if(!getCookies().includes(ing)) missingIngs.push(ing);
        })

        return missingIngs.length === 0 ? "You have all ingredients for this recipe!" : "You are missing the following ingredients: " + missingIngs.join(", ");
    }
    return "Oh oh, something went wrong here...";
}