import React, { useEffect, useState } from 'react';
import API from './api';
import './App.css';

const apiConstantInitialStatus = {
    initial: "initial",
    success: "success",
    inprogress: 'inprogress',
    failure: 'failure'
}

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiConstantInitialStatus.initial)
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const getContacts = () => {
    setApiStatus(apiConstantInitialStatus.inprogress);
    API.get("/api/contacts")
    .then(response => {
      setContacts(response.data.data);
      setApiStatus(apiConstantInitialStatus.success)
    })
    .catch(error => {
      console.log(error);
      setApiStatus(apiConstantInitialStatus.failure)
      alert("Unable to Fetch Contacts")
    });
  }

  useEffect(getContacts,[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value
    });
  }

  const handelphone = (e) => {
    if(e.target.value.length <= 10){
      setContact({...contact, phone: e.target.value})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/api/contacts", contact)
    .then(() => {
      setContact({
        name: "",
        email: "",
        phone: ""
      });
      getContacts();
    })
    .catch(error => {
      alert(error.response.data.error_message);
    });
  }

  const handleDelete = (id) => {
    API.delete(`/api/contacts/${id}`)
    .then(response => {
      alert(response.data.message);
      getContacts();
    })
    .catch(error => {
      console.log(error)
      alert('Unable to Delete Contact')
    })
  }

  return (
    <div className="bg-container">
      <h1>Contacts</h1>
      <form  onSubmit={handleSubmit}>
        <h4>Add New Contact</h4>

        <div>
          <label htmlFor="name">Name: </label>
          <input id="name" type="text"  name="name" required onChange={handleChange} value={contact.name}/>
        </div>

        <div>
          <label htmlFor="email">Email: </label>
          <input id="email" type="email"  name="email" onChange={handleChange} value={contact.email}/>
        </div>

        <div>
          <label htmlFor="phone">Phone: </label>
          <input id="phone" type="text" name="phone" required onChange={handelphone} value={contact.phone}/>
        </div>
        <br/>
        <button type="submit">Submit</button>
      </form>
        {apiStatus === apiConstantInitialStatus.success && 
          <ul>
            {
              contacts.map(each => (
                <li key={each.id}>
                  <div>
                    Name: {each.name}<br/>
                    Email: {each.email}<br/>
                    Phone Number: {each.phone}
                  </div>
                  <button type='button' onClick={() => handleDelete(each.id)}>Delete</button>
                </li>
              ))
            }
          </ul>
        }
    </div>
  );
}

export default App;
