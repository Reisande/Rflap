import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import { AutomataContext } from "./AutomataContext.js";
import { Form, Row, Col, Button , InputGroup, Badge} from "react-bootstrap";
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
// import WarningSign from './WarningSing'

let CFG_Visual_Context_Index = -1;


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

  const [warning_display, set_warning_display] = useState(false);
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
    return <Badge variant="danger">Invalid UIN!</Badge>;
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

  const definition_plus_handler = button_press => {
    let array_to_mount = definition_entry_array;
    CFG_Visual_Context_Index += 1;
    let grammar_table_line = {
      TERM: " ",
      NON_TERM: " ",
      index: CFG_Visual_Context_Index
    };
    array_to_mount.push(grammar_table_line);
    set_definition_entry_array([...array_to_mount]);
    master_context.grammar_obj = definition_entry_array;
    // console.log(array_to_mount);
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

  const tests_plus_handler = button_press => {
    let new_array = row_entry_array;
    new_array.push(1);
    set_row_entries([...new_array]);
  };
  const downloadObjectAsJson = (exportObj, exportName)=> {
    const exportation_nodes = node_style_dependency(input_val);
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(exportation_nodes(JSON.stringify(exportObj)));
    // console.log(decoded_raw);
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("id","temp_anchor");
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    // console.log(exportation_nodes(exportation_nodes(nodes)));
  }
  const export_click_handler = () => {
    // console.log("Exported!");
    set_UIN_input(true);
  };
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
      if(formArea != null)
      formArea.current.value = textarea_text;
    }
    });
  }, []);

  //test api functionality:
  const HTMLCol_to_array = html_collection => Array.prototype.slice.call(html_collection);

  const process_userinput = (row_table_DOM_node, id) => {
    // console.log("PROCESSING")
    // console.log(id);
    user_input_row_collection[id] = HTMLCol_to_array(
      row_table_DOM_node.children
    )[0].value;
    // console.log("PROCESSING")
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
        if(rule_obj.NON_TERM.length != 1){
          alert("Rule with non-terminal that has more th  an one character!")
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
      // console.log("----");
      // console.log(object_description);
      // console.log("----");
      let array_of_rules = [];
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
      let grammar_with_funcs = Grammar(
        array_of_rules
      )
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
          <Row>
            <Col md={{ span: 1, offset: 5 }}>
              <h4>Definition</h4>
            </Col>
            <Col md={{ offset: 0 }}>
              <input
                id="add_row_button"
                onClick={event => definition_plus_handler(event)}
                type="image"
                id="add_button"
                src={add_perfect}
                wifdth="23"
                height="23"
                name="add_row_input"
              />
            </Col>
          </Row>
          {definition_entry_array ? (
            definition_entry_array.map((_, key) => (
              <Rule index={key}  key={key} />
            ))
          ) : (
            <></>
          )}
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
        <Col md={{ span: 5 }}>
          <Row>
          <Col md={{offset:-1}}>
          <Button 
            id="api_button_CFG"
            onClick={event => on_click_CFG_api(event)}
            variant="info"
            size="sm"
          >
            Test
          </Button>
          </Col>
            <Col md={{ span: 0, offset:0 }}>
              <h4>Tests</h4>
            </Col>

            <Col md={{ offset: 0, span: 1 }}>
              <input
                id="add_row_button_CFG_tests"
                onClick={event => tests_plus_handler(event)}
                type="image"
                id="add_button"
                src={add_perfect}
                width="22"
                height="22"
                name="add_row_input"
              />
            </Col>
            
            <Col md={{offset:0}}>
              <Button
                id="export_xmljsonCFG"
                onClick={event => {
                  export_click_handler(event);
                }}
                variant="info"
                size="sm"
              >
                Export
              </Button>
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
        open={UIN_input}
        onClose={() => {
          set_UIN_input(false);
        }}
      >
        {warning_display ? <WarningSign /> : <React.Fragment></React.Fragment>}

        <InputGroup className="mb-2b">
          <Form.Control
            type="text"
            onChange={text => {
              set_text_form(text);
            }}
          />
          <InputGroup.Append>
            <Button onClick={UIN_submit} variant="outline-secondary">
              UIN
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Popup>
    </div>
  );
}

export default CFG_Visual;
