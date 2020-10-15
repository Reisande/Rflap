import React, { useEffect, useRef, useState, useContext } from "react";
/*graphing library*/
import vis from "vis-network";
/*react bootstrap components*/
import { Button, ButtonGroup, Col, Row, Modal,Badge} from "react-bootstrap";
/*import css and react bootstrap css */
import "./App.css";
import "./Visual.css";
import "bootstrap/dist/css/bootstrap.min.css";
/*grab app-wide context*/
import { AutomataContext } from "./AutomataContext.js";
/* resource images */
import accept_bar from "./accept.svg";
import add_bar from "./add-bar.svg";
import points_bar from "./points.svg";
import reject_bar from "./reject.svg";
import transition_bar from "./transition.svg";
import blank_svg_bar from "./blank.svg";
import passive_bar from "./delete.svg";
import remove_bar from "./remove.svg";

/*Network options object and Hex's in js*/
import { Hex } from "./res/HexColors.js";
import { NetworkOptions } from "./res/NetworkOptions";
//Component-wide state variable to track total number of Ids on client side,
//seperate from nodesDS (vis.DataSet() object) because of leaky abstractions
let node_id_global = 0;
let height = window.innerHeight - 85 
let img_bar_status_did_mount = false;

/*Creating vs.DataSet objects (arrays of object {id;labels;from;to;arrows;}*/

/* 

    nodesDS and edgesDS 

    Desc:
      Contain all information of Nodes and Edgstring, callback: (event: KeyboardEvent, handler: HotkeysEvent) => void, options: Options = {}, deps: any[] = [])
The callback function takes the exaes to be displayed on the graph via module vis's contstrucot DataSet()

*/

let nodesDS = new vis.DataSet([]);
let edgesDS = new vis.DataSet([]);

/* 
    graph

    Desc:
      Graph object which is passed nodes and edges, and in turn is passed to populate vis.network (final canvas object). 

*/
let in_initial_mode = false;
let in_accepting_mode_ = false;
let delete_lock = false;
 let inputVal = "";
let edgeDeletion = false;

