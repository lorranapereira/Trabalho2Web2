const express = require('express');
const path = require('path');
const app = express();
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');  
const categoryRoutes = require('./routes/categoryRoutes');  
const productRoutes = require('./routes/productRoutes');  
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandlerMiddleware');
const requestLogger = require('./middleware/requestLoggerMiddleware');
require('dotenv').config(); 

app.use(express.json());

app.use(requestLogger);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/users', userRoutes);
app.use('/restaurants', authMiddleware, restaurantRoutes); 
app.use('/restaurants', authMiddleware, menuRoutes); 
app.use('/restaurants', authMiddleware, categoryRoutes); 
app.use('/restaurants', authMiddleware, productRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
