const express = require('express');
const billRoutes = require('./routes/billRoutes');

const app = express();
const PORT = 3000;

app.use('/api', billRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
