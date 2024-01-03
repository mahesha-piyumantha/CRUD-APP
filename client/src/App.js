import { useEffect, useState } from 'react';
import './App.css';
import './components/FormTable.js';
import axios from "axios"
import FormTable from './components/FormTable.js';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {

  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const [formDataEdit, setFormDataEdit] = useState({
    name: '',
    email: '',
    mobile: '',
    _id: '',
  });
  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target
    setFormData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  };

  const handleEditOnChange = (e) => { 
    const { value, name } = e.target
    setFormDataEdit((preve) => {
      return {
        ...preve,
        [name]: value
      }
    }) 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("/create", formData)  //  sending data to server for URI called /create || http://localhost:8080/create
    console.log(data);

    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchedData();
      setFormData(
        {
          name:'',
          email : '',
          mobile : '',
        }
      );
    }
  }

  const getFetchedData = async () => {
    const data = await axios.get("/")  //  sending data to server for home URI  / || http://localhost:8080/
    console.log(data);
    if (data.data.success) {
      setAddSection(false);
      setDataList(data.data.data);
      console.log(data.data.data);
      //alert(data.data.message);
    }

  }

  useEffect(() => {
    getFetchedData();

  }, []);
  
  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id)  //  sending request to server for delete / || http://localhost:8080/delete+id
    
    if(data.data.success) {
      getFetchedData();
      alert(data.data.message);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit)
    console.log(data);
    alert(data.data.message);
    setEditSection(false);
    getFetchedData(); // updating data
  }

  const handleEdit = async (e) => {

    setFormDataEdit(e);
    setEditSection(true);

  }
  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>

        {
          addSection ? (
            <FormTable
              handleSubmit =  {handleSubmit}
              handleOnChange = {handleOnChange}
              handleClose={ () => setAddSection(false)}
              rest={formData}
            />
          ) : null
        }

        {
          editSection ? (
            <FormTable
              handleSubmit =  {handleUpdate}
              handleOnChange = {handleEditOnChange}
              handleClose={ () => setEditSection(false)}
              rest={formDataEdit}
            />
          ) : null
        }

        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                dataList[0] ? (
                dataList.map((el) => {
                  return (
                    <tr>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>
                        <button className='btn btn-edit' onClick={()=>handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })
                ) : (
                  <p style={{textAlign : 'center'}}>
                    No Data
                  </p>
                )
              }
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
