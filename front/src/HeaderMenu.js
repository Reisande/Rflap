import React, { useState,useEffect} from 'react';
import {useRef,useContext} from 'react';
import './HeaderMenu.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, NavDropdown,Col,Button} from 'react-bootstrap';
import {AutomataContext} from './AutomataContext.js';
import not_ferris  from "./rFlapLogo.png";



function HeaderMenu(props){
    const master_context = useContext(AutomataContext)



    const DFA = useRef();
    const NFA = useRef();
    const TM = useRef();
    const PDA = useRef();
    const CFG = useRef();
    const REG = useRef();
    useEffect( ()=>{
      master_context.mode = machine_select;
    }  )  ;

    const [machine_select,set_machine_title] = useState("Determinstic Finite Automata");

    // console.log("master context "  + master_context['test_value']);


    function propagateEvent(event,language){
        let name = language['current'].text;
        // console.log(event);
        // console.log(name);
        set_machine_title(name);
        master_context.mode = name;
        master_context['test_value']= "Change made to test_value in HeaderMenu.js";
        // console.log("In propogateEvent");
    }

return(
<Navbar  bg="primary"  className="bg-dark" id = "nav-header">
    {/* Space RFLAP title a bit to the right */}
   <Col md={0}>
       <Col>
       <br></br>
       </Col>
    </Col>     
    <Col>
    <Navbar.Brand id="logo_text" ><b> <font size = "5" color="#835C3B">R </font>  <font size="5" color="#FFD700">FLAP</font></b></Navbar.Brand>
    </Col>
    {/* <Navbar.Brand> <img
      src={not_ferris}
      height = "75px"
      width= "100px"
    /></Navbar.Brand> */}
    {/* add xs field for release */}
    <Col md = {3}></Col>
    <Col md = {3}>
    <Col>
    {machine_select}
    </Col>
    </Col>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Col md= {2}>
  </Col>
  <Navbar.Collapse id="responsive-navbar-nav">
    
    <Nav className="mr-auto">
   
      <NavDropdown class = "nav-dropdown-text" title="Machines"id="collasible-nav-dropdown" >
      
        
        <NavDropdown.Item onClick={(event) => propagateEvent(event,DFA)} ref= {DFA}  href="">Determinstic Finite Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,NFA)} ref= {NFA} href="">Non-Determinstic Finite Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,TM)} ref= {TM}href="">Turing Machine</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,PDA)} ref= {PDA}href="">Push-down Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,CFG)} ref= {CFG}href="">Context-free Grammar</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,REG)} ref= {REG} href="">Regular Expression</NavDropdown.Item>
      </NavDropdown>
      <Col></Col>
      <Nav>
  <Nav.Link href="" class="text-primary" id = 'runbutton'>Run</Nav.Link>
  <Col></Col>
 
  </Nav>
    </Nav>
    
  
  </Navbar.Collapse>
  

  
</Navbar>

);


}


export default HeaderMenu;