
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

    dijkstra() {
	let pathingTiles = this.state.tiles.slice();
	let src = 0;
	let dest = 0;
	for (let i = 0; i < this.state.numTiles; i++) {
	    if (pathingTiles[i].start === true) {
		src = i;
	    }
	    if (pathingTiles[i].end === true) {
		dest = i;
	    }
	}
	let dist = [];
	let visited = [];
	let parent = [];

	for(let i = 0; i < this.state.numTiles; i++) {
	    parent[0] = -1;
	    dist[i] = 10000000;
	    visited[i] = false;
	}

	dist[src] = 0;

	var count = 0;
	
	this.dijkstraInterval = setInterval(
	    () => {
		
		
		let min_index;
		

		let u;
		let min = 10000000;
		for(let v = 0; v < this.state.numTiles; v++) {
		    if (visited[v] === false && dist[v] <= min) {
			min = dist[v];
			min_index = v;
		    }

		}

		visited[min_index] = true;
		this.changeColor(min_index, "blue");
		

		for(let i = 0; i < this.state.numTiles; i++) {
		    if (!visited[i] && this.state.tiles[min_index].weight[i] && dist[min_index] + this.state.tiles[min_index].weight[i] < dist[i]){
			parent[i] = min_index;
			dist[i] = dist[min_index] + this.state.tiles[min_index].weight[i];
		    }
		    
		} 
		count++;
		if (count >= this.state.numTiles) this.stop()
	    },
	    100
	);

    }

    componentDidMount() {
	this.dijkstraInterval = null;
	let a = this.state.tiles.slice();
	//set weights of all neighboring tiles
	for (let i = 0; i < this.state.numTiles; i++) {
	    let w = (new Array(this.state.numTiles).fill(0));
	    if (i+1 in w) {
		w[i+1] = 1;
	    }
	    if (i-1 in w) {
		w[i-1] = 1;
	    }
	    if (i+this.state.width in w) {
		w[i+ this.state.width] = 1;
	    }
	    if (i-this.state.width in w) {
		w[i- this.state.width] = 1;
	    }
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
	    if (this.state.tiles[index].color !== "white")this.changeColor(index, "white");
	    else this.changeColor(index, "blue");

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
