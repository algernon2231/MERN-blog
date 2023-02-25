
import { useEffect, useContext, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom '
import { UserContext } from '../UserContext'
import { formatISO9075 } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import LoadingImage from './LoadingImage';
import useFetch from '../Auth/useFetch';

const SinglePost = () => {
    const { callFetch } = useFetch();
    const navigate = useNavigate();
    const { slug } = useParams();
    const id = useMemo(() => {
        const segments = slug.split('-');
        return segments[segments.length - 1];
    }, [slug]);
    const [postInfo, setPostInfo] = useState(null);
    const [userInfo] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:4000/post/${id}`, {
                credentials: 'include'
            });
            setIsLoading(false);
            setPostInfo(await res.json());
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
        }
        // remove event listener when modal is closed
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);



    const delPost = async () => {

        const { response, data } = await callFetch(`http://localhost:4000/post/${id}`, 'DELETE');
        console.log(response);
        if (response.ok) navigate('/')
        // const token = localStorage.getItem('token');
        // await fetch(`http://localhost:4000/post/${id}`, {
        //     credentials: 'include',
        //     method: 'DELETE',
        //     headers: { Authorization: token }
        // });
        // navigate('/');
    }

    const toggleModal = () => {
        setIsOpen(false);
        navigate(-1);
    }
    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal-container')) {
            toggleModal();
        }
    };

    if (isLoading) return <LoadingImage />

    if (!postInfo) {
        return <div>No post found.</div>
    }
    const { _id, title, createdAt, author, cover, content } = postInfo;
    return (
        <div className='modal-container'>
            {isOpen && (
                <div className="post-page">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>{title}</title>
                        <meta name="description" content="Helmet application" />
                    </Helmet>
                    <span onClick={toggleModal} className="close-btn">X</span>
                    <h1>{title}</h1>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                    <div className="author">by @{author.username}</div>
                    {userInfo && userInfo._id === author?._id && (
                        <div className='buttons'>
                            <div className="edit-row">
                                <Link className="edit-btn" to={`/edit/${slug}-${_id}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Edit this post
                                </Link>
                            </div>
                            <div className="delete-row">
                                <a className="delete-btn" onClick={delPost} >
                                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M128 192v640h768V320H485.76L357.504 192H128zm-32-64h287.872l128.384 128H928a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32zm370.752 448-90.496-90.496 45.248-45.248L512 530.752l90.496-90.496 45.248 45.248L557.248 576l90.496 90.496-45.248 45.248L512 621.248l-90.496 90.496-45.248-45.248L466.752 576z" /></svg>
                                    Delete this post
                                </a>
                            </div>
                        </div>
                    )}
                    <div className="image">
                        <img src={`http://localhost:4000/${cover}`} alt={title} />
                    </div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: content }}>

                    </div>
                </div>
            )}
        </div>

    )
}
export default SinglePost