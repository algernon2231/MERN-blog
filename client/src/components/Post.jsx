import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { slugify, ucfirst } from '../utils/format'

const Post = memo(({ post }) => {
    const slug = slugify(post.title);
    return (
        <>
            <div className="post">
                <div className="image">
                    <img src={`http://localhost:4000/${post.cover}`} alt={post.title} />
                </div>
                <div className="texts">
                    <Link to={`/post/${slug}-${post._id}`}>
                        <h2>{ucfirst(post.title)}</h2>
                    </Link>
                    <p className="info">
                        <Link to={`/post/getByName?name=${post.author.username}`} className="author">
                            {post.author.username}
                        </Link>
                        <time>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</time>
                    </p>
                    <p className='summary'>{post.summary}</p>
                </div>
            </div>
        </>
    )
})

export default Post