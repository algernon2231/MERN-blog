import React, { useEffect, useState, memo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Post from './Post';

const GetPostByName = () => {
    const [search, setSearch] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const name = search.get('name');

    const fetchPosts = useCallback(async () => {
        const res = await fetch(`http://localhost:4000/getByName?name=${name}`, {
            method: 'GET',
            credentials: 'include'
        });
        setPosts(await res.json());
    }, [name])
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts])
    return (
        <div className='postUser'>
            <h2 className='header'>Posts from <span className='author_header'>{name}</span></h2>
            {posts && posts.map(post => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    )
}
export default GetPostByName;