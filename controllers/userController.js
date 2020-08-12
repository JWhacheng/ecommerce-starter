const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('account/login', {
    title: 'Login',
  });
};

exports.postLogin = (req, res) => {
  const errors = validationResult(req);
  const validationsErrors = [];
  errors.array().map((error) => {
    validationsErrors.push({
      msg: error.msg,
    });
  });

  if (!errors.isEmpty()) {
    req.flash('errors', validationsErrors);
    return res.redirect('back');
  }
};

exports.getSignup = (req, res) => {
  res.render('account/signup', {
    title: 'Signup',
  });
};

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  const validationsErrors = [];
  errors.array().map((error) => {
    validationsErrors.push({
      msg: error.msg,
    });
  });

  if (!errors.isEmpty()) {
    req.flash('errors', validationsErrors);
    return res.redirect('back');
  }

  const { name, lastname, email, password, birthdate, privacy } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      req.flash('errors', { msg: 'Account already exists.' });
      return res.redirect('/signup');
    }

    user = new User({
      email,
      password,
      'profile.name': name,
      'profile.lastname': lastname,
      'profile.birthdate': birthdate,
      'profile.privacy': privacy === 'on' ? true : false,
    });
    await user.save();
    req.flash('success', { msg: 'Signup successful' });
    return res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
};
