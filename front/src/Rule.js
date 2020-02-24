import React, { useEffect,useRef,useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Col } from "react-bootstrap";
import right_arrow_production from "./long-right-arrow.svg";
import "./Rule.css"


// const preprocess_string = (input_text) =>{
  
//   let toks  = input_text.split(">");
//   let return_string = ""
//     //check if capital and only one
  
//   if(tok[0].length == 1 && tok[0] == tok[0].toUpperCase()){
//       return_string.concat(tok);
//       }

//   let len = toks.length.;

// }

function Rule(props) {

  
  const non_terminal = useRef(null);
  const definition = useRef(null);
  let mount_text = ""
  props.text == null ? mount_text = "  ": mount_text = props.text;


  useEffect( ()=>{
  
    
  },[]);


  return (
    <Form.Row>
      <Col md={{span:2,offset:1}} >
        <Form.Control defaultValue= {mount_text.charAt(0)} as="input" id="rule_non-terminal"/>
      </Col>
      <Col md= "auto">
      <img id="bar" src={right_arrow_production} height="34" width="34"></img>
      </Col>
      <Col md={{span:6}}>
        <Form.Control as ="input" defaultValue={mount_text.charAt(1)} />
      </Col>
    </Form.Row>
  );
}

export default Rule;
