import React, { useState, useEffect, useContext, useReducer } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { IconButton } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { postCategories, postStatuses } from '../Data/constants';



const initialState = {
    status: {
        edited: false,
        value: ''
    },
    itemName: {
        edited: false,
        value: '',
    },
    description: {
        edited: false,
        value: ''
    },
    category: {
        edited: false,
        value: ''
    },
    // category: {
    //     edited: false,
    //     value: ''
    // },
}


function formReducer(state, action) {
    switch (action.type) {
        case 'edit':
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    edited: true
                }
            }
        case 'cancel':
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    edited: false,
                    value: '' //this is the line i added
                }
            }
        case 'update':
            return {
                ...state,
                [action.field]: {
                    ...state[action.field],
                    value: action.value
                }
            }
        default:
            return state;
    }
}



export default function PostPage() {

    const { _id } = useParams();
    const navigation = useNavigate();
    const { posts } = useContext(AppContext);
    const [post, setPost] = useState(posts.find((p) => p._id == _id));
    const [loading, setloading] = useState(false);
    const [zoomedImg, setZoomedImg] = useState(null);
    const [showReports, setShowReports] = useState(false);

    const [formState, dispatch] = useReducer(formReducer, initialState);



    async function handleChanges() {
        try {
            setloading(true);
            //!add validations to the inputs
            //!check all the values
            //!format the edited data

        } catch (error) {

        } finally {
            setloading(false);
        }
    }

    return (
        <>
            {loading
                ?
                <Loading />
                :
                <div className='main-container2'>
                    <h2>דף פריט</h2>
                    {
                        formState.itemName.edited ?
                            <div>
                                <input className='input' type='text' placeholder='שם הפריט' onChange={(e) => dispatch({ type: 'update', field: 'itemName', value: e.target.value })} ></input>
                                <IconButton aria-label="cancel" onClick={() => { dispatch({ type: 'cancel', field: 'itemName' }); dispatch({ type: 'cancel', field: 'admin' }) }}>
                                    <ClearIcon />
                                </IconButton>
                            </div>

                            :
                            <h3 className=''>{post.itemName} <IconButton aria-label="edit" onClick={() => { dispatch({ type: 'edit', field: 'itemName' }) }}>
                                <EditIcon />
                            </IconButton></h3>

                    }
                    <div className='pictures-container'>
                        {post.photos.map((photo, index) => {
                            return <div key={index} className={zoomedImg === index ? 'zoomed-photo-container' : ''} onClick={() => setZoomedImg(() => zoomedImg !== null ? null : index)} >
                                <img className={zoomedImg === index ? 'zoomed-photo' : 'photo'} src={photo.url} alt='' />
                            </div>
                        })}
                    </div>

                    {
                        formState.description.edited ?
                            <div className='flex'>
                                <textarea className='input' type='text' placeholder='תיאור הפריט' aria-multiline onChange={(e) => dispatch({ type: 'update', field: 'description', value: e.target.value })}></textarea>
                                <IconButton className='btn-top' aria-label="cancel" onClick={() => dispatch({ type: 'cancel', field: 'description' })}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            :
                            <p>תיאור הפריט: <br /> {post.description} <IconButton aria-label="edit" onClick={() => { dispatch({ type: 'edit', field: 'description' }) }}>
                                <EditIcon />
                            </IconButton></p>
                    }
                    {
                        formState.category.edited ?
                            <div>
                                <label htmlFor="categories">קטגוריות: </label>

                                <select name="categories" id="categories" onChange={(e) => dispatch({ type: 'update', field: 'category', value: e.target.value })}>
                                    {
                                        postCategories.map((c, index) => { return <option value={c} key={index}>{c}</option> })

                                    }

                                </select>
                                <IconButton className='btn-top' aria-label="cancel" onClick={() => dispatch({ type: 'cancel', field: 'category' })}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            :
                            <p>קטגוריה: {post.category} <IconButton aria-label="edit" onClick={() => { dispatch({ type: 'edit', field: 'category' }) }}>
                                <EditIcon />
                            </IconButton></p>
                    }
                    <p>מיקום הפריט: {post.address.simplifiedAddress || post.address.notes}</p>
                    <p>תאריך פרסום: {new Date(post.creationDate).toLocaleDateString()}</p>
                    {
                        formState.status.edited ?
                            <div>
                                <label htmlFor="statuses">סטטוס: </label>

                                <select name="statuses" id="statuses" onChange={(e) => dispatch({ type: 'update', field: 'status', value: e.target.value })}>
                                    {
                                        postStatuses.map((s, index) => { return <option value={s} key={index}>{s}</option> })

                                    }

                                </select>
                                <IconButton className='btn-top' aria-label="cancel" onClick={() => dispatch({ type: 'cancel', field: 'status' })}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            :
                            <p>סטטוס: {post.status} <IconButton aria-label="edit" onClick={() => { dispatch({ type: 'edit', field: 'status' }) }}>
                                <EditIcon />
                            </IconButton></p>
                    }

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

                    {
                        formState.itemName.edited || formState.description.edited || formState.category.edited || formState.status.edited ?
                            <button className='btn btn-small align-center bg-green' onClick={() => handleChanges()}>שמור שינויים</button>
                            :
                            null
                    }

                </div>}
        </>
    )
}