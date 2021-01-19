const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');


app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", (req, res, next) => {

    res.status(200).render("login");
});

router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        return res.sendStatus(400);
    }

    const postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    Post.create(postData)
        .then( async newPost => {
            newPost = await User.populate(newPost, { path: "postedBy" })

            res.status(201).send(newPost);
            
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });

    res.status(200).send("it wored");
});

module.exports = router;

