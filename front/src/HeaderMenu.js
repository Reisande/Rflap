import React, { useState} from 'react';
import {useRef,useContext} from 'react';
import './HeaderMenu.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, NavDropdown,Col,Button} from 'react-bootstrap';
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

    // console.log("master context "  + master_context['test_value']);


    function propagateEvent(event,language){
        let name = language['current'].text;
        console.log(event);
        console.log(name);
        set_machine_title(name);
        master_context['mode'] = name;
        master_context['test_value']= "Change made to test_value in HeaderMenu.js";
        console.log("In propogateEvent");
        

    }

return(
<Navbar  bg="primary"  className="bg-dark" id = "nav-header">
    {/* Space RFLAP title a bit to the right */}
   <Col md={0}>
       <Col>
       <br></br>
       </Col>
    </Col>     
    <Navbar.Brand ><b> <font color="#835C3B">R </font>  <font color="#FFD700">FLAP</font></b></Navbar.Brand>
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
        <NavDropdown.Item onClick={(event) => propagateEvent(event,NFA)} ref= {NFA} href="">Non-deterministic Finite Automata</NavDropdown.Item>
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