const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/UserSchema');


app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", (req, res, next) => {

    res.status(200).render("login");
});

router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        return res.sendStatus(400);
    }

    res.status(200).send("it wored");
});

module.exports = router;

