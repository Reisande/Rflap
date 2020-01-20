import  React, {useRef,useContext,useState,useEffect} from 'react';
import {Button,Form, Col,Row,Navbar,Nav, InputGroup,FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { inspect } from 'util' 
import Popup from 'reactjs-popup';
import "./Run.css";
import error_image from './error.svg';
import success_image from './success.svg';
import {AutomataContext} from './AutomataContext.js'
import not_ferris  from "./rFlapLogo.png";
import add_svg from './add.svg';
import add_red from './add_red.svg';
import add_black from './add_black.svg';
// import {RowEntry} from './RowEntry.js';
import RowInput from './RowInput.js';
import idle_svg from './button.svg';
import add_perfect from './plus.svg';
import NotPopUp from './NotPopUp.js';

var util = require('util')
let bool_check = false;
const not_dfa = "Not a valid DFA!";
const import_error = "Importation Errror!";
let error_object = {
    multiple_initial_states: false,
    no_label_transition:false,
    no_initial_state:false


}
function Run(props){
    const master_context = useContext(AutomataContext);
    
    let user_input_row_collection = []
    const [s_or_e,set_image] = useState([error_image,success_image]);
    const [succeded_failed,set_succeded_failed] = useState(0);
    const [determinism_tf,set_determinism_tf] = useState(false);
    const [importation_error,set_import_status] = useState(false);
    let image_collection = [error_image,idle_svg,success_image];

    const [row_entry_array,set_row_entries] = useState([1]);
   


    const add_button = useRef(null);
    const image_ref = useRef(null);
    const row_ref_container = useRef(null);
    const file_dialog = useRef(null);
    let entry_amount = 30;
    let array_of_row_refs = []

    // console.log(row_entry_array);
    let packet_to_misha_the_microsoft_engineer = {
            alphabet:[],
            start_state:"",
            //String:Bool
            states:{
                
            },
            //lists of lists:
            transition_function:[],
            //bool
            determinism: master_context.mode == "Determinstic Finite Automata" ? true : false,
            input_strings:["a"],
    };

    //useEffect clause
    useEffect( ()=>{
        document.querySelector("#import_json_button_run").addEventListener("change",(e)=>{

            // console.log(e.target.files[0]);
        });

 
 
    });

    let input_val = "default";
    let toBePushed = [];
    // error_object =
    const edgeProcess = (edgeObj,nodeObj) =>{
        // console.log("edge process");
        // console.log(edgeObj);
        let transition_triple = [];
        packet_to_misha_the_microsoft_engineer.determinism = (master_context.mode == "Determinstic Finite Automata" ? true : false)
        packet_to_misha_the_microsoft_engineer.transition_function = []
        edgeObj.forEach( (edgeObj) =>{

            transition_triple = [];
            if(edgeObj.label == undefined){
                // console.log()
                error_object.no_label_transition = true;
                return undefined;
            }
            let label_to_add = edgeObj.label == undefined ? " ":  edgeObj.label.trim();
            let from,to,label;
            from = edgeObj.from;
            to = edgeObj.to;
            label = edgeObj.label.trim();
            if(label.length > 1 && (from == to) ){
                // console.log("double-self loop detected---beginning")
                // console.log("subarray-creation:");
                let sub_string_collection = label.split(",");
                // console.log(sub_string_collection);
                // console.log("subarray-ending");

                // console.log("double-self loop detected---ending")
                
                for(let i = 0 ; i  < sub_string_collection.length;i++){
                    let from_label,to_label
                    transition_triple = [];
                    nodeObj.forEach( (nodeObj)=>{
                        if(nodeObj.id == from){
                            from_label = nodeObj.label;
                        }
                        if(nodeObj.id == to){
                            to_label = nodeObj.label;
                        }

                    });
                    transition_triple.push( from_label.trim());
                    transition_triple.push(sub_string_collection[i].toString(10));
                    transition_triple.push(to_label.trim());
                    
                    packet_to_misha_the_microsoft_engineer.transition_function.push(transition_triple);
                };
                
            }
            else{
                let from_label,to_label;
                nodeObj.forEach( (nodeObj)=>{
                    if(nodeObj.id == from){
                        from_label = nodeObj.label.trim();
                    }
                    if(nodeObj.id == to){
                        to_label = nodeObj.label.trim();
                    }

                });
                transition_triple.push( from_label);

            //processing self-loops
          
            transition_triple.push(label);
            transition_triple.push(to_label);

            toBePushed.push(label_to_add.toString(10));
            packet_to_misha_the_microsoft_engineer.transition_function.push(transition_triple);
            }

        });

        packet_to_misha_the_microsoft_engineer.alphabet = [...new Set(toBePushed)];
        // console.log(edgeObj);
        // console.log("end of edgeProcess");
    }
    const nodeProcess = (nodeObj) =>{
        // console.log("node process");
        // console.log(nodeObj);
        let start_state = "";
        let accepting_states = [];
        let states = [];
        let multiple_initial_states_check = false;
        //get complete object:

        // accepting: #FF8632
        // intial: #00bfff
        let sState = "";
        console.log("LINEAR SEARCH:")
        nodeObj.forEach((node)=>{

            console.log(node);
            //Accumulates all states
            if( !(states.includes(node.label)) ){
                states.push( ""+node.label.trim());
            }
            //Getting the start state
            if(node.init){
                if(multiple_initial_states_check){
                    error_object.multiple_initial_states = true;
                    return;
                }
                sState = node.label.trim();
                multiple_initial_states_check = true;
            }
            if(node.shape == "triangle"){
                start_state = node.label.trim();

                // console.log("SETTING START_STATE" + start_state);
            }
            //Accumulates the accepting states.
             if(node.borderWidth == 3){
                if(!(accepting_states.includes(node.label)))  {

                accepting_states.push(node.label.trim());
                }
            }
        });
        console.log(multiple_initial_states_check);
        if(multiple_initial_states_check == false){
            error_object.no_initial_state = true;
            return;
        }
        packet_to_misha_the_microsoft_engineer.start_state = sState;
        //boolean for accepting
        states.forEach( (label)=>{
            let isAccepting = false;
            if( accepting_states.includes(label)){
                isAccepting = true;
            }
            packet_to_misha_the_microsoft_engineer.states[""+ label] = isAccepting;

        }  );
    }
    const preprocess = () =>{
     
        nodeProcess(master_context.graphobj.nodes.get());
        edgeProcess(master_context.graphobj.edges.get(),master_context.graphobj.nodes.get()   );


    }

async function postToRustApi(){
    let url = `http://localhost:8080/api`;

    let postingObject = {
        method: "POST",
        mode:"cors",
        // cache:"no-cache",
        // credentials: "same-origin",
        headers:{
            "Content-Type":"application/json",
        },
        // redirect:"follow",
        // referrer: "no-referrer",
        body: JSON.stringify(packet_to_misha_the_microsoft_engineer)
    }
    console.log(JSON.stringify(packet_to_misha_the_microsoft_engineer));
    // console.log("callback")
    
    
    // console.log((packet_to_misha_the_microsoft_engineer));
    //Check for Errors via the error_object
    if(error_object.multiple_initial_states){
        alert("\tMultiple Initial States!");
        //reset object for next API request
        error_object = {
            no_label_transition: false,
            multiple_initial_states: false,
            no_initial_state:false

        }
        return null;
    }
    if(error_object.no_label_transition){
        alert("\t\tUnlabeled Transition!");
        error_object = {
            multiple_initial_states :false,
            no_label_transition: false,
            no_initial_state:false
        }
        return null;
    }
    if(error_object.no_initial_state){
        alert("\tNo Initial State!");
        error_object = {
            multiple_initial_states :false,
            no_label_transition: false,
            no_initial_state:false
        }
        return null;
    }
    
    let Algorithms_are_the_computational_content_of_proofs = await fetch(url,postingObject);
    
    //reset error_object
    error_object = {
        multiple_initial_states :false,
        no_label_transition: false,
        no_initial_state:false
    }
    
    return   await Algorithms_are_the_computational_content_of_proofs.json();
    
};
   const checkForProperDetermnism = (listOfStringsCallback,single_entry) => {
    let determinism_callback = listOfStringsCallback[1];
    let determinism_index = 1;
    let bool_check_for_determinism = false;
    console.log("-");
    console.log(listOfStringsCallback);
    console.log("-");
    console.log(listOfStringsCallback);
    console.log(single_entry);
    if(master_context['mode'] == "Determinstic Finite Automata"){

        if(single_entry == true){
            console.log(listOfStringsCallback[0][1]);
            console.log("First");
            console.log(!listOfStringsCallback[0][1]);
            return !listOfStringsCallback[0][1];
        }
        else{
            console.log("Second");

            listOfStringsCallback.forEach((_,id)=>{
                if(!_[determinism_index]){
                    // console.log(_);
                    // console.log(_[determinism_index]);
                    bool_check_for_determinism = true;
                }
            });
            return bool_check_for_determinism;
        }
    }


   }

  
   async function onClickPingToApi(){
    //    event.preventDefault();
    //lines 325 to 340 are for caching results of api requests, currently does nothin
        let empty_string = false;
        // let dump_var;
        packet_to_misha_the_microsoft_engineer.input_strings = [];
        // let process_empty_strings_array = [...row_entry_array];
       user_input_row_collection.forEach((_,id)=>{
        packet_to_misha_the_microsoft_engineer.input_strings.push(_);
        // (_=="") ? empty_string = true : packet_to_misha_the_microsoft_engineer.input_strings.push(_);
        // (empty_string) ?  process_empty_strings_array[id] = 1 : dump_var = 2;
       });
    //    console.log(process_empty_strings_array);
    //    set_row_entries([...process_empty_strings_array]);
    
       console.log("USER INPUT STRINGS:" + (packet_to_misha_the_microsoft_engineer.input_strings));
  
        preprocess();
        try{
            const callback = await postToRustApi();
            console.log("----")
            console.log(callback);
            console.log("----")

            if(callback == null){
                console.log("EXITING . . .")
                return;
            }

        if(  callback["hint"] != "" && master_context.mode == "Determinstic Finite Automata" ){
            alert("Invalid determinism!\n" + callback["hint"]);
            let mounting_array = [];
            for(let i = 0 ; i < row_entry_array.length ;i++){
              mounting_array.push(1);
            }
            set_row_entries([...mounting_array]);
        }
        else{
            console.log("CALBACK")
            console.log(callback);
            console.log("CALBACK")

            let new_array;

        if(row_entry_array.length == 1){
            console.log("row_entry = 1");
            callback.list_of_strings[0][1] ? new_array = [2] : new_array = [0];
            console.log(callback.list_of_strings[0][0])
            set_row_entries([...new_array]);
            // console.log("SINGLE row entry api call: ");
            // console.log( callback);
        }   
        else{
            let array_to_mount = [];
            console.log("YOLO")
            // console.log("ENSEMBLE row entries api call");
            // console.log(callback);
            //iterate through each array for each row index and declare it either rejected or accepted
            console.log("---")
            
                    for(let i = 0 ; i < row_entry_array.length ;i++){
                        // console.log(callback.list_of_strings[i][1]);
                        if(  callback.list_of_strings[i][1]){
                            array_to_mount.push(2);
                        }
                        else{
                            array_to_mount.push(0);
                        }
                    }
                    console.log("---")
                    console.log(array_to_mount);
                    set_row_entries([...array_to_mount]);
                
                
                }
            }
        }
        catch(e){
            // console.log(e);
        }
   };
   const HTMLCol_to_array = (html_collection) => Array.prototype.slice.call(html_collection);

   const process_userinput = (row_table_DOM_node,id) =>{
    // console.log("PROCESSING")
    // console.log(id);
    user_input_row_collection[id] = (HTMLCol_to_array(row_table_DOM_node.children)[0]).value;
    // console.log("PROCESSING")
   }

   function on_click_test_api(event){
    //reset list for each click to api with amount of rows
    //array that contains all the input strings from the user
    user_input_row_collection = [...Array(HTMLCol_to_array(row_ref_container.current.children).length)];
    // console.log("ON_CLICK_API_TEST")
    event.preventDefault();
    // console.log(event);
    HTMLCol_to_array(row_ref_container.current.children).map(process_userinput);
    // console.log(user_input_row_collection);
    // collection of all the 
    // row_ref_container.current.childNodes().map( (DOM_node,id)=>process_row_for_userinput(DOM_node,id));
    // console.log("ON_CLICK_API_TEST")
    onClickPingToApi();

   }
   function addBar(e){

    console.log(e.target);
    e.preventDefault();
   }
   function setInputVal(value){
    input_val = value.target.value;
   }

    // !Functional component, put into production instead of map in return() below!
    
//    const  row_entry_components  =  row_entry_array.map((id)=>
//         <RowInput key= {id}></RowInput>
//     );

   //Update state of Run.js component based on image_click.
   // Rerenders Run.js when button is clicked, thus adding a row entry component 
   function image_click_handler(event){
    let new_array = row_entry_array;
    new_array.push(1);
    set_row_entries([...new_array]);
   }
   
   function export_click_handler(event){
    //   console.log("EXPORT_BUTTON");
       preprocess();
    //    console.log(packet_to_misha_the_microsoft_engineer)
       downloadObjectAsJson(packet_to_misha_the_microsoft_engineer,"RFLAP + " + Math.random() * (100));
    //    window.location.href = "http:locahost:8000/packet.json"

        // console.log("EXPORT_BUTTON");

   }

   //function to mount anchor tag and initiate download
   function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function import_json(event){
    console.log("import_json");
    // console.log(file_dialog.click());
    const dialog_box = document.querySelector('#import_json_button_run');
    dialog_box.click( (file)=>{console.log(file.target);}  );

    console.log("import_json");


}
    return(
        <div id = "inside-div-scrollbar"> 
        <Navbar className="bg-dark justify-content-between" id ='nav-header' >
        <input ref= {file_dialog} id="import_json_button_run" accept= ".json" type = "file" style={{display:"none"}}/>
        {/* <Button id="import_json" onClick={ (event) => import_json(event)} variant="info">
           Import
        </Button> */}

        <Button id="export_xmljson" onClick={ (event)=>{export_click_handler(event)}} variant="info">
           Export
        </Button>
                <Nav>
        {/* <Button ref = {add_button}onClick={ (event) => addBar(event) } variant="warning">
           Add
        </Button> */}
        <Col className="justify-content-between" id ="add_row_button_container">
        <input id = "add_row_button" onClick={ (event) => image_click_handler(event)}type="image" id="add_button" src={add_perfect} width="33" height="33" name="add_row_input"/>
        </Col>
        <Button id="api_button" onClick={ (event) => on_click_test_api(event) } variant="warning">
           Test
        </Button>
        </Nav>
        </Navbar>
        <Row><br/></Row>
        <div className="name" ref={row_ref_container}>
        {row_entry_array ? row_entry_array.map((_, key) => <RowInput key = {key} image={image_collection[row_entry_array[key]]}/> ):<></>}
        </div>
            <Popup
            open ={determinism_tf}
            >
            <NotPopUp text={not_dfa}/>
            </Popup>
            <Popup
            open={importation_error}>
            <NotPopUp text={import_error}/>
            </Popup>
    </div>
    );
    

    }
export default Run;