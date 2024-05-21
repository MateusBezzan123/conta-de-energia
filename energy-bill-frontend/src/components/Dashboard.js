import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styled from 'styled-components';

Chart.register(...registerables);

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

const ChartContainer = styled.div`
  margin-top: 20px;
`;

function Dashboard() {
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

  const energyData = {
    labels: filteredInvoices.map(invoice => invoice.referenceMonth),
    datasets: [
      {
        label: 'Consumo de Energia Elétrica KWh',
        data: filteredInvoices.map(invoice => invoice.energyElectricQuantity + (invoice.energySCEEEQuantity || 0)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Energia Compensada kWh',
        data: filteredInvoices.map(invoice => invoice.energyCompensatedQuantity || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const valueData = {
    labels: filteredInvoices.map(invoice => invoice.referenceMonth),
    datasets: [
      {
        label: 'Valor Total sem GD R$',
        data: filteredInvoices.map(invoice =>
          (invoice.energyElectricValue || 0) +
          (invoice.energySCEEEValue || 0) +
          (invoice.publicLightingContribution || 0)
        ),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
      },
      {
        label: 'Economia GD R$',
        data: filteredInvoices.map(invoice => invoice.energyCompensatedValue || 0),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Container>
      <h1>Dashboard</h1>
      <div>
        <FilterInput
          type="text"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          placeholder="Client Number"
        />
        <FilterButton onClick={handleFilter}>Filter</FilterButton>
      </div>
      <ChartContainer>
        <h2>Energia (kWh)</h2>
        <Line data={energyData} />
      </ChartContainer>
      <ChartContainer>
        <h2>Valores Monetários (R$)</h2>
        <Line data={valueData} />
      </ChartContainer>
    </Container>
  );
}

export default Dashboard;
