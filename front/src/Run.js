import React, { useRef, useContext, useState, useEffect } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Navbar,
  Nav,
  InputGroup,
  FormControl,
  Tooltip,
  Alert,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { inspect } from "util";
import Popup from "reactjs-popup";
import "./Run.css";
import error_image from "./error.svg";
import success_image from "./success.svg";
import { AutomataContext } from "./AutomataContext.js";
import not_ferris from "./rFlapLogo.png";
import add_svg from "./add.svg";
import add_red from "./add_red.svg";
import add_black from "./add_black.svg";
// import {RowEntry} from './RowEntry.js';
import RowInput from "./RowInput.js";
import idle_svg from "./button.svg";
import add_perfect from "./plus.svg";
import NotPopUp from "./NotPopUp.js";
import { v4 as uuidv4 } from "uuid";

var util = require("util");
let bool_check = false;
const not_dfa = "Not a valid DFA!";
const import_error = "Importation Errror!";
let error_object = {
  multiple_initial_states: false,
  no_label_transition: false,
  no_initial_state: false,
  epsilon_on_DFA: false,
  no_label_on_dfa: false,
  out_of_bounds: false,
};
let testID;
function Run(props) {
  const master_context = useContext(AutomataContext);
  let popup_lock = false;
  let user_input_row_collection = [];
  const [UIN_input, set_UIN_input] = useState(false);
  const [s_or_e, set_image] = useState([error_image, success_image]);
  const [succeded_failed, set_succeded_failed] = useState(0);
  const [determinism_tf, set_determinism_tf] = useState(false);
  const [importation_error, set_import_status] = useState(false);
  let image_collection = [error_image, idle_svg, success_image];
  const [warning_display, set_warning_display] = useState(false);
  const [row_entry_array, set_row_entries] = useState([1]);

  const UIN_textform = useRef(null);
  const test_button = useRef(null);
  const status_ref = useRef(null);
  const add_button = useRef(null);
  const image_ref = useRef(null);
  const row_ref_container = useRef(null);
  const file_dialog = useRef(null);
  let entry_amount = 30;
  let array_of_row_refs = [];

  let packet_to_misha_the_microsoft_engineer = {
    PDA: false,
    alphabet: [],
    start_state: "",
    //String:Bool
    states: {},
    //lists of lists:
    transition_function: [],
    //bool
    determinism:
      master_context.mode == "Determinstic Finite Automata" ? true : false,
    input_strings: ["a"],
  };

  //useEffect clause
  useEffect(() => {
    document
      .querySelector("#import_json_button_run")
      .addEventListener("change", (e) => {});
  });

  let input_val = "default";
  let toBePushed = [];
  // error_object =
  const edgeProcess = (edgeObj, nodeObj) => {
    let transition_triple = [];
    packet_to_misha_the_microsoft_engineer.determinism =
      master_context.mode == "Deterministic Finite Automata" ? true : false;
    packet_to_misha_the_microsoft_engineer.transition_function = [];
    let stack_alpha = new Set();
    let alpha = new Set();
    if (master_context.PDA) {
      packet_to_misha_the_microsoft_engineer.PDA = true;

      edgeObj.forEach((edgeObj) => {
        transition_triple = [];
        if (edgeObj.label == undefined) {
        }
        let label_to_add =
          edgeObj.label == undefined || edgeObj.label == " "
            ? "null"
            : edgeObj.label.trim();
        let from, to, label;
        from = edgeObj.from;
        to = edgeObj.to;
        if (
          edgeObj.label == undefined &&
          packet_to_misha_the_microsoft_engineer.determinism
        ) {
          error_object.no_label_on_dfa = true;
        }
        if (edgeObj.label == undefined) return;
        label = edgeObj.label.trim();
        if (from == to) {
          let sub_string_collection = label.replace(/\s/g, "").split("|");

          for (let i = 0; i < sub_string_collection.length; i++) {
            let from_label, to_label;
            transition_triple = [];
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label;
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label;
              }
            });
            transition_triple.push(from_label.trim());
            // transition_triple.push(sub_string_collection[i].toString(10));
            let transition_alpha_no_whitespace = sub_string_collection[
              i
            ].replace(/\s/g, "");
            // [0]: read
            // [2]: push
            // [5]: pop
            let read, push, pop;
            try {
              read = transition_alpha_no_whitespace[0];
              push = transition_alpha_no_whitespace[2];
              pop = transition_alpha_no_whitespace[5];
            } catch (e) {
              error_object.out_of_bounds = true;
              return;
            }

            transition_triple.push(read);
            transition_triple.push(push);
            stack_alpha.add(push);
            transition_triple.push(pop);
            stack_alpha.add(push);

            if (transition_triple[1] == "ε") {
              transition_triple[1] = null;
            }
            transition_triple.push(to_label.trim());

            if (
              packet_to_misha_the_microsoft_engineer.determinism &&
              transition_triple[1] == "ϵ"
            ) {
              error_object.epsilon_on_DFA = true;
            }
            packet_to_misha_the_microsoft_engineer.transition_function.push(
              transition_triple
            );
          }
        } else {
          let from_label, to_label;
          if (edgeObj.label.includes("|")) {
            let sub_string_collection = edgeObj.label.split("|");
            transition_triple = [];
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label.trim();
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label.trim();
              }
            });
            sub_string_collection.forEach((transition_alpha) => {
              transition_triple = [];
              transition_triple.push(from_label);
              let transition_alpha_no_whitespace = transition_alpha.replace(
                /\s/g,
                ""
              );
              // [0]: read
              // [2]: push
              // [5]: pop
              let read, push, pop;
              try {
                read = transition_alpha_no_whitespace[0];
                push = transition_alpha_no_whitespace[2];
                pop = transition_alpha_no_whitespace[5];
              } catch (e) {
                error_object.out_of_bounds = true;
                return;
              }

              transition_triple.push(read);
              alpha.add(read);
              transition_triple.push(push);
              stack_alpha.add(push);

              transition_triple.push(pop);
              stack_alpha.add(push);

              if (
                transition_triple[1] == "ε" &&
                master_context.mode == "Non-Deterministic Finite Automata"
              ) {
                transition_triple[1] = null;
              }
              transition_triple.push(to_label);
              packet_to_misha_the_microsoft_engineer.transition_function.push(
                transition_triple
              );
            });
          } else {
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label.trim();
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label.trim();
              }
            });
            transition_triple = [];
            transition_triple.push(from_label);
            if (
              transition_triple[1] == "ε" &&
              master_context.mode == "Non-Deterministic Finite Automata"
            ) {
              transition_triple[1] = null;
            }
            let transition_alpha_no_whitespace = label
              .replace(/\s/g, "")
              .split("");

            let read, push, pop;
            try {
              read = transition_alpha_no_whitespace[0];
              push = transition_alpha_no_whitespace[2];
              pop = transition_alpha_no_whitespace[5];
            } catch (e) {
              error_object.out_of_bounds = true;
              return;
            }
            transition_triple.push(read);
            alpha.add(read);
            transition_triple.push(push);
            stack_alpha.add(push);

            transition_triple.push(pop);
            stack_alpha.add(pop);

            transition_triple.push(to_label);
            toBePushed.push(label_to_add.toString(10));
            packet_to_misha_the_microsoft_engineer.transition_function.push(
              transition_triple
            );
          }
        }
      });
      let alphabet_processed = [];

      [...new Set(toBePushed)].forEach((entry, id) => {
        entry.split("|").forEach((char) => {
          alphabet_processed.push(char);
        });
      });

      packet_to_misha_the_microsoft_engineer.transition_alphabet = [...alpha];
      packet_to_misha_the_microsoft_engineer.stack_alphabet = [...stack_alpha];
    }

    //NON_PDA
    else {
      packet_to_misha_the_microsoft_engineer.PDA = false;
      edgeObj.forEach((edgeObj) => {
        transition_triple = [];
        if (edgeObj.label == undefined) {
          //
          // error_object.no_label_transition = true;
          // return undefined;
        }
        let label_to_add =
          edgeObj.label == undefined || edgeObj.label == " "
            ? "null"
            : edgeObj.label.trim();
        let from, to, label;
        from = edgeObj.from;
        to = edgeObj.to;
        if (
          edgeObj.label == undefined &&
          packet_to_misha_the_microsoft_engineer.determinism
        ) {
          error_object.no_label_on_dfa = true;
        }
        if (edgeObj.label == undefined) return;
        label = edgeObj.label.trim();
        if (label.length > 1 && from == to) {
          let sub_string_collection = label.split(",");

          for (let i = 0; i < sub_string_collection.length; i++) {
            let from_label, to_label;
            transition_triple = [];
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label;
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label;
              }
            });
            transition_triple.push(from_label.trim());
            transition_triple.push(sub_string_collection[i].toString(10));
            if (transition_triple[1] == "ε") {
              transition_triple[1] = null;
            }
            transition_triple.push(to_label.trim());

            if (
              packet_to_misha_the_microsoft_engineer.determinism &&
              transition_triple[1] == "ϵ"
            ) {
              error_object.epsilon_on_DFA = true;
            }
            packet_to_misha_the_microsoft_engineer.transition_function.push(
              transition_triple
            );
          }
        } else {
          let from_label, to_label;
          if (edgeObj.label.includes(",")) {
            let sub_string_collection = edgeObj.label.split(",");
            transition_triple = [];
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label.trim();
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label.trim();
              }
            });
            sub_string_collection.forEach((transition_alpha) => {
              transition_triple = [];
              transition_triple.push(from_label);
              transition_triple.push(transition_alpha);
              if (
                transition_triple[1] == "ε" &&
                master_context.mode == "Non-Deterministic Finite Automata"
              ) {
                transition_triple[1] = null;
              }
              transition_triple.push(to_label);
              packet_to_misha_the_microsoft_engineer.transition_function.push(
                transition_triple
              );
            });
          } else {
            nodeObj.forEach((nodeObj) => {
              if (nodeObj.id == from) {
                from_label = nodeObj.label.trim();
              }
              if (nodeObj.id == to) {
                to_label = nodeObj.label.trim();
              }
            });
            transition_triple = [];
            transition_triple.push(from_label);
            if (
              transition_triple[1] == "ε" &&
              master_context.mode == "Non-Deterministic Finite Automata"
            ) {
              transition_triple[1] = null;
            }
            transition_triple.push(label);
            transition_triple.push(to_label);

            toBePushed.push(label_to_add.toString(10));
            packet_to_misha_the_microsoft_engineer.transition_function.push(
              transition_triple
            );
          }
        }
      });
      let alphabet_processed = [];

      [...new Set(toBePushed)].forEach((entry, id) => {
        entry.split(",").forEach((char) => {
          alphabet_processed.push(char);
        });
      });
      packet_to_misha_the_microsoft_engineer.alphabet = alphabet_processed;
    }
  };
  const nodeProcess = (nodeObj) => {
    let start_state = "";
    let accepting_states = [];
    let states = [];
    let multiple_initial_states_check = false;
    //get complete object:

    // accepting: #FF8632
    // intial: #00bfff
    let sState = "";
    //
    nodeObj.forEach((node) => {
      //Accumulates all states
      if (!states.includes(node.label)) {
        states.push("" + node.label.trim());
      }
      //Getting the start state
      if (node.init) {
        if (multiple_initial_states_check) {
          error_object.multiple_initial_states = true;
          return;
        }
        sState = node.label.trim();
        multiple_initial_states_check = true;
      }
      if (node.shape == "triangle") {
        start_state = node.label.trim();
      }
      //Accumulates the accepting states.
      if (node.borderWidth == 3) {
        if (!accepting_states.includes(node.label)) {
          accepting_states.push(node.label.trim());
        }
      }
    });

    if (multiple_initial_states_check == false) {
      error_object.no_initial_state = true;
      // return;
    }
    packet_to_misha_the_microsoft_engineer.start_state = sState;
    //boolean for accepting
    states.forEach((label) => {
      let isAccepting = false;
      if (accepting_states.includes(label)) {
        isAccepting = true;
      }
      packet_to_misha_the_microsoft_engineer.states["" + label] = isAccepting;
    });
  };
  const preprocess = () => {
    edgeProcess(
      master_context.graphobj.edges.get(),
      master_context.graphobj.nodes.get()
    );
    nodeProcess(master_context.graphobj.nodes.get());
  };
