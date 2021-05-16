import React from "react";
import { Col, InputGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function RowInput(props) {
  if (props.flip) {
    return (
      <InputGroup className="mb-3" as={Col}>
        <Col md="auto">
          <InputGroup.Prepend>
            <img width="32px" height="32px" src={props.image}></img>
          </InputGroup.Prepend>
        </Col>
        <Form.Control aria-label="" />
      </InputGroup>
    );
  }
  return (
    <InputGroup className="mb-3" as={Col}>
      <Form.Control aria-label="" />
      <Col md="auto">
        <InputGroup.Append>
          <img width="32px" height="32px" src={props.image}></img>
        </InputGroup.Append>
      </Col>
    </InputGroup>
  );
}

export default RowInput;
