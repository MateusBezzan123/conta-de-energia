import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [clientNumber, setClientNumber] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3001/api/bills');
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (clientNumber) {
      setFilteredInvoices(invoices.filter(invoice => invoice.clientNumber === clientNumber));
    } else {
      setFilteredInvoices(invoices);
    }
  }, [clientNumber, invoices]);

  const handleFilter = () => {
    if (clientNumber) {
      const filtered = invoices.filter(invoice => invoice.clientNumber === clientNumber);
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  return (
    <div>
      <h1>Library of Invoices</h1>
      <input
        type="text"
        value={clientNumber}
        onChange={(e) => setClientNumber(e.target.value)}
        placeholder="Client Number"
      />
      <button onClick={handleFilter}>Filter</button>
      <div>
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id}>
            <p>Client Number: {invoice.clientNumber}</p>
            <p>Reference Month: {invoice.referenceMonth}</p>
            <a href={`/api/bills/${invoice.id}/download`}>Download Invoice</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Invoices;
