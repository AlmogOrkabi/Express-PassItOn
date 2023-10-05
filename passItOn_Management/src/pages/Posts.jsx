import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext';
import { getPosts } from '../api';
import Loading from '../components/Loading';
import PostCard from '../components/PostCard';

export default function Posts() {

    const { posts, setPosts, fetchPosts } = useContext(AppContext);
    const [loading, setloading] = useState(null);

    useEffect(() => {
        loadPosts()
    }, [])


    async function loadPosts() {
        try {
            setloading(true);
            await fetchPosts();

        } catch (error) {
            console.log("error - posts: " + error)
        } finally {
            setloading(false);
        }
    }

    return (
        <>
            {loading ? <Loading />
                :
                <div>
                    <h1>פוסטים</h1>

                    <div>
                        {
                            posts.map((post, index) => { return <PostCard post={post} index={index} key={index} /> })
                        }
                    </div>
                </div>
            }
        </>
    )
}
