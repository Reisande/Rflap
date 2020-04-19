import {Hex} from "./HexColors";

export const NetworkOptions = (height,width)=> {
    return {
    autoResize: true,
    height: height,
    width: width,
    locale: "en",
  
    // turn off nodes physics
    nodes: {
      physics: false,
      label: undefined,
      title: undefined,
      shape: "circle",
          
      borderWidth: 1,
  
      scaling: {
        label: {
          enabled: true
        }
      },
      //removes both hover state 
      // and select state
      chosen: false,
  
      color: {
       border: Hex.NodeBorder,
        background:Hex.NodeInner, 
        highlight: {
          border: Hex.NodeBorder,
          background: Hex.NodeInner
        },
        hover: {
          border: Hex.NodeBorder,
          background: Hex.NodeInner
      
        }
      },
      font: {
        color:Hex.NodeInnerText,
        face: "sans serif",
        strokeWidth: 2,
        strokeColor: Hex.NodeInnerTextStroke,
        size: 13,
        bold: {
          face: "sans serif",
          size: 20
        }
      }
    },
    // keep edges physics on as to not overlay two transitions over each other
    edges: {
      physics: true,
  
      color: Hex.EdgeColor,
      scaling: {
        label: true
      },
      chosen: false,
      font: {
        color: Hex.EdgeInnerText,
        size: 16,
        strokeWidth: 3,
        strokeColor: Hex.EdgeInnerTextStroke
      }
    },
    interaction: {
      hover: true
    }
  };
}
  export default NetworkOptions;