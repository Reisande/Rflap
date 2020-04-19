import React, { useEffect, useRef, useState, useContext } from "react";
//graphing library
import vis from "vis-network";
//react-bootstrap component imports
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
//css (bootstrap)
import "./App.css";
import "./Visual.css";
import "bootstrap/dist/css/bootstrap.min.css";
//context import
import { AutomataContext } from "./AutomataContext.js";
//image imports
import accept_bar from "./accept.svg";
import add_bar from "./add-bar.svg";
import points_bar from "./points.svg";
import reject_bar from "./reject.svg";
import transition_bar from "./transition.svg";
import blank_svg_bar from "./blank.svg";
import passive_bar from "./delete.svg";
import remove_bar from "./remove.svg";

//Network, Hex's (js)
import { NetworkOptions } from "./res/NetworkOptions";
import { Hex } from "./res/HexColors";
/*height and width make dimensions of graph fill screen*/
let node_id_global = 0;
let height = window.innerHeight - 80;
let img_bar_status_did_mount = false;

/*Beginning of node and edge information*/

let nodesDS = new vis.DataSet([]);
let edgesDS = new vis.DataSet([]);

let graph = { nodes: nodesDS, edges: edgesDS };

function PDA_Visual() {
  const master_context = useContext(AutomataContext);
  master_context.graphobj = graph;
  let in_add_node_mode = false;
  let in_accepting_mode_ = false,
    in_initial_mode = false;
  let img_index = 0;
  let img_array = [
    blank_svg_bar,
    accept_bar,
    add_bar,
    points_bar,
    reject_bar,
    transition_bar,
  ];
  const wrapper = useRef(null); //Display graph in div "wrapper"
  const img_status = useRef(null);

  let network;

  useEffect(() => {
    img_status.current.src = passive_bar;
    const HTMLCol_to_array = (html_collection) =>
      Array.prototype.slice.call(html_collection);
    master_context.PDA = true;

    network = new vis.Network(
      wrapper.current,
      graph,
      NetworkOptions(height.toString(), window.innerWidth.toString())
    );
    /* graph event listeners */
    network.on("showPopup", (params) => {});
    /*

    afterDrawing
    Desc: Ensures canvas has been drawn, apply CSS stylings for css background here.
*/
    network.on("afterDrawing", (params) => {
      let canvasDOM = document.getElementsByTagName("canvas")[0];
      canvasDOM.style.background = Hex.Canvas;
      document.getElementById("group-holder").style.borderColor = Hex.Canvas;
      document.getElementById("non-header-div").style.background = Hex.Canvas;
    });

    //graph event listeners here:
    network.on("hoverNode", (params) => {
      // console.log("hoverNode: ");
      let node_id_clicked = params.node;
      if (in_add_node_mode) {
        // console.log("GRAPH NODE LENGTH : " + graph.nodes.get().length);
        // console.log("add_node_mode");
        nodesDS.remove({ id: node_id_clicked });
        let new_id = node_id_global;
        node_id_global += 1;
        nodesDS.add([
          { id: new_id, label: " Q " + graph.nodes.get().length + " " },
        ]);
        network.moveNode(
          new_id,
          (Math.random() - 0.6) * 200,
          (Math.random() - 0.7) * 200
        );

        in_add_node_mode = false;
        img_status.current.src = passive_bar;
      }
    });
    network.on("controlNodeDragEnd", (params) => {
      network.disableEditMode();
      let edge_identifier = findEdgeByNodes(
        params.controlEdge.from,
        params.controlEdge.to
      );

      edgesDS.update([{ id: edge_identifier, arrows: "to" }]);
    });
    network.on("select", (params) => {
      if (
        params != null &&
        in_initial_mode &&
        (params.nodes > 0 || params.nodes[0] != null)
      ) {
        let node_id_clicked = params.nodes[0];
        let found_node;
        graph.nodes.get().forEach((node) => {
          if (node.id == node_id_clicked) {
            found_node = node;
          }
        });
        in_initial_mode = false;
        img_status.current.src = passive_bar;
        let final_state;
        let circle_config = "circle";
        let triangle_config = "triangle";
        let border_config_a = 3;
        let border_config_b = 0;
        let init_state = "#00bfff";

        if (found_node.shape == circle_config || found_node.shape == null) {
          final_state = triangle_config;
        } else {
          final_state = circle_config;
        }
        if (found_node.init == true) {
          nodesDS.update([
            { id: found_node.id, shape: final_state, init: false },
          ]);
        } else {
          nodesDS.update([
            { id: found_node.id, shape: final_state, init: true },
          ]);
        }
      }
      //ACCEPTING BUTTON PRESS LISTENER
      else if (
        params != null &&
        params.nodes != null &&
        in_accepting_mode_ &&
        (params.nodes > 0 || params.nodes[0] != null)
      ) {
        let found_node;
        let node_id_clicked = params.nodes[0];
        graph.nodes.get().forEach((node) => {
          if (node.id == node_id_clicked) {
            found_node = node;
          }
        });
        let final_border = 3;
        let border_width_a = 3;
        let border_width_b = 1;

        if (found_node.borderWidth == border_width_a) {
          final_border = border_width_b;
        }
        // then
        else {
          final_border = border_width_a;
        }
        nodesDS.update([{ id: node_id_clicked, borderWidth: final_border }]);
        in_accepting_mode_ = false;
        img_status.current.src = passive_bar;
      } else if (params.edges.length == 1 && params.nodes == 0) {
        let edge_id = params.edges[0];
        let Display_String =
          master_context.mode == "Determinstic Finite Automata"
            ? "Edit String!"
            : "Edit String! ([ ε ])";
        let user_input_string = prompt(Display_String + "\t ! for Epsilon");
        ChangeEdgeText(user_input_string.replace(/!/g, "\u03B5"), edge_id);
        img_status.current.src = passive_bar;
      }
    });
    //remove event listeners
    return () => {
      network.off("select");
      network.off("controlNodeDragEnd");
      network.off("hoverNode");
      network.off("showPopup");
      network.destroy();
      master_context.PDA = false;
    };
  });
  const deselectAllModes = () => {
    in_accepting_mode_ = false;
    in_add_node_mode = false;
    in_initial_mode = false;
  };
  const ChangeEdgeText = (userInput, edgeID) => {
    graph.edges.forEach((edge) => {
      if (edge.id == edgeID) {
        edge.label = userInput;
        if (userInput == " " || userInput == "") {
          userInput = "ϵ";
        }
        // console.log("changed!");
        // console.log(edge.label)
        edgesDS.update([{ id: edge.id, label: userInput }]);
        return;
      }
    });
  };

  const findEdgeByNodes = (from, to) => {
    let return_id;
    graph.edges.forEach((edge, index) => {
      if (to == edge.to && edge.from == from) {
        return_id = edge.id;
      }
    });
    return return_id;
  };
  function toEditEdgeMode(props) {
    deselectAllModes();
    img_status.current.src = transition_bar;
    network.enableEditMode();
    network.addEdgeMode();
  }
  function toAddNodeMode(props) {
    deselectAllModes();

    img_status.current.src = add_bar;
    network.enableEditMode();
    network.addNodeMode();

    in_add_node_mode = true;
  }
  function setInitial(props) {
    deselectAllModes();
    img_status.current.src = points_bar;

    in_initial_mode = true;
  }
  function setAccepting(props) {
    deselectAllModes();
    img_status.current.src = accept_bar;
    in_accepting_mode_ = true;
  }

  function mount_styling() {
    let url = "https://worldclockapi.com/api/json/est/now";
    let postingObject = {
      method: "GET",
    };
    let current_time;
    fetch(url, postingObject).then((callback, error) => {
      callback.json().then((body, err) => {
        master_context.state_styles = body.currentDateTime;
        console.log("callbackPing: " + master_context.state_styles);
      });
    });
  }
  /*encryption*/
  //  const  isOverlapping= (label)=>{
  //   let returnBool = false;
  //   graph.nodes.get().forEach(  (node)=>{
  //     if(label == node.label){
  //       found_node = node;
  //       returnBool = true

  //     }}
  //   );
  //  }
  function populateNode(props) {
    !img_bar_status_did_mount
      ? (master_context.did_mount = mount_styling())
      : (master_context.did_mount = master_context.did_mount);
    img_bar_status_did_mount = true;
    node_id_global += 1;
    nodesDS.add([
      { id: node_id_global, label: " Q " + graph.nodes.get().length + " " },
    ]);

    network.moveNode(
      node_id_global,
      (Math.random() - 0.6) * 400,
      (Math.random() - 0.6) * 400
    );
  }
  function deleteNodeOrEdge(props) {
    deselectAllModes();

    let node_deleted, edge_deleted;
    let deleted_node = network.getSelectedEdges;
    graph.nodes.forEach((node) => {
      network.deleteSelected();
    });
  }

  return (
    <div id="non-header-div">
      <div class="div-inline-group-below-header">
        <div id="trash_button" class="div-inline-group-below-header">
          <input
            id="trash_button_input"
            onClick={deleteNodeOrEdge}
            type="image"
            src={remove_bar}
            width="33"
            height="33"
            name="remove_bar"
          />
        </div>
        <div id="add_button_visual" class="div-inline-group-below-header">
          <input
            id="add_button_image"
            onClick={populateNode}
            type="image"
            src={add_bar}
            width="33"
            height="33"
            name="add_button"
          />
        </div>

        <ButtonGroup id="group-holder" className="mr-2">
          <Button class="visual-button" variant="info" onClick={toEditEdgeMode}>
            {" "}
            <font color="white">Add Transitions</font>
          </Button>
          {/* <Button class ="visual-button" variant="secondary" onClick={toAddNodeMode}><font color='yellow'> Add Node</font> </Button> */}
          <Button class="visual-button" variant="info" onClick={setInitial}>
            {" "}
            <font color="white">Mark Initial</font>
          </Button>
          <Button class="visual-button" variant="info" onClick={setAccepting}>
            {" "}
            <font color="white">Mark Accepting </font>
          </Button>
        </ButtonGroup>
        <img
          id="bar"
          ref={img_status}
          src={img_array[img_index]}
          height="34"
          width="34"
        ></img>
      </div>

      <div
        style={{ height: `${height}px` }}
        id="graph-display"
        className="Visual"
        ref={wrapper}
      ></div>
    </div>
  );
}

export default PDA_Visual;