const animateIntoNeutral = (status_ref,test_button_ref) =>{

        status_ref.current.classList.remove("spinner-border");
        status_ref.current.classList.remove("spinner-border-sm");
    }
  async function postToRustApi(status_ref, test_button_ref) {
    let dotnet_endpoint = "https://metricsrflap.azurewebsites.net/api/Test/";
    let endpoint = master_context.PDA ? "pda" : "automata";
    //  for testing:
    //let url = "https://rflap.acmuic.app/" + endpoint;
    let url = `${window.location.origin}/` + endpoint;

    if (packet_to_misha_the_microsoft_engineer.PDA) {
      delete packet_to_misha_the_microsoft_engineer.state_names;
      delete packet_to_misha_the_microsoft_engineer.determinism;
      delete packet_to_misha_the_microsoft_engineer.alphabet;
      delete packet_to_misha_the_microsoft_engineer.PDA;
      packet_to_misha_the_microsoft_engineer.transition_function.forEach(
        (ar_, id) => {
          ar_.forEach((item, index) => {
            if (item == "ε") {
              ar_[index] = "!";
            }
          });
        }
      );
      packet_to_misha_the_microsoft_engineer.stack_alphabet.map(
        (item, index) => {
          if (item == "ε") {
            packet_to_misha_the_microsoft_engineer.stack_alphabet[index] = "!";
          }
        }
      );
      packet_to_misha_the_microsoft_engineer.transition_alphabet.map(
        (item, index) => {
          if (item == "ε") {
            packet_to_misha_the_microsoft_engineer.transition_alphabet[index] =
              "!";
          }
        }
      );
    }
    //

    let postingObject = {
      method: "POST",
      mode: "cors",
      // cache:"no-cache",
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      // redirect:"follow",
      // referrer: "no-referrer",
      body: JSON.stringify(packet_to_misha_the_microsoft_engineer),
    };
    const pad = (n, width, z) => {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    };
    const toMins = (seconds) =>
      Math.floor(seconds / 60).toString() +
      ":" +
      pad(Math.round(seconds % 60), 2).toString();
    const getMinsIntoSession = (sessionStart, sessionPing) =>
      toMins((sessionPing - sessionStart) / 1000);
    testID = uuidv4();
    const createTestDotnet = (testID) => {
      const getNumAccepting = (statesMap) =>
        Object.values(statesMap).reduce((t, bool) => t + (bool ? 1 : 0), 0);
      const getMode = () => {
        if (master_context.PDA) {
          return "PDA";
        } else {
          let map = {
            "Non-Deterministic Finite Automata": "NFA",
            "Deterministic Finite Automata": "DFA",
            "Push-down Automata": "PDA",
          };
          return map[master_context.mode.trim()];
        }
      };
      return {
        sessionID: master_context.session,
        startTime: master_context.date,
        testTime: getMinsIntoSession(master_context.date, new Date()),
        rustPacket: JSON.stringify(packet_to_misha_the_microsoft_engineer),
        mode: getMode(),
        initialState: packet_to_misha_the_microsoft_engineer.start_state,
        numStates: Object.keys(packet_to_misha_the_microsoft_engineer.states)
          .length,
        numAccepting: getNumAccepting(
          packet_to_misha_the_microsoft_engineer.states
        ),
        numTransitions:
          packet_to_misha_the_microsoft_engineer.transition_function.length,
        testStrings: JSON.stringify(
          packet_to_misha_the_microsoft_engineer.input_strings
        ),
        testID: testID,
      };
    };
    let dotnetPostTest = {
      method: "POST",
      mode: "cors",
      // cache:"no-cache",
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      // redirect:"follow",
      // referrer: "no-referrer",
      body: JSON.stringify(createTestDotnet(testID)),
    };
    try {
      let rilke = await fetch(dotnet_endpoint, dotnetPostTest);
    } catch (err) {
      console.log("1");
    }
    //Check for Errors via the error_object
    if (error_object.multiple_initial_states) {
      alert("\tMultiple Initial States!");
      //reset object for next API request
      error_object = {
        no_label_transition: false,
        multiple_initial_states: false,
        no_initial_state: false,
      };

      return null;
    }
    // if(error_object.epsilon_on_DFA){
    //     alert("Illegal Epsilon While in DFA-Mode");
    //     error_object = {
    //         multiple_initial_states :false,
    //         no_label_transition: false,
    //         no_initial_state:false,
    //         epsilon_on_DFA: false
    //     }
    //   return null;
    // }
    // if(error_object.no_label_transition){
    //     alert("\t\tUnlabeled Transition!");
    //     error_object = {
    //         multiple_initial_states :false,
    //         no_label_transition: false,
    //         no_initial_state:false,
    //         epsilon_on_DFA: false
    //     }
    //   return null;
    // }
    // if(error_object.no_label_transition){
    //     alert("\t\tUnlabeled Transition!");
    //     error_object = {
    //         multiple_initial_states :false,
    //         no_label_transition: false,
    //         no_initial_state:false,
    //         epsilon_on_DFA: false
    //     }
    //     return null;
    // }
    if (error_object.no_initial_state) {
      alert("No Initial State!");
      error_object = {
        multiple_initial_states: false,
        no_label_transition: false,
        no_initial_state: false,
        epsilon_on_DFA: false,
        no_label_on_dfa: false,
      };
      animateIntoNeutral(status_ref,test_button_ref);
      return null;
    }
    // if(error_object.out_of_bounds){
    //   alert("Invalid transitions");
    //   error_object = {
    //     multiple_initial_states:false,
    //     no_label_transition:false,
    //     no_initial_state:false,
    //     epsilon_on_DFA:false,
    //     no_label_on_dfa:false,
    //     out_of_bounds: false,

    //   }
    // }
    // if(error_object.no_label_on_dfa){

    //     alert("\tUnlabelled Transition!!");

    //     error_object = {
    //         multiple_initial_states :false,
    //         no_label_transition: false,
    //         no_initial_state:false,
    //         epsilon_on_DFA: false,
    //         no_label_on_dfa: false

    //     }

    //     return null;
    // }
    let Algorithms_are_the_computational_content_of_proofs;
    try {
      Algorithms_are_the_computational_content_of_proofs = await fetch(
        url,
        postingObject
      );
    } catch (e) {}

    //reset error_object
    error_object = {
      multiple_initial_states: false,
      no_label_transition: false,
      no_initial_state: false,
      epsilon_on_DFA: false,
    };
    return await Algorithms_are_the_computational_content_of_proofs.json();
  }
  const checkForProperDetermnism = (listOfStringsCallback, single_entry) => {
    let determinism_callback = listOfStringsCallback[1];
    let determinism_index = 1;
    let bool_check_for_determinism = false;
    if (master_context.mode === "Deterministic Finite Automata") {
      if (single_entry == true) {
        return !listOfStringsCallback[0][1];
      } else {
        listOfStringsCallback.forEach((_, id) => {
          if (!_[determinism_index]) {
            bool_check_for_determinism = true;
          }
        });
        return bool_check_for_determinism;
      }
    }
  };

  async function onClickPingToApi(status_ref,test_button_ref) {
    let empty_string = false;
    
    packet_to_misha_the_microsoft_engineer.input_strings = [];
    user_input_row_collection.forEach((_, id) => {
      packet_to_misha_the_microsoft_engineer.input_strings.push(_);
    });
    preprocess();

    try {
      let dotnet_endpoint =
        "https://metricsrflap.azurewebsites.net/api/TestResult/";
      let _;
      let callback;
      try {
        callback = await postToRustApi(status_ref,test_button_ref);
        animateIntoNeutral(status_ref,test_button_ref)
      } catch (err) {
        console.log("10");
      }
      if (callback == null) {
        return;
      }
      const pad = (n, width, z) => {
        z = z || "0";
        n = n + "";
        return n.length >= width
          ? n
          : new Array(width - n.length + 1).join(z) + n;
      };
      const toMins = (seconds) =>
        Math.floor(seconds / 60).toString() +
        ":" +
        pad(Math.round(seconds % 60), 2).toString();
      const getMinsIntoSession = (sessionStart, sessionPing) =>
        toMins((sessionPing - sessionStart) / 1000);

      const createTestCallbackPost = (
        testID,
        testStringsResultArray,
        callbackHint
      ) => {
        return {
          sessionID: master_context.session,
          testID: testID,
          callbackTime: getMinsIntoSession(master_context.date, new Date()),
          callbackPacket: JSON.stringify(callback),
          callbackHint: callbackHint,
          testStringsCorrect: JSON.stringify(testStringsResultArray),
          numCorrect: testStringsResultArray.reduce(
            (sum, bool) => sum + (bool ? 1 : 0),
            0
          ),
        };
      };
      let dotnetTestCallbackPost = {
        method: "POST",
        mode: "cors",
        // cache:"no-cache",
        // credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        // redirect:"follow",
        // referrer: "no-referrer",
        body: "",
      };
      if (
        (callback["hint"] != "" || !callback.list_of_strings[0][0]) &&
        master_context.mode === "Deterministic Finite Automata"
      ) {
        dotnetTestCallbackPost.body = JSON.stringify(
          createTestCallbackPost(testID, [], callback["hint"])
        );
        try {
          _ = await fetch(
            dotnet_endpoint,
            createTestCallbackPost(testID, [], callback["hint"])
          );
        } catch (err) {
          console.log("20");
        }
        alert("Invalid determinism!\n" + callback["hint"]);
        let mounting_array = [];
        for (let i = 0; i < row_entry_array.length; i++) {
          mounting_array.push(1);
        }
        set_row_entries([...mounting_array]);
      } else {
        let new_array;
        if (row_entry_array.length == 1) {
          let bool_result = master_context.PDA
            ? callback.list_of_strings[0][0]
            : callback.list_of_strings[0][1];

          bool_result ? (new_array = [2]) : (new_array = [0]);
          set_row_entries([...new_array]);
          dotnetTestCallbackPost.body = JSON.stringify(
            createTestCallbackPost(testID, [bool_result], "")
          );
          try {
            _ = await fetch(
              dotnet_endpoint,
              createTestCallbackPost(testID, [bool_result], "")
            );
          } catch (err) {
            console.log("21");
          }
        } else {
          let array_to_mount = [];
          for (let i = 0; i < row_entry_array.length; i++) {
            let bool_result = master_context.PDA
              ? callback.list_of_strings[i][0]
              : callback.list_of_strings[i][1];
            if (bool_result) {
              array_to_mount.push(2);
            } else {
              array_to_mount.push(0);
            }
          }
          set_row_entries([...array_to_mount]);
          dotnetTestCallbackPost.body = JSON.stringify(
            createTestCallbackPost(
              testID,
              array_to_mount.map((n) => (n > 0 ? true : false)),
              ""
            )
          );
          try {
            _ = await fetch(
              dotnet_endpoint,
              createTestCallbackPost(
                testID,
                array_to_mount.map((n) => (n > 0 ? true : false)),
                ""
              )
            );
          } catch (err) {
            console.log("22");
          }
        }
      }
    } catch (e) {}
  }
  const HTMLCol_to_array = (html_collection) =>
    Array.prototype.slice.call(html_collection);

  const process_userinput = (row_table_DOM_node, id) => {
    user_input_row_collection[id] = HTMLCol_to_array(
      row_table_DOM_node.children
    )[0].value;
  };
  
  function on_click_test_api(event, status_ref,test_button_ref) {
    const animateIntoTesting = (status_ref,test_button_ref) =>{
    status_ref.current.classList.add("spinner-border");
    status_ref.current.classList.add("spinner-border-sm");
    }
    //reset list for each click to api with amount of rows
    //array that contains all the input strings from the user
    animateIntoTesting(status_ref,test_button_ref)

    user_input_row_collection = [
      ...Array(HTMLCol_to_array(row_ref_container.current.children).length),
    ];
    event.preventDefault();
    HTMLCol_to_array(row_ref_container.current.children).map(process_userinput);
    onClickPingToApi(status_ref,test_button_ref);
  }
  function addBar(e) {
    e.preventDefault();
  }
  function setInputVal(value) {
    input_val = value.target.value;
  }

  // !Functional component, put into production instead of map in return() below!

  //    const  row_entry_components  =  row_entry_array.map((id)=>
  //         <RowInput key= {id}></RowInput>
  //     );

  //Update state of Run.js component based on image_click.
  // Rerenders Run.js when button is clicked, thus adding a row entry component
  function image_click_handler(event) {
    let new_array = row_entry_array;
    new_array.push(1);
    set_row_entries([...new_array]);
  }

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

  const WarningSign = () => {
    return <Badge variant="danger"> Enter: name@uic.edu</Badge>;
  };

  async function UIN_submit(event) {
    let dotnet_endpoint;
    input_val = input_val.toLowerCase();
    if (input_val.length > 7 && input_val.includes("@uic.edu") ) {
      let append = Math.round(Math.random() * 1000);

      preprocess();

      packet_to_misha_the_microsoft_engineer.state_names =
        master_context.state_styles;
      if (packet_to_misha_the_microsoft_engineer.PDA) {
        delete packet_to_misha_the_microsoft_engineer.state_names;
        delete packet_to_misha_the_microsoft_engineer.determinism;
        delete packet_to_misha_the_microsoft_engineer.alphabet;
        delete packet_to_misha_the_microsoft_engineer.PDA;
        packet_to_misha_the_microsoft_engineer.transition_function.forEach(
          (ar_, id) => {
            ar_.forEach((item, index) => {
              if (item == "ε") {
                ar_[index] = "!";
              }
            });
          }
        );
        packet_to_misha_the_microsoft_engineer.stack_alphabet.map(
          (item, index) => {
            if (item == "ε") {
              packet_to_misha_the_microsoft_engineer.stack_alphabet[index] =
                "!";
            }
          }
        );
        packet_to_misha_the_microsoft_engineer.transition_alphabet.map(
          (item, index) => {
            if (item == "ε") {
              packet_to_misha_the_microsoft_engineer.transition_alphabet[
                index
              ] = "!";
            }
          }
        );
      }
      const pad = (n, width, z) => {
        z = z || "0";
        n = n + "";
        return n.length >= width
          ? n
          : new Array(width - n.length + 1).join(z) + n;
      };
      const toMins = (seconds) =>
        Math.floor(seconds / 60).toString() +
        ":" +
        pad(Math.round(seconds % 60), 2).toString();
      const getMinsIntoSession = (sessionStart, sessionPing) =>
        toMins((sessionPing - sessionStart) / 1000);

      const createExportDotnet = (testID) => {
        const getNumAccepting = (statesMap) =>
          Object.values(statesMap).reduce((t, bool) => t + (bool ? 1 : 0), 0);
        const getMode = () => {
          if (master_context.PDA) {
            return "PDA";
          } else {
            let map = {
              "Non-Deterministic Finite Automata": "NFA",
              "Deterministic Finite Automata": "DFA",
              "Push-down Automata": "PDA",
            };
            return map[master_context.mode.trim()];
          }
        };
        return {
          sessionID: master_context.session,
          startTime: master_context.date,
          exportTime: getMinsIntoSession(master_context.date, new Date()),
          downloadPacket: JSON.stringify(
            packet_to_misha_the_microsoft_engineer
          ),
          mode: getMode(),
          initialState: packet_to_misha_the_microsoft_engineer.start_state,
          numStates: Object.keys(packet_to_misha_the_microsoft_engineer.states)
            .length,
          numAccepting: getNumAccepting(
            packet_to_misha_the_microsoft_engineer.states
          ),
          numTransitions:
            packet_to_misha_the_microsoft_engineer.transition_function.length,
          testID: testID,
          exportID: input_val,
        };
      };
      dotnet_endpoint = "https://metricsrflap.azurewebsites.net/api/Export/";
      let dotnetPostExport = {
        method: "POST",
        mode: "cors",
        // cache:"no-cache",
        // credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        // redirect:"follow",
        // referrer: "no-referrer",
        body: JSON.stringify(createExportDotnet(testID)),
      };
      try {
        let _ = await fetch(dotnet_endpoint, dotnetPostExport);
      } catch (e) {}
      downloadObjectAsJson(
        packet_to_misha_the_microsoft_engineer,
        "RFLAP_" + input_val + "_" + append.toString()
      );

      set_UIN_input(false);
      set_warning_display(false);
    } else {
      set_warning_display(true);
    }
  }

  const export_click_handler = (event) => {
    set_UIN_input(true);
  };
  let text_form = "";
  function set_text_form(event) {
    input_val = event.target.value;
  }

  //function to mount anchor tag and initiate download
  function downloadObjectAsJson(exportObj, exportName) {
    const exportation_nodes = node_style_dependency(input_val);
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
  return (
    <div id="inside-div-scrollbar">
      <Navbar className="bg-dark justify-content-between" id="nav-header">
        <input
          ref={file_dialog}
          id="import_json_button_run"
          accept=".json"
          type="file"
          style={{ display: "none" }}
        />
        {/* Import JSON button(without functionality, depreciated and potential future feature) */}
        {/* <Button id="import_json" onClick={ (event) => import_json(event)} variant="info">
           Import
        </Button> */}

        <Button
          id="export_xmljson"
          onClick={(event) => {
            export_click_handler(event);
          }}
          variant="info"
        >
          Export
        </Button>
        <Nav>
          {/* <Button ref = {add_button}onClick={ (event) => addBar(event) } variant="warning">
           Add
        </Button> */}
          <Col
            className="justify-content-between"
            id="add_row_button_container"
          >
            <input
              id="add_row_button"
              onClick={(event) => image_click_handler(event)}
              type="image"
              id="add_button"
              src={add_perfect}
              width="33"
              height="33"
              name="add_row_input"
            />
          </Col>
          {true ? (
            <Button
              id="api_button"
             variant="info"
              onClick={(event) => on_click_test_api(event, status_ref,test_button)}
              ref={test_button}
            >
              <span role="status"aria-hidden="true" ref={status_ref}></span>
                  {" Test"}
            </Button>
          ) : (
            <></>
          )}
        </Nav>
      </Navbar>
      <Row>
        <br />
      </Row>
      <div className="name" ref={row_ref_container}>
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
      {/* <Popup open={determinism_tf}> */}
      {/* <text>Invalid</text> */}
      {/* </Popup> */}
      <Popup
        open={UIN_input}
        onClose={() => {
          set_UIN_input(false);
        }}
      >
        <div>
          {warning_display ? (
            <WarningSign />
          ) : (
            <React.Fragment></React.Fragment>
          )}

          <InputGroup className="mb-2b">
            <Form.Control
              type="text"
              onChange={(text) => {
                set_text_form(text);
              }}
            />
            <InputGroup.Append>
              <Button onClick={UIN_submit} variant="outline-secondary">
               EDU 
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </Popup>
    </div>
  );
}
export default Run;
