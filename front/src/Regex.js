import React, { useEffect, useState, useRef, useCallback } from "react";
import { Hex } from "./res/HexColors.js";
import RowInput from "./RowInput.js";
import { Col, Row, InputGroup, Button, FormControl } from "react-bootstrap";

const base_styles = {
  backgroundColor: Hex.Canvas,
};
function Regex() {
  useEffect(() => {});

  return (
    <div style={base_styles} id="row_container_reg">
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          <h1>Reg</h1>
          <InputGroup>
          <FormControl/>
            <InputGroup.Append>
            <Button variant="primary">Test</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <h1>{""}</h1>
      </Row>
    </div>
  );
}

export default Regex;
