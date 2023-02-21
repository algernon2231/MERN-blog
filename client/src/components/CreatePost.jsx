import React, { useState, memo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        file: ''
    })
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleEditorChange = (content, delta, source, editor) => {
        handleInputChange('content', content);
    }
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, summary, content, file } = formData;

        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('content', content);
        data.append('file', file);

        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
            headers: { Authorization: token }
        })
        if (res.ok) {
            return navigate('/')
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text"
                name='title'
                placeholder='title'
                value={formData.title}
                onChange={handleInputChange}
            />
            <input type="text"
                name='summary'
                value={formData.summary}
                placeholder='summary'
                onChange={handleInputChange}
            />

            <input type="file"
                onChange={handleFileChange}
            />
            <ReactQuill
                name='content'
                value={formData.content}
                placeholder="Start writing..."
                theme='snow'
                modules={modules}
                onChange={handleEditorChange}
            />
            <br />
            <button type='submit'>Create Post</button>
        </form>
    )
}

export default memo(CreatePost)