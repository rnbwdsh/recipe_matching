import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem, InputAdornment, IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import React from "react";
import ReactDOM from "react-dom";

function PopulatedComboBox(props) {
    const [ingredients, setIngredients] = React.useState([]);

    React.useEffect(() => {
        fetch('/ingredients')
            .then((response) => response.json())
            .then((ingredients) => {
                setIngredients(ingredients);
            });
    }, []);

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={Object.keys(ingredients)}
            defaultValue={getCookies}
            onChange={(event, value) => setCookies(value, props.tags, props.setTags)}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Ingredients"
                />
            )}
        />
    );
}

const RecipesRoot = ({tags}) => {
    const [recipes, setRecipes] = React.useState({});

    React.useEffect(() => {
        fetch('/search?' + new URLSearchParams({
            q: Object.values(tags).filter(val => val !== "").toString()
        }))
            .then((response) => response.json())
            .then((recipes) => {
                setRecipes(recipes);
            });
    }, [tags]);

    return <RecipeCard recipes={recipes}/>;
};

function RecipeCard(props) {
    if(props.recipes[1] === undefined){
        return <div>Loading...</div>
    }
    else{
        return (
            <Grid container spacing={3}>
                {props.recipes.map(recipe => (
                    <Grid item>
                            <Card>
                                <CardMedia component='img' height='140' image={"static/images/" + recipe.id + "/meal.jpg"} alt={"image of recipe " + recipe.name}/>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        {recipe.name}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {(filterIngredients(recipe.ingredients, false).length > 0) &&
                                            <b>{filterIngredients(recipe.ingredients, false).join(", ")}, </b>
                                        }
                                        <span>{filterIngredients(recipe.ingredients, true).join(", ")}</span>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' onClick={() => DetailedRecipeCard(recipe)}>View recipe</Button>
                                </CardActions>
                            </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

function DetailedRecipeCard(recipe) {
    var children = document.getElementById('selected-recipe').children;
    if(children.length > 0 && children[0].id == recipe.id) {
        ReactDOM.unmountComponentAtNode(document.getElementById('selected-recipe'));
    }
    else {
        const card = (
                <Card id={recipe.id}>
                    <CardMedia component='img' image={"static/images/" + recipe.id + "/meal.jpg"} alt={"image of recipe " + recipe.name}/>

                    <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                            {recipe.name}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' style={{whiteSpace: 'pre-line'}}>
                            {recipe.ingredients_raw_str.join('\n')}
                        </Typography>

                        <CardMedia component='img' image={"static/images/" + recipe.id + "/ingedients.jpg"} alt={"image of ingredients " + recipe.name}/>

                        <Typography variant='body2' sx={{ mt: 2 }} style={{whiteSpace: 'pre-line'}}>
                            {recipe.steps.map((elem, idx) => idx+1 + '. ' + elem).join('\n')}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }} style={{whiteSpace: 'pre-line'}}>
                            Tags: {recipe.tags.join(', ')}
                        </Typography>
                    </CardContent>
                </Card>
        );


        ReactDOM.render(card, document.getElementById('selected-recipe'));
    }
}

export default function TagSelect(props) {
    let key;
    let state = JSON.parse(JSON.stringify(props.tags));

    switch(props.label){
        case 'Meal Type': key = "type"; break;
        case 'Cuisine': key = "cuisine"; break;
        case 'Diet': key = "diet"; break;
        case 'Time': key = "time"; break;
        default: console.log("Error: Tag Select state could not be defined"); break;
    }

    const [tagType, setTagType] = React.useState("");

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setTagType(value);
        state[key] = value;
        props.setTags(state);
    };

    return (
        <FormControl sx={{width: 250}}>
            <InputLabel id="label">{props.label}</InputLabel>
            <Select
                labelId="label"
                placeholder={props.label}
                value={tagType}
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {props.options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function Search(props) {
    const [searchVal, setSearch] = React.useState("");

    let state = JSON.parse(JSON.stringify(props.tags));

    function searchRecipes() {
        state['search'] = searchVal;
        props.setTags(state);
        console.log(props.tags);
    }

    return (
        <TextField
            id="recipe-search"
            label="Search for recipes..."
            value={searchVal}
            onChange={(e) => {setSearch(e.target.value);}}
            sx={{width: 270}}
            InputProps={{endAdornment: (
                    <InputAdornment position="end">
                        <IconButton edge="end" color="primary">
                            <SearchIcon onClick={searchRecipes}/>
                        </IconButton>
                    </InputAdornment>
                )}}
        />
    );
}

const mealOptions = [
    {value: "breakfast", label: "Breakfast"},
    {value: "lunch", label: "Lunch"},
    {value: "dinner", label: "Dinner"},
    {value: "dessert", label: "Dessert"},
    {value: "appetizer", label: "Appetizer"},
    {value: "side", label: "Side"},
    {value: "bread", label: "Bread"},
    {value: "salad", label: "Salad"}
];

const cuisineOptions = [
    {value: "southern", label: "Southern"},
    {value: "mexican", label: "Mexican"},
    {value: "italian", label: "Italian"},
    {value: "indian", label: "Indian"},
    {value: "chinese", label: "Chinese"},
    {value: "greek", label: "Greek"},
    {value: "german", label: "German"},
    {value: "french", label: "French"},
    {value: "english", label: "English"},
    {value: "caribbean", label: "Caribbean"},
    {value: "lebanese", label: "Lebanese"},
    {value: "turkish", label: "Turkish"},
    {value: "thai", label: "Thai"},
    {value: "irish", label: "Irish"},
    {value: "japanese", label: "Japanese"},
    {value: "russian", label: "Russian"},
    {value: "vietnamese", label: "Vietnamese"}
];

const dietOptions = [
    {value: "vegetarian", label: "Vegetarian"},
    {value: "vegan", label: "Vegan"},
    {value: "gluten-free", label: "Gluten-free"},
    {value: "lactose-free", label: "Lactose-free"},
    {value: "low-carb", label: "Low Carb"},
    {value: "low-fat", label: "Low Fat"},
    {value: "low-sodium", label: "Low Sodium"},
    {value: "low-calorie", label: "Low Calorie"}
];

const timeOptions = [
    {value: "15-minutes-or-less", label: "< 15 minutes"},
    {value: "30-minutes-or-less", label: "< 30 minutes"},
    {value: "60-minutes-or-less", label: "< 60 minutes"}
];

function RecipeContainer() {
    const [tags, setTags] = React.useState({
        type: "",
        cuisine: "",
        diet: "",
        time: "",
        search: ""
    });

    return (
        <div>
            <div className="ingredients">
                <PopulatedComboBox tags={tags} setTags={setTags}/>
            </div>
            <div className="food">
                <div className="recipes">
                    <div>
                        <span><TagSelect label={"Meal Type"} options={mealOptions} tags={tags} setTags={setTags}/></span>
                        <span><TagSelect label={"Cuisine"} options={cuisineOptions} tags={tags} setTags={setTags}/></span>
                        <span><TagSelect label={"Diet"} options={dietOptions} tags={tags} setTags={setTags}/></span>
                        <span><TagSelect label={"Time"} options={timeOptions} tags={tags} setTags={setTags}/></span>
                        <span><Search tags={tags} setTags={setTags}/></span>
                    </div>
                    <br/>
                    <div><RecipesRoot tags={tags}/></div>
                </div>
                <div className="selection">
                    <div id="selected-recipe">
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>
    );
}

function setCookies(ingredient, tags, setTags) {
    document.cookie = "ingredients=" + ingredient + "; SameSite=None; Secure";
    setTags(JSON.parse(JSON.stringify(tags)));
}

ReactDOM.createRoot(document.getElementById('recipe-container')).render(<RecipeContainer />);