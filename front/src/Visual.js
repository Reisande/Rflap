import React, { useEffect, useRef, useState, useContext } from "react";
import vis from "vis-network";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import logo from "./logo.svg";
import "./App.css";
import "./Visual.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AutomataContext } from "./AutomataContext.js";
import accept_bar from "./accept.svg";
import add_bar from "./add-bar.svg";
import points_bar from "./points.svg";
import reject_bar from "./reject.svg";
import transition_bar from "./transition.svg";
import blank_svg_bar from "./blank.svg";
import passive_bar from "./delete.svg";
import remove_bar from "./remove.svg";
let node_id_global = 0;
let height = window.innerHeight - 80;
let img_bar_status_did_mount = false;

/*Creating vs.DataSet objects (arrays of object {id;labels;from;to;arrows;}*/

/* 

    nodesDS and edgesDS 

    Desc:
      Contain all information of Nodes and Edges to be displayed on the graph via module vis's contstrucot DataSet()

*/

let nodesDS = new vis.DataSet([]);
let edgesDS = new vis.DataSet([]);

/* 
    graph

    Desc:
      Graph object which is passed nodes and edges, and in turn is passed to populate vis.network (final canvas object). 

*/
let graph = { nodes: nodesDS, edges: edgesDS };

let options = {
  autoResize: true,
  height: height.toString(),
  width: window.innerWidth.toString(),
  locale: "en",

  // turn off nodes physics
  nodes: {
    physics: false,
    label: undefined,
    title: undefined,
    shape: "circle",
    borderWidth: 0,
    borderWidthSelected: -1,

    scaling: {
      label: {
        enabled: true
      }
    },
    color: {
      border: "#64778D",
      background: "#E25B4B",
      highlight: {
        border: "#64778D",
        background: "#B22222"
      },
      hover: {
        border: "#64778D",
        background: "#B22222"
      }
    },
    font: {
      color: "#DCDCDC",
      face: "sans serif",

      size: 12,
      bold: {
        face: "sans serif",
        size: 20
      }
    }
  },
  // keep edges physics on as to not overlay two transitions over each other
  edges: {
    physics: true,

    color: "skyblue",
    scaling: {
      label: true
    },
    font: {
      size: 16
    }
  },
  interaction: {
    hover: true
  }
};
function Visual() {
  const master_context = useContext(AutomataContext);
  master_context.graphobj = graph;
  let in_add_node_mode = false;
  let in_accepting_mode_ = false,
    in_initial_mode = false;
  let display_popup = false;
  let node_id_clicked, state_field, string_field;
  let img_index = 0;
  let img_array = [
    blank_svg_bar,
    accept_bar,
    add_bar,
    points_bar,
    reject_bar,
    transition_bar
  ];

  const wrapper = useRef(null); //Display graph in div "wrapper"
  const img_status = useRef(null);
  let network;

  useEffect(() => {
    img_status.current.src = passive_bar;
    const HTMLCol_to_array = html_collection =>
      Array.prototype.slice.call(html_collection);

    network = new vis.Network(wrapper.current, graph, options);
    //context-click for graph
    network.on("showPopup", params => {});




    //graph event listeners here:

    /*
  hoverNode listener
  Desc: Takes node added in addNode
  */

    network.on("hoverNode", params => {
      let node_id_clicked = params.node;

      if (in_add_node_mode) {
        nodesDS.remove({ id: node_id_clicked });
        let new_id = node_id_global;
        node_id_global += 1;
        nodesDS.add([
          { id: new_id, label: " Q " + graph.nodes.get().length + " " }
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


    /* 
    
    controlNodeDragEnd
    Desc: Catches end of add transition event, and updates edges with newly added edges.

    */
    network.on("controlNodeDragEnd", params => {
      network.disableEditMode();
      let edge_identifier = findEdgeByNodes(
        params.controlEdge.from,
        params.controlEdge.to
      );

      edgesDS.update([{ id: edge_identifier, arrows: "to" }]);
    });





    network.on("select", params => {
      if (
        params != null &&
        in_initial_mode &&
        (params.nodes > 0 || params.nodes[0] != null)
      ) {
        let node_id_clicked = params.nodes[0];
        let found_node;
        //find node given
        graph.nodes.get().forEach(node => {
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
            { id: found_node.id, shape: final_state, init: false }
          ]);
        } else {
          nodesDS.update([
            { id: found_node.id, shape: final_state, init: true }
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
        graph.nodes.get().forEach(node => {
          if (node.id == node_id_clicked) {
            found_node = node;
          }
        });
        let final_border = 3;
        let border_width_a = 3;
        let border_width_b = 0;

        if (found_node.borderWidth == border_width_a) {
          final_border = border_width_b;
        } else {
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
        let user_input_string = prompt(Display_String);
        ChangeEdgeText(user_input_string, edge_id);
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
    };
  });
  const deselectAllModes = () => {
    in_accepting_mode_ = false;
    in_add_node_mode = false;
    in_initial_mode = false;
  };
  const ChangeEdgeText = (userInput, edgeID) => {
    graph.edges.forEach(edge => {
      if (edge.id == edgeID) {
        edge.label = userInput;
        if (userInput == " " || userInput == "") {
          userInput = "ϵ";
        }
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

  /* Functions for all graph transformation buttons right below the header */

  //network.enableEditMode and then network.addEdgeMode
  function toEditEdgeMode(props) {
    deselectAllModes();
    img_status.current.src = transition_bar;
    network.enableEditMode();
    network.addEdgeMode();
  }
  //network.enableEditMode() and then network.addNodeMode()
  function toAddNodeMode(props) {
    deselectAllModes();
    img_status.current.src = add_bar;
    network.enableEditMode();
    network.addNodeMode();
    in_add_node_mode = true;
  }
  //
  function setInitial(props) {
    deselectAllModes();
    img_status.current.src = points_bar;

    // if in_initial_mode is true, the event listener in useEffect() makes the next node selection
    // the initial node (transforms shape).
    in_initial_mode = true;
  }
  function setAccepting(props) {
    deselectAllModes();
    img_status.current.src = accept_bar;

    // if in_initial_mode is true, the event listener in useEffect() makes the next node selection
    // the initial node (transforms shape).
    in_accepting_mode_ = true;
  }

  /* @@@ */
  function mount_styling() {
    let url = "https://worldclockapi.com/api/json/est/now";
    let postingObject = {
      method: "GET"
    };
    let current_time;
    fetch(url, postingObject).then((callback, error) => {
      callback.json().then((body, err) => {
        master_context.state_styles = body.currentDateTime;
      });
    });
  }
  /* 
  populateNode() => props:null
    Desc: adds Node when the plus button is clicked.
    Adds nodes and ensures that id and displayname does not overlap with other nodes.
*/
  function populateNode(props) {
    !img_bar_status_did_mount
      ? (master_context.did_mount = mount_styling())
      : (master_context.did_mount = master_context.did_mount);
    img_bar_status_did_mount = true;
    node_id_global += 1;

    nodesDS.add([
      { id: node_id_global, label: " Q " + graph.nodes.get().length + " " }
    ]);
    network.moveNode(
      node_id_global,
      (Math.random() - 0.6) * 400,
      (Math.random() - 0.6) * 400
    );
  }

  /* deleteNodesOrEdge(props) => props:null

  Desc: Deletes selected nodes when the trash icon is clicked

*/

  function deleteNodeOrEdge(props) {
    deselectAllModes();
    network.deleteSelected();
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

          {/*Depreciated method of adding nodes to the canvas */}
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

export default Visual;
