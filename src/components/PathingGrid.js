import * as React from "react";
import Tile from "./Tile.js"
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

class PathingGrid extends React.Component {

    //props
    constructor(props) {
	super(props);
	this.state = {
	    numTiles: 1500,
	    width: 50,
	    height: 30,
	    tiles: [],
	    startToggle: false,
	    endToggle: false,
	    mouseDown: false,
	    toggles: null
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
	console.log(this.state.numTiles);
	console.log(this.state.width);
	console.log(this.state.height);
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
	if (window.innerWidth > 1447) {
	    this.setState({numTiles: 1500, width: 50, height: 30}, this.clear);
	} else if (window.innerWidth < window.innerHeight) {
	    this.setState({numTiles: 250, width: 10, height: 25}, this.clear);
	}
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
	if (this.state.startToggle === true) {
	    this.setState({startToggle: false, toggles: null});
	} else {
	    this.setState({startToggle: true});
	}
    }
    toggleEnd() {
	if (this.state.endToggle === true) {
	    this.setState({endToggle: false, toggles: null});
	} else {
	    this.setState({endToggle: true});
	}
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

    buttonToggles(event, newAlignment){
	this.setState({toggles: newAlignment});
    };

    render() {
	return (
	    <div>
	    <Box sx={{ width: '100vw', height: '7vh', backgroundColor: '#47c6ab91', display: 'inline-flex', flexDirection: 'row', alignContent: 'center',	justifyContent: 'center'}}>
	    <ToggleButtonGroup
	    color="primary"
	    value={this.state.toggles}
	    exclusive
	    onChange={(event, val)=>{this.buttonToggles(event, val)}}
	    >
	    <ToggleButton value="start" color="success" onClick={() => {this.toggleStart()}}>startFlag</ToggleButton>
	    <ToggleButton value="end" color="error" onClick={() => {this.toggleEnd();}}>endFlag</ToggleButton>
	    </ToggleButtonGroup>
	    
	    <Button sx={{color: "#000000ab"}} onClick={() => {this.path();}}>path</Button>
	    <Button sx={{color: "#000000ab"}} onClick={() => {this.clear()}}> clear </Button>
	    </Box>

	    <Box onMouseDown={()=>{this.setState({mouseDown: true})}}  onMouseUp={()=>{this.setState({mouseDown: false})}} sx={{ paddingTop: '1vh', display: 'grid', justifyContent: 'center', gridGap: "0px", gridTemplateColumns: 'repeat(' + this.state.width + ', 3vh)', gridTemplateRows: 'repeat(' + this.state.height + ', 3vh)' }}>
	    {this.state.tiles.map((element, index, array) => {return <Tile click={()=>{this.clickTile(index)}} drag={()=>{if (this.state.mouseDown === true) this.clickTile(index)}} key={this.state.tiles.at(index).id} type={this.state.tiles.at(index).type} />})}
	    </Box>
	    </div>
	);
    }
}

export default PathingGrid;
