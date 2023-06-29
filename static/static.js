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

// function to filter a list of ingredients, based if they are in cookies or not
function filterIngredients(ingredients, invert) {
    let cookies = getCookies();
    let filtered = [];
    ingredients.forEach((ingredient) => {
        if (invert ^ cookies.includes(ingredient)) {
            filtered.push(ingredient);
        }
    });
    return filtered;
}