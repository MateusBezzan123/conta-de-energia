# Sistema de Gerenciamento de Faturas de Energia

Este projeto é um aplicativo full-stack projetado para gerenciar faturas de energia para clientes. O sistema permite que os usuários façam upload de arquivos PDF contendo dados de faturas de energia, que são extraídos e armazenados em um banco de dados PostgreSQL. Os usuários podem visualizar, filtrar e baixar faturas de energia através de uma interface web. O sistema também fornece recursos de visualização de dados para acompanhar o consumo de energia e os custos ao longo do tempo.




## Stack utilizada

**Front-end:** React, React Router, Styled-Components, Chart.js, Axios

**Back-end:** Node.js, Express.js, Prisma, PostgreSQL, Formidable, PDF-Parse, uuid, Nodemon, Jest e TypeScript




## Estrutura do Projeto


## Backend
**datasource db:**  Configuração do Prisma para conectar ao banco de dados PostgreSQL.

**model Bill:**  Modelo Prisma representando a estrutura dos dados da fatura de energia.

**app.ts:**  Ponto de entrada da aplicação Express, configura middleware e rotas.
**routes/billRoutes.ts:**  Define os endpoints da API para gerenciamento de faturas de energia.

**services/billService.ts:**  Lida com a lógica de negócios relacionada às faturas de energia, como uploads de arquivos e extração de dados.

**models/billModel.ts:**  Extrai dados de arquivos PDF e prepara-os para armazenamento.

**controllers/billController.ts:**  Gerencia o fluxo de dados entre a camada de serviço e as requisições dos clientes.

## Frontend
**src/App.js:**  Ponto de entrada da aplicação React, configura roteamento e temas.

**src/components/Navbar.js:**  Componente da barra de navegação.

**src/pages/Invoices.js:**  Página para exibir e filtrar faturas.

**src/components/Dashboard.js:**  Dashboard para visualizar o consumo de energia e custos.

**src/theme.js:**  Define o tema para styled-components.

**src/GlobalStyle.js:**  Estilos globais para a aplicação.

## Instalação

Instale energy-bill com npm

## BackEnd

```bash
  cd energy-bill-backend
  npm install
  npx prisma generate
  npx prisma migrate dev
  npm run dev
```

## Front

```bash
  cd energy-bill-frontend
  npm install
  npm start
```

## Testes 

```bash
  cd energy-bill-backend
  npm test
```
    
