import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({
      ...contact,
      [name]: value
    });
  }

  const handelMobile = (e) => {
    if(e.target.value.length <= 10){
      setContact({...contact, mobile: e.target.value})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contact)
    setContact({
    name: "",
    email: "",
    mobile: ""
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
          <label htmlFor="mobile">Mobile: </label>
          <input id="mobile" type="text" name="mobile" required onChange={handelMobile} value={contact.mobile}/>
        </div>
        <br/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
