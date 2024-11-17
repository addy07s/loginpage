const express = require('express');
const { signup, login, home,adminhome,disp,deletefunc,updatefunc } = require('../controllers/authController');
const router = express.Router();

router.get('/signup', (req, res) => res.sendFile('signup.html', { root: './templates' }));
router.post('/signup', signup);
router.get('/', (req, res) => res.sendFile('login.html', { root: './templates' }));
router.post('/', login);
router.get('/home', home);
router.get('/adminhome', adminhome);
router.get('/dispdata', disp);
router.delete('/deletedata/:userid', deletefunc);
router.patch('/updateAttribute/:userid', updatefunc);


module.exports = router;
