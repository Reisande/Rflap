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
  const terminal = useRef(null);
  const master_context = useContext(AutomataContext);
  let mount_text = "  ";
  props.index == 0 ? (mount_text = "S") : (mount_text = mount_text);
  useEffect(() => {
    let a;
    const set_S = ()=>{
      master_context.grammar_obj[0].NON_TERM = mount_text;
      non_terminal.current.readOnly = true;
    };
    (props.index == 0) ? set_S():  a = 1;  
  }, []);

  const update_grammar_table = (e, E_formtype_value) => {
    let preprocess = e.target.value;
    let text_input = e.target.value.replace(/\s/g, "")    ;
    switch (E_formtype_value) {
      case E_formtype.NON_TERM:
        // console.log("transformation of context grammar: " + E_formtype.NON_TERM + "\nRow Number: " +  props.index);
        master_context.grammar_obj[props.index].NON_TERM = text_input;
        break;
      case E_formtype.TERM:
        // console.log("transformation of context grammar: " + E_formtype.TERM + "\nRow Number: " +  props.index);

        master_context.grammar_obj[props.index].TERM = text_input;
        // terminal.current.value = preprocess
        break;
      default:
        // console.log("NON-TYPE (neither terminal or non-terminal");
    }
  };

  return (
    <div class="rulecontainer">
      <Form.Row >
        <Col md={{ span: 2, offset: 1 }}>
          <Form.Control
            ref= {non_terminal}
            onChange={e => update_grammar_table(e, E_formtype.NON_TERM)}
            defaultValue={props.index == 0 ? "S" : props.non_term}
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
            ref={terminal}
            as="input"
            defaultValue ={props.term}
            id= "rule_terminal"
          />
        </Col>
      </Form.Row>
    </div>
  );
}

export default Rule;
