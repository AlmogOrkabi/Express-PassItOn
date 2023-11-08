import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { IconButton } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function PostPage() {

    const { _id } = useParams();
    const navigation = useNavigate();
    const { posts } = useContext(AppContext);
    const [post, setPost] = useState(posts.find((p) => p._id == _id));
    const [loading, setloading] = useState(false);
    const [zoomedImg, setZoomedImg] = useState(null);
    const [showReports, setShowReports] = useState(false);


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
                    <p>מספר דיווחים על הפריט: {post.reports.length} {
                        showReports ? <IconButton aria-label='show-less' onClick={() => { setShowReports((prev) => false) }} >
                            <ExpandLessIcon />
                        </IconButton>
                            :
                            !showReports ?
                                <IconButton aria-label={post.reports.length < 1 ? 'show-more-disabled' : 'show-more'} disabled={post.reports.length < 1} onClick={() => { setShowReports((prev) => true) }} >
                                    <ExpandMoreIcon />
                                </IconButton>
                                :
                                null
                    }</p>
                    {
                        showReports && <ul>
                            {
                                post.reports.map((report, index, _id) => {
                                    return <li className='clickable' key={index} onClick={() => { navigation(`/reports/${_id}`) }
                                    }>
                                        דיווח מס' : {index + 1}
                                    </li>
                                })
                            }
                        </ul>
                    }
                </div>}
        </>
    )
}
