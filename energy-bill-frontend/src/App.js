import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [clientNumber, setClientNumber] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/invoices');
      setInvoices(response.data);
    }
    fetchData();
  }, []);

  const handleFilter = async () => {
    const response = await axios.get(`/invoices/${clientNumber}`);
    setInvoices(response.data);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        value={clientNumber}
        onChange={(e) => setClientNumber(e.target.value)}
        placeholder="Client Number"
      />
      <button onClick={handleFilter}>Filter</button>
      <Dashboard invoices={invoices} />
    </div>
  );
}

export default App;
