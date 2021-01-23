const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    Post.find()
        .populate("postedBy")
        .sort({ "createdAt": -1 })
        .then(results => res.status(200).send(results))
        .catch(err => console.log(err))
});

router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }

    const postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
        .then(async newPost => {
            newPost = await User.populate(newPost, { path: "postedBy" })

            res.status(201).send(newPost);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
});

router.put("/:id/like", async (req, res, next) => {

    const postId = req.params.id;
    const userId = req.session.user._id;

    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    

    res.status(200).send("nice")
})

module.exports = router;