import React, { useState, useEffect } from 'react';
import { useRef, useContext } from 'react';
import './HeaderMenu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Col } from 'react-bootstrap';
import { AutomataContext } from './AutomataContext';

function HeaderMenu(props: any) {
  const master_context = useContext(AutomataContext);

  const DFA = useRef<any>();
  const NFA = useRef<any>();
  // const TM = useRef();
  // const PDA = useRef();
  // const CFG = useRef();
  // const REG = useRef();

  useEffect(() => {
    //edit the colors of the right menu drop down buttons and run button
    // document.querySelector('a.dropdown-toggle.nav-link').style.color = '#e25b4b';
    master_context.mode = machine_select;
  });

  const [machine_select, set_machine_title] = useState('Deterministic Finite Automata');

  // console.log("master context "  + master_context['test_value']);

  function propagateEvent(event: any, language: any) {
    let name = language['current'].text;
    // console.log(event);
    // console.log(name);
    set_machine_title(name);
    master_context.mode = name;
    master_context['test_value'] = 'Change made to test_value in HeaderMenu';
    // console.log("In propagateEvent");
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
        <Navbar.Brand id="logo_text">
          <b>
            {' '}
            <h3>
              <span style={{ color: '#2f9399' }}>R</span>{' '}
              <span style={{ color: '#E25B4B' }}>FLAP</span>
            </h3>
          </b>
        </Navbar.Brand>
      </Col>
      {/* <Navbar.Brand> <img
      src={not_ferris}
      height = "75px"
      width= "100px"
    /></Navbar.Brand> */}
      {/* add xs field for release */}
      <Col md={3}></Col>
      <Col md={3}>
        <Col>{machine_select}</Col>
      </Col>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Col md={2}></Col>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown className="nav-dropdown-text" title="Machines" id="collapsible-nav-dropdown">
            <NavDropdown.Item onClick={event => propagateEvent(event, DFA)} ref={DFA} href="">
              Deterministic Finite Automata{' '}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={event => propagateEvent(event, NFA)} ref={NFA} href="">
              {' '}
              Non-Deterministic Finite Automata{' '}
            </NavDropdown.Item>
            {/* <NavDropdown.Item onClick={(event) => propagateEvent(event,TM)} ref= {TM}href="">Turing Machine</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,PDA)} ref= {PDA}href="">Push-down Automata</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,CFG)} ref= {CFG}href="">Context-free Grammar</NavDropdown.Item>
        <NavDropdown.Item onClick={(event) => propagateEvent(event,REG)} ref= {REG} href="">Regular Expression</NavDropdown.Item> */}
          </NavDropdown>
          <Col></Col>
          <Nav>
            <Nav.Link href="" className="text-primary" id="runbutton">
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
