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
let key_index;
function Rule(props) {
  const non_terminal = useRef(null);
  const definition = useRef(null);
  const master_context = useContext(AutomataContext);
  let mount_text = "";
  props.text == null ? (mount_text = "  ") : (mount_text = props.text);
  console.log(props);

  key_index = props.id;

  useEffect(() => {
    key_index = props.id;
  }, []);

  const update_grammar_table = (e, E_formtype) => {
    let text_input = e.target.value;
    console.log(key_index);
    switch (E_formtype) {
      case E_formtype.NON_TERM:
        console.log("transformation of context grammar object!");
        master_context.grammar_obj[key_index].NON_TERM = text_input;
        break;
      case E_formtype.TERM:
        console.log("transformation of context grammar object!");

        master_context.grammar_obj[key_index].TERM = text_input;
        break;
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
          />
        </Col>
      </Form.Row>
    </div>
  );
}

export default Rule;
