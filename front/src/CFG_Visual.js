import React, { useEffect, useState, useRef, useCallback } from "react";
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

function CFG_Visual() {
  const formArea = useRef(null);

  let image_collection = [error_image, idle_svg, success_image];
  const [row_entry_array, set_row_entries] = useState([1]);

  const image_click_handler = button_press => {
    console.log("button click!")
    return;
  };
  return (
    <div id="row_container_CFG">
      <Row>
        <Form as={Col} md={{ span: 4 }}>
          {/* <div class="header-with-button"> */}
          <Row>
            <Col md={{span:1,offset:5}}>
              <h4>Definition</h4>
            </Col>
            <Col md={{offset:0}}>
              <input
                id="add_row_button"
                onClick={event => image_click_handler(event)}
                type="image"
                id="add_button"
                src={add_perfect}
                width="23"
                height="23"
                name="add_row_input"
              />
            </Col>
          </Row>
          {/* </div> */}
          <Rule />
          <br></br>
          <Rule />
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
