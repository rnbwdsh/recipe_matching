const React = require('react');
const ReactDOM = require('react-dom');

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

ReactDOM.render(<IngredientsRoot />, document.getElementById('ingredients-root'));

