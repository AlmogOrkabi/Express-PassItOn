import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext';
import { getPosts } from '../api';
import Loading from '../components/Loading';
import PostCard from '../components/PostCard';

import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

import { postCategories } from '../Data/constants'

import useErrorHandler from '../hooks/useErrorHandler';

export default function Posts() {

    const navigate = useNavigate();
    const handleError = useErrorHandler();

    const { posts, setPosts, fetchPosts } = useContext(AppContext);
    const [loading, setloading] = useState(null);
    const [currentPosts, setCurrentPosts] = useState(posts);
    const [searchBy, setSearchBy] = useState('name');
    const [searchStatus, setSearchStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        loadPosts()
    }, [])

    useEffect(() => {
        filterPosts();
    }, [searchStatus])


    async function loadPosts() {
        try {
            setloading(true);
            await fetchPosts();

        } catch (error) {
            console.log("error - posts: " + error)
            handleError(error);
        } finally {
            setloading(false);
        }
    }



    const handleRadioBtnChange = (e) => {

        setSearchStatus(e.target.value);
    }


    const filterPosts = () => {
        const postsByStatus = filterByStatus();
        const filteredPosts = filterByQuery(postsByStatus);
        setCurrentPosts((prev) => filteredPosts);
    }


    const filterByStatus = () => {

        switch (searchStatus) {
            case 'all':
                return posts;
            case 'זמין':
                return posts.filter((p) => p.status === searchStatus);
            case 'בתהליך':
                return posts.filter((p) => p.status === 'בתהליך מסירה');
            case 'סגור':
                return posts.filter((p) => p.status === 'סגור' || p.status === 'מבוטל' || p.status === 'נמסר');
            case 'בטיפול':
                return posts.filter((p) => p.status === 'בבדיקת מנהל' || p.status === 'לא זמין למסירה');
            default:
                break;
        }

    }

    const filterByQuery = (toFilter) => {

        if (searchQuery === '') return toFilter;

        let filteredPosts;

        switch (searchBy) {
            case 'name':
                filteredPosts = toFilter.filter((p) => p.itemName.includes(searchQuery));
                break;

            case 'username':
                filteredPosts = toFilter.filter((p) => p.owner.username == searchQuery);
                break;
            case 'ID':
                filteredPosts = toFilter.filter((p) => p._id == searchQuery);
                break;
            default:
                return;
        }

        return filteredPosts;

    }

    return (
        <>
            {loading ? <Loading />
                :
                <div className='main-container2'>
                    <h1>פוסטים</h1>

                    <div className='flex-row margin-block input-container '>
                        <IconButton className='input-icon' aria-label='search-users' onClick={() => filterPosts()}>
                            <SearchIcon />
                        </IconButton>
                        <input className='round-input' type='search' placeholder='חיפוש' onChange={(e) => { setSearchQuery((prev) => e.target.value) }}></input>

                        <select className='select-style' aria-label='search-options' onChange={(e) => setSearchBy((prev) => e.target.value)}>
                            <option value='name'>שם פריט</option>
                            <option value='username'>שם משתמש</option>
                            <option value='ID'>ID</option>
                        </select>

                        {/* 
                        <select className='select-style' aria-label='post-categories' onChange={(e) => setSearchBy((prev) => e.target.value)}>
                            <option value='all'>בחר קטגוריה</option>
                            {
                                postCategories.map((pc, index) => {
                                    return <option value={pc} key={index}>{pc}</option>
                                })
                            }
                        </select> */}

                    </div>

                    <form className='flex-row margin-block'>
                        <input type="radio" id="all" name="post-status" value="all" onChange={(e) => handleRadioBtnChange(e)}></input>
                        <label htmlFor="all">הכל</label>
                        <input type="radio" id="available" name="post-status" value="זמין" onChange={(e) => handleRadioBtnChange(e)}></input>
                        <label htmlFor="available">זמין</label>
                        <input type="radio" id="in-process" name="post-status" value="בתהליך" onChange={(e) => handleRadioBtnChange(e)}></input>
                        <label htmlFor="in-process">בתהליך מסירה</label>
                        <input type="radio" id="closed" name="post-status" value="סגור" onChange={(e) => handleRadioBtnChange(e)}></input>
                        <label htmlFor="closed">סגור</label>
                        <input type="radio" id="manager" name="post-status" value="בטיפול" onChange={(e) => handleRadioBtnChange(e)}></input>
                        <label htmlFor="manager">בטיפול מנהל</label>
                    </form>

                    <div className='cards-container'>
                        {
                            Array.isArray(currentPosts) && currentPosts.length > 0 ?


                                currentPosts.map((post, index) => { return <PostCard post={post} index={index} key={index} /> })
                                :
                                <h3>
                                    לא נמצאו פוסטים מתאימים
                                </h3>
                        }
                    </div>
                </div>
            }
        </>
    )
}
