import React,{useEffect,useRef,useState,useContext} from 'react';
import vis from 'vis-network';
import {Button, ButtonGroup,Col,Row} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';
import './Visual.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {AutomataContext} from './AutomataContext.js'
import accept_bar from './accept.svg';
import add_bar from './add-bar.svg';
import points_bar from './points.svg';
import reject_bar from './reject.svg';
import transition_bar from './transition.svg';
import blank_svg_bar from './blank.svg';
import passive_bar from "./delete.svg";
import remove_bar from "./remove.svg"
//Yo
/*hieght and width make dimensions of graph fill screen*/
let node_id_global = 0;
let height = window.innerHeight -80;
let width = window.innerWidth;
let img_bar_status_did_mount = false;

/*Beggining node and edge informaiton*/
let nodesDS = new vis.DataSet([
  // {id: 1, label: ' Q 1 '},
  // {id: 2, label: ' Q 2 '},
  // {id: 3, label: ' Q 3 '},
  // {id: 4, label: ' Q 4 '},
  // {id: 5, label: ' Q 5 '},
]);
let edgesDS = new vis.DataSet( [
  // { from: 1, to: 2, label: "a", id: "b",arrows:"to" },
  // { from: 2, to: 1, label: "a", id: "a",arrows:"to"}
  // { from: 3, to: 1, label:"c" ,id:"c",arrows:"to"},
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
   
    
    nodes:{
      physics: false,
      label: undefined,
    title: undefined,
      shape: "circle",
      borderWidth: 0,
      borderWidthSelected: -1,

      scaling:{
        label:{
          enabled: true,
        }
      },
      color:{
        border: "#64778D",
        background: "#E25B4B",
        highlight:{
          border:"#64778D",
          background: '#B22222'	,
          
        },
        hover:{
          border:"#64778D",
          background: '#B22222'	,
          
        }

      },
      font:{
        color: "#DCDCDC",
        face:"sans serif",
        
        
        size: 12,
        bold:{
          face:"sans serif",
          size: 20,

        }
      },
      // shadow:{
      //   size:0
      // },

    },
    edges:{
      // font: '12px arial #ff0000',
      // smooth:true,
       physics: true,
       
    // stabilization: {
    //   enabled: true,
    //   iterations: 1000,
    //   updateInterval: 100,
    //   onlyDynamicEdges: false,
    //   fit: true
    // },
      color:"skyblue",
      // length: 85,
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
  let img_index = 0;
  let img_array = [blank_svg_bar ,accept_bar,add_bar,points_bar,reject_bar,transition_bar];

  const wrapper = useRef(null) //Display graph in div "wrapper"
  // const [img_array_index,set_img_array_index] = useState(0);//change to enums
  const img_status = useRef(null);
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
    img_status.current.src = passive_bar;
    const HTMLCol_to_array = (html_collection) => Array.prototype.slice.call(html_collection);

        // let yager = HTMLCol_to_array(wrapper.current.childNodes);
        // console.log(HTMLCol_to_array(wrapper.current.childNodes));
        // console.log(yager)
  network = new vis.Network(wrapper.current,graph,options);
  // console.log("Event: " + network);
  //context-click for graph
  network.on("showPopup", (params)=>{
  });
  //graph event listeners here:
  network.on("hoverNode", (params)=>{
    // console.log("hoverNode: ");
    let node_id_clicked = params.node;
    if(in_add_node_mode){
      // console.log("GRAPH NODE LENGTH : " + graph.nodes.get().length);
      // console.log("add_node_mode");
      nodesDS.remove({id:node_id_clicked});
      let new_id = node_id_global;
      node_id_global+=1;
      nodesDS.add([{id:new_id, label: " Q "+ (graph.nodes.get().length) + " "}])
      network.moveNode(new_id, (Math.random()-.6) *200, (Math.random() -.7)*200)
      
    // graph.nodes.get().forEach(  (node)=>{
    //   if(node.id == node_id_clicked){
    //     found_node = node;
       
    //   }
    // }
    // );
    // nodesDS.remove({id:found_node.id});
    // // Update the name of the new Node
    // nodesDS.update([{id:found_node.id, label: " Q "+ (graph.nodes.get().length) + " "}]);

    in_add_node_mode = false;
    img_status.current.src = passive_bar;
    // console.log("end add_Node_mode\n--------------")
  }
  })
  network.on("controlNodeDragEnd",(params)=>{
    // console.log("disabled edit mode");
    network.disableEditMode();
    let edge_identifier = findEdgeByNodes(params.controlEdge.from,params.controlEdge.to);
    // console.log(edge_identifier);
    
    edgesDS.update([{id:edge_identifier, arrows:'to'}])
  });
  network.on("select", (params)=>{
    // console.log("select");
   
    if( (params != null ) && in_initial_mode && (params.nodes > 0 || params.nodes[0] !=null)){
   
      let node_id_clicked= params.nodes[0];
      let found_node;
      //find node given
      graph.nodes.get().forEach(  (node)=>{
        if(node.id == node_id_clicked){
          found_node = node;
        }}
      );
      // console.log(found_node);
      // nodesDS.update([{id:node_id_clicked,color: "#00bfff"}]);
      in_initial_mode = false;
      img_status.current.src = passive_bar;
      let final_state;
      let circle_config = "circle";
      let triangle_config = "triangle";
      let border_config_a = 3;
      let border_config_b = 0;
      let init_state = "#00bfff";
      

      if(found_node.shape == circle_config || found_node.shape == null){ 
        final_state = triangle_config;
      }
      else{
        final_state = circle_config;
      }
      // console.log("SET THE INITIAL COLOR: ");
      // console.log(final_color);
      if(found_node.init == true){
        // console.log("INITIAL TAG REMOVED");
        // console.log(final_state)
        nodesDS.update([{id:found_node.id, shape: final_state, init:false }]);
      }
      else{
      nodesDS.update([{id:found_node.id, shape: final_state, init:true}]);
      }
      // console.log("END-initial")
    }
    //ACCEPTING BUTTON PRESS LISTENER
    else if((params != null )  && (params.nodes != null) && in_accepting_mode_ &&  ( params.nodes >  0 || params.nodes[0] != null )){
      
      let found_node;
      let node_id_clicked = params.nodes[0];
      graph.nodes.get().forEach(  (node)=>{
        if(node.id == node_id_clicked){
          found_node = node;
        }
        } );
      // console.log(found_node);
      let final_border = 3;
      let border_width_a = 3;
      let border_width_b = 0;

      // console.log()
      if(found_node.borderWidth == border_width_a){
        final_border = border_width_b;
      }
      // then
      else{
        final_border = border_width_a;
      }
      nodesDS.update([{id:node_id_clicked, borderWidth: final_border}]);
      in_accepting_mode_ = false;
      img_status.current.src = passive_bar;
      // console.log("END-accepting")
    }
    else if(params.edges.length  == 1 && params.nodes == 0){
    // console.log(params.edges[0]);
    let edge_id = params.edges[0];
    // console.log("Clicked on an edge!");
    let Display_String = master_context.mode == "Determinstic Finite Automata" ? "Edit String!" : "Edit String! ([ ε ])"
     let user_input_string =  prompt(Display_String);
      ChangeEdgeText(user_input_string, edge_id)
      img_status.current.src = passive_bar;

  }});
  //remove event listeners
 return ()=>{
   network.off("select");
   network.off("controlNodeDragEnd");
   network.off("hoverNode");
   network.off("showPopup");
   network.destroy();
  }
});
const deselectAllModes= ()=>{
  in_accepting_mode_ = false;
  in_add_node_mode = false;
  in_initial_mode = false;
}
const ChangeEdgeText = (userInput, edgeID)=>{

  graph.edges.forEach( (edge)=>{
    if(edge.id == edgeID){
      edge.label = userInput;
      if( userInput == " " || userInput == "" ){
        userInput = "ϵ";
      }
      // console.log("changed!");
      // console.log(edge.label)
      edgesDS.update([{id:edge.id,label: userInput,}]) ; 
      return;
    }

  })
}

const findEdgeByNodes = (from,to) =>{
  // console.log("find edge by nodes!");
  // console.log(to);
  // console.log(from);
  let return_id;
  graph.edges.forEach( (edge,index)=>{
    // console.log(index + ":");
    // console.log(edge);
    if( (to == edge.to) &&   (edge.from == from)   ){
      // console.log('returned  true');
      // console.log("edge id" + edge.id)
      return_id = edge.id;
    }

  })
  // console.log(return_id);
    return return_id; 

}
function toEditEdgeMode(props){
  // console.log("EditEdgeMode");
  deselectAllModes();
    img_status.current.src = transition_bar;
    network.enableEditMode();
    network.addEdgeMode();

};
function toAddNodeMode(props){
  deselectAllModes();

  img_status.current.src = add_bar;
  network.enableEditMode();
  network.addNodeMode();
  
  in_add_node_mode = true;
  
}
function setInitial(props){
  deselectAllModes();
  img_status.current.src = points_bar;

  in_initial_mode = true;

}
function setAccepting(props){
  deselectAllModes();
  img_status.current.src = accept_bar;
  in_accepting_mode_ = true;

}


 function mount_styling()  {
  let url = "https://worldclockapi.com/api/json/est/now";
    let postingObject = {
        method: "GET",
    }
  let current_time;
  fetch(url,postingObject).then( (callback,error)=>{
    callback.json().then((body,err)=>{
      master_context.state_styles = body.currentDateTime;  
    })
   }); 


}
/*encryption*/
//  const  isOverlapping= (label)=>{
//   let returnBool = false;
//   graph.nodes.get().forEach(  (node)=>{
//     if(label == node.label){
//       found_node = node;
//       returnBool = true

//     }}
//   );
//  }
function populateNode(props){
  (!img_bar_status_did_mount) ?  master_context.did_mount = mount_styling() : master_context.did_mount = master_context.did_mount;
  img_bar_status_did_mount = true;
  node_id_global+=1;
  // graph.nodes.get().forEach(  (node)=>{
  //   if(node.id == node_id_clicked){
  //     found_node = node;
  //   }}
  // );
  nodesDS.add([{id:node_id_global, label: " Q "+ (graph.nodes.get().length) + " "}])

  network.moveNode(node_id_global, (Math.random()-.6) *400, (Math.random() -.6)*400)



}
function deleteNodeOrEdge(props){
  deselectAllModes();

  // console.log("deletion:")
  let node_deleted,edge_deleted;
  //console.log(network.getIds([network.getSelec]))
  let deleted_node = network.getSelectedEdges
  graph.nodes.forEach( (node)=>{
  //   if(node.id == )
  // } );
  // console.log(network.getSelectedEdges());
  // console.log(network.getSelectedNodes());


  // console.log('deletion--end');

  network.deleteSelected();
});
}

  return (
    <div id = "non-header-div">
        {/* <div id="button-hold"><Col></Col></div> */}
      
      <div class="div-inline-group-below-header"  >
      <div id = "trash_button" class = "div-inline-group-below-header">
      <input  id= "trash_button_input" onClick={deleteNodeOrEdge}type="image"  src={remove_bar} width="33" height="33" name="remove_bar"/>
      </div>
      <div id = "add_button_visual" class = "div-inline-group-below-header">
      <input  id= "add_button_image" onClick={populateNode}type="image"  src={add_bar} width="33" height="33" name="add_button"/>
      </div>
      
      
      
      <ButtonGroup id = "group-holder" className="mr-2"  >
      <Button class ="visual-button" variant="info" onClick={toEditEdgeMode}> <font color='white'>Add Transitions</font></Button>
      {/* <Button class ="visual-button" variant="secondary" onClick={toAddNodeMode}><font color='yellow'> Add Node</font> </Button> */}
      <Button class="visual-button" variant="info" onClick={setInitial}> <font color='white'>Mark Initial</font></Button>
      <Button class="visual-button" variant="info" onClick={setAccepting}> <font color='white'>Mark Accepting </font></Button>
      </ButtonGroup>  
      <img id="bar" ref={img_status}src={img_array[img_index]}  height="34" width="34"></img>

      
      </div>


    <div style={{'height':`${height}px`}} id="graph-display"  className="Visual" ref={wrapper}></div>
    </div>
  );
}

export default Visual;
