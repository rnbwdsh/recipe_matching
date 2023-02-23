import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
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
const options = [{label: 'The Godfather'}, {label: 'Pulp Fiction'}];

export default function ComboBox() {
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
        />
    );
};


ReactDOM.render(<IngredientsRoot/>, document.getElementById('ingredients-root'));

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ComboBox/>
    </React.StrictMode>
);
