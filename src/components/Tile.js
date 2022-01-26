import * as React from "react";
import Box from "@mui/material/Box";
import './Tile.css'

class Tile extends React.Component {

    //as to not render all tiles everytime one is updated
    shouldComponentUpdate(nextProps, nextState) {
	if (nextProps.type !== this.props.type) return true;
	//if (nextProps.id > this.props.numTiles) return true;
	/* console.log(nextProps.type);
	   console.log(this.props.type); */
	return false;
    }

    
    render() {
	//swap type of tyle for rendering
	let box;
	switch (this.props.type) {
	    case "finish":
		box = (<Box className='finish'></Box>);
		break;
	    case "path":
		box = (<Box className='path'></Box>);
		break;
	    case "unvisited":
		box = (<Box className='unvisited'></Box>);
		break;
	    case "start":
		box = (<Box className='start'></Box>);
		break;
	    case "visiting":
		box = (<Box className='node-visited'></Box>);
		break;
	    case "wall":
		box = (<Box className='wall'></Box>);
		break;
	}
	
	return (
	    <button onMouseOver={this.props.drag} onMouseDown={this.props.click} style={{outline: 'none', border: "0px", padding: "0px"}}>
	    { box }
	    </button>
	);
    }
}

export default Tile;
