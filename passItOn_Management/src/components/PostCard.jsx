import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { IconButton } from '@mui/material';

export default function PostCard({ post }) {


    const navigation = useNavigate();


    return (
        <>
            <div className='user-card-container box-shadow-card'>

                <img className='user-pfp-small' src={post.photos[0].url} />

                <div className='card-details-container'>
                    <p className='text-bold'>{post.itemName}</p>
                    <p>{post.description}</p>
                    <p>סטטוס: {post.status}</p>
                    <p>פורסם בתאריך: {new Date(post.creationDate).toLocaleDateString()}</p>
                </div>
                <IconButton className='btn-end' aria-label="open" onClick={() => { navigation(`/posts/${post._id}`) }} >
                    <OpenInFullIcon />
                </IconButton>
            </div>
        </>
    )
}
