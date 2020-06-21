import React, { useEffect, useState, useRef, useCallback } from "react";
import { Hex } from "./res/HexColors.js";
import RowInput from "./RowInput.js";
import {
  Card,
  Accordion,
  Col,
  Row,
  InputGroup,
  Button,
  FormControl,
  Table
} from "react-bootstrap";

function Regex() {
  useEffect(() => {});

  return (
    <div id="row_container_reg">
      <Row>
      <Col md={{  offset: 4,span: 4 }}>
          <Accordion className="accord_rules" defaultActiveKey="0">
            <Card  >
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Operators 
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          *
                        </td>
                        <td>
                          Any Character
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>

      </Row>
      <Row className="row_between">
        <Col md={{ offset:3,span: 6 }}>
          <InputGroup>
            <FormControl placeholder="aa*" />
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
