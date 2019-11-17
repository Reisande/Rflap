import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Graph } from "react-d3-graph";
import Visual from './Visual.js';
import HeaderMenu from './HeaderMenu.js';
import {AutomataContext} from './AutomataContext.js';
import Run from './Run.js';




function App() {

  
  let master_context = {
    mode: "Determinstic Finite Automata",
    states : [],
    transitions:[],
    test_value: "TEST_VALUE",
  };

  return (
    <div className="App">
      <AutomataContext.Provider value={master_context}   >
      <HeaderMenu/>
      <Visual/>
      </AutomataContext.Provider>
    </div>
  );
}

export default App;
