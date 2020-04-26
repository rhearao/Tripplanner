const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { User } = require("../db/models");
module.exports = router;

const storage = multer.memoryStorage();
const upload = multer({ storage });
global.fetch = require("node-fetch");

const storeCloud = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.unsigned_upload(
      { tags: "profile", folder: process.env.CLOUD_FOLDER },
      (err, image) => {
        if (err) {
          reject(err);
        }
        resolve(image);
      }
    );
  });
};
// const cloudRegex = /cloudinary/;
const deleteCloud = (path) => {
  if (!cloudRegex.test(path)) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const public_id =
      "bomb-blog/" +
      path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
    cloudinary.uploader.destroy(
      public_id,
      { invalidate: true },
      (result, error) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
};

router.post("/", async (req, res) => {
  console.log("enter uploading photo in server", req.body);
  const url = req.body.fileRes.url;

  const user = await User.findByPk(req.body.user.id);
  if (!user) {
    res.sendStatus(404);
  } else {
    const updatedUser = await user.update({
      photoURLs: [url],
    });
    console.log("update", updatedUser.dataValues);
    res.send(updatedUser.dataValues);
  }
});
