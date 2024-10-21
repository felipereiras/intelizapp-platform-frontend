// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://seu-app-backend.herokuapp.com';

function App() {
  const [qr, setQr] = useState('');
  const [message, setMessage] = useState('');
  const [number, setNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', tags: '' });
  const [newCampaign, setNewCampaign] = useState({ name: '', message: '', tags: '' });

  useEffect(() => {
    fetchQR();
    fetchContacts();
    fetchCampaigns();
  }, []);

  const fetchQR = async () => {
    const response = await axios.get(`${API_URL}/qr`);
    setQr(response.data);
  };

  const fetchContacts = async () => {
    const response = await axios.get(`${API_URL}/contacts`);
    setContacts(response.data);
  };

  const fetchCampaigns = async () => {
    const response = await axios.get(`${API_URL}/campaigns`);
    setCampaigns(response.data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/send-message`, { number, message });
    setMessage('');
    setNumber('');
  };

  const addContact = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/contacts`, newContact);
    setNewContact({ name: '', phone: '', tags: '' });
    fetchContacts();
  };

  const addCampaign = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/campaigns`, newCampaign);
    setNewCampaign({ name: '', message: '', tags: '' });
    fetchCampaigns();
  };

  const executeCampaign = async (campaignId) => {
    await axios.post(`${API_URL}/execute-campaign`, { campaignId });
    fetchCampaigns();
  };

  return (
    <div className="App">
      <h1>WhatsApp Management Platform</h1>
      
      <div dangerouslySetInnerHTML={{ __html: qr }} />
      
      <h2>Send Message</h2>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone number"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <button type="submit">Send Message</button>
      </form>

      <h2>Add Contact</h2>
      <form onSubmit={addContact}>
        <input
          type="text"
          value={newContact.name}
          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          placeholder="Name"
        />
        <input
          type="text"
          value={newContact.phone}
          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
          placeholder="Phone"
        />
        <input
          type="text"
          value={newContact.tags}
          onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
          placeholder="Tags (comma separated)"
        />
        <button type="submit">Add Contact</button>
      </form>

      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id}>{contact.name} - {contact.phone} - Tags: {contact.tags.join(', ')}</li>
        ))}
      </ul>

      <h2>Add Campaign</h2>
      <form onSubmit={addCampaign}>
        <input
          type="text"
          value={newCampaign.name}
          onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
          placeholder="Campaign Name"
        />
        <input
          type="text"
          value={newCampaign.message}
          onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
          placeholder="Message"
        />
        <input
          type="text"
          value={newCampaign.tags}
          onChange={(e) => setNewCampaign({...newCampaign, tags: e.target.value})}
          placeholder="Tags (comma separated)"
        />
        <button type="submit">Add Campaign</button>
      </form>

      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            {campaign.name} - Tags: {campaign.tags.join(', ')} - Status: {campaign.status}
            <button onClick={() => executeCampaign(campaign._id)}>Execute Campaign</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
