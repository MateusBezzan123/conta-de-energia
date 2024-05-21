import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        value={clientNumber}
        onChange={(e) => setClientNumber(e.target.value)}
        placeholder="Client Number"
      />
      <button onClick={handleFilter}>Filter</button>
      <div>
        <h2>Energia (kWh)</h2>
        <Line data={energyData} />
      </div>
      <div>
        <h2>Valores Monetários (R$)</h2>
        <Line data={valueData} />
      </div>
    </div>
  );
}

export default Dashboard;
