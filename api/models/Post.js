import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

PostSchema.statics.paginate = async function (page, limit) {
    const skipIndex = (page - 1) * limit;

    try {
        const count = await this.countDocuments();
        const alltotalPages = Math.ceil(count / limit);
        const allposts = await this.find()
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(limit);
        return {
            allposts,
            alltotalPages,
        };
    } catch (error) {
        console.log(error.message);
    }
}
PostSchema.statics.findByName = async function (name) {
    const allposts = await this.find()
        .sort({ createdAt: -1 })
        .populate('author', ['username']);
    return allposts.filter(post => post.author.username === name);
}
const PostModel = model('Post', PostSchema);
export default PostModel;