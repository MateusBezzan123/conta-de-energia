import express from 'express';
import billRoutes from './routes/billRoutes';

const app = express();
const PORT = 3000;

app.use('/api', billRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
