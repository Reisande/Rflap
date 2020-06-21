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
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function highlight(container,what,spanClass) {
  var content = container.innerHTML,
      pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
      replaceWith = '$1<mark ' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$2</mark>$3',
      highlighted = content.replace(pattern,replaceWith);
      console.log(highlighted);
  return (container.innerHTML = highlighted) !== content;
}
function moveCursorToEnd(el) {
  el.focus();
  if (el.setSelectionRange) {
    var len = el.value.length * 2;
    el.setSelectionRange(len, len);
  } else el.value = el.value;
  el.scrollTop = 999999;
}

function Regex() {
  let input_test = useRef(null);

  useEffect(() => {});

  const handleChange = (event) => {

    // moveCursorToEnd(input_test.current);
    // console.log("Something:"  + input_test.current.innerHTML)
    // highlight(input_test.current,"some","highlight");
    // moveCursorToEnd(input_test.current);
  }  
  return (
    <div id="row_container_reg">
      <Row>
        <Col md={{ offset: 4, span: 4 }}>
          <Accordion className="accord_rules" defaultActiveKey="0">
            <Card>
              <OverlayTrigger
                delay={{ show: 150, hide: 200 }}
                overlay={<Tooltip>Click </Tooltip>}
              >
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Operators
                </Accordion.Toggle>
              </OverlayTrigger>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Table bordered hover>
                    <tbody>
                      <tr>
                        <td>*</td>
                        <td>Any Character</td>
                      </tr>
                      <tr>
                        <td>+</td>
                        <td>Previous Character or More</td>
                      </tr>
                      <tr>
                        <td>( . . . )</td>
                        <td>Grouping Characters</td>
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
        <Col md={{ offset: 3, span: 6 }}>
          <InputGroup>
            <InputGroup.Prepend>
              <Button variant="primary">Export</Button>
            </InputGroup.Prepend>
            <FormControl placeholder="aa*"  />
            <InputGroup.Append>
              <Button variant="primary">Test</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

      <Row className="row_between" id="div_in">
        <Col ref={input_test} onFocus={()=>{}}onInput={handleChange} id="textarea_div" contentEditable="true" md={{ offset: 2, span: 8 }}>
          "something"
        </Col>
      </Row>
    </div>
  );
}

export default Regex;
