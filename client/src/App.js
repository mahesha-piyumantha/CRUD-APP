import { useEffect, useState } from 'react';
import './App.css';
import { MdClose } from "react-icons/md";
import axios from "axios"

axios.defaults.baseURL = "http://localhost:8080/"

function App() {

  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [deleteSection, setDeleteSection] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("/create", formData)  //  sending data to server for URI called /create || http://localhost:8080/create
    console.log(data);

    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
    }
  }

  const getFetchedData = async () => {

    const data = await axios.get("/")  //  sending data to server for home URI  / || http://localhost:8080/
    console.log(data);
    if (data.data.success) {
      setAddSection(false);
      setDataList(data.data.data);
      //alert(data.data.message);
    }

  }

  useEffect(() => {
    getFetchedData();

  }, []);

  const handleDelete = async (id) => {
    const data = await axios.get("/delete/" + id)  //  sending request to server for delete / || http://localhost:8080/delete+id
    alert(data.data.message);

  }

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>

        {
          addSection ? (
            <div className="addContainer">
              <form onSubmit={handleSubmit}>
                <div className="close-btn" onClick={() => setAddSection(false)}>
                  <MdClose />
                </div>
                <label htmlFor="name">Name :</label>
                <input type="text" id="name" name="name" onChange={handleOnChange} />

                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" onChange={handleOnChange} />

                <label htmlFor="mobile">Mobile :</label>
                <input type="number" id="mobile" name="mobile" onChange={handleOnChange} />

                <button className="btn">Submit</button>
              </form>
            </div>
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
                dataList.map((el) => {
                  return (
                    <tr>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleDelete(el._id)}>Edit</button>
                        <button className='btn btn-delete'>Delete</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
