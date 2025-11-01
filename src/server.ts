import express from 'express'
import homeRoutes from './modules/home/home.rest';
import userRoutes from './modules/users';
import authRoutes from './modules/auth';
import shopRoutes  from './modules/shop';

const app = express();
app.use(express.json())

app.use('/home', homeRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/shops', shopRoutes )

export default app;