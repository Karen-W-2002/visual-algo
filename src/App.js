import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Bar from './components/Bar.tsx'

function App() {
  const [arr, setArr] = useState({num: [], index_i: [], index_j: [], min: [], finished: false});
  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);
  let fifo = useRef(null);

  // Immutable queue for recieving messages
  // Return array
  function push(arr, newEntry) {
    return [...arr, newEntry];
  }
  // Return array
  function pop(arr) {
    return arr.slice(1);
  }

  // Timer function in milliseconds (1s = 1000ms)
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  async function animateSorting() {
    // While the queue is not empty
    while(fifo.current.length > 0) {
      setArr(fifo.current[0]);
      fifo.current = pop(fifo.current);
      await timeout(100);
    }
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:18080/ws");
    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket closed");

    const wsCurrent = ws.current;

    // Initialize FIFO queue
    fifo.current = [];

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if(!ws.current) return;

    ws.current.onmessage = (e) => {
      // Return if websocket is paused
      if(isPaused) return;

      // Parse the message into readable data
      const message = JSON.parse(e.data);

      // Check if the operation is finished
      // If not finished, push the message into a queue
      if(!message.finished)
      {
        // console.log("res: ", message);
        fifo.current = push(fifo.current, message);
        // console.log(fifo.current.length)
        // setArr(message);
      }
      // Else if it is finished, start frontend operation
      else
      {
        console.log(fifo.current);
        animateSorting();
      }

    }
  }, [isPaused]);


  return (
    <div className="App">
      <header className="App-header">
        <div className='bar-container'>
          {arr.num.map(function(num,iter) {
            return <Bar num={num} index_i={arr.index_i[iter]} index_j={arr.index_j[iter]} min={arr.min[iter]} key={iter} />
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
            let indexIArr = new Array(numArr.length).fill(false);
            let indexJArr = new Array(numArr.length).fill(false);
            let minArr = new Array(numArr.length).fill(false);

            setArr({num: numArr, index_i: indexIArr, index_j: indexJArr, min: minArr, finished: false});
          }}>Submit</button>
          <button onClick={() => {
            // Clear the queue for new incoming messages
            fifo.current = [];

            // Message to be sent thru the websocket to the server
            let msg = JSON.stringify(arr);
            ws.current.send(msg);
          }}>Run</button>
          <button onClick={() => {
            console.log(fifo)
          }}>Check queue</button>
        </div>
      </header>
    </div>
  );
}

export default App;
