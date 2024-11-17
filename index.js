const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { connectDB } = require('./controllers/authController');
const app = express();

connectDB(); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
