import React, {useState} from 'react'
import { Button, Checkbox, Icon, Table, Input } from 'semantic-ui-react'
import logo from './logo.svg';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value + 1);
}

function SorTable(userName, tableData) {

  let tabData = tableData;
  let isCheckedChange = false;

  const forceUpdate = useForceUpdate();

  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState("");
  const [addTodo, setAddTodo] = useState("");
  const [changedToDo, setChangedToDo] = useState("");

  let checkedObject = {};
  
  function dataPatch(standByPatchData, isChanged) {
    axios.patch(`https://62ab9821bd0e5d29af12f141.mockapi.io/api/todo/v1/WorkList/${userName}`, standByPatchData)
    .then(() => {
      if(isChanged){
        toastInfo("Data Updated")
      }else{
        toastInfo("Nothing Changed")
      }
    })
    .catch((err) => {
      toastError("Error Found!");
      console.log(err);
    });
  }

  function dataPost(standByPostData) {
    axios.patch(`https://62ab9821bd0e5d29af12f141.mockapi.io/api/todo/v1/WorkList/${userName}`, standByPostData)
    .then(() => {
      axios.get(`https://62ab9821bd0e5d29af12f141.mockapi.io/api/todo/v1/WorkList/${userName}`)
      .then((res) => {
        tabData = res.data.work;
        toastInfo("Data Has Been Added");
        forceUpdate();
      })
    })
    .catch((err) => {
      toastError("Error Found!");
      console.log(err);
    });
  }

  function dataDelete(standByDeleteData) {
    axios.patch(`https://62ab9821bd0e5d29af12f141.mockapi.io/api/todo/v1/WorkList/${userName}`, standByDeleteData)
    .then(() => {
      axios.get(`https://62ab9821bd0e5d29af12f141.mockapi.io/api/todo/v1/WorkList/${userName}`)
      .then((res) => {
        tabData = res.data.work;
        forceUpdate();
        toastError("Data Successfully Deleted");
      })
    })
    .catch((err) => {
      toastError("Error Found!");
      console.log(err);
    });
  }

  const checkHandler = (workName, data) => {
    let tempArray = [
      {
       "workName": workName,
       "isCompleted": data.checked
      }
    ];

    tabData = tabData.map(obj => tempArray.find(o => o.workName === obj.workName) || obj);
    
    let readiedData = {
      "work": tabData
    }

    checkedObject = readiedData;
    isCheckedChange = true;
  }

  const submitHandler = (workName) => {
    let tempDataHolder = tabData;
    let standByHolder = {};

    tempDataHolder.push({
      "workName": workName,
      isCompleted: false
    });
    
    standByHolder = {
      "work": tempDataHolder
    }

    dataPost(standByHolder);
  }
  
  const changeHandler = (workName, index) => {
    let isChanged = false;

    if(workName.length > 0) {
      isChanged = true;
      tabData.find(v => v.workName === tabData[index].workName).workName = workName;
    }else{
      isChanged = false;
    }
    
    let readiedData = {
      "work": tabData
    };

    dataPatch(readiedData, isChanged);
    forceUpdate();
  }

  const deleteHandler = (index) => {
    let tempDataHolder = tabData;

    let vux = tempDataHolder.indexOf(tabData[index]);
    if (vux > -1) {
      tempDataHolder.splice(vux, 1);
    }

    let readiedData = {
      "work": tempDataHolder
    }

    dataDelete(readiedData);
  }

  const fireSwall = (index) => {
    Swal.fire({
      title: 'This Data Will Be Permanently Lost!',
      text: 'Do you want to continue?',
      icon: 'error',
      confirmButtonText: 'Yes',
      confirmButtonColor: 'Red',
      denyButtonColor: "Grey",
      denyButtonText: 'No',
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHandler(index);
      }
    })
  }

  let tableCell = () => {
    if(tabData.length===0){
      return (
        <Table.Row>
          <Table.Cell colSpan='3'>
          <h4>It is Quiet for Now..</h4>
          </Table.Cell>
        </Table.Row>
      )
    }else{
      return tabData.map(({ workName }, index) => (
        <Table.Row id="Cell-row" key={workName}>
          <Table.Cell>
            {
              active===true+index?
              <input placeholder={workName} onChange={(e) => {setChangedToDo(e.target.value)}}></input>:
              workName
            }
          </Table.Cell>
          <Table.Cell>
            <Checkbox type="checkbox" disabled={disabled} defaultChecked={workName===tabData[index].workName&&tabData[index].isCompleted?true:false} onChange={(e,d) => {checkHandler(workName, d)}} />
          </Table.Cell>
          <Table.Cell>
            {
              active===true+index?
              <Button
                icon
                labelPosition='left'
                color='green'
                size='small'
                onClick={() => {changeHandler(changedToDo, index);setActive(false);setDisabled(false);}}
              >
                <Icon name='check' /> Finished
              </Button>
              :
              <Button
                icon
                labelPosition='left'
                color='blue'
                size='small'
                onClick={() => {setActive(true+index);setDisabled(true);}}
              >
                <Icon name='wrench' /> Edit
              </Button>
            }
            &nbsp;
              <Button
                icon
                labelPosition='left'
                color='red'
                size='small'
                onClick={() => {fireSwall(index)}}
                disabled={disabled}
              >
                <Icon name='delete' /> Delete
              </Button>
          </Table.Cell>
        </Table.Row>
      ))
    }
  }

  return (
    <>
      <ToastContainer />
      <Table selectable={true} basic="very" inverted fixed compact textAlign='center'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Work List
            </Table.HeaderCell>
            <Table.HeaderCell
              width={3}
            >
              Status
            </Table.HeaderCell>
            <Table.HeaderCell
              width={5}
            >
              Options
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableCell()}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              <img src={logo} className="App-logo-table" alt="logo"/>
              <p className="Reactive-todo">Reactive To-Do by <span className="Owner">Faith</span></p>
              <Button
                icon
                labelPosition='left'
                color='green'
                size='small'
                disabled={disabled}
                onClick={() => {dataPatch(checkedObject, isCheckedChange)}}
              >
                <Icon name='refresh' /> Apply Checks
              </Button>
              <span style={{float: "right", marginRight: "1em"}}>
                <Input onChange={(e) => {setAddTodo(e.target.value)}} disabled={disabled} action={{
                  content: 'Add',
                  color: "teal",
                  labelPosition: "left",
                  icon: "plus",
                  disabled: disabled,
                  onClick: () => {submitHandler(addTodo)}}} placeholder='Add To-Do...' style={{width: '20em', height: '1.4em'}} />
              </span>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  )

}

export default SorTable;