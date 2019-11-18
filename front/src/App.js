import React, { useEffect,useState,useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph } from "react-d3-graph";
import Visual from './Visual.js';
import HeaderMenu from './HeaderMenu.js';
import {AutomataContext} from './AutomataContext.js';
import Run from './Run.js';
import Sidebar from "react-sidebar";
import {Button,Table} from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

let master_context = {
  mode: "Determinstic Finite Automata",
  states : [],
  transitions:[],
  test_value: "TEST_VALUE",
};

function App() {





  let toggle_menu = useRef();
  const [sidebar_display,set_sidebar_display] = useState(false);
  
  // Catch run click and load sidebar:


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
      if(sidebar_display == true&& target_check === "Run"){
        set_sidebar_display(false);
        console.log("Closing sidebar");
      }
    })
  
  }
  )

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
        styles={{ sidebar: { background: "white", zIndex:2 } , overlay: {zIndex: -100}, content: {visibility: "hidden", zIndex: -112}, dragHandle: {zIndex: -500}}   }
        ></Sidebar>: null }
      <HeaderMenu/>
      <ContextMenuTrigger  id="right-click-trigger">
        
      <Visual/>
      </ContextMenuTrigger>

      <ContextMenu  id="right-click-trigger">
      <Table striped bordered hover variant="dark">
        <tbody>
        <tr>
        <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
         
          
          <th>Add node</th>
          
        </MenuItem>
        </tr>
      <tr>
        <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
          <th>
          Close
          </th>
        </MenuItem>
        </tr>
        </tbody>
        </Table>
      </ContextMenu>

 
      </AutomataContext.Provider>

    </div>
  );
}

export default App;
