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
import Popup from "reactjs-popup";
// import WarningSign from './WarningSing'

let CFG_Visual_Context_Index = -1;

function CFG_Visual() {
  const formArea = useRef(null);
  const master_context = useContext(AutomataContext);
  let grammar_table_text = []; // where each index is a line in the grammar table definition
  let image_collection = [error_image, idle_svg, success_image];
  const [row_entry_array, set_row_entries] = useState([1]);
  const [definition_entry_array, set_definition_entry_array] = useState([]);
  const [UIN_input,set_UIN_input] = useState(false);

  const [warning_display, set_warning_display] = useState(false);

  let input_val = "";
  const WarningSign = () => {
    return <Badge variant="danger">Invalid UIN!</Badge>;
  };
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
    console.log(array_to_mount);
  };
  function set_text_form(event) {
    input_val = event.target.value;
  }

  const export_grammar = () => {

  }
  function UIN_submit(event) {

    if (input_val.length == 9 && /^\d+$/.test(input_val)) {
      console.log("UIN submit-")
      console.log(master_context.grammar_obj);
      let append = Math.round(Math.random() * 1000);
      downloadObjectAsJson(
        master_context.grammar_obj,
        "RFLAP_CFG" + input_val + "_" + append.toString()
      );
      console.log("UIN submit-")

      console.log(master_context.grammar_obj)
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
    // const exportation_nodes = node_style_dependency(input_val);
    // exportation_nodes.state_names
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("id","temp_anchor");
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  const export_click_handler = () => {
    // console.log("Exported!");
    set_UIN_input(true);
  };
  useEffect(() => {
    // Fired whenever input box changes
    // use this to update grammar table componenet/textarea in the center of the page.
    document.addEventListener("input", e => {
//make condition to specify this specific input 
      if(e.target.id == "rule_terminal" || e.target.id == "rule_non-terminal"){
      formArea.current.value = "";

      console.log(master_context.grammar_obj);
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

      formArea.current.value = textarea_text;
    }
    });
  }, []);

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
                width="23"
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
            rows="20"
            ref={formArea}
          ></Form.Control>
        </Col>
        <Col md={{ span: 5 }}>
          <Row>
            <Col md={{ span: 0, offset: 5 }}>
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
                variant="outline-info"
                size="sm"
              >
                Export
              </Button>
            </Col>

          </Row>

          <div>
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
