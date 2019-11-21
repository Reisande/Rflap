import React from 'react';
import { Graph } from "react-d3-graph";




const data = {
    nodes: [{ id: "q_01"},{id:"q_02"}],
    links: [{ source: "q_01", target: "q_01" }],
  };
  
  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  const myConfig = {
    nodeHighlightBehavior: true,
    //Node-wide customizations: 
    node: {
        color: "brown",
        size: 1250,
        highlightStrokeColor: "#9b870c",
        fontSize:18,
        fontColor: "black",
        highlightFontSize: 18,
        highlightStrokeWidth: 4,
        highlightFontWeight: 500,
        strokeWidth: 3,
        //mouseCursor to maybe edit what the mouse does over hovering a node
        //labelproperty is important!
        // highlightColor: "brown",

    },
    link: {
        highlightColor: "lightblue",
    },
    fontSize: 60,
    height:window.innerHeight -65,
    width:window.innerWidth,
    gravity: 100,
  };
  
  // graph event callbacks
  const onClickGraph = function() {

    window.alert(`Clicked the graph background`);
    
  };
  
  const onClickNode = function(nodeId) {
    window.alert(`Clicked node ${nodeId}`);
  };
  
  const onDoubleClickNode = function(nodeId) {
    window.alert(`Double clicked node ${nodeId}`);
  };
  
  const onRightClickNode = function(event, nodeId) {
    window.alert(`Right clicked node ${nodeId}`);
  };
  
  const onMouseOverNode = (nodeId)=> {
    // window.alert(`Mouse over node ${nodeId}`);
  };
  
  const onMouseOutNode = function(nodeId) {

    // window.alert(`Mouse out node ${nodeId}`);
  };
  
  const onClickLink = function(source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };
  
  const onRightClickLink = function(event, source, target) {
    window.alert(`Right clicked link between ${source} and ${target}`);
  };
  
  const onMouseOverLink = function(source, target) {
    // window.alert(`Mouse over in link between ${source} and ${target}`);
  };
  
  const onMouseOutLink = function(source, target) {
    // window.alert(`Mouse out link between ${source} and ${target}`);
  };
  
  const onNodePositionChange = function(nodeId, x, y) {
    window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
  };
  
  function Visual(props){
      return(
      <div>
    <Graph
  id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
  data={data}
  config={myConfig}
  onClickNode={onClickNode}
  onRightClickNode={onRightClickNode}
  onClickGraph={onClickGraph}
  onClickLink={onClickLink}
  onRightClickLink={onRightClickLink}
  onMouseOverNode={onMouseOverNode}
  onMouseOutNode={onMouseOutNode}
  onMouseOverLink={onMouseOverLink}
  onMouseOutLink={onMouseOutLink}
  onNodePositionChange={onNodePositionChange}
    />
</div>



  );

  }

  export default Visual