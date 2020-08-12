/**
 * Module dependencies.
 */
const express = require('express');
const dotenv = require('dotenv');
const lusca = require('lusca');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const { check } = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const sassMiddleware = require('node-sass-middleware');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers
 */
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const cartController = require('./controllers/cartController');
const productController = require('./controllers/productController');

/**
 * Middlewares
 */

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.on('error', (error) => {
  console.error(error);
  console.log('MongoDB connection error.');
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
  })
);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB,
      autoReconnect: true,
    }),
  })
);
app.use(flash());

app.use(
  '/',
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 })
);

/**
 * Main app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post(
  '/login',
  [
    check('email', 'The email in not valid').isEmail(),
    check('password', 'The password is obligatory').notEmpty(),
  ],
  userController.postLogin
);
// app.get('/logout', userController.logout);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post(
  '/signup',
  [
    check('name', 'The name must have a value').notEmpty(),
    check('lastname', 'The lastname must have a value').notEmpty(),
    check('email', 'The email in not valid').isEmail(),
    check('password', 'The password is obligatory').notEmpty(),
    check('repassword')
      .notEmpty()
      .withMessage('The password confirmation is obligatory')
      .custom(async (repassword, { req }) => {
        const { password } = req.body;
        if (password !== repassword) {
          throw new Error('Passwords must be same');
        }
      }),
    check('privacy')
      .notEmpty()
      .withMessage('You must accept our terms and conditions'),
  ],
  userController.postSignup
);
// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);
// app.get('/account/verify', passportConfig.isAuthenticated, userController.getVerifyEmail);
// app.get('/account/verify/:token', passportConfig.isAuthenticated, userController.getVerifyEmailToken);
// app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
// app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/cart', cartController.getCart);
app.get('/products/all', productController.getAllProducts);
app.get('/products/:id', productController.getProductDetail);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d', app.get('port'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
