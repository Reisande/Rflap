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

function moveCursorToEnd(el) {
  el.focus();
  if (el.setSelectionRange) {
    var len = el.value.length * 2;
    el.setSelectionRange(len, len);
  } else el.value = el.value;
  el.scrollTop = 999999;
}
function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
function Regex() {
  let input_test = useRef(null);
  let input_reg = useRef(null);

  useEffect(() => {
  });
  function removeTags(str) {
    if ((str===null) || (str===''))
    return false;
    else
    str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
 }
  const strip_white = (str) => str.replace(/\s+/g, '');
  
  const testInputs  = (event) => {
    const make_reg = (str_ar) =>{
      return new RegExp(str_ar,"g"); 
    }
    const markup_matches = (reg_matches,div) =>{
      let final_html;
      let test_area = div.current.innerHTML;

        reg_matches.forEach(element => {
        let hd = test_area.indexOf(element);
        let tl = element.length + hd
        final_html = test_area.slice(0,hd) + "<mark>" + test_area.slice(hd,tl) + "</mark>" + test_area.slice(tl) 
        });
       div.current.innerHTML = final_html
    }
    const reg_from_operator_table = (test_reg) =>{
      let proc = strip_white(test_reg);
      
      let test_regex_conv = make_reg(proc.split());
      return make_reg(test_regex_conv)
    }
    input_test.current.innerHTML = input_test.current.innerHTML.replace( /(<([^>]+)>)/ig, '');; 
       let test_reg = input_reg.current.value;
    let test_area = input_test.current.innerText;
    let regex = reg_from_operator_table(test_reg)
    console.log(input_test.current.innerHTML);
    let arr_match = test_area.match(regex,input_test);
    if(arr_match ==null ){

    }
    else{
    markup_matches(arr_match,input_test);
}
  };
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
            <FormControl ref={input_reg} placeholder="aa*" />
            <InputGroup.Append>
              <Button variant="primary" onClick={testInputs}>Test</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

      <Row className="row_between" id="div_in">
        <Col
          ref={input_test}
          id="textarea_div"
          contentEditable="true"
          md={{ offset: 2, span: 8 }}
        >
          something
        </Col>
      </Row>
    </div>
  );
}

export default Regex;
