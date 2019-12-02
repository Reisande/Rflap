import React,{useEffect,useRef,useState,useContext} from 'react';
import vis from 'vis-network';
import {Button, ButtonGroup,Col,Row} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';
import './Visual.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {AutomataContext} from './AutomataContext.js'
//Yo
/*hieght and width make dimensions of graph fill screen*/
let height = window.innerHeight -80;
let width = window.innerWidth;

/*Beggining node and edge informaiton*/
let nodesDS = new vis.DataSet([
  {id: 1, label: ' Q 1 '},
  {id: 2, label: ' Q 2 ' },
  {id: 3, label: ' Q 3 '},
  // {id: 4, label: ' Q 4 '},
  // {id: 5, label: ' Q 5 '},
]);
let edgesDS = new vis.DataSet( [
  { from: 1, to: 2, label: "a", id: "a",arrows:"to" },
  { from: 2, to: 3, label: "b", id: "b",arrows:"to"},
  { from: 3, to: 1, label:"c" ,id:"c",arrows:"to"},
  // { from: 2, to: 2, label:"2>2",id: "2->2" ,arrows:"to"},
  // { from: 4, to: 2, label:"2>2",id: "4->2" ,arrows:"to"}

]);

let graph = {nodes: nodesDS,
  edges: edgesDS};

  let options = {
    autoResize : true,
    height: height.toString(),
    width: window.innerWidth.toString(),
    locale: 'en',
    
    
    physics:{
      enabled: true,
      repulsion:{
        springConstant: .001,
        centralGravity:   10,
      },
    },
    nodes:{
      label: undefined,
    title: undefined,
      shape: "circle",
      borderWidth: 3,

      scaling:{
        label:{
          enabled: true,
        }
      },
      color:{
        border: "yellow",
        background: "#576672",
        highlight:{
          border:"yellow",
          background: 'grey'	,
          
        },
        hover:{
          border:"yellow",
          background: 'grey'	,
        }

      },
      font:{
        color: "yellow",
        face:"sans serif",
        size: 20,
        bold:{
          face:"sans serif",
          size: 8,
        }
      },
      // shadow:{
      //   size:0
      // },

    },
    edges:{
      // font: '12px arial #ff0000',
      // smooth:true,
      color:"black",
      length: 200,
      scaling:{
        label:true,
      },
      font:{
        size: 16 ,
      }
    },
    interaction:{
      hover:true,

    }

};
function Visual() {
  const  master_context = useContext(AutomataContext);
  master_context.graphobj = graph;
  let in_add_node_mode = false;
  let in_accepting_mode_ = false,in_initial_mode = false;
  let display_popup = false;
  let node_id_clicked,state_field, string_field;
  const wrapper = useRef(null) //Display graph in div "wrapper"
  
  // const find_node_clicked = (node_ids,node_postions,userX,userY) =>{
  //   let return_id = -1;
  //   node_ids.forEach((id)=>{
  //     let node_x = node_postions[id].x;
  //     let node_y = node_postions[id].y;
  //     // Approximating area of node.
  //     let offset_bound = 30;
  //     let lower_x = node_x - offset_bound;
  //     let upper_x = node_x + offset_bound;
  //     let upper_y = node_y+offset_bound;
  //     let lower_y = node_y -offset_bound;
  //     // * debugging * 
  //     // console.log("Node: " + node_ids[id]);
  //     // console.log("x:"+node_x+ "y"+node_y);
  //     // console.log("cx:" + params.pointer.canvas.x + "cy" + params.pointer.canvas.y); 
  //     if(  ((userX< upper_x) && (userX> lower_x)) && ( (userY < upper_y) && (userY > lower_y)  )){
  //     return_id = id;        
  //     node_id_clicked = return_id;
  //     }  
  //     });

  //   return return_id;


  // }

let network;

useEffect( ()=>{

  network = new vis.Network(wrapper.current,graph,options);
  console.log(network);
  //context-click for graph
  network.on("showPopup", (params)=>{

  });

  //graph event listeners here:
  network.on("hoverNode", (params)=>{
    console.log("hoverNode: ");
    let node_id_clicked = params.node;
    let found_node;
    if(in_add_node_mode){
      console.log("add_node_mode");
    graph.nodes.get().forEach(  (node)=>{
      if(node.id == node_id_clicked){
        
        found_node = node;
      }
      
    }
    );
    console.log(found_node);
    nodesDS.update([{id:found_node.id, label: " Q "+ (graph.nodes.get().length) + " "}]);

    console.log(params.node)
    in_add_node_mode = false;
    console.log("end add_Node_mode\n--------------")
  }
  in_add_node_mode = false;

  })
  network.on("controlNodeDragEnd",(params)=>{
    console.log("disabled edit mode");
    network.disableEditMode();
    let edge_identifier = findEdgeByNodes(params.controlEdge.from,params.controlEdge.to);
    console.log(edge_identifier);
    
    edgesDS.update([{id:edge_identifier, arrows:'to'}])
  });

  network.on("select", (params)=>{
    console.log(params);
    console.log("In intial_mode " + in_initial_mode);
    console.log("accepting " + in_accepting_mode_);
    console.log(params.nodes);
    console.log(params.nodes[0] != null);
    if( (params != null ) && in_initial_mode && (params.nodes > 0 || params.nodes[0] !=null)){

      console.log("SELECT-initial");
      console.log(in_initial_mode);
      console.log(params.nodes[0]);
      let node_id_clicked= params.nodes[0];
      let found_node;
      //find node given
      graph.nodes.get().forEach(  (node)=>{
        if(node.id == node_id_clicked){
          
          found_node = node;
        }
        
      }
      );
      console.log(found_node);
      // nodesDS.update([{id:node_id_clicked,color: "#00bfff"}]);
      in_initial_mode = false;
      let final_color;
      if(found_node.color == "#00bfff"){
        final_color = "grey";
      }
      else{
        final_color = "#00bfff";
      }
      console.log("SET THE INITIAL COLOR: ");
      console.log(final_color);
      if(found_node.init == true){
        console.log("INITIAL TAG REMOVED");
        nodesDS.update([{id:found_node.id,color:"grey" , init:false }]);
      }
      else{
      nodesDS.update([{id:found_node.id, color: final_color, init:true}]);
      }
      in_initial_mode = false;
      console.log("END-initial")
      

    }

    if((params != null )  && (params.nodes != null) && in_accepting_mode_ &&  ( params.nodes >  0 || params.nodes[0] != null )){
      console.log("SELECT-accepting");
      console.log(in_accepting_mode_)
      console.log(params.nodes);
      let found_node;
      let node_id_clicked = params.nodes[0];
      graph.nodes.get().forEach(  (node)=>{
        if(node.id == node_id_clicked){
         
          found_node = node;
        }
   
      }
      );
      console.log(found_node);
      let final_color = "#000000";
    
      if(found_node.color == "#000000"){
        final_color = "grey";
      }
      // then
      else{
        final_color = "#000000";
      }
      nodesDS.update([{id:node_id_clicked, color: final_color}]);
      in_accepting_mode_ = false;
      console.log("END-accepting")

    }

    if(params.edges.length  == 1 && params.nodes == 0){
    console.log(params.edges[0]);
    let edge_id = params.edges[0];
    console.log("Clicked on an edge!");
     let user_input_string =  window.prompt("Edit String!");
      ChangeEdgeText(user_input_string, edge_id)

  }});

})

const ChangeEdgeText = (userInput, edgeID)=>{

  graph.edges.forEach( (edge)=>{
    if(edge.id == edgeID){
      edge.label = userInput;
      // console.log("changed!");
      // console.log(edge.label)
      edgesDS.update([{id:edge.id,label: userInput,}]) ; 
      return;
    }

  })
}

const findEdgeByNodes = (from,to) =>{
  console.log("find edge by nodes!");
  console.log(to);
  console.log(from);
  let return_id;
  graph.edges.forEach( (edge,index)=>{
    console.log(index + ":");
    console.log(edge);
    if( (to == edge.to) &&   (edge.from == from)   ){
      console.log('returned  true');
      console.log("edge id" + edge.id)
      return_id = edge.id;
    }

  })
  console.log(return_id);
    return return_id; 

}
function toEditEdgeMode(props){
  console.log("EditEdgeMode");
    network.enableEditMode();
    network.addEdgeMode();
    console.log("End");

};
function toAddNodeMode(props){
  console.log("AddNodeMode")

  network.enableEditMode();
  network.addNodeMode();
  in_add_node_mode = true;
  
}
function setInitial(props){
  in_initial_mode = true;
}
function setAccepting(props){
  in_accepting_mode_ = true;
}
function deleteNodeOrEdge(props){
  console.log("deletion:")
  let node_deleted,edge_deleted;
  console.log(network.getIds([network.getSelec]))
  let deleted_node = network.getSelectedEdges
  graph.nodes.forEach( (node)=>{
  //   if(node.id == )
  // } );
  console.log(network.getSelectedEdges());
  console.log(network.getSelectedNodes());


  console.log('deletion--end');

  network.deleteSelected();
});
}

  return (
    <div>
        {/* <div id="button-hold"><Col></Col></div> */}
      <div>
        
        <ButtonGroup className="justify-content-between" >
      <Button variant="secondary" onClick={toEditEdgeMode}>Add Transitions!</Button>
      <Button variant="secondary" onClick={toAddNodeMode}> Add Node </Button>
      <Button variant="secondary" onClick={setInitial}> Mark Initial</Button>
      <Button variant="secondary" onClick={setAccepting}>Mark Accepting</Button>
      <Button variant="secondary"  onClick={deleteNodeOrEdge}>Delete</Button>
      </ButtonGroup>  
      </div>
      
    <div style={{'height':`${height}px`}} id="graph-display"  className="Visual" ref={wrapper}>
    </div>
    </div>
  );
}

export default Visual;
