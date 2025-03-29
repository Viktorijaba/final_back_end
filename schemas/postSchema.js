const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:
        { type: String,
          required: true
        },
    image:
        { type:
            String,
            required: true
        },
    description:
        { type:
            String,
            required: true
        },
    time:
        { type:
            String,
            required: true
        },
    username:
        { type: String,
          required: true },
    favorites:
        [String],
    comments: [
        {
            username: String,
            comment: String
        }
    ]
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
