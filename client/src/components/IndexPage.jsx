import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet';
import LoadingImage from './LoadingImage';
import Pagination1 from './Pagination1';
import Post from './Post'

const IndexPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const postsPerPage = 3;

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch(`http://localhost:4000/post?page=${currentPage}&limit=${postsPerPage}`);
            const { allposts, alltotalPages } = await res.json();
            setIsLoading(false);
            setPosts(allposts);
            setTotalPages(alltotalPages);
        }
        fetchPosts();
    }, [currentPage])

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [])

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages])

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage])

    if (isLoading) return <LoadingImage />

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Trang thông tin giới trẻ, cập nhật hàng ngày</title>
                <meta name="description" content="Helmet application" />
            </Helmet>
            <div className="posts">
                {posts && posts.map(post => (
                    <Post key={post._id} post={post} />
                ))}
            </div>
            {posts && (
                <Pagination1
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                />
            )}
        </>
    )
}

export default IndexPage