import React, { useState, useEffect } from "react";
import { useRef, useContext } from "react";
import "./HeaderMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, NavDropdown, Col, Button } from "react-bootstrap";
import { AutomataContext } from "./AutomataContext.js";
/*LOGO svg import*/
import rflapsvg from "./rflapsvg.svg";
/* Machine Enum used in App.js
const CURRENT_MACHINE = {
  DFA: 0,
  NFA: 1,
  CFG: 2,
  TM: 3
};
*/
function HeaderMenu(props) {
  
  const master_context = useContext(AutomataContext);



  const runbutton = useRef();

  /*
  Reference tag to get html tag of particular DFA/NFA/TM/PDA/CFG/REG in nav.dropdown.menu
  */
  const DFA = useRef();
  const NFA = useRef();
  const TM = useRef();
  const PDA = useRef();
  const CFG = useRef();
  const REG = useRef();

  useEffect(() => {
    document.querySelector("a.dropdown-toggle.nav-link").style.color =
      "#e25b4b";

function trimSvgWhitespace() {

  // get all SVG objects in the DOM
  var svgs = document.getElementById("rflapsvg-logo");

  // go through each one and add a viewbox that ensures all children are visible
  for (var i=0, l=svgs.length; i<l; i++) {

    var svg = svgs[i],
        box = svg.getBBox(), // <- get the visual boundary required to view all children
        viewBox = [box.y, box.x, box.width, box.height].join(" ");

    // set viewable area based on value above
    svg.setAttribute("viewBox", viewBox);
  }
}
//trimSvgWhitespace();
    master_context.mode = machine_select;

    /* 
    Check of master_context.mode (what ought be current machine mode) and hide
    Run button if in CFG || TM mode as no sidebar component is needed for either.
    */
    if (
      master_context.mode == "Context-free Grammar" ||
      master_context.mode == "Turing Machine"
    )
    {
      
      runbutton.current.style.visibility = "hidden";
    } 
    else {
      runbutton.current.style.visibility = "visible";
    }
  });

    /*

  STATE VARIABLE: machine_select (string)
  machine_select:<title of state machine> => Sets header's title to the state machine

  */
  const [machine_select, set_machine_title] = useState("Deterministic Finite Automata");

  /*
    nav_menu_dropdown_click(e, machine : useRef object)

    Desc: Sets title of machine to the menu click and updates master_context to the machine chosen

  */

  function nav_menu_dropdown_click(e, machine) {
    let name = machine["current"].text;
    set_machine_title(name);
    master_context.mode = name;
  }

  return (
    <Navbar bg="primary" className="bg-dark" id="nav-header">
      {/* Space RFLAP title a bit to the right */}
      <Col md={0}>
        <Col>
          <br></br>
        </Col>
      </Col>
      <Col>
        <Navbar.Brand href="http://www.github.com/Reisande/Rflap"id="logo_text">
         <embed id="rflapsvg-logo" src= {rflapsvg}
          width="140"
          height="50"
          />
          {/* <b>
            {" "}
            <font size="5" color="#2f9399">
              R{" "}
            </font>{" "}
            <font size="5" color="#E25B4B">
              FLAP
            </font>
          </b>  */}
        </Navbar.Brand>
      </Col>
      <Col md={3}></Col>
      <Col md={3}>
        <Col>{machine_select}</Col>
      </Col>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Col md={2}></Col>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown
            className="nav-dropdown-text"
            title="Machines"
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item
              id="DFA"
              onClick={event => nav_menu_dropdown_click(event, DFA)}
              ref={DFA}
              href=""
            >
              Deterministic Finite Automata{" "}
            </NavDropdown.Item>
            <NavDropdown.Item
              id="NFA"
              onClick={event => nav_menu_dropdown_click(event, NFA)}
              ref={NFA}
              href=""
            >
              {" "}
              Non-Deterministic Finite Automata{" "}
            </NavDropdown.Item>
            <NavDropdown.Item
              id="CFG"
              onClick={event => nav_menu_dropdown_click(event, CFG)}
              ref={CFG}
              href=""
            >
              Context-free Grammar
            </NavDropdown.Item>
            <NavDropdown.Item
              id="PDA"
              onClick={event => nav_menu_dropdown_click(event, PDA)}
              ref={PDA}
              href=""
            >
              Push-down Automata
            </NavDropdown.Item>
            
          </NavDropdown>
          <Col></Col>
          <Nav>
            <Nav.Link
              ref={runbutton}
              href=""
              class="text-primary"
              id="runbutton"
            >
              Run
            </Nav.Link>

            <Col></Col>
          </Nav>
        </Nav>
        
      </Navbar.Collapse>
    </Navbar>
  );
}

export default HeaderMenu;
