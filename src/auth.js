const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/user');


// This file sets up both local and JWT strategies for Passport.js. It also includes a function to 
// create JWT tokens for authenticated users.

// Set up local strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Set up JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Create JWT token
function createToken(user) {
  const payload = {
    sub: user._id,
    iat: Date.now()
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

module.exports = {
  passport,
  createToken
};


// Next, add the authentication middleware to your API routes:
const { passport, createToken } = require('./auth');

app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = createToken(req.user);
  res.json({ token });
});

app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});



// The /login route uses the local strategy to authenticate the user's credentials. If the credentials are valid, 
// a JWT token is created and sent back in the response.

// The /profile route uses the JWT strategy to authenticate the user's token. If the token is valid, 
// the authenticated user is sent back in the response.

// Note that you will need to create a User model that defines the schema for your user documents. 
// You can do this using Mongoose or another ORM.