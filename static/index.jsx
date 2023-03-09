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

const IngredientsList = ({ ingredients }) => {
    return (
        <div>
            {Object.keys(ingredients).map(key => (
                <div key={key}>
                    <input type="checkbox" id={key} />
                    <label htmlFor={key}>{key}</label>
                </div>
            ))}
        </div>
    );
};

const IngredientsRoot = () => {
    const [ingredients, setIngredients] = React.useState({});

    React.useEffect(() => {
        fetch('/ingredients')
            .then((response) => response.json())
            .then((ingredients) => setIngredients(ingredients));
    }, []);

    return <IngredientsList ingredients={ingredients} />;
};

function PopulatedComboBox() {
    const [ingredients, setIngredients] = React.useState([]);

    React.useEffect(() => {
        fetch('/ingredients')
            .then((response) => response.json())
            .then((ingredients) => {
                console.log(ingredients);
                setIngredients(ingredients);
            });
    }, []);

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={Object.keys(ingredients)}
            defaultValue={getCookies}
            onChange={(event, value) => setCookies(value)}
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

const RecipesRoot = () => {
    const [recipes, setRecipes] = React.useState({});

    React.useEffect(() => {
        fetch('/search')
            .then((response) => response.json())
            .then((recipes) => {
                setRecipes(recipes);
            });
    }, []);

    return <RecipeCard recipes={recipes}/>;
};

function RecipeCard(recipes) {
    if(recipes.recipes[1] === undefined){       // TODO: find a better way to check this, this is ungodly
        return <div>Loading...</div>
    }
    else{
        return (
            <Grid container spacing={3}>
                {recipes.recipes.map(recipe => (
                    <Grid item xs={12} sm={6} md={3}>
                        <Box width='300px'>
                            <Card>
                                <CardMedia component='img' height='140' image={"static/images/" + recipe.id + "/meal.jpg"} alt={"image of recipe " + recipe.name}/>
                                <CardContent>
                                    <Typography gutterBottom variant='h5' component='div'>
                                        {recipe.name}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        {recipe.ingredients.join(', ')}
                                    </Typography>
                                    <Typography variant='body2' sx={{ mt: 2 }}>
                                        {calcIngredients(recipe)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' onClick={() => DetailedRecipeCard(recipe)}>View recipe</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

function DetailedRecipeCard(recipe) {
    console.log(recipe);
    const card = (
        <Box width='480px'>
            <Card>
                <CardMedia component='img' image={"static/images/" + recipe.id + "/meal.jpg"} alt={"image of recipe " + recipe.name}/>
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {recipe.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' style={{whiteSpace: 'pre-line'}}>
                        {recipe.ingredients_raw_str.join('\n')}
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 2 }} style={{whiteSpace: 'pre-line'}}>
                        {recipe.steps.map((elem, idx) => idx+1 + '. ' + elem).join('\n')}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );

    ReactDOM.render(card, document.getElementById('selected-recipe'));

}

export default function TagSelect(props) {
    const [tagType, setTagType] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setTagType(value);
    };
    return (
        <FormControl sx={{width: 250}}>
            <InputLabel id="label">{props.label}</InputLabel>
            <Select
                labelId="label"
                placeholder={props.label}
                value={tagType}
                onChange={handleChange}
                multiple={props.isMult}
            >
                {!props.isMult &&
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                }
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

function Search() {
    return (
        <TextField
            id="recipe-search"
            label="Search for recipes..."
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

function setCookies(ingredient) {
    document.cookie = "ingredients=" + ingredient + "; SameSite=None; Secure";       // order matters!! find out why todo
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

ReactDOM.createRoot(document.getElementById('root')).render(<PopulatedComboBox />);
ReactDOM.render(<RecipesRoot/>, document.getElementById('recipe-card'));
ReactDOM.render(<TagSelect label={"Meal Type"} options={mealOptions} isMult={true}/>, document.getElementById('meal-select'));
ReactDOM.render(<TagSelect label={"Cuisine"} options={cuisineOptions} isMult={true}/>, document.getElementById('cuisine-select'));
ReactDOM.render(<TagSelect label={"Diet"} options={dietOptions} isMult={true}/>, document.getElementById('diet-select'));
ReactDOM.render(<TagSelect label={"Time"} options={timeOptions} isMult={false}/>, document.getElementById('time-select'));
ReactDOM.render(<Search/>, document.getElementById('search-bar'));