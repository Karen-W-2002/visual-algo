import React from "react";
import './styles/Bar.css'

function Bar(props) {
  let bar;
  if (!props.index_i && !props.index_j && !props.min) {
    bar = 
    <>
      <div className="bar-item" style={{height: `${props.num}vh`}}></div>
      <div className="bar-num">{props.num}</div>
    </>
  } else if(props.min && !props.index_i) {
    bar =
    <>
      <div className="bar-item" style={{height: `${props.num}vh`, backgroundColor: 'red'}}></div>
      <div className="bar-num" style={{color: 'red'}}>{props.num}</div>
    </>
  } else if(props.index_i) {
    bar =
    <>
      <div className="bar-item" style={{height: `${props.num}vh`, backgroundColor: 'blue'}}></div>
      <div className="bar-num" style={{color: 'blue'}}>{props.num}</div>
    </>
  }
  return(
    <>
      <div className="container">{bar}</div>
    </>
  );
}

export default Bar;