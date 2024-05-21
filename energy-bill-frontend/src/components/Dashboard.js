import React from 'react';

function Dashboard({ invoices }) {
  return (
    <div>
      {invoices.map((invoice) => (
        <div key={invoice.id}>
          <p>Client Number: {invoice.clientNumber}</p>
          <p>Reference Month: {invoice.referenceMonth}</p>
          <p>Energy Electric Quantity: {invoice.energyElectricQuantity} kWh</p>
          <p>Energy Electric Value: R$ {invoice.energyElectricValue}</p>
          <p>Energy SCEEE Quantity: {invoice.energySCEEEQuantity} kWh</p>
          <p>Energy SCEEE Value: R$ {invoice.energySCEEEValue}</p>
          <p>Energy Compensated Quantity: {invoice.energyCompensatedQuantity} kWh</p>
          <p>Energy Compensated Value: R$ {invoice.energyCompensatedValue}</p>
          <p>Public Lighting Contribution: R$ {invoice.publicLightingContribution}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;