let graph = { nodes: nodesDS, edges: edgesDS };
function Visual() {
  const [show, setShow] = useState({display: false, user_in: " _"});
  const [warning, setWarningDisplay] = useState(false);
  const master_context = useContext(AutomataContext);
  master_context.graphObj = graph;
  master_context.edgesDS = edgesDS;
  master_context.nodesDS = nodesDS;
//  let delete_lock = false;
//  let in_accepting_mode_ = false;
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
    let nav_header_height = document.querySelector("#nav-header") == null ? 0 : document.querySelector("#nav-header").offsetHeight;
    let bar_layout_height = document.querySelector("#bar_layout") == null ? 0 : document.querySelector("#bar_layout").offsetHeight;
   
    network = new vis.Network(
      wrapper.current,
      graph,
      NetworkOptions((height - nav_header_height - bar_layout_height ).toString(), window.innerWidth.toString())
    );
    master_context.network = network;
    //context-click for graph
    network.on("showPopup", (params) => { });

    //graph event listeners here:

    /*
  hoverNode listener
  Desc: Takes node added in addNode
  */
    network.on("hoverNode", (params) => { });
    /* 
    controlNodeDragEnd
    Desc: Catches end of add transition event, and updates edges with newly added edges.
    */
    network.on("controlNodeDragEnd", (params) => {
      network.disableEditMode();
      let edge_identifier = findEdgeByNodes(
        params.controlEdge.from,
        params.controlEdge.to
      );

      edgesDS.update([{ id: edge_identifier, arrows: "to" }]);
    });

    /*

    afterDrawing
    Desc: Ensures canvas has been drawn, apply CSS stylings for css background here.
*/
    network.on("afterDrawing", (params) => {
      let canvasDOM = document.getElementsByTagName("canvas")[0];
      canvasDOM.style.background = Hex.Canvas;
      if (master_context.hasImported) {
        nodesDS = master_context.nodesDS;
        edgesDS = master_context.edgesDS;
        master_context.hasImported = false;
        graph = master_context.graphObj;
        node_id_global += nodesDS.get().length -1
      }
      document.getElementById("group-holder").style.borderColor = Hex.Canvas;
      document.getElementById("non-header-div").style.background = Hex.Canvas;
    });

    /*Empty Canvas Click event handler initiated on network.on(click)*/
    const emptyCanvasClickHandler = (params) => {
      let addedNode = node_id_global;
      const noNodesClicked = (params) =>
        params.nodes.length === 0 ? true : false;
      const noEdgesClicked = (params) =>
        params.edges.length === 0 ? true : false;
      const BoundsCheck = (params) =>
        params.pointer.canvas.x != undefined || params.pointer.canvas.y != null;
      const getXY = (params) => [
        params.pointer.canvas.x,
        params.pointer.canvas.y,
      ];
      const [x, y] = BoundsCheck(params) ? getXY(params) : [null, null];
      const populateNodeAt = (x, y) => {
        node_id_global += 1;
        nodesDS.add([{ id: node_id_global, label: newNodeLabel() }]);
        network.moveNode(node_id_global, x, y);
      };
      let _ =
        noNodesClicked(params) &&
          noEdgesClicked(params) &&
          x != null &&
          y != null
          ? populateNodeAt(x, y)
          : () => {
            return;
          };
      return addedNode != node_id_global ? true : false;
    };

    /* to get hotkey designations from ctrl,shift, and alt:
        params.event.srcEvent.<csa>Key */

    /*   deleteNodeWithCtrl -> params -> bool 
      Remove a node with ctrl hotkey pressed hotkey on network.on(click)*/

    const deleteNodeWithCtrl = (params) => {
      if (params.event.srcEvent.ctrlKey || params.event.srcEvent.metaKey) {

        network.deleteSelected();
        return true;
      }
      return false;
    };

    network.on("release", (p) => {
      img_status.current.src = passive_bar;
    });

    /*Shift click event listeners */
    //called by keydown, enables editing edges when nodes are clicked.
    const handleShiftClick = (event) => {
      if (event.key === "Shift") {
        toEditEdgeMode({});
      }
    };
    // Shift click event listeners, keydown calls handleShiftClick(e)
    // to enable edit edge mode

    //window.addEventListener("keydown", handleShiftClick);

    window.addEventListener("keydown", (e) => {
      const deleteNodeMode = (keyCode) => {
        if (keyCode === "KeyD") {
          try {
            img_status.current.src = remove_bar;
          }
          catch (e) {
          }
          delete_lock = true;
          return;
        }
        else if (keyCode == "KeyT") {
          toEditEdgeMode();
          return;
        }
        else {
          delete_lock = false;
          if (img_status != null && img_status.current != null) {
            img_status.current.src = passive_bar;
          }
          return;
        }
      };
      deleteNodeMode(e.code);
    });

    network.on("click", (params) => {
      if (edgeDeletion) {
        edgeDeletion = false;
        return;
      }
      else if (delete_lock && network.getSelectedNodes().length != 0) {
        network.deleteSelected();
        deselectAllModes()
        return;
      }
      else if (delete_lock && params.edges) {
        graph.edges.remove(params.edges[0])
        deselectAllModes();
        return;
      }

      deselectAllModes();
      emptyCanvasClickHandler(params) || deleteNodeWithCtrl(params);
    });

    network.on("select", (params) => {
      // SET INITIAL MODE PRESS
      if (delete_lock && params.edges.length > 0 && (params.nodes.length == 0 || params.nodes == [])) {
        edgeDeletion = true;
        graph.edges.remove(params.edges[0]);
        deselectAllModes();
      }
      else if (
        params != null &&
        in_initial_mode &&
        (params.nodes > 0 || params.nodes[0] != null)
      ) {
       let node_id_clicked = params.nodes[0];
        let found_node;
 
        //find node given
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
        //checks if in accepting state (found_node has border width of 3)
        if (found_node.borderWidth == border_width_a) {
          final_border = border_width_b;
        } else {
          final_border = border_width_a;
        }
        nodesDS.update([{ id: node_id_clicked, borderWidth: final_border }]);
        in_accepting_mode_ = false;
        img_status.current.src = passive_bar;
      } else if (params.edges.length == 1 && params.nodes == 0 && edgeDeletion == false) {
        let edge_id = params.edges[0];
        const openModal = (edgeDisplayInfo) => {
          if (edgeDisplayInfo == null) {
            setShow({ display: true, user_in: "!" });
            return;
          }
          let from = edgeDisplayInfo.from, to = edgeDisplayInfo.to;
          let currentEdgeText = edgeDisplayInfo.edgeLabel == null ? "" : edgeDisplayInfo.edgeLabel;
          inputVal = currentEdgeText
          setShow({ display: true, from: "δ(" + from.trim() + ", ", edgeLabel: currentEdgeText, to: ") =" + to, edgeId: edge_id });
        };
          openModal(nodesOfEdgeId(params.edges[0]))
      }
    });

    //cleaning up event listeners
    return () => {
      network.off("select");
      network.off("controlNodeDragEnd");
      network.off("hoverNode");
      network.off("showPopup");
      network.destroy();
      window.removeEventListener("keydown", (e) => {
        const deleteNodeMode = (keyCode) => {
          if (keyCode === "KeyD") {
            img_status.current.src = remove_bar;
            delete_lock = true;
            return;
          }
          else if (keyCode == "KeyT") {
            toEditEdgeMode();
            return;
          }
          else {
            delete_lock = false;
            if (img_status != null && img_status.current != null) {
              img_status.current.src = passive_bar;
            }
            return;
          }
        };
        deleteNodeMode(e.code);
      });
  
      window.removeEventListener("keydown", handleShiftClick);
    };
  },[]);



  const deselectAllModes = () => {
    in_accepting_mode_ = false;
    in_initial_mode = false;
    delete_lock = false;
    if (img_status != null && img_status.current != null) {
      img_status.current.src = passive_bar
    }
  };
  const nodesOfEdgeId = (edgeID) => {
    let fromLabel = "", toLabel = "", edgeText = "";
    let nodeFromId, nodeToId;

     graph.edges.forEach((edge) => {
      if (edge.id == edgeID) {
        nodeFromId = edge.from
        nodeToId = edge.to
        edgeText = edge.label;
      }
    });
    graph.nodes.forEach((node) => {
      if (node.id == nodeFromId) {
        fromLabel = node.label;
      }
      if (node.id == nodeToId) {
        toLabel = node.label;
      }
    });
    return {edgeLabel: edgeText , from: fromLabel, to:toLabel }
  }
  const ChangeEdgeText = (userInput, edgeID) => {
    String.prototype.replaceAt = function(index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
    let warn = false;
    graph.edges.forEach((edge) => {
      if (edge.id == edgeID) {
        edge.label = userInput;
        userInput.split(",").forEach((chr) => {
          if (chr.length > 1){
            warn = true;
          }
        });
        if (userInput === "") {
          warn = true;
        }
        if (warn) return;
        userInput = userInput.replace("!", "ϵ").replace(" ", "ϵ");
        edgesDS.update([{ id: edge.id, label: userInput }]);
      }
    });
    if (warn) {
      setWarningDisplay(true);
    }
    else {
      setShow({ display: false })
      setWarningDisplay(false);
      deselectAllModes();
    }
  };
//  const saveEdgeEdit = (edgeId) => {
 //   ChangeEditText()
  //}

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
    try {
      img_status.current.src = transition_bar;
      if (network == null) return;
      network.enableEditMode();
      network.addEdgeMode();
    }
    catch (e) {

    }
  }
  //network.enableEditMode() and then network.addNodeMode()
  function toAddNodeMode(props) {
    deselectAllModes();
    img_status.current.src = add_bar;
    if (network == null) return;
    network.enableEditMode();
    network.addNodeMode();
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

  const newNodeLabel = () => {
    let returnLabel = " Q ";
    let nominalAppend = nodesDS.get().length.toString();
    const parseLabel = (label) => parseInt(label.replace(returnLabel, ""), 10);
    let foundEmptyIndex = false;
    let nodesPresent = nodesDS
      .get()
      .map((obj) => {
        return parseLabel(obj.label);
      })
      .sort((a, b) => a - b);
    nodesDS.get().forEach((obj, index) => {
      if (nodesPresent[index] != index && !foundEmptyIndex) {
        nominalAppend = index.toString();
        foundEmptyIndex = true;
        return;
      }
    });
    //standardize end input to string lengths of size 5:
    return (returnLabel += nominalAppend).length == 4
      ? (returnLabel += " ")
      : returnLabel;
  };

  /* 
  populateNode() => props:null
    Desc: adds Node when the plus button is clicked.
    Adds nodes and ensures that id and displayname does not overlap with other nodes.
*/
  function populateNode(props) {
    //    !img_bar_status_did_mount
    //    ? (master_context.did_mount = mount_styling())
    //  : (master_context.did_mount = master_context.did_mount);
    img_bar_status_did_mount = true;
    //Node_id_global just to ensure ids are different each time
    // used purely for the api library vis.network and not for node selection
    // on the frontend-- label is used instead .
    node_id_global += 1;
    nodesDS.add([{ id: node_id_global, label: newNodeLabel() }]);
    network.moveNode(
      node_id_global,
      (Math.random() - 0.6) * 400,
      (Math.random() - 0.6) * 40>0
    );
  }

  /* deleteNodesOrEdge(props) => props:null

  Desc: Deletes selected nodes when the trash icon is clicked

*/

  function deleteNodeOrEdge(props) {
    deselectAllModes();
    if (network == null) return;
    network.deleteSelected();
  }

//  const graphComp = ({children}) => (
    // <div
    //   style={{ height: `${height}px` }}
    //   id="graph-display"
    //   className="Visual"
    //   ref={wrapper}
    // >{children}</div>

  //const memoGraph = React.memo(graphComp);

  const closeModal = () => {
    //setShow(false);

  }

//          setShow({ display: true, from: "δ(" + from, edgeLabel: edgeLabel, toInvariant: ") = ",  to: to});
  return (
    <div id="non-header-div">
      <Modal size="sm"backdrop="static" show={show.display} onHide={() => { setShow({display:false, user_in: "_"}) }}> 
        <Modal.Header >
          <Modal.Title>Edit Transition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>         <Col md={{ offset: 2 }}> 
        <input type="text" defaultValue= {show.from} size="3" disabled/>
            <input type="text" size="4" onChange={(event) => { inputVal = event.target.value }} defaultValue={ show.edgeLabel }/>
        <input type="text" defaultValue= {show.to} size="3" disabled/>
        </Col>
</Row>
          </Modal.Body>
        <Modal.Footer>
          {warning ?
            <Badge size="sm" variant="danger">Must be single characters comma seperated.</Badge> :
            <React.Fragment />}
          <Button variant="primary" onClick={() => ChangeEdgeText(inputVal,show.edgeId)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div class="div-inline-group-below-header" id="bar_layout">
        {/* <div id="trash_button" class="div-inline-group-below-header">
          <input
            id="trash_button_input"
            onClick={deleteNodeOrEdge}
            type="image"
            src={remove_bar}
            width="33"
            height="33"
            name="remove_bar"
          />
        </div> */}
        {/* <div id="add_button_visual" class="div-inline-group-below-header">
          <input
            id="add_button_image"
            onClick={populateNode}
            type="image"
            src={add_bar}
            width="33"
            height="33"
            name="add_button"
          />
        </div> */}

        <ButtonGroup id="group-holder" className="mr-2">
          {/* <Button class="visual-button" variant="info" onClick={()=>toEditEdgeMode()}>
            {" "}
            <font color="white">Add Transitions</font>
          </Button> */}

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

      {/* <memoGraph ref={wrapper}> {"hi"}</memoGraph> */}
      <div
        style={{ height: `${height.toString()}px` }}
        id="graph-display"
        className="Visual"
        ref={wrapper}
      ></div>
    </div>
  );
}

export default Visual;
