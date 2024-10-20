import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styled from 'styled-components';

Chart.register(...registerables);

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 40px auto;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s forwards ease-out;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 30px;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const FilterInput = styled.input`
  padding: 12px;
  margin-right: 10px;
  width: 250px;
  max-width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
    width: 100%;
  }
`;

const FilterButton = styled.button`
  padding: 12px 25px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.lightText};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ChartContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.lightBackground};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: slideIn 0.8s forwards ease-out;

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 20px;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
    from {
      opacity: 0;
      transform: translateY(50px);
    }
  }
`;

const ChartTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Dashboard = () => {
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
        tension: 0.4,
      },
      {
        label: 'Energia Compensada kWh',
        data: filteredInvoices.map(invoice => invoice.energyCompensatedQuantity || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
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
        tension: 0.4,
      },
      {
        label: 'Economia GD R$',
        data: filteredInvoices.map(invoice => invoice.energyCompensatedValue || 0),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <Container>
      <Title>Dashboard de Consumo de Energia</Title>
      <FilterSection>
        <FilterInput
          type="text"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          placeholder="Número do Cliente"
        />
        <FilterButton onClick={handleFilter}>Filtrar</FilterButton>
      </FilterSection>
      <ChartContainer>
        <ChartTitle>Energia (kWh)</ChartTitle>
        <Line data={energyData} options={{ animation: { duration: 1000 } }} />
      </ChartContainer>
      <ChartContainer>
        <ChartTitle>Valores Monetários (R$)</ChartTitle>
        <Line data={valueData} options={{ animation: { duration: 1000 } }} />
      </ChartContainer>
    </Container>
  );
}

export default Dashboard;
