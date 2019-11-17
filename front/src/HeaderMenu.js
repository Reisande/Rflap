import React, { useState} from 'react';
import {useRef,useContext} from 'react';
import './HeaderMenu.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, NavDropdown,Col} from 'react-bootstrap';
import {AutomataContext} from './AutomataContext.js'
function HeaderMenu(props){
    const master_context = useContext(AutomataContext)
    const DFA = useRef();
    const NFA = useRef();
    const TM = useRef();
    const PDA = useRef();
    const CFG = useRef();
    const REG = useRef();


    const [machine_select,set_machine_title] = useState("Deterministic Finite-Automata");

    console.log("master context "  + master_context['test_value']);


    function propagateEvent(event,language){
        let name = language['current'].text;
        console.log(event);
        console.log(name);
        set_machine_title(name);
        master_context['mode'] = name;
        console.log("In propogateEvent");
        

    }

return(
<Navbar collapseOnSelect bg="primary"  expand="md" variant="dark" id = "nav-header">
    {/* Space RFLAP title a bit to the right */}
   <Col md={0}>
       <Col>
       <br></br>
       </Col>
    </Col>     
    
    <Navbar.Brand href="#home"> <b>RFLAP</b></Navbar.Brand>
    {/* add xs field for release */}
    <Col></Col>
    <Col md = {9}>
    {machine_select}
        <Col md = {6}></Col>
    </Col>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    
  <Navbar.Collapse id="responsive-navbar-nav">
    
    <Nav className="mr-auto">
   
      <NavDropdown class = "nav-dropdown-text" title="Machines"id="collasible-nav-dropdown" >
      
        
        <NavDropdown.Item onClick={(event) => propagateEvent(event,DFA)} ref= {DFA}  href="">Determinstic Finite Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,NFA)} ref= {NFA} href="">Non-deterministic Finite Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,TM)} ref= {TM}href="">Turing Machine</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,PDA)} ref= {PDA}href="">Push-down Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,CFG)} ref= {CFG}href="">Context-free Grammar</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,REG)} ref= {REG} href="">Regular Expression</NavDropdown.Item>
      </NavDropdown>
      <Col></Col>
      <Nav>
  <Nav.Link href="#home" class="text-primary">Run</Nav.Link>

  </Nav>
    </Nav>
    
  
  </Navbar.Collapse>
  

  
</Navbar>

);


}


export default HeaderMenu;