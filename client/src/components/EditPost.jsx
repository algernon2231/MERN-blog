import React, { useState, useEffect, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const id = useMemo(() => {
        const segments = slug.split('-');
        return segments[segments.length - 1];
    }, [slug]);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState();

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setSummary(data.summary);
                setContent(data.content);
            })
    }, []);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('content', content);
        data.append('id', id);
        if (file) {
            data.append('file', file)
        }

        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await fetch(`http://localhost:4000/post/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
            headers: { Authorization: token }
        })
        if (res.ok) {
            return navigate('/post/' + id)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text"
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input type="text"
                value={summary}
                placeholder='summary'
                onChange={(e) => setSummary(e.target.value)}
            />

            <input type="file"
                onChange={e => setFile(e.target.files[0])}
            />
            <ReactQuill
                value={content}
                placeholder="Start writing..." theme='snow'
                modules={modules}
                onChange={newValue => setContent(newValue)}
            />
            <br />
            <button type='submit'>Update Post</button>
        </form>
    )
}

export default EditPost