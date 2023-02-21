import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js';
import multer from 'multer';
const uploadMiddleware = multer({ dest: 'uploads/' });

import authenticateToken from './services/authMiddleware.js';
import fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173', exposedHeaders: ['Authorization'] }));

// app.use('/uploads', express.static(__dirname + '/uploads'));

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(`${__dirname}/uploads`));


mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://dongocanh:cuncon_kk9@cluster0.bdfsw.mongodb.net/simpleBlogs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));


app.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(200).json(user.toJSON());
    } catch (error) {
        return res.status(500).json(error);
    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(400).json('Unthenticated');
    const passOk = await userDoc.comparePassword(password);
    if (passOk) {
        const token = userDoc.createToken();
        res.setHeader('Authorization', token);
        res.json({
            _id: userDoc._id,
            username: userDoc.username,
            email
        });
    } else {
        return res.status(400).json('Wrong credentials');
    }
})
app.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
})
app.delete('/all', async (req, res) => {
    try {
        await User.deleteMany({});
        return res.status(200).json("Delete all")
    } catch (error) {
        return res.status(500).json(error);
    }
})
app.post('/logout', (req, res) => {
    res.setHeader('Authorization', '').json('ok');
});

app.post('/post', authenticateToken, uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + Date.now() + '.' + ext;
    fs.renameSync(path, newPath);
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: req.user._id
    })
    res.json(postDoc);
})
app.get('/post', async (req, res) => {
    const { page, limit } = req.query;
    const result = await Post.paginate(parseInt(page), parseInt(limit));
    res.json(result);
})

app.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('author', ['username']);
        return res.json(post);
    } catch (error) {
        return res.status(500).json(error);
    }
})
app.put('/post/:id', authenticateToken, uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + Date.now() + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { id, title, summary, content } = req.body;
    const post = await Post.findById(id);
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(req.user._id);
    if (!isAuthor) {
        return res.status(400).json('You are not the author')
    }
    await Post.findOneAndUpdate({ _id: id }, {
        $set: {
            title,
            summary,
            content,
            cover: newPath ? newPath : post.cover
        }
    })
    res.json(post)
})

app.delete('/post/:id', authenticateToken, async (req, res) => {
    const post = await Post.findById(req.params.id);
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(req.user._id);
    if (!isAuthor) {
        return res.status(400).json('You are not the author')
    }
    const data = await post.remove();
    res.json(data);
})

app.get('/getByName', async (req, res) => {
    const name = req.query?.name;
    const data = await Post.findByName(name);
    return res.status(200).json(data);
})
app.listen(4000, () => {
    console.log('Server is running');
});