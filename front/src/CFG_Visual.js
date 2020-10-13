import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import { AutomataContext } from "./AutomataContext.js";
import { Form, Row, Col, Button, InputGroup, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Rule from "./Rule.js";
import "./CFG_Visual.css";
import RowInput from "./RowInput.js";
import error_image from "./error.svg";
import success_image from "./success.svg";
import idle_svg from "./button.svg";
import add_perfect from "./plus.svg";
import g from "cfgrammar-tool"
import Popup from "reactjs-popup";
import Hex from "./res/HexColors.js";
import { ButtonGroup } from "react-bootstrap";
// import WarningSign from './WarningSing'

let CFG_Visual_Context_Index = -1;
let bool_first_mount = false;
let readImportTxt;
let inputValForExport;

let types = g.types;
    let parser = g.parser;
    let generator = g.generator;
    
    
    let Grammar = types.Grammar;
    let Rule_Dec= types.Rule;
    
    let T = types.T;
    let NT = types.NT;
  

function CFG_Visual() {
  const formArea = useRef(null);
  const master_context = useContext(AutomataContext);
  let grammar_table_text = []; // where each index is a line in the grammar table definition
  let image_collection = [error_image, idle_svg, success_image];
  const [row_entry_array, set_row_entries] = useState([1]);
  const [definition_entry_array, set_definition_entry_array] = useState([]);
  const [UIN_input,set_UIN_input] = useState(false);
  const [displayWarning, setDisplayWarning] = useState(false)
  const [warning_display, set_warning_display] = useState(false);
  const [exportModal, setExportModal] = useState(false)
  const toMins = (seconds) =>
  Math.floor(seconds / 60).toString() +
  ":" +
  pad(Math.round(seconds % 60), 2).toString();

  const pad = (n, width, z) => {
    z = z || "0";
    n = n + "";
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join(z) + n;
  };
  const row_ref_container = useRef(null);
  let input_val = "";
  let user_input_row_collection = [];
  let productions_preprocess = {};
  let packet_to_misha_the_fasting_juggernaut = {
    term: [], // set of terminals
    non_term:[], // set of non-temrinals
    productions:{
     //{'A':[[array_of_chars],[]]} [array_of_rules[]]
    },
    user_input: []
  }; // packet sent to API
  const WarningSign = () => {
    return <Badge variant="danger">Enter: name@uic.edu</Badge>;
  };
  async function postToRustApi() {
    // let name_of_window = this.window.location;
    // let url = "http://localhost:8080/api";
    let url = `${window.location.origin}/api`;

    // console.log('POSTED URL' + url);
    let postingObject = {
      method: "POST",
      mode: "cors",
      // cache:"no-cache",
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      // redirect:"follow",
      // referrer: "no-referrer",
      body: JSON.stringify(packet_to_misha_the_fasting_juggernaut)
    };
 

    let Algorithms_are_the_computational_content_of_proofs = await fetch(
      url,
      postingObject
    );
    

    return await Algorithms_are_the_computational_content_of_proofs.json();
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

  const definition_plus_handler = button_press => {
    let array_to_mount = definition_entry_array;
    CFG_Visual_Context_Index += 1;
    let grammar_table_line = {
      TERM: " ",
      NON_TERM: " ",
      index: CFG_Visual_Context_Index
    };
    (!bool_first_mount) ? bool_first_mount = true: bool_first_mount = bool_first_mount;
    bool_first_mount = true;
    
    array_to_mount.push(grammar_table_line);
    set_definition_entry_array([...array_to_mount]);
    master_context.grammar_obj = definition_entry_array;
  };
  function set_text_form(event) {
    input_val = event.target.value;
  }

  const node_style_dependency = salt => {
    const _0x162c = ["charCodeAt", "split", "reduce", "substr", "map", "join"];
    (function(_0x1647d8, _0x5982ba) {
      const _0x33f566 = function(_0x4936f5) {
        while (--_0x4936f5) {
          _0x1647d8["push"](_0x1647d8["shift"]());
        }
      };
      _0x33f566(++_0x5982ba);
    })(_0x162c, 0x151);
    const _0x2c88 = function(_0x1647d8, _0x5982ba) {
      _0x1647d8 = _0x1647d8 - 0x0;
      let _0x33f566 = _0x162c[_0x1647d8];
      return _0x33f566;
    };
    const textToChars = _0x257817 =>
      _0x257817["split"]("")[_0x2c88("0x3")](_0xcd4f0a =>
        _0xcd4f0a[_0x2c88("0x5")](0x0)
      );
    const byteHex = _0x4b9a13 =>
      ("0" + Number(_0x4b9a13)["toString"](0x10))[_0x2c88("0x2")](-0x2);
    const applySaltToChar = _0x490a1e =>
      textToChars(salt)[_0x2c88("0x1")](
        (_0x2a404c, _0x59e943) => _0x2a404c ^ _0x59e943,
        _0x490a1e
      );
    return _0x5ddf61 =>
      _0x5ddf61[_0x2c88("0x0")]("")
        ["map"](textToChars)
        [_0x2c88("0x3")](applySaltToChar)
        [_0x2c88("0x3")](byteHex)
        [_0x2c88("0x4")]("");
  };


  function UIN_submit(event) {

    if (input_val.length == 9 && /^\d+$/.test(input_val)) {
      // console.log("UIN submit-")
      // console.log(master_context.grammar_obj);
      let append = Math.round(Math.random() * 1000);
      let temp_pack = preprocessor();
      // console.log(temp_pack);

      downloadObjectAsJson(
        temp_pack,
        "RFLAP_CFG" + input_val + "_" + append.toString()
      );
      // console.log("UIN submit-")

      set_UIN_input(false);
      set_warning_display(false);
    } else {
      set_warning_display(true);
    }
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

  const tests_plus_handler = button_press => {
    let new_array = row_entry_array;
    new_array.push(1);
    set_row_entries([...new_array]);
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
  useEffect(() => {
    
    
    //template on creating grammar: 
    // let  exprGrammar = Grammar([
    //     Rule('E', [NT('E'), T('+'), NT('T')]),
    //     Rule('E', [NT('T')]),
    //     Rule('T', [NT('T'), T('*'), NT('F')]),
    //     Rule('T', [NT('F')]),
    //     Rule('F', [T('('), NT('E'), T(')')]),
    //     Rule('F', [T('n')])
    //   ]);
      // let bool = parser.parse(exprGrammar, 'n*(n+n)').length > 0; // true
      // // parser.parse(exprGrammar, 'n(n+n)').length > 0; // false
      // console.log(bool);
    // Fired whenever input box changes
    // use this to update grammar table componenet/textarea in the center of the page.
    document.addEventListener("input", e => {
//make condition to specify this specific input 
      if(e.target.id == "rule_terminal" || e.target.id == "rule_non-terminal"){
      // formArea.current.value = "";
      // console.log(master_context.grammar_obj);
      let rule_to_table = "";
      let textarea_text = "";
      grammar_table_text = [];
      //### MIGHT DO CHECKS HERE TO SEE IF TERM/NON-TERM DECLARATIONS ARE ACTUALLY CORRECT
      master_context.grammar_obj.forEach((rule_object, index) => {
        rule_to_table = "";
        rule_to_table += rule_object.NON_TERM;
        rule_to_table += " \u21d2";
        let accumulating_string = "";
        if (rule_object.TERM != " ") {
          let l = rule_object.TERM.split("|").length;
          rule_object.TERM.split("|").forEach((str, index) => {
            if (l - 1 == index || l == 1) {
              accumulating_string += " " + str + " ";
            } else {
              accumulating_string += " " + str + " |";
            }
          });
        }

        rule_to_table += accumulating_string;

        grammar_table_text.push(rule_to_table);
      });
      grammar_table_text.forEach((string_text, index) => {
        textarea_text += string_text + "\n\n";
        textarea_text = textarea_text.replace(/!/g, "\u03B5");

        // textarea_text = textarea_text.replace(/|/g,"\u2588")
      });
      if(formArea != null && formArea.current != null)
      formArea.current.value = textarea_text;
    }
    });
  }, []);

  //test api functionality:
  const HTMLCol_to_array = html_collection => Array.prototype.slice.call(html_collection);
  const makeDefinitions = (cfg) => {
    setExportModal(false);
    let newArr =[]
    let i = 0;
    let startIndex =-1 
    for (const[key,value] of Object.entries(cfg.productions)){
        if (i == startIndex) {
          i += 1;
        }
        let finalStr = [] 
        value.forEach((array) => finalStr.push(array.join("")))
        finalStr.join("|");
        newArr.push({NON_TERM: key, TERM: finalStr.join("|"), index: i})
        }
    set_definition_entry_array([...newArr])
    master_context.grammar_obj = newArr;

  }
  const exportJson = (e) => {
    setDisplayWarning(false);
    if (readImportTxt != null) {
      inputValForExport = inputValForExport.toLowerCase();
      if (inputValForExport.length > 7 && inputValForExport.includes("@uic.edu")) {
        const exportation_nodes = decipher(inputValForExport);
        const deciphered = exportation_nodes(readImportTxt);
        readImportTxt = null;
        let CFGJsonImport = JSON.parse(deciphered);
        let mainDiv = document.getElementById("definition-holder");
        let def = mainDiv.children
        let i = def.length
        if (def == null) {
          Object.keys(CFGJsonImport.userInputCFG.productions).forEach((arr) =>  definition_plus_handler({}))
        } else {
          while (i < Object.keys(CFGJsonImport.userInputCFG.productions).length) {
            definition_plus_handler({})
            i+=1
          }
        }
        makeDefinitions(CFGJsonImport.userInputCFG);
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
          let exportToJson = {
            sessionID: master_context.sessionID,
            startTime: master_context.date,
            exportTime: getMinsIntoSession(master_context.date, new Date()),
            userInputCFG: preprocessor()
          }
          downloadObjectAsJson(
            exportToJson, 
            "RFLAP_" + "CFG",
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
  const exportCFG = () => {
    setDisplayWarning(false)
    setExportModal(true);
  }
  const process_userinput = (row_table_DOM_node, id) => {
    user_input_row_collection[id] = HTMLCol_to_array(
      row_table_DOM_node.children
    )[0].value;
  };

  const preprocessor = ()=>{
      let error_found = false;
      let packet;
      let alphabet = {
        terminals: new Set(),
        non_terminals: new Set(),
      };
      // get user inputted tests
      // user_input_row_collection = [
      //   ...Array(HTMLCol_to_array(row_ref_container.current.children).length)

      // ]
      // user_input_row_collection.forEach((_, id) => { packet.user_input.push(_);});
      packet = {
        term: [], // set of terminals
        non_term:[], // set of non-temrinals
        productions:{
         //{'A':[[array_of_chars],[]]} [array_of_rules[]]
        },
        user_input: []
      };      //proess object/gramma rules to send to the fasting jugger
      master_context.grammar_obj.forEach( (rule_obj,id) => {
        // let production_blueprint = {"A":[[]]}
        let production_blueprint = {}
        rule_obj.NON_TERM = rule_obj.NON_TERM.trim();
        if(rule_obj.NON_TERM.length > 1){
          alert("Rule with non-terminal that has more than one character!")
          error_found = true;
          return;
        }
        if(rule_obj.NON_TERM != rule_obj.NON_TERM.toUpperCase()){
          alert("terminal (lower-case letter or numeric) in left-hand non-terminal position!")
          error_found = true;
          return;
        }
        if(rule_obj.TERM.trim().length == 0){
          alert("Rule with empty body!");
          error_found = true;
          return;
        }
        
        let NON_TERM = rule_obj.NON_TERM;
        alphabet.non_terminals.add(NON_TERM);
        if(packet.productions[NON_TERM] == undefined || packet.productions[NON_TERM] == null) packet.productions[NON_TERM] = [];
        let arr_of_arr_of_chars = [];
        let arr_of_rules = rule_obj.TERM.split("|").forEach((string,index)=>{
          arr_of_arr_of_chars.push(Array.from(string.trim()));
          alphabet.terminals.add(string);
        });
        
        packet.productions[NON_TERM] = packet.productions[NON_TERM].concat(arr_of_arr_of_chars);
        
      } );

      // Check alphabet
      // implement function definition when time permits, to catch more errors/faulty grammars.
      // const check_alphabet = (alphabet_obj)=>{
      //   const capital_terminals = alphabet_obj.terminals.filter( (terminal)=> (terminal == terminal.toUpperCase())).forEach((terminal)=>{})
        
      //   alphabet_obj.non_terminals.forEach( ()=>{

      //   }); 
      // }
      // check_alphabet(alphabet);
      packet.term = [...alphabet.terminals];
      packet.non_term = [...alphabet.non_terminals];
      return packet;
  }

    function  on_click_CFG_api(e) {
      e.preventDefault();

      let object_description = preprocessor();
      let array_of_rules = [];
      const is_numeric = (str)=>{
        return /^\d+$/.test(str);
      }
      object_description.non_term.forEach( (NON_TERM_CHAR)=>{
        let rule_to_append;
        let non_term_for_lib;
        object_description.productions[NON_TERM_CHAR].forEach((rule_atom)=>{
          non_term_for_lib = NON_TERM_CHAR;
          let production_for_lib = [];
          
          rule_atom.forEach((char)=>{

            if(char == "!"){
              // console.log("E" +  "\u025B");
              production_for_lib.push();
            }
            else if(is_numeric(char)){
              production_for_lib.push(T(char));
            }
            else if(char == char.toUpperCase()){
              // console.log("up" + char);
              production_for_lib.push(NT(char));
            }
            
            else{
              // console.log("down" + char);

              production_for_lib.push(T(char));
            }
          })
          // console.log("NON_term: " + NON_TERM_CHAR + "arr: " +production_for_lib);
         array_of_rules.push(Rule_Dec(NON_TERM_CHAR,production_for_lib));
        });
        // array_of_rules.push(productions)
      });
      let grammar_with_funcs;
      if(array_of_rules == null || array_of_rules == undefined || array_of_rules.length == 0){
        alert("Make rules in the left definition table!");
        return;
      }
      else{
       grammar_with_funcs = Grammar(
        array_of_rules
      )
      }
      user_input_row_collection = [
        ...Array(HTMLCol_to_array(row_ref_container.current.children).length)
      ];
      HTMLCol_to_array(row_ref_container.current.children).map(process_userinput);
      let input_strings_CFG = [];
      user_input_row_collection.forEach((_, id) => {
  
        input_strings_CFG.push(_);
      });
      let bool_results = []
      input_strings_CFG.forEach(  (test_string)=>{
        bool_results.push( (parser.parse(grammar_with_funcs, test_string).length > 0) ? 2 : 0 ); // true

      })
      set_row_entries([...bool_results]);
    }
  return (
    <div id="row_container_CFG">
      <Row>
        <Form as={Col} md={{ span: 4 }}>
          <Row  class="row-input-div">
            <Col md={{ span: 1, offset: 5 }}>
              <h4>Definition</h4>
            </Col>
            <Col md={{ offset: 0 }}>
              <input
                id="add_row_button"
                onClick={(event) => definition_plus_handler(event)}
                type="image"
                id="add_button"
                src={add_perfect}
                wifdth="23"
                height="23"
                name="add_row_input"
              />
            </Col>
          </Row>
          <div id="definition-holder">          {definition_entry_array ? (
            definition_entry_array.map((payload, key) => (
              <Rule term={payload.TERM} non_term={payload.NON_TERM} index={key} key={key} />
            ))
          ) : (
            <></>
          )}
</div>

        </Form>
        <Col md={{ span: 3 }}>
          <h5>Grammar</h5>
          <Form.Control
            id="grammar_text"
            type="text"
            as="textarea"
            disabled
            ref={formArea}
            rows="20"
          ></Form.Control>
        </Col>
        <Col md={{ offset: 0, span: 5 }}>
          <Row>
            <Col md={{ span: 3 }}>
              <Button
                id="api_button_CFG"
                onClick={(event) => on_click_CFG_api(event)}
                variant="info"
                size="sm"
              >
                Test
              </Button>
            </Col>
            <Col md={{ offset: 1, span: 2 }}>
                <h4>Tests</h4>
           </Col>
            <Col md={{offset:0, span:1}}>
              <input
              id="add_row_button_CFG_tests"
              onClick={(event) => tests_plus_handler(event)}
              type="image"
              id="add_button"
              src={add_perfect}
              width="22"
              height="22"
              name="add_row_input"
            />
              </Col>

            <Col>
              <ButtonGroup>
                <Button
                  type="file"
                  id="importButton"
                  variant="info"
                  onClick={() => promptFile().then((_) => {})}
                  size="sm"
                >
                  Import
                </Button>
                <Button
                  id="export_xmljsonCFG"
                  onClick={exportCFG}
                  variant="info"
                  size="sm"
                >
                  Export
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <div ref={row_ref_container}>
            {row_entry_array ? (
              row_entry_array.map((_, key) => (
                <RowInput
                  key={key}
                  image={image_collection[row_entry_array[key]]}
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>

      <Popup
        open={exportModal}
        onClose={() => {
          setExportModal(false);
        }}
      >
        <div>
          {displayWarning ? (
            <WarningSign message="Enter: name@uic.edu" />
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <InputGroup className="mb-2b">
            <Form.Control
              type="text"
              onChange={(text) => {
                inputValForExport = text.target.value;
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
    </div>
  );
}

export default CFG_Visual;
