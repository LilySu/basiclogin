require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Local authentication strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return done(null, { id: 1, username: username });
    }
    return done(null, false, { message: 'Incorrect username or password.' });
  }
));

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/redirect`
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would typically look up or create a user in your database
    return done(null, { id: profile.id, username: profile.displayName });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Here you would typically fetch the user from the database
  done(null, { id: id, username: 'user' });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, redirect: '/dashboard' });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome to the dashboard, ${req.user.username}!`);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});