import React, {useEffect} from "react";
import './styles/Bar.css'

function Bar(props) {
  return(
    <>
      <div className="container">
        {props.selected ? 
        <>
          <div className="bar-item" style={{height: `${props.num}vh`, backgroundColor: 'red'}}></div>
          <div className="bar-num" style={{color: 'red'}}>{props.num}</div>
        </>
        :
        <>
          <div className="bar-item" style={{height: `${props.num}vh`}}></div>
          <div className="bar-num">{props.num}</div>
        </>}
      </div>
    </>
  );
}

export default Bar;