import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { IconButton } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
export default function PostPage() {

    const { _id } = useParams();
    const navigation = useNavigate();
    const { posts } = useContext(AppContext);
    const [post, setPost] = useState(posts.find((p) => p._id == _id));
    const [loading, setloading] = useState(false);
    const [zoomedImg, setZoomedImg] = useState(null);


    return (
        <>
            {loading
                ?
                <Loading />
                :
                <div>
                    <h2>דף פריט</h2>
                    <h3 className=''>{post.itemName}</h3>

                    <div className='pictures-container'>
                        {post.photos.map((photo, index) => {
                            return <div key={index} className={zoomedImg === index ? 'zoomed-photo-container' : ''} onClick={() => setZoomedImg(() => zoomedImg !== null ? null : index)} >
                                <img className={zoomedImg === index ? 'zoomed-photo' : 'photo'} src={photo.url} alt='' />
                            </div>
                        })}
                    </div>

                    <p>תיאור הפריט: <br /> {post.description}</p>
                    <p>קטגוריה: {post.category}</p>
                    <p>מיקום הפריט: {post.address.simplifiedAddress || post.address.notes}</p>
                    <p>תאריך פרסום: {new Date(post.creationDate).toLocaleDateString()}</p>
                    <p>סטטוס: {post.status}</p>

                    <p>מעלה הפריט: {post.owner.username} <IconButton aria-label="profile" onClick={() => { navigation(`/users/${post.owner.username}`) }}>
                        <AccountBoxIcon />
                    </IconButton></p>
                    <p>מספר דיווחים על הפריט: {post.reports.length}</p>

                </div>}
        </>
    )
}
