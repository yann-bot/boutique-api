import express from 'express'
import userRoutes from './modules/users';
import authRoutes from './modules/auth';
import shopRoutes  from './modules/shop';
import { errorHandler } from './lib/errorHandler';

const app = express();
app.use(express.json())


app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/shop', shopRoutes )

app.use(errorHandler)
export default app;