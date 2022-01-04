import "./App.css";
import Tile from "./components/Tile";
import Box from "@mui/material/Box";
import {useState} from 'react';
import PathingGrid from "./components/PathingGrid";

function App() {
    
    return (
	<div className="App">
	    <PathingGrid />
	</div>
    );
}

export default App;
