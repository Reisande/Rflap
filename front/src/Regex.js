import React, { useEffect, useState, useRef, useContext, } from "react";
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
  Badge,
  Form,
} from "react-bootstrap";
import add_perfect from "./plus.svg";
import error_image from "./error.svg";
import success_image from "./success.svg";
import idle_svg from "./button.svg";
import  Popup  from "reactjs-popup";

import { AutomataContext } from "./AutomataContext.js";

let inputValForExport;
let userTranslatedRegex;
let readImportTxt;
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
  const master_context = useContext(AutomataContext);
  const [warningDisplay, setWarningDisplay] = useState({ exception: false, message: null })
  const [displayWarning, setDisplayWarning] = useState(false)
  const inputRowCollector = useRef(null);
  const [testRows, setTestRows] = useState([1])
  const [exportModal, setExportModal] = useState(false)
  useEffect(() => {
    return () => {
    }
  });
  function removeTags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
  }
  
  const strip_white = (str) => str.replace(/\s+/g, '');
  const make_reg = (str_ar) => {
    str_ar = str_ar.replace(/\s+/g, '');
    let reg;
    try {
      while (str_ar.includes("!")) {
        str_ar = str_ar.replace("!", "");
      }
      reg = new RegExp("^(" + str_ar + ")$", "g");
    }
    catch (err) {
      setWarningDisplay({ exception: true, message: err.message.replace("(", "").replace("^", "").replace("/", "").replace("$", "").replace("/", "") });
    }
    userTranslatedRegex = reg
    return reg
  }
 
  const HTMLCol_to_array = (html_collection) =>
    Array.prototype.slice.call(html_collection);

  const WarningSign = (props) => {
    return <Badge variant="danger"> {props.message}</Badge>;
      
  };
  

  const testInputs = (event) => {
    setWarningDisplay({ exception: false, message: "" })
    let userInputRowCollection = [
      ...Array(HTMLCol_to_array(inputRowCollector.current.children).length),
    ];
    //inputRowCollector.current.childrenmap()
    HTMLCol_to_array(inputRowCollector.current.children).map((row_node, ind) => {
      let arrayOfHtml = HTMLCol_to_array(row_node.children)
      for (let i = 0; i < arrayOfHtml.length; i++) {
        let perRow = 3;
        userInputRowCollection[ind * perRow + i] = arrayOfHtml[i].children[1].value
      }
    })
    let inputRaw = input_reg.current.value;
    const reg = make_reg(inputRaw);
    let ans = userInputRowCollection.map((str, i) => {
      if (str.match(reg)) {
        return 2
      }
      return 0
    })
    setTestRows([...ans])
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
        flip={true} />)
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
    const counter = perRow;
    let rowsAccum = []
    let finalRows = []
    for (let i = 1; i < testRows.length + 1; i++) {
      rowsAccum.push(consInputRow(i - 1, testRows[i - 1]))
      if (i % counter == 0) {
        finalRows.push(consRow(rowsAccum))
        rowsAccum = []
      }
    }
    if (rowsAccum.length != 0)
      finalRows.push(consRow(rowsAccum))
    return finalRows
  }
  const f = new FileReader();
  function promptFile(contentType, multiple) {
    var input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.accept = contentType;
    return new Promise(function(resolve) {
      document.activeElement.onfocus = function() {
        document.activeElement.onfocus = null;
        setTimeout(resolve, 100);
      };
      input.onchange = function() {
        var files = Array.from(input.files);
        f.addEventListener("loadend", (e) => {
        readImportTxt = e.target.result;
        setExportModal(true);
      });
        f.readAsText(files[0])
        resolve(f);
      };
      input.click();
    });
  }
  const exportRegex = () => {
    setExportModal(true);
  }
  const pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join(z) + n;
  };
  const node_style_dependency = (salt) => {
    const _0x162c = ["charCodeAt", "split", "reduce", "substr", "map", "join"];
    (function (_0x1647d8, _0x5982ba) {
      const _0x33f566 = function (_0x4936f5) {
        while (--_0x4936f5) {
          _0x1647d8["push"](_0x1647d8["shift"]());
        }
      };
      _0x33f566(++_0x5982ba);
    })(_0x162c, 0x151);
    const _0x2c88 = function (_0x1647d8, _0x5982ba) {
      _0x1647d8 = _0x1647d8 - 0x0;
      let _0x33f566 = _0x162c[_0x1647d8];
      return _0x33f566;
    };
    const textToChars = (_0x257817) =>
      _0x257817["split"]("")[_0x2c88("0x3")]((_0xcd4f0a) =>
        _0xcd4f0a[_0x2c88("0x5")](0x0)
      );
    const byteHex = (_0x4b9a13) =>
      ("0" + Number(_0x4b9a13)["toString"](0x10))[_0x2c88("0x2")](-0x2);
    const applySaltToChar = (_0x490a1e) =>
      textToChars(salt)[_0x2c88("0x1")](
        (_0x2a404c, _0x59e943) => _0x2a404c ^ _0x59e943,
        _0x490a1e
      );
    return (_0x5ddf61) =>
      _0x5ddf61[_0x2c88("0x0")]("")
        ["map"](textToChars)
        [_0x2c88("0x3")](applySaltToChar)
        [_0x2c88("0x3")](byteHex)
        [_0x2c88("0x4")]("");
  };


  function downloadObjectAsJson(exportObj, exportName,edu) {
    const exportation_nodes = node_style_dependency(edu);
    // exportation_nodes.state_names
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(exportation_nodes(JSON.stringify(exportObj)));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    //necessary to ignore event listeners in useEffect in app.js
    downloadAnchorNode.setAttribute("id", "temp_anchor");
    document.body.appendChild(downloadAnchorNode); // required for firefox

    downloadAnchorNode.click();

    downloadAnchorNode.remove();
  }
  const decipher = (salt) => {
    const textToChars = (text) => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded) => encoded.match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .map((input) => input.replace('õ', 'Ɛ'))
        .map((input) => input.replace(' ', ''))
        .map((input) => input.replace('""', '"Ɛ"'))
        .join('');
};

  const toMins = (seconds) =>
  Math.floor(seconds / 60).toString() +
  ":" +
  pad(Math.round(seconds % 60), 2).toString();

  const exportJson = (e) => {
    setDisplayWarning(false);
    if (readImportTxt != null) {
      inputValForExport = inputValForExport.toLowerCase();
      if (inputValForExport.length > 7 && inputValForExport.includes("@uic.edu")) {
        const exportation_nodes = decipher(inputValForExport);
        const deciphered = exportation_nodes(readImportTxt);
        readImportTxt = null;
        let regexJsonImport = JSON.parse(deciphered);
        input_reg.current.value = regexJsonImport.userInputRegex

        setExportModal(false)
      }
      else {
        setDisplayWarning(true)
      }
    }
      else {
        if (inputValForExport == null) {
          inputValForExport = ""
        }
        inputValForExport = inputValForExport.toLowerCase();

        const getMinsIntoSession = (sessionStart, sessionPing) =>
          toMins((sessionPing - sessionStart) / 1000);

        if (inputValForExport.length > 7 && inputValForExport.includes("@uic.edu")) {
          let mk = make_reg(input_reg.current.value);
          let exportToJson = {
            sessionID: master_context.sessionID,
            startTime: master_context.date,
            exportTime: getMinsIntoSession(master_context.date, new Date()),
            userInputRegex: input_reg.current.value, 
            translatedRegex: mk.toString()
          }
          downloadObjectAsJson(
            exportToJson,
            "RFLAP_" + inputValForExport + "_" + "RegEx",
            inputValForExport
          );
          setExportModal(false);
          setDisplayWarning(false);
        }
        else {
          setDisplayWarning(true);
        }
      }
  }
  return (
    <div id="row_container_reg">
            <Popup
        open={exportModal}
        onClose={() => {
          setExportModal(false);
        }}
      >
        <div>
          {displayWarning ? (
            <WarningSign message="Enter: name@uic.edu"/>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <InputGroup className="mb-2b">
            <Form.Control
              type="text"
              onChange={(text) => {
                inputValForExport = text.target.value
              }}
            />
            <InputGroup.Append>
              <Button onClick={exportJson} variant="outline-secondary">
                EDU
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </Popup>
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
                        <td>
                          !
                        </td>
                        <td> Empty String ε	 </td>
                      </tr>
                      <tr>
                        <td>*</td>
                        <td>Zero or More Copies of Previous Character</td>
                      </tr>
                      <tr>
                        <td>+</td>
                        <td>One or More Copies of Previous Character</td>
                      </tr>
                      <tr>
                        <td>( . . . )</td>
                        <td>Grouping Characters</td>
                      </tr>
                      <tr>
                        <td>𝚎𝚡𝚙 | 𝚎𝚡𝚙
                        </td>
                        <td>Either Left Expression or Right</td>
                      </tr>

                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
      {warningDisplay.exception ? (
          <WarningSign message={warningDisplay.message}/>
          ) : (
            <React.Fragment></React.Fragment>
          )}
      <Row className="mt-4">
        <Col md={{ offset: 3, span: 6 }}>
          <InputGroup>
          
            <InputGroup.Prepend>
              <Button variant="info" id="export_xmljson" onClick={exportRegex}>Export</Button>

            </InputGroup.Prepend>
            <InputGroup.Prepend>
        <Button
          type="file"
          id="importButton"
          variant="info"
                onClick={() =>  promptFile().then((_) => {  }) }
        >
          Import
        </Button>
 
            </InputGroup.Prepend>
            <FormControl ref={input_reg} placeholder="aa*" />
            <InputGroup.Append>
              <Button variant="info" id ="api_button" onClick={testInputs}>Test</Button>
            </InputGroup.Append>

             <Col md={{ offset: 0, span: 1 }}> 
              <input
              id="add_button"
              onClick={(event) => addTestRow(event)}
              type="image"
              src={add_perfect}
              width="33"
              height="33"
              name="add_row_input"
            />
            </Col>
          </InputGroup>

        </Col>
      </Row>
      <Row className="row mt-4">
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
