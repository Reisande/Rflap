import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Col } from "react-bootstrap";
import right_arrow_production from "./long-right-arrow.svg";
import "./Rule.css"
function Rule() {
  return (
    <Form.Row>
      <Col md={{span:2,offset:1}} >
        <Form.Control as="input" id="rule_non-terminal"/>
      </Col>
      <Col md= "auto">
      <img id="bar" src={right_arrow_production} height="34" width="34"></img>
      </Col>
      <Col md={{span:6}}>
        <Form.Control />
      </Col>
    </Form.Row>
  );
}

export default Rule;
