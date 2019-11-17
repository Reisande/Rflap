import React, { useEffect,useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph } from "react-d3-graph";
import Visual from './Visual.js';
import HeaderMenu from './HeaderMenu.js';
import {AutomataContext} from './AutomataContext.js';
import Run from './Run.js';
import Sidebar from "react-sidebar";
let master_context = {
  mode: "Determinstic Finite Automata",
  states : [],
  transitions:[],
  test_value: "TEST_VALUE",
};

function App() {

  const [sidebar_display,set_sidebar_display] = useState(false);
  
  // Catch run click and load sidebar:
  useEffect( ()=>{
    window.addEventListener('click', (e)=>{
      // Check if event is not null, else breaks everything
      if(e == null || e.target == null || e.target.lastChild == null){
        return;
      }
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

  return (
    <div className="App">
      <AutomataContext.Provider value={master_context}   >
        {sidebar_display ? <Sidebar id = "sidebar-app" sidebar={<Run/>}
        touch = {false}
        defaultSidebarWidth = {20}
        open = {false}
        shadow = {true}
        docked = {true}
        styles={{ sidebar: { background: "white" } }}
        ></Sidebar>: null }
      <HeaderMenu/>
      <Visual/>

      </AutomataContext.Provider>

    </div>
  );
}

export default App;
