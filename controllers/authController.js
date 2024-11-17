const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/schema');
const mongoose = require('mongoose');
const { app } = require('express');



const secret = 'secretkey';


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/logindetails')
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
};

const signup = async (req, res) => {
  const { fname, lname, email, userid, password } = req.body;
  const hashedPw = await bcrypt.hash(password, 10);
  let role = email.split('@')[1] === 'admin.com' ? 'admin' : 'guest';
  const user = new User({ fname, lname, email, userid, password: hashedPw, role })


  try {
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.json({ msg: 'Error creating account', error });
  }
};

const login = async (req, res) => {
  const { id, pass } = req.body;
  try {
    const user = await User.findOne({ userid: id });
    if (!user) {
      return res.send('<h1>User not found</h1>');
    }

    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const token = jwt.sign({ userid: user.userid, fname: user.fname, lname: user.lname, role: user.role }, secret);
      res.cookie('token', token);
      if (user.role === 'guest') { res.redirect('/home'); }
      else { res.redirect('/adminhome') }
    } else {
      res.send('<h1>Wrong password</h1>');
    }
  } catch (error) {
    res.send(error);
  }
};

const home = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const verify = jwt.verify(token, secret);
    res.send(`<h1>Welcome ${verify.fname} ${verify.lname}!</h1>`);
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const adminhome = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const verify = jwt.verify(token, secret);
    if (verify.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied' });
    }
    res.sendFile('admin.html', { root: './templates' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


const disp = async (req, res) => {

  const result = await User.find({});
  res.json(result);
}


const deletefunc = async (req, res) => {
  const userId = req.params.userid;
  try {
    const deletedUser = await User.findOneAndDelete({ userid: userId });
    if (deletedUser) {
      res.status(200).json({ message: `${userId} User deleted successfully` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while deleting user', error });
  }
};

const updatefunc = async (req, res) => {
  console.log(req.body);
  const ID = req.params.userid;
  const { attribute, newValue } = req.body;
  
  try {
    const user = await User.findOne({ userid: ID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!attribute || !newValue) {
      return res.status(400).json({ message: 'Both attribute and new value are required' });
    }

    const validAttributes = ['fname', 'lname', 'email'];
    if (!validAttributes.includes(attribute)) {
      return res.status(400).json({ message: 'Invalid attribute' });
    }


    if (attribute === 'email') {
      const emailParts = newValue.split('@');
      if (emailParts.length !== 2 || !emailParts[1].includes('.')) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }
    }


    user[attribute] = newValue;
    await user.save();
    return res.status(200).json({ message: `${attribute} updated successfully` });

  } catch (error) {
    console.error('Error updating user attribute:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = { connectDB, signup, login, home, adminhome, disp, deletefunc, updatefunc };
