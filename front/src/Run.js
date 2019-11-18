import  React, {useRef,useContext} from 'react';
import {Button,Form, Col,Row,Navbar,Nav, InputGroup,FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { inspect } from 'util' 
import "./Run.css";
import error from './error.svg';
import success from './success.svg';
import {AutomataContext} from './AutomataContext.js'

var util = require('util')


function Run(props){
    const master_context = useContext(AutomataContext)

    let input_val = "default";


    
   function onClickPingToApi(event){
       console.log("String from user: " +input_val);
       console.log("State info:" + master_context['mode']  )

   }
   function setInputVal(value){
    input_val = value.target.value;
   }



    return(
        <div id = "inside-div-scrollbar"> 
        <Navbar className="bg-dark justify-content-between" id ='nav-header' >

        <Navbar.Brand href="#home"> <b> <font color="#835C3B">R </font>   <font color = "#FFD700">FLAP</font></b></Navbar.Brand>
        <Nav>
        <Button onClick={ (event) => onClickPingToApi(event) } variant="warning">
           Run Strings
        </Button>
        </Nav>
        </Navbar>



        <Row><br/></Row>
        <InputGroup className="mb-3" as={Col}>

        <Form.Control onChange={ (event) => setInputVal(event)} aria-label="Amount (to the nearest dollar)"  />
        <Col md="auto" >
        
        <InputGroup.Append  >
        <img width="32px" height = "32px" src={error}></img>
        </InputGroup.Append>
        </Col>
     </InputGroup>
    </div>
    );
    
}

export default Run;