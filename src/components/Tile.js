import * as React from "react";
import Box from "@mui/material/Box";
import './Tile.css'

class Tile extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    size: 100,
	    toggled: true
	};
    }

    shouldComponentUpdate(nextProps, nextState) {
	if (nextProps.type === this.props.type) return false;
	return true;
    }

    
    render() {
	console.log("render Tile");
	var c = () => {
	    /* if (this.state.toggled) {
	       this.setState({toggled: false});
	       } else if (!this.state.toggled) {
	       this.setState({toggled: true});
	       }  */
	}
	let style = {
	    width: this.state.size,
	    height: this.state.size,
	    backgroundColor: "#FF4141",
	    "&:hover": {
		backgroundColor: "#FF7676",
		opacity: [0.9, 0.8, 0.7]
	    }
	};
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
	    <button onClick={this.props.onClick} style={{outline: 'none', border: "0px", padding: "0px"}}>
	    { box }
	    </button>
	);
    }
}

export default Tile;
