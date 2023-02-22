const React = require('react');
const ReactDOM = require('react-dom');

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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

const options = [{label: 'The Godfather'}, {label: 'Pulp Fiction'}];

ReactDOM.createRoot(document.querySelector("#root")).render(
    <React.StrictMode>
        <ComboBox />
    </React.StrictMode>
);