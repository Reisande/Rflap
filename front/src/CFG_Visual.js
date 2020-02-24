import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import { AutomataContext } from "./AutomataContext.js";
import { Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Rule from "./Rule.js";
import "./CFG_Visual.css";
import RowInput from "./RowInput.js";
import error_image from "./error.svg";
import success_image from "./success.svg";
import idle_svg from "./button.svg";
import add_perfect from "./plus.svg";

let  CFG_Visual_Context_Index = -1;

function CFG_Visual() {

  const formArea = useRef(null);
  const master_context = useContext(AutomataContext);
  let grammar_table_text = [] // where each index is a line in the grammar table definition
  let image_collection = [error_image, idle_svg, success_image];
  const [row_entry_array, set_row_entries] = useState([1]);
  const [definition_entry_array, set_definition_entry_array] = useState([]);

  const definition_plus_handler = button_press => {
    console.log("button click!");
    let array_to_mount = definition_entry_array;
    CFG_Visual_Context_Index+=1;
    let grammar_table_line = {
      TERM: " ",
      NON_TERM: " ",
      index: CFG_Visual_Context_Index,
    };
    array_to_mount.push(grammar_table_line);
    set_definition_entry_array([...array_to_mount]);
    master_context.grammar_obj = definition_entry_array;
    console.log(array_to_mount);
  };
  useEffect(() => {
    // Fired whenever input box changes
    // use this to update grammar table componenet/textarea in the center of the page.
    document.addEventListener("input", e => {
      formArea.current.value = "";

      console.log(master_context.grammar_obj);
      let rule_to_table = "";
      let textarea_text = ""
      grammar_table_text = [];
      //### MIGHT DO CHECKS HERE TO SEE IF TERM/NON-TERM DECLARATIONS ARE ACTUALLY CORRECT
      master_context.grammar_obj.forEach((rule_object,index)=>{
        rule_to_table = "";
        rule_to_table+= rule_object.NON_TERM;
        rule_to_table+= "\u21d2";
        rule_to_table+= rule_object.TERM;
        grammar_table_text.push(rule_to_table);      
      });
      grammar_table_text.forEach((string_text,index)=>{
        textarea_text+= string_text + "\n";
        textarea_text = textarea_text.replace(/!/g,"\u03B5")
      });
      
      formArea.current.value = textarea_text;

    });


  }, []);

  return (
    <div id="row_container_CFG">
      <Row>
        <Form as={Col} md={{ span: 4 }}>
          {/* <div class="header-with-button"> */}
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
            definition_entry_array.map((_, key) => <Rule index={key} key={key} />)
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
          <h5>Tests</h5>
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
    </div>
  );
}

export default CFG_Visual;
