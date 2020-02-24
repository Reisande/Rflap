import React, { useEffect, useState, useRef, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Graph } from "react-d3-graph";
import Visual from "./Visual.js";
import HeaderMenu from "./HeaderMenu.js";
import { AutomataContext } from "./AutomataContext.js";
import Run from "./Run.js";
import Sidebar from "react-sidebar";
import {
  Button,
  Table,
  InputGroup,
  FormControl,
  Row,
  Col
} from "react-bootstrap";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Popup from "reactjs-popup";
import CFG_Visual from "./CFG_Visual.js";
import "bootstrap/dist/css/bootstrap.min.css";

let master_context = {
  graphobj: null,    // DFA/NFA: holds graphing object, which declares parameters
  grammar_obj: [{TERM:"",NON_TERM:""}], // CFG_MODULE: array of arrays, where each array is a grammar rule from "Definition"
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

const CURRENT_MACHINE = {
  DFA: 0,
  NFA: 1,
  CFG: 2,
  TM: 3
};

function App() {
  let toggle_menu = useRef();
  const [sidebar_display, set_sidebar_display] = useState(false);
  const [machine_displayed, set_menu_item] = useState(CURRENT_MACHINE.DFA);
  const [modal_state, set_modal_state] = useState(false);
  const [render_visual, set_render_visual] = useState(false);
  const [render_CFG, set_render_CFG] = useState(false);
  const [menu_array, set_menu_array] = useState(CURRENT_MACHINE.DFA);
  // Lock Run Button temporarily as to not cause infinite loop between sidebar appearing and not appearing
  let lock_run_button = false;
  // Catch run click and load sidebar:
  const render_sidebar_callback = useCallback(display_lock => {
    set_sidebar_display(display_lock);
  }, []);

  const render_visual_callback = useCallback(() => {
    set_render_visual(true);
  }, []);
  const click_run_handler = e => {
    // Check if event is not null, then continue
    // toggle_menu.handleContextClick(e);
    if (e == null || e.target == null || e.target.lastChild == null) {
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
  const click_CFG_handler = () =>{

  }
  useEffect(() => {
    // render_visual_callback();
    // console.log("RENDER")

    window.addEventListener("click", e => {
      e.preventDefault();
      // menu handler
      if (e.target != null) {
        if(e.target.id == "DFA"){
          set_menu_item(CURRENT_MACHINE.DFA);

        }
        if(e.target.id == "NFA"){
          set_menu_item(CURRENT_MACHINE.NFA);

        }
        if (e.target.id == "CFG") {
          set_menu_item(CURRENT_MACHINE.CFG);
        }
         if(e.target.id == "TM"){
         set_menu_item(CURRENT_MACHINE.TM); 
        }
      }
      click_run_handler(e);
    });
    return () => {
      window.removeEventListener("click", e => click_run_handler(e));
    };
  }, [sidebar_display, modal_state, render_visual]);

  // modal, called by contex_menu first one.
  function openModal(e, data) {
    set_modal_state(true);
  }
  function add_node(e, data) {
    // console.log(e,data);
  }
  function change_node_name(e) {
    // console.log("E"+ e.target.value);
  }

  function handleClick(e, data) {
    // console.log('------HANDLECLICK-------');
    // console.log(e);
    // console.log(data);
    // console.log('////////HANDLECLICK///////');
  }
  const CFG_modal_open = () => {
    return <div>{render_CFG ? <CFG_Visual /> : <React.Fragment />}</div>;
  };

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
            
        {(function() {
          switch (machine_displayed) {
            case CURRENT_MACHINE.DFA:
              return <Visual />;
            case CURRENT_MACHINE.NFA:
              return <Visual />;
            case CURRENT_MACHINE.CFG:
              return <CFG_Visual/>;
            case CURRENT_MACHINE.TM:
            return <h1>Turing Machine! :(</h1>
          }
        })()}
      </AutomataContext.Provider>
    </div>
  );
}

export default App;
