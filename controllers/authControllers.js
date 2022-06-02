const User = require('../models/User');
const jwt = require('jsonwebtoken');

//handleErrors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: '', email: '', password: '' };

  //incorrect email or password
  if (err.message === 'Invalid email or password') {
    errors.email = 'Invalid email or password';
    errors.password = 'Invalid email or password';
    return errors;
  }
  if (err.code === 11000) {
    //duplicate error code
    errors.username = 'Username already exists';
    errors.email = 'Email already exists';
    return errors;
  }

  //validation errors

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//create tokens
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'rickie smoothie secret', {
    expiresIn: maxAge,
  });
};
const signup_get = (req, res) => {
  res.render('signup');
};
const login_get = (req, res) => {
  res.render('login');
};
const signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
};
