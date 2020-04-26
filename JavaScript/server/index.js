require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
var cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
// const gis = require("./gis");
const sessionStore = new SequelizeStore({ db });
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const User = require("./db/models/user");
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "my best friend is Cody",
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
});
// require("./socket")(server, sessionMiddleware);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const [[user]] = await db.query(
      `
      SELECT
          id, "firstName", "lastName", email, "photoURLs"
      FROM users
      WHERE id = ?
    `,
      { replacements: [id] }
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionMiddleware);

app.use((req, res, next) => {
  if (!req.session.user) req.session.user = {};
  console.log("req.session: ", req.session);
  next(); // needed to continue through express middleware
});

app.use(passport.initialize());
app.use(passport.session());

console.log(passport.session());

app.use("/auth", require("./auth"));
app.use("/home", require("./home"));
app.use("/group", require("./group"));

app.use(express.static(path.join(__dirname, "..", "build")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build/index.html"));
  });
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "INTERNAL SERVER ERROR");
  });
}

db.sync()
  // .then(async () => {
  //   await gis(db);
  // })
  .then(function () {
    return sessionStore.sync();
  })
  .then(function () {
    server.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });
  });
