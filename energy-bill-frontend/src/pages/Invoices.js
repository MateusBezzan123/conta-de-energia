import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background: ${({ theme }) => theme.colors.lightText};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FilterInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  width: 200px;
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FilterButton = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.lightText};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const InvoiceList = styled.div`
  margin-top: 20px;
`;

const InvoiceItem = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DownloadButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.lightText};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

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

  const handleDownload = async (id) => {
    const downloadUrl = `http://localhost:3001/api/bills/${id}/download`;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <Container>
      <h1>Library of Invoices</h1>
      <div>
        <FilterInput
          type="text"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          placeholder="Client Number"
        />
        <FilterButton onClick={handleFilter}>Filter</FilterButton>
      </div>
      <InvoiceList>
        {filteredInvoices.map((invoice) => (
          <InvoiceItem key={invoice.id}>
            <p>Client Number: {invoice.clientNumber}</p>
            <p>Reference Month: {invoice.referenceMonth}</p>
            <DownloadButton onClick={() => handleDownload(invoice.id)}>Download Invoice</DownloadButton>
          </InvoiceItem>
        ))}
      </InvoiceList>
    </Container>
  );
}

export default Invoices;
