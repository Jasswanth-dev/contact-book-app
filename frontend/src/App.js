import React, { useEffect, useState } from 'react';
import API from './api';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const getContacts = () => {
    API.get("/contacts")
    .then(response => setContacts(response.data.data))
    .catch(error => {
      console.log(error);
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
    API.post("/contacts", contact)
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
    API.delete(`/contacts/${id}`)
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
      {contacts.length === 0 ? <p>No Contacts Available</p> : (
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
      )}
    </div>
  );
}

export default App;
