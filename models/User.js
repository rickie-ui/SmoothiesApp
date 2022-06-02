const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter username'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Minimum password length is 6 charactors'],
  },
});

// //fire a function after user has been saved to db
// userSchema.post('save', function (user, next) {
//   console.log('New user has been saved', user);
//   next();
// });

//fire a function before user has been saved to db
// userSchema.pre('save', function (next) {
//   console.log('New user about to be created and  saved', this);
//   next();
// });

//hash password before its saved
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Invalid email or password');
  }
  throw Error('Invalid email or password');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
