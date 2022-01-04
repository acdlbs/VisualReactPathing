import * as React from "react";
import Box from "@mui/material/Box"; 

class Tile extends React.Component {
    constructor(props) {
	super(props);
	this.state = {
	    size: 100,
	    toggled: true
	};
    }

    
    render() {
	var c = () => {
	    /* if (this.state.toggled) {
	       this.setState({toggled: false});
	       } else if (!this.state.toggled) {
	       this.setState({toggled: true});
	       }  */
	}
	let box;
	switch (this.props.color) {
	    case "red":
		box = (<button onClick={()=>{c()}}  style={{outline: 'none', border: "0px", padding: "0px"}}><Box sx={{ width: this.state.size, height: this.state.size, backgroundColor: "#FF4141", "&:hover": { backgroundColor: "#FF7676", opacity: [0.9, 0.8, 0.7], } }}></Box></button>);
		break;
	    case "white":
		box = (<button onClick={()=>{c()}} style={{outline: 'none', border: "0px", padding: "0px"}}><Box sx={{ width: this.state.size, height: this.state.size, backgroundColor: "#E7E7E7", "&:hover": { backgroundColor: "#FAF9F9", opacity: [0.9, 0.8, 0.7], } }}></Box></button>);
		break;
	    case "green":
		box = (<button onClick={()=>{c()}}  style={{outline: 'none', border: "0px", padding: "0px"}}><Box sx={{ width: this.state.size, height: this.state.size, backgroundColor: "#15C241", "&:hover": { backgroundColor: "#77C38A", opacity: [0.9, 0.8, 0.7], } }}></Box></button>);
		break;
	    case "blue":
		box = (<button onClick={()=>{c()}}  style={{outline: 'none', border: "0px", padding: "0px"}}><Box sx={{ width: this.state.size, height: this.state.size, backgroundColor: "#4253D1", "&:hover": { backgroundColor: "#808AD3", opacity: [0.9, 0.8, 0.7], } }}></Box></button>);
		break;
	}
	
	return (
	    <div>
	    { box }
	    </div>
	);
    }
}

export default Tile;
