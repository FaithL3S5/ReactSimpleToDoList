import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import SorTable from './SorTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "react-simple-tooltip";
import { Button, Icon, Input } from 'semantic-ui-react'

function App() {

  const [userName, setUserName] = useState("");
  const [currentShow, setCurrentShow] = useState(0);
  const [clicked, isClicked] = useState(0);
  const [tableData, setTableData] = useState([]);

  const toastError = (msg) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false
    });
  }

  const toastInfo = (msg) => {
    toast.info(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false
    });
  }

  const clickHandlerCreate = () => {
    axios.post(`/api/todo/v1/WorkList`, {
      "work": [
      ]
    })
    .then(() => {
      toastInfo("UUID Created!");
      axios.get(`/api/todo/v1/WorkList`)
      .then((res) => {
        setUserName(res.data.length);
        let uId = res.data.length
        axios.get(`/api/todo/v1/WorkList/${uId}`)
        .then((res) => {
          clicked===1?isClicked(0):isClicked(1);
          setTableData(res.data.work);
          setCurrentShow(1);
        })
      })
    })
    .catch((err) => {
      toastError("Error Found!");
      console.log(err);
    });
  }

  const clickHandlerFind = () => {
    if(parseInt(userName) !== parseInt(userName, 10) || userName === "") {
      toastError("Please Input Your UID Correctly");
    }else{
      axios.get(`/api/todo/v1/WorkList/${userName}`)
      .then((res) => {
        clicked===1?isClicked(0):isClicked(1);
        setTableData(res.data.work);
        setCurrentShow(1);
      })
      .catch((err) => {
        toastError("We Cannot Find Your UUID!");
        console.log(err);
      });
    }
  };

  let workList = (
    <div className="App">
      <header className="App-header">
        <Tooltip content="Click to Reload Page" placement="bottom" fontSize="0.5em">
          <img src={logo} className="App-logo" alt="logo" onClick={() => {window.location.reload()}} />
        </Tooltip>
        <h3>To-Do List Simple App</h3>
        <p>Your UUID: <strong>{userName}</strong></p>
        <p className="Remember-note"><small>Always Remember Your UUID!</small>
          <br/>
          <span className="Reminder-note">Don't Forget to Click <strong>Apply Checks</strong> when You Finished Changing Status</span>
        </p>
        <div className="Table-container">{SorTable(userName, tableData)}</div>
      </header>
    </div>
  )

  let startUp = (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <Tooltip content="Click to Reload Page" placement="bottom" fontSize="0.5em">
          <img src={logo} className="App-logo" alt="logo" onClick={() => {window.location.reload()}} />
        </Tooltip>
        <h2>To-Do List Simple App<br/><span style={{fontSize: 'medium'}}>Login with Your UUID Below</span></h2>
        <Input onChange={(e) => {setUserName(e.target.value)}} disabled={false} action={{
          content: 'Find Me',
          color: "blue",
          labelPosition: "left",
          icon: "search",
          onClick: () => clickHandlerFind()}} placeholder='Your UUID Here...' style={{marginRight: '3.6em', width: '15em', height: '1.4em'}} 
        />
        <h3 style={{marginTop: '2.5em'}}>Don't Have UUID?<br/><span style={{fontSize: 'small'}}>Generate One Below!</span></h3>
        <Button
          icon
          labelPosition='left'
          color='violet'
          size='small'
          onClick={() => clickHandlerCreate()}
        >
          <Icon name='refresh' /> Generate UUID
        </Button>
        <h3 style={{color: 'red', fontSize: 'medium'}}>
            Please Remember to Save Your UUID<br/>There is No Way to Recover It!
        </h3>
      </header>
    </div>
  );

  return currentShow===0?startUp:workList;
}

export default App;