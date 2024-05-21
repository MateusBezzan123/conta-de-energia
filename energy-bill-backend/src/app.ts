import express from 'express';
import cors from 'cors';
import billRoutes from './routes/billRoutes';

const app = express();
const PORT = 3001;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE']
}


// Configurar CORS
app.use(cors(corsOptions))

app.use(express.json());
app.use('/api', billRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
