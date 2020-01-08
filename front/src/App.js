import React, { useEffect,useState,useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph } from "react-d3-graph";
import Visual from './Visual.js';
import HeaderMenu from './HeaderMenu.js';
import {AutomataContext} from './AutomataContext.js';
import Run from './Run.js';
import Sidebar from "react-sidebar";
import {Button,Table,InputGroup,FormControl,Row,Col} from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.min.css';


let master_context = {
    graphobj: null,
};

// const disable_handler= (e) =>{
//   e.stopPropagation();
//   e.preventDefault();
// }
// const disable_click = (duration) =>{
//   document.removeEventListener("click");
//   window.setTimeout(document.addEventListener("click",disable_handler),3000) 
//   document.removeEventListener()
// }

function App() {



  let toggle_menu = useRef();
  const [sidebar_display,set_sidebar_display] = useState(false);
  const [modal_state,set_modal_state] = useState(false);
  let node_name;
  // Catch run click and load sidebar:

console.log("<>")
  useEffect( ()=>{
    window.addEventListener('click', (e)=>{
      // Check if event is not null, else breaks everything
      // toggle_menu.handleContextClick(e);
      if(e == null || e.target == null || e.target.lastChild == null){
        return;
      }
      e.preventDefault();
      let target_check = e.target.lastChild.data;

      
      if(target_check === "Run" && sidebar_display == false){
        set_sidebar_display(true);
        console.log("Value of sidebar_display: " + sidebar_display);
        
      }
      else if(sidebar_display == true && target_check === "Run"){
        
        set_sidebar_display(false);
        console.log("Closing sidebar");
      }
    } )
  });


  //Constrols modal, called by contex_menu first one.
  function openModal(e,data){
    set_modal_state(true)

  }
  function add_node(e,data){

    console.log(e,data);

  }
  function change_node_name(e){
    console.log("E"+ e.target.value);
  }

  function handleClick(e,data){
    console.log('------HANDLECLICK-------');
    console.log(e);
    console.log(data);
    console.log('////////HANDLECLICK///////');

  }
  return (
    <div className="App">
      <AutomataContext.Provider value={master_context}   >
        {sidebar_display ? <Sidebar id = "sidebar-app" sidebar={<Run/>}
        touch = {false}
        defaultSidebarWidth = {20}
        open = {false}
        shadow = {true}
        docked = {true}
        styles={{ sidebar: { background: "white", zIndex:2 } , overlay: {zIndex: 2}, content: {visibility: "hidden", zIndex: -112}, dragHandle: {zIndex: -500}}   }
        ></Sidebar>: null }
      <HeaderMenu/>
        
      <Visual/>
     
      </AutomataContext.Provider>

    </div>
  );
}

export default App;
