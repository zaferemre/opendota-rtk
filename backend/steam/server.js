// server.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
const STEAM_API_KEY = process.env.STEAM_API_KEY;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3001/auth/steam/return",
      realm: "http://localhost:3001/",
      apiKey: STEAM_API_KEY,
    },
    (identifier, profile, done) => {
      profile.identifier = identifier;
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(
      `http://localhost:3000/auth/success?steamid=${req.user.id}&username=${req.user.displayName}`
    );
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.listen(3001, () =>
  console.log("✅ Backend running on http://localhost:3001")
);
