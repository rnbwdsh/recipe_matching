import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
    Grid } from '@mui/material'
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

{/* <CardMedia component='img' height='140' image='https://img.freepik.com/free-photo/top-view-healthy-food-immunity-boosting-composition_23-2148890265.jpg?w=1060&t=st=1677435651~exp=1677436251~hmac=6bbe47a617712cdfd32ab8848f5833a6503e25796709e632a53e0f262b821ea9' alt='food'/> */}

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
        return <div>Loading...uwu</div>
    }
    else{
        return (
            <Grid container spacing={3}>
                {recipes.recipes.map(recipe => (
                    <Grid item xs={12} sm={6} md={3}>
                        <Box width='300px'>
                            <Card>
                                <CardMedia component='img' height='140' image='https://img.freepik.com/free-photo/top-view-healthy-food-immunity-boosting-composition_23-2148890265.jpg?w=1060&t=st=1677435651~exp=1677436251~hmac=6bbe47a617712cdfd32ab8848f5833a6503e25796709e632a53e0f262b821ea9' alt='food'/>
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
                                    <Button size='small' onClick={viewRecipe}>View recipe</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    }

};

ReactDOM.render(<RecipesRoot/>, document.getElementById('recipe-card'));

ReactDOM.createRoot(document.getElementById('root')).render(<PopulatedComboBox />);
