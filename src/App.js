import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Bar from './components/Bar.tsx'

function App() {
  const [arr, setArr] = useState({num: [], selected: []});
  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:18080/ws");
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if(!ws.current) return;

    ws.current.onmessage = (e) => {
      if(isPaused) return;
      const message = JSON.parse(e.data);
      console.log("res: ", message);
      setArr(message);
    }
  }, [isPaused]);

  return (
    <div className="App">
      <header className="App-header">
        <div className='bar-container'>
          {arr.num.map(function(num,iter) {
            return <Bar num={num} selected={arr.selected[iter]} key={iter} />
          })}
        </div>
        <div>
          <button onClick={() => setPause(!isPaused)}>{isPaused ? "Resume" : "Pause"}</button>
        </div>
        <div>
          <>Array=</>
          <input type="text" id='num-input' placeholder='ex: 5,4,3,2,1'></input>
          <button onClick={() => {
            // Gets the text from frontend
            let text = document.querySelector('#num-input').value;

            // Splits the text into an array
            let numArr = text.split(",").map(Number);

            // Uses the length of the number array and fills every cell with false
            let selectedArr = new Array(numArr.length).fill(false);

            setArr({num: numArr, selected: selectedArr});
          }}>Submit</button>
          <button onClick={() => {
            // let cmd = JSON.stringify("cmd")
            // let msg = JSON.stringify(numArr);
            // ws.current.send([cmd,msg]);
            let msg = JSON.stringify(arr);
            ws.current.send(msg);
          }}>Run</button>
        </div>
      </header>
    </div>
  );
}

export default App;
