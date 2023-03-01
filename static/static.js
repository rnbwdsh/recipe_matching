
/*
    Toggle dropdown menu on button
 */
function toggleDropdown(button) {
    document.getElementById(button).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function setCookies(ingredient) {
    document.cookie = "ingredients=" + ingredient + "; SameSite=None; Secure";       // order matters!! find out why todo



}

function getCookies() {
    let defaultValues = [];
    document.cookie
        .split("; ")
        .find((row) => row.startsWith("ingredients="))
        ?.split("=")[1]
        .split(",")
        .forEach((value) => defaultValues.push(value));
    return defaultValues;
}

function viewRecipe() {
    console.log("button is being pressed");
    document.getElementById("selected-recipe").innerHTML = "hi hello!";
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