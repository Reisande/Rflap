import React, { useRef, useContext, useState, useEffect } from 'react';
import { Col, Row, InputGroup, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function RowInput(props: any) {
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
