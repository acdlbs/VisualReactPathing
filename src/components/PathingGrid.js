
import * as React from "react";
import Tile from "./Tile.js"
import Box from "@mui/material/Box";

class PathingGrid extends React.Component {
    
    constructor(props) {
	super(props);
	this.state = {
	    numTiles: 100,
	    width: 10,
	    tiles: [],
	    iter: 0,
	    startToggle: false,
	    endToggle: false
	};
    }

    minNode(distances, visited) {
	let min = Infinity;
	let minIndex = -1;

	for (let i = 0; i < this.state.numTiles; i++) {
	    if (distances[i] <= min && visited[i] === false && this.state.tiles[i].wall == false) {
		min = distances[i];
		minIndex = i;
	    }
	}
	
	return minIndex;
    }
    
    dijkstra() {
	let found = false;
	let pathingTiles = this.state.tiles.slice();
	let src = -1;
	let dest = -1;
	let parentLoop = false;
	for (let i = 0; i < this.state.numTiles; i++) {
	    if (pathingTiles[i].start === true) {
		src = i;
	    }
	    if (pathingTiles[i].end === true) {
		dest = i;
	    }
	}
	
	let distances = {};
	let visited = {};
	let parents = {};

	for (let i = 0; i < this.state.numTiles; i++) {
	    distances[i] = Infinity;
	    visited[i] = false;
	}


	parents[src] = null;
	distances[src] = 0;

	let counter = 0;

	let parent;
	
	this.dijkstraInterval = setInterval(
	    () => {

		if (parentLoop) {
		    this.changeColor(parents[parent], "red");
		    parent = parents[parent];
		    if (parent === null) this.stop();
		} else {
		    
		    let currentMinNode = this.minNode(distances, visited);
		    
		    visited[currentMinNode] = true;

		    if (currentMinNode !== src && currentMinNode !== dest){
			this.changeColor(currentMinNode, "blue");
		    }

		    if (currentMinNode === dest) {
			console.log(parents);
			found = true;
			counter = 0;
			parent = dest;
			parentLoop = true;
		    }

		    for (let i = 0; i < this.state.numTiles; i++) {
			if (!visited[i] && pathingTiles[currentMinNode].weight[i] !== 0 && distances[currentMinNode] !== Infinity && distances[currentMinNode] + pathingTiles[currentMinNode].weight[i] < distances[i]) {
			    distances[i] = distances[currentMinNode] + pathingTiles[currentMinNode].weight[i];
			    parents[i] = currentMinNode;
			}
		    } 
		    
		    if (found === false/* counter < this.state.numTiles */){
			counter++;
		    } else {
			//this.stop();
		    }
		}
	    },
	    10
	);

    }

    componentDidMount() {
	this.dijkstraInterval = null;
	let a = this.state.tiles.slice();
	//set weights of all neighboring tiles
	for (let i = 0; i < this.state.numTiles; i++) {
	    let w = (new Array(this.state.numTiles).fill(0));
	    if (i+1 in w) {
		if (i%10 === 9) w[i+1] = 0;
		else w[i+1] = 1;
	    }
	    if (i-1 in w) {
		if (i%10 === 0) w[i-1] = 0;
		else w[i-1] = 1;
	    }
	    if (i+this.state.width in w) {
		w[i+ this.state.width] = 1;
	    }
	    if (i-this.state.width in w) {
		w[i- this.state.width] = 1;
	    }
	    a[i] = {id: i, color: "white", weight: w, start: false, end: false, wall: false};
	}
	this.setState((state, props) => ({tiles: a}));
    }

    componentWillUnmount() {

    }

    path() {
	this.dijkstra();
    }

    stop() {
	clearInterval(this.dijkstraInterval);
	this.dijkstraInterval = null;
	console.log("done");
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
    toggleEnd() {
	this.setState({endToggle: !this.state.endToggle});
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
	    let oldStartItem = {...toChangeTiles[oldStart], start: false, color: "white"};
	    console.log(oldStartItem);
	    toChangeTiles[oldStart] = oldStartItem;
	    toChangeTiles[index] = toChangeTile;
	    this.setState({tiles: toChangeTiles});
	    
	    this.toggleStart();
	} else 	if (this.state.endToggle === true) {
	    let searchingSet = this.state.tiles.slice();
	    let oldEnd;
	    for (let i = 0; i < this.state.numTiles; i++) {
		if (searchingSet[i].end === true) {
		    oldEnd = i;
		}
	    }
	    let toChangeTiles = [...this.state.tiles];
	    let toChangeTile = {...toChangeTiles[index], end: true, color: "red"};
	    let oldEndItem = {...toChangeTiles[oldEnd], end: false, color: "white"};
	    console.log(oldEndItem);
	    toChangeTiles[oldEnd] = oldEndItem;
	    toChangeTiles[index] = toChangeTile;
	    this.setState({tiles: toChangeTiles});
	    
	    this.toggleEnd();
	} else {
	    if (this.state.tiles[index].color !== "white") {
		if (this.state.tiles[index].wall == true){
		    let tmps = [...this.state.tiles];
		    let tmp = {...tmps[index], wall: false, color: "white"};
		    tmps[index] = tmp;
		    this.setState({tiles: tmps});
		}		
	    }
	    else {
		let tmps = [...this.state.tiles];
		let tmp = {...tmps[index], wall: true, color: "black"};
		tmps[index] = tmp;
		this.setState({tiles: tmps});
	    }
	    

	}
    }
    //`${ this.state.percentage }%`

    render() {
	return (
	    <div>
		<button onClick={() => {this.toggleStart()}}>startFlag</button>
		<button onClick={() => {this.toggleEnd();}}>endFlag</button>
		<button onClick={() => {this.path();}}>path</button>
		<button onClick={() => {console.log(this.state.tiles);}}> foo </button>
		<Box sx={{ display: 'grid', gridGap: "1px", gridTemplateColumns: 'repeat(' + this.state.width + ', 1fr)', gridTemplateRows: 'repeat(' + this.state.width + ', 1fr)', width: "50vw", height: "50vh" }}>
		    {this.state.tiles.map((element, index, array) => {return <button key={index} onClick={()=>{this.clickTile(index)}}  style={{outline: 'none', border: "0px", padding: "0px"}}><Tile onClick={()=>{this.clickTile(index)}}  key={element} color={this.state.tiles.at(index).color} /></button>})}
		</Box>
	    </div>
	);
    }
}

export default PathingGrid;
