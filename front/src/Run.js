import  React, {useRef,useContext,useState,useEffect} from 'react';
import {Button,Form, Col,Row,Navbar,Nav, InputGroup,FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { inspect } from 'util' 
import "./Run.css";
import error_image from './error.svg';
import success_image from './success.svg';
import {AutomataContext} from './AutomataContext.js'
import not_ferris  from "./rFlapLogo.png";

var util = require('util')
let bool_check = false;


function Run(props){

    const [s_or_e,set_image] = useState([error_image,success_image]);
    const [succeded_failed,set_succeded_failed] = useState(0);
    const image_ref = useRef(null);
    let arrray_index = 0;
    let packet_to_misha_the_microsoft_engineer = {
            alphabet:[],
            start_state:"",
            //String:Bool
            states:{
                
            },
            //lists of lists:
            transition_function:[],
            //bool
            determinism: false,
            input_string:[],
    };
    useEffect( ()=>{
 
    })
    const master_context = useContext(AutomataContext);

    let input_val = "default";
    let toBePushed = [];
    const edgeProcess = (edgeObj,nodeObj) =>{
        console.log("edge process");
        console.log(edgeObj);
        let transition_triple = [];
        edgeObj.forEach( (edgeObj) =>{

            transition_triple = [];
            let label_to_add = edgeObj.label.trim();
            let from,to,label;
            from = edgeObj.from;
            to = edgeObj.to;
            label = edgeObj.label.trim();
            if(label.length > 1 && (from == to) ){
                console.log("double-self loop detected---beginning")
                console.log("subarray-creation:");
                let sub_string_collection = label.split(",");
                console.log(sub_string_collection);
                console.log("subarray-ending");

                console.log("double-self loop detected---ending")
                
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
        console.log(edgeObj);
        console.log("end of edgeProcess");
    }
    const nodeProcess = (nodeObj) =>{
        console.log("node process");
        console.log(nodeObj);
        let start_state = "";
        let accepting_states = [];
        let states = [];
        //get complete object:

        // accepting: #FF8632
        // intial: #00bfff
        let sState = false;
        nodeObj.forEach((node)=>{
        
            //Accumulates all states
            if( !(states.includes(node.label)) ){
                states.push( ""+node.label.trim());
            }
            //Getting the start state
            console.log("NODECOLOR")
            console.log(node.color)
            console.log("NODECOLOR")
            if(node.init){
                
                sState = node.label.trim();

            }
            if(node.color == "#FF8632"){
                start_state = node.label.trim();
                console.log("SETTING START_STATE" + start_state);
            }
            //Accumulates the accepting states.
             if(node.color == "#000000"){
                if(!(accepting_states.includes(node.label)))  {

                accepting_states.push(node.label.trim());
                }
            }

            
        });

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
        console.log("preprocesser: ");
        console.log(master_context.graphobj.nodes.get());
        console.log(master_context.graphobj.edges.get());
        nodeProcess(master_context.graphobj.nodes.get());
        edgeProcess(master_context.graphobj.edges.get(),master_context.graphobj.nodes.get()   );

        console.log("After node and edge processing: ");

        console.log(packet_to_misha_the_microsoft_engineer);

    }

async function postToRustApi(){
    let url = "http://localhost:8000/";

    let postingObject = {
        method: "POST",
        mode:"cors",
        cache:"no-cache",
        credentials: "same-origin",
        headers:{
            "Content-Type":"application/json",
        },
        redirect:"follow",
        referrer: "no-referrer",
        body: JSON.stringify(packet_to_misha_the_microsoft_engineer)
    }

    const Algorithms_are_the_computational_content_of_proofs = await fetch(url,postingObject);

    return await Algorithms_are_the_computational_content_of_proofs.json();
    
};

   async function onClickPingToApi(event){
       console.log("String from user: " +input_val);
       packet_to_misha_the_microsoft_engineer.input_string = input_val;
       console.log("State info:" );
        preprocess();
        try{
        const callback = await postToRustApi();
        console.log(callback);

            if(callback[0]){
                bool_check = true;
                set_succeded_failed(1);

                console.log("SUCCESS");
                console.log(master_context.graphobj.nodes)
            }
            else{
                bool_check = false;
                set_succeded_failed(0);
                console.log("ERROR");
            }
        }
        catch(error){
            console.error(error);
        }



   };

   function setInputVal(value){
    input_val = value.target.value;
   }

    return(
        <div id = "inside-div-scrollbar"> 
        <Navbar className="bg-dark justify-content-between" id ='nav-header' >

        <Navbar.Brand href="#home"> <b> <font color="#835C3B">R </font>   <font color = "#FFD700">FLAP</font></b></Navbar.Brand>
        <Nav>
        <Button onClick={ (event) => onClickPingToApi(event) } variant="warning">
           Run Strings
        </Button>
        </Nav>
        </Navbar>



        <Row><br/></Row>
        <InputGroup className="mb-3" as={Col}>

        <Form.Control onChange={ (event) => setInputVal(event)} aria-label=""  />
        <Col md="auto" >
        
        <InputGroup.Append  >

        <img ref={image_ref} width="32px" height = "32px" src={s_or_e[succeded_failed]}></img>
        </InputGroup.Append>
        </Col>
     </InputGroup>
    </div>
    );
    
}

export default Run;