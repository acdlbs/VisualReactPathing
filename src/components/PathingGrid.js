import * as React from "react";
import Tile from "./Tile.js"
import Box from "@mui/material/Box";


class PathingGrid extends React.Component {

    //props
    constructor(props) {
	super(props);
	this.state = {
	    numTiles: 100,
	    width: 10,
	    height: 10,
	    tiles: [],
	    startToggle: false,
	    endToggle: false,
	    mouseDown: false
	};
    }


    //gets min weighted node to visit next
    minNode(distances, visited) {
	let min = Infinity;
	let minIndex = -1;

	for (let i = 0; i < this.state.numTiles; i++) {
	    if (distances[i] <= min && visited[i] === false && this.state.tiles[i].wall === false) {
		min = distances[i];
		minIndex = i;
	    }
	}
	return minIndex;
    }

    // dijkstra's algorithm
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

	let visitingStack = [];
	
	this.dijkstraInterval = setInterval(
	    () => {

		if (parentLoop) {
		    if (parents[parent] !== src) this.changeType(parents[parent], "path");
		    parent = parents[parent];
		    if (parents[parent] === null) this.stop();
		} else {
		    if (visitingStack.length >= 1) {
			let tmps = [...this.state.tiles];
			visitingStack.forEach((element) => {
			    let tmp = {...tmps[element], type: "visiting"};
			    tmps[element] = tmp;
			});
			this.setState({tiles: tmps});
			visitingStack = [];
		    }
		    

		    let currentMinNode = this.minNode(distances, visited);
		    if (currentMinNode === -1) {
			this.stop();
			return;
		    }
		    
		    visited[currentMinNode] = true;


		    if (currentMinNode === dest) {
			found = true;
			counter = 0;
			parent = dest;
			parentLoop = true;
		    }

		    for (let i = 0; i < this.state.numTiles; i++) {
			if (!visited[i] && pathingTiles[currentMinNode].weight[i] !== 0 && distances[currentMinNode] !== Infinity && distances[currentMinNode] + pathingTiles[currentMinNode].weight[i] < distances[i]) {
			    if (this.state.tiles[i].type !== "wall" && i !== src && i !== dest) {
				visitingStack.push(i);

			    }//this.changeType(i, "visiting");
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
	    1
	);

    }


    //clears the screen
    clear() {
	this.stop();
	if (this.dijkstraInterval != null) this.dijkstraInterval = null;
	let a = this.state.tiles.slice();
	//set weights of all neighboring tiles
	for (let i = 0; i < this.state.numTiles; i++) {
	    let w = (new Array(this.state.numTiles).fill(0));
	    if (i+1 in w) {
		if (i % this.state.width === this.state.width - 1) w[i+1] = 0;
		else w[i+1] = 1;
	    }
	    if (i-1 in w) {
		if (i % this.state.width === 0) w[i-1] = 0;
		else w[i-1] = 1;
	    }
	    if (i + this.state.width in w) {
		w[i + this.state.width] = 1;
	    }
	    if (i - this.state.width in w) {
		w[i - this.state.width] = 1;
	    }
	    a[i] = {id: i, type: "unvisited", weight: w, start: false, end: false, wall: false};
	}
	this.setState((state, props) => ({tiles: a}));
    }

    componentDidMount() {
	this.clear();
    }

    path() {
	this.dijkstra();
    }

    stop() {
	clearInterval(this.dijkstraInterval);
	this.dijkstraInterval = null;
	console.log("done");
    }
    
    changeType(index, type) {
	if (index > this.state.numTiles) {
	    console.error("index greter than size of tiles");
	    this.stop();
	    return null;
	}
	let tmps = [...this.state.tiles];
	let tmp = {...tmps[index], type: type};
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
	    let toChangeTile = {...toChangeTiles[index], start: true, type: "start"};
	    let oldStartItem = {...toChangeTiles[oldStart], start: false, type: "unvisited"};
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
	    let toChangeTile = {...toChangeTiles[index], end: true, type: "finish"};
	    let oldEndItem = {...toChangeTiles[oldEnd], end: false, type: "unvisited"};
	    console.log(oldEndItem);
	    toChangeTiles[oldEnd] = oldEndItem;
	    toChangeTiles[index] = toChangeTile;
	    this.setState({tiles: toChangeTiles});
	    
	    this.toggleEnd();
	} else {
	    if (this.state.tiles[index].type !== "unvisited") {
		if (this.state.tiles[index].wall === true){
		    let tmps = [...this.state.tiles];
		    let tmp = {...tmps[index], wall: false, type: "unvisited"};
		    tmps[index] = tmp;
		    this.setState({tiles: tmps});
		}		
	    }
	    else {
		let tmps = [...this.state.tiles];
		let tmp = {...tmps[index], wall: true, type: "wall"};
		tmps[index] = tmp;
		this.setState({tiles: tmps});
	    }
	}
    }

    render() {
	return (
	    <div>
	    <button onClick={() => {this.toggleStart()}}>startFlag</button>
	    <button onClick={() => {this.toggleEnd();}}>endFlag</button>
	    <button onClick={() => {this.path();}}>path</button>
	    <button onClick={() => {console.log(this.state.tiles);}}> foo </button>
	    <button onClick={() => {this.clear()}}> clear </button>
	    <Box onMouseDown={()=>{this.setState({mouseDown: true})}}  onMouseUp={()=>{this.setState({mouseDown: false})}} sx={{ display: 'grid', justifyContent: 'center', gridGap: "0px", gridTemplateColumns: 'repeat(' + this.state.width + ', 3vh)', gridTemplateRows: 'repeat(' + this.state.height + ', 3vh)' }}>
	    {this.state.tiles.map((element, index, array) => {return <Tile click={()=>{this.clickTile(index)}} drag={()=>{if (this.state.mouseDown === true) this.clickTile(index)}} key={this.state.tiles.at(index).id} type={this.state.tiles.at(index).type} />})}
	    </Box>
	    </div>
	);
    }
}

export default PathingGrid;
