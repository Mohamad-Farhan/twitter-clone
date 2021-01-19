const mongoose = require('mongoose');

const Scehma = mongoose.Schema;

const PostSchema = new Scehma({
    content: { String, trim: true },
    postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean

}, { timestamps: true });

const Post = mongoose.model('User', PostSchema);
module.exports = Post;