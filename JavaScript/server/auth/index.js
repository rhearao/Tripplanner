const router = require("express").Router();
module.exports = router;
const { User } = require("../db/models");

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      console.log("No such user found:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else if (!user.correctPassword(req.body.password)) {
      console.log("Incorrect password for user:", req.body.email);
      res.status(401).send("Wrong username and/or password");
    } else {
      req.login(user, (err) => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  console.log("hi");
  console.log(req.body.firstName);
  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      googleId: null,
      password: req.body.password,
    });
    req.login(newUser, (err) => (err ? next(err) : res.json(newUser)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else if (err.name === "SequelizeValidationError") {
      res.status(401).send("Please Enter a Valid Email");
    } else {
      next(err);
    }
  }
});

router.get("/me", (req, res) => {
  res.json(req.user);
});

/**
 * Get a user's info based on its email
 */
router.get("/:userEmail", async (req, res, next) => {
  try {
    const userEmail = req.params.userEmail;
    console.log("get user #" + userEmail);
    const user = await User.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      console.log("No such user found:", userEmail);
      res.status(401).send("Wrong username and/or password");
    } else {
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoURLs: user.photoURLs,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.put(
  "/update/:userId",
  // userGateway,
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        res.sendStatus(404);
      } else {
        const updatedUser = await user.update({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        res.send(updatedUser);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.post("/:userId/location", async (req, res, next) => {
  console.log("uodate location in auth");

  try {
    const user = await User.findByPk(req.params.userId);
    const updatedUser = await user.update({
      lng: req.body.longitude,
      lat: req.body.latitude,
    });
    res.send(updatedUser);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else if (err.name === "SequelizeValidationError") {
      res.status(401).send("Please Enter a Valid Email");
    } else {
      next(err);
    }
  }
});

router.use("/photo", require("./photos"));
