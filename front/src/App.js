import React, { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import Visual from "./Visual.js";
import HeaderMenu from "./HeaderMenu.js";
import { AutomataContext } from "./AutomataContext.js";
import Run from "./Run.js";
import Sidebar from "react-sidebar";
import PDA_Visual from "./PDA_Visual.js";
import CFG_Visual from "./CFG_Visual.js";
import "bootstrap/dist/css/bootstrap.min.css";
    /*resource managment libraries: */
import {scheduleMeasurement} from './res/MemoryTests';

import { v4 as uuidv4 } from 'uuid';
let master_context = {
  graphObj: null,    // DFA/NFA: holds graphing object, which declares parameters
  grammar_obj: [{TERM:"",NON_TERM:""}], // CFG_MODULE: array of arrays, where each array is a grammar rule from "Definition"
  pushdown: false, // for Push Down Automatas
};

const CURRENT_MACHINE = {
  DFA: 0,
  NFA: 1,
  CFG: 2,
  TM: 3,
  PDA:4
};

function App() {

  // Start measurements after page load on the main window.
  window.onload = function () {
    scheduleMeasurement();
    master_context.session = uuidv4();
    master_context.date = new Date();
   }
  /*

  STATE VARIABLE: sidebar_display (bool)
  sidebar_display:true => SideBar component renders
  sidebar_display:false => component unmounts
  Passed as second argument to App component's useEffect(()=>{}, [sidebar_display] ) 

  */
  const [sidebar_display, set_sidebar_display] = useState(false);
  
  /*

  STATE VARIABLE: machine_displayed (CURRENT_MACHINE) 
  machine_displayed: CURRENT_MACHINE.DFA  => Renders 
  sidebar_display:false => component unmounts
  Passed as second argument to App component's useEffect(()=>{}, [sidebar_display] ) 

  */  
  const [machine_displayed, set_machine_displayed] = useState(CURRENT_MACHINE.DFA);

  // Lock Run Button temporarily as to not cause infinite loop between sidebar appearing and not appearing
  let lock_run_button = false;


  // useCallback on set_sidebar_display so that text boxes inputted by user are not erased
  const render_sidebar_callback = useCallback(display_lock => {
    set_sidebar_display(display_lock);
  }, []);

/*
  Instantiated @ 

  Desc: Called when useEffect click listener is not a menu click.
  Updates state of sidebar_display to trigger rerender and mount the Sidebar
*/

  const click_run_handler = e => {
    if (e.target.lastChild == null) {
      return;
    }
    e.preventDefault();

    // which href/button pressed, as Bootstrap navbar headers are link HREFS and not buttons
    let target_check = e.target.lastChild.data;


    // if lock run button is not true, then load - or unload - sidebar component
    // else skip, as infinite loading/unloading react component refresh cycle
    //  with locker lock_run_button variable.
    // lock_run_button is reset to false at rerender (!important)
    if (
      target_check === "Run" &&
      sidebar_display == false &&
      !lock_run_button
    ) {
      lock_run_button = true;
      render_sidebar_callback(true);
    } else if (
      target_check === "Run" &&
      sidebar_display == true &&
      !lock_run_button
    ) {
      lock_run_button = true;
      render_sidebar_callback(false);
    }
  };


  useEffect(() => {
    /*
    Click event listener
    Desc: Handles machine menu clicks by checking e type, if DFA|NFA|CFG|PDA|TM sets
    machine_displayed via set_machine_displayed.

    */
    window.addEventListener("click", e => {
      
      if(e.target.id == "temp_anchor" || e.hotkeyApplication) return;
      e.preventDefault();

      // menu handler
      if (e.target != null) {
        if(e.target.id == "DFA"){
          set_machine_displayed(CURRENT_MACHINE.DFA);

        }
        else if(e.target.id == "NFA"){
          set_machine_displayed(CURRENT_MACHINE.NFA);

        }
        else if (e.target.id == "CFG") {
          set_machine_displayed(CURRENT_MACHINE.CFG);
        }
        else if(e.target.id == "PDA"){
          set_machine_displayed(CURRENT_MACHINE.PDA);
        }
        else if(e.target.id == "TM"){
          set_machine_displayed(CURRENT_MACHINE.TM); 
        }
      }

      click_run_handler(e);
      setTimeout(()=>{ },1)

    });
    return () => {
      window.removeEventListener("click", e => click_run_handler(e));
    };
  }, 
  // rerender if and only if sidebar_display changes to false, which means unmount sidebar
  [sidebar_display]);
 
  /*
  Instantiated @ 195 
  Desc: On rerender of state from set_machine_displayed, this function renders
  the graphical body of the selected machine based by enums in CURRENT_MACHINE
  */
  function render_machine_display(){
    switch (machine_displayed){
      case CURRENT_MACHINE.DFA:
        return <Visual />;
      case CURRENT_MACHINE.NFA:
        return <Visual />;
      case CURRENT_MACHINE.CFG:
        return <CFG_Visual/>;
      case CURRENT_MACHINE.PDA:
        return <PDA_Visual/>
      case CURRENT_MACHINE.TM:
        return <h1>Turing Machine! :(</h1>

    }
}

/* Renders */
  return (
    <div className="App">
      <AutomataContext.Provider value={master_context}>
        {sidebar_display ? (
          <Sidebar
            id="sidebar-app"
            sidebar={<Run />}
            touch={false}
            children={<div></div>}
            defaultSidebarWidth={20}
            open={false}
            shadow={true}
            docked={true}
            styles={{
              sidebar: { background: "white", zIndex: 2 },
              overlay: { zIndex: 2 },
              content: { visibility: "hidden", zIndex: -112 },
              dragHandle: { zIndex: -500 }
            }}
          ></Sidebar>
        ) : null}
        <HeaderMenu />
        {render_machine_display()}
      </AutomataContext.Provider>
    </div>
  );
}

export default App;
