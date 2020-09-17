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
import add_perfect from "./plus.svg";
import error_image from "./error.svg";
import success_image from "./success.svg";
import idle_svg from "./button.svg";

const image_collection = [error_image, idle_svg, success_image];
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
  const inputRowCollector = useRef(null);
  const [testRows,setTestRows] = useState([1])

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
  const make_reg = (str_ar) =>{
      return new RegExp("^" + str_ar + "$","g"); 
    }
 
  const HTMLCol_to_array = (html_collection) =>
    Array.prototype.slice.call(html_collection);


  const testInputs = (event) => {
    let userInputRowCollection = [
      ...Array(HTMLCol_to_array(inputRowCollector.current.children).length),
    ];
    //inputRowCollector.current.childrenmap()
    HTMLCol_to_array(inputRowCollector.current.children).map((row_node, ind) => {
      console.log(row_node)
      console.log(ind)
      let arrayOfHtml = HTMLCol_to_array(row_node.children)
      console.log(arrayOfHtml)
      for (let i = 0; i < arrayOfHtml.length; i++) {
        let perRow = 3;
        console.log(arrayOfHtml[i])
        userInputRowCollection[ind * perRow + i] = arrayOfHtml[i].children[1].value
      }
    })
    let inputRaw = input_reg.current.value;
    const reg = make_reg(inputRaw);
    let ans = userInputRowCollection.map((str, i) => {
      console.log(str)
      console.log(reg)
      if (str.match(reg)) {
        return 2
      } 
      return 0
    })
    console.log(ans);
    return
    const markup_matches = (reg_matches,div) =>{
      let final_html;
      let test_area = div.current.innerHTML;

        reg_matches.forEach(element => {
          console.log(element)
        let hd = test_area.indexOf(element);
        let tl = element.length + hd
        test_area = test_area.slice(0,hd) + "<mark>" + test_area.slice(hd,tl) + "</mark>" + test_area.slice(tl) 
        });
        console.log(test_area.split())
       div.current.innerHTML = test_area
    }
    const reg_from_operator_table = (test_reg) =>{
      let proc = strip_white(test_reg);
      
      let test_regex_conv = make_reg(proc.split());
      return make_reg(test_regex_conv)
    }
    // replaces marks with nothing
    input_test.current.innerHTML = input_test.current.innerHTML.replace( /(<([^>]+)>)/ig, '');; 
    //console.log(":"input_test.current.innerHTML)
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

  const addTestRow = () => {
    if (testRows.length == 24) {
      return
    }
    let newArr = [...testRows, 1] 
    setTestRows([...newArr])
  }
  const layRows = () => {
    const consInputRow = (key, isCorrect) => {
      return (<RowInput key={key}
            image={image_collection[isCorrect]}
            flip={true}/>)
    }
    const consRow = (inputRows) => {
      if (inputRows == false) {
        return
      }
      return (<Row>
        {inputRows.map((input, key) => (input))}
      </Row>)
    }
    const perRow = 3;
    const counter = perRow ;
    let rowsAccum =[] 
    let finalRows = []
    for (let i = 1; i < testRows.length + 1; i++){
      rowsAccum.push(consInputRow(i-1,testRows[i-1])) 
      if ( i % counter == 0) {
        finalRows.push(consRow(rowsAccum))
        rowsAccum = []
      }
    }
    if(rowsAccum.length != 0 )
    finalRows.push(consRow(rowsAccum))
    return finalRows
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
              <Button variant="info" id="export_xmljson">Export</Button>
            </InputGroup.Prepend>
            <FormControl ref={input_reg} placeholder="aa*" />
            <InputGroup.Append>
              <Button variant="info" id ="api_button" onClick={testInputs}>Test</Button>
            </InputGroup.Append>

             <Col md={{ offset: 0, span: 1 }}> 
              <input
              id="add_row_button"
              onClick={(event) => addTestRow(event)}
              type="image"
              id="add_button"
              src={add_perfect}
              width="33"
              height="33"
              name="add_row_input"
            />
            </Col>
          </InputGroup>

        </Col>
      </Row>
      <Row className="row mt-3">
        <Col ref={inputRowCollector} md={{offset: 1,span:10}}>      {layRows().map((jsx, _) =>
        (jsx)
      )}
</Col>

      </Row>
 
      {/* <Row className="row_between" id="div_in">
        {testRows ? (testRows.map((isCorrect, key) => 
          ( <RowInput key={key}
            image={image_collection[isCorrect]}
            flip={true}/>
          )
        )) : (<></>)}
      </Row> 
       */}
    </div>
  );
}

export default Regex;
