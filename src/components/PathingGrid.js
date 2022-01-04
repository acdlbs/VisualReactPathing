
import * as React from "react";
import Tile from "./Tile.js"
import Box from "@mui/material/Box";

class PathingGrid extends React.Component {
    
    constructor(props) {
	super(props);
	this.state = {
	    numTiles: 100,
	    tiles: [],
	    iter: 0,
	    startToggle: false,
	    endToggle: false
	};
    }


    componentDidMount() {
	this.timerID = null;
	let a = this.state.tiles.slice();
	for (let i = 0; i < this.state.numTiles; i++) {
	    let w = (new Array(this.state.numTiles).fill(1));
	    a[i] = {id: i, color: "white", weight: w, start: false, end: false};
	}
	this.setState((state, props) => ({tiles: a}));
    }

    componentWillUnmount() {

    }

    path() {
	this.dijkstra();
    }

    stop() {
	clearInterval(this.timerID);
	this.timerID = null;
    }
    
    changeColor(index, color) {
	if (index > this.state.numTiles) {
	    console.error("index greter than size of tiles");
	    this.stop();
	    return null;
	}
	let tmps = [...this.state.tiles];
	let tmp = {...tmps[index], color: color};
	tmps[index] = tmp;
	this.setState({tiles: tmps});


    }

    toggleStart() {
	this.setState({startToggle: !this.state.startToggle});
    }

    clickTile(index) {
	if (this.state.startToggle === true) {
	    let searchingSet = this.state.tiles.slice();
	    let oldStart;
	    for (let i = 0; i < this.state.numTiles; i++) {
		if (searchingSet[i].start === true) {
		    oldStart = i;
		}
	    }
	    let toChangeTiles = [...this.state.tiles];
	    let toChangeTile = {...toChangeTiles[index], start: true, color: "green"};
	    let oldStartItem = {...toChangeTiles[oldStart], start: false, color: "blue"};
	    console.log(oldStartItem);
	    /* toChangeTile.start = true;
	       toChangeTile.color = "green"; */
	    toChangeTiles[oldStart] = oldStartItem;
	    toChangeTiles[index] = toChangeTile;
	    this.setState({tiles: toChangeTiles});
	    
	    this.toggleStart();
	} else {
	    if (this.state.tiles[index].color !== "white")this.changeColor(index, "white");
	    else this.changeColor(index, "blue");

	}
    }
    
    render() {
	return (
	    <div>
		<button onClick={() => {this.toggleStart()}}>startFlag</button>
		<button onClick={() => {this.path();}}>endFlag</button>
		<button onClick={() => {this.path();}}>click me</button>
		<button onClick={() => {console.log(this.state.tiles);}}> foo </button>
		<Box sx={{ display: 'grid', gridGap: "1px", gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', width: "50vw", height: "50vh" }}>
		    {this.state.tiles.map((element, index, array) => {return <button onClick={()=>{this.clickTile(index)}}  style={{outline: 'none', border: "0px", padding: "0px"}}><Tile key={element} color={this.state.tiles.at(index).color} /></button>})}
		</Box>
	    </div>
	);
    }
}

export default PathingGrid;
