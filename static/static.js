/*
Gets all ingredients and displays them in a text field -> use for ingredient list later
*/
async function showIngredients() {
    fetch("/ingredients")
        .then((response) => response.json())
        .then((ingredients) => {
            console.log(Object.keys(ingredients));
            document.getElementById("ingredients").textContent = Object.keys(ingredients).toString();
        });
}

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