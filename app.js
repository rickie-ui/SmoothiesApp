const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const { requireAuth, checkUser } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
//middlesware
app.use(helmet());
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');


mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

//error handler middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
