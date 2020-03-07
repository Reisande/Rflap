import React, { useEffect, useRef, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Col } from "react-bootstrap";
import right_arrow_production from "./long-right-arrow.svg";
import "./Rule.css";
import { AutomataContext } from "./AutomataContext.js";

const E_formtype = {
  TERM: "TERMINAL",
  NON_TERM: "NON_TERMINAL"
};
function Rule(props) {
  const non_terminal = useRef(null);
  const definition = useRef(null);
  const master_context = useContext(AutomataContext);
  let mount_text = "";
  props.text == null ? (mount_text = "  ") : (mount_text = props.text);



  useEffect(() => {

    
  }, []);

  const update_grammar_table = (e, E_formtype_value) => {
    let text_input = e.target.value.replace(/\s/g, "")    ;
    console.log("UPDATE_GRAMMAR_TABLE");
    console.log(master_context.grammar_obj);
    console.log(props.index);
    switch (E_formtype_value) {
      case E_formtype.NON_TERM:
        console.log("transformation of context grammar: " + E_formtype.NON_TERM + "\nRow Number: " +  props.index);
        master_context.grammar_obj[props.index].NON_TERM = text_input;
        break;
      case E_formtype.TERM:
        console.log("transformation of context grammar: " + E_formtype.TERM + "\nRow Number: " +  props.index);

        master_context.grammar_obj[props.index].TERM = text_input;
        console.log(master_context.grammar_obj);
        break;
      default:
        console.log("NON-TYPE (neither terminal or non-terminal");
    }
  };

  return (
    <div class="rulecontainer">
      <Form.Row>
        <Col md={{ span: 2, offset: 1 }}>
          <Form.Control
            onChange={e => update_grammar_table(e, E_formtype.NON_TERM)}
            defaultValue={mount_text.charAt(0)}
            as="input"
            id="rule_non-terminal"
          />
        </Col>
        <Col md="auto">
          <img
            id="bar"
            src={right_arrow_production}
            height="34"
            width="34"
          ></img>
        </Col>
        <Col md={{ span: 6 }}>
          <Form.Control
            onChange={e => update_grammar_table(e, E_formtype.TERM)}
            as="input"
            defaultValue={mount_text.charAt(1)}
            id= "rule_terminal"
          />
        </Col>
      </Form.Row>
    </div>
  );
}

export default Rule;
