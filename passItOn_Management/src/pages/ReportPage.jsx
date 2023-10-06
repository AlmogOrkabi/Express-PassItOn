import React, { useState, useEffect, useContext, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import Loading from '../components/Loading';
import { updateReport } from '../api';

const initialState = {
    status: {
        edited: false,
        value: ''
    },
    verdict: {
        edited: false,
        value: '',
    },
    verdictDescription: {
        edited: false,
        value: ''
    },
    admin: {
        edited: false,
        value: ''
    }

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




export default function ReportPage() {

    const { reports, loggedUser } = useContext(AppContext);


    const [formState, dispatch] = useReducer(formReducer, initialState);

    const reportStatuses = ['פתוח', 'בטיפול מנהל', 'בבירור', 'סגור'];

    const [loading, setLoading] = useState(false);

    const { index } = useParams();
    const [report, setReport] = useState(reports[index]);
    const [zoomedImg, setZoomedImg] = useState(null);
    // const [editStatus, setEditStatus] = useState(false);

    const navigation = useNavigate();


    useEffect(() => {
        // console.log("logged user: " + JSON.stringify(loggedUser))
        console.log('changed ' + formState.status.value)
        if (formState.status.edited && formState.status.value != 'פתוח') {
            dispatch({ type: 'edit', field: 'admin' });
            dispatch({ type: 'update', field: 'admin', value: `${loggedUser.firstName + " " + loggedUser.lastName}` })
        }
        else if (formState.status.edited && formState.status.value === 'פתוח') {
            dispatch({ type: 'cancel', field: 'admin' })
        }
        console.log('admin in charge: ' + formState.admin.value)


    }, [formState.status]);

    function handleSelect(e) {
        const selectedValue = e.target.value;
        dispatch({ type: 'update', field: 'status', value: selectedValue });
    }

    async function handleSaveChanges() {
        try {
            setLoading(true);
            const updatedData = {};
            if (formState.status.edited) {
                updatedData.status = formState.status.value;
                dispatch({ type: 'cancel', field: 'status' });
            }
            if (formState.admin.edited) {
                updatedData.admin = formState.admin.value;
                dispatch({ type: 'cancel', field: 'admin' });
            }
            if (formState.verdict.edited) {
                updatedData.verdict = formState.verdict.value;
                dispatch({ type: 'cancel', field: 'verdict' });
            }
            if (formState.verdictDescription.edited) {
                updatedData.verdictDescription = formState.verdictDescription.value;
                dispatch({ type: 'cancel', field: 'verdictDescription' });
            }
            const res = await updateReport(updatedData, report._id);
            console.log(res);

            setReport((prev) => ({ ...prev, ...updatedData }));

        } catch (error) {
            console.log("update report error: " + error.msg);
        } finally {
            setLoading(false);
        }
    }




    return (
        <>
            {loading ? <Loading /> :
                <div className='sub-container-2'>
                    <h1>דף דיווח</h1>
                    {formState.status.edited ?
                        <div>
                            <label htmlFor="statuses">סטטוס: </label>

                            <select name="statuses" id="status" onChange={(e) => handleSelect(e)}>
                                {
                                    reportStatuses.map((s, index) => { return <option value={s} key={index}>{s}</option> })

                                }

                            </select>
                            <IconButton aria-label="cancel" onClick={() => { dispatch({ type: 'cancel', field: 'status' }); dispatch({ type: 'cancel', field: 'admin' }) }}>
                                <ClearIcon />
                            </IconButton>
                        </div>
                        :
                        <p>סטטוס: {report.status}    <IconButton aria-label="cancel" onClick={() => { dispatch({ type: 'edit', field: 'status' }) }}>
                            <EditIcon />
                        </IconButton></p>
                    }
                    {report.admin || formState.admin.edited ? <p>הדיווח בטיפול: {report.admin || formState.admin.value}</p> : null}
                    <p>סוג דיווח: {report.reportType} </p>
                    <p>תיאור: {report.description}</p>
                    <p>המשתמש המדווח: {report.owner.username} <IconButton aria-label="navigate-to-profile" onClick={() => { navigation(`/users/${report.owner.username}`) }}>
                        <AccountBoxIcon />
                    </IconButton></p>
                    {report.userReported && <p>המשתמש שדווח:{report.userReported.username} <IconButton aria-label="navigate-to-profile" onClick={() => { navigation(`/users/${report.owner.username}`) }}>
                        <AccountBoxIcon />
                    </IconButton></p>}
                    {report.post && <p>הפוסט שדווח:{report.post.itemName} <IconButton aria-label="navigate-to-post" onClick={() => { navigation(`/posts/${report.post._id}`) }} >
                        <ArticleIcon />
                    </IconButton></p>}
                    <div className='pictures-container'>
                        {report.photos.map((photo, index) => {
                            return <div key={index} className={zoomedImg === index ? 'zoomed-photo-container' : ''} onClick={() => setZoomedImg(() => zoomedImg !== null ? null : index)} >
                                <img className={zoomedImg === index ? 'zoomed-photo' : 'photo'} src={photo.url} alt='' />
                            </div>
                        })}
                    </div>

                    {
                        report.status !== 'סגור' ?
                            <>
                                {formState.verdict.edited ?
                                    <>
                                        <input className='input' type='text' placeholder='פסק דין' onChange={(text) => dispatch({ type: 'update', field: 'verdict', value: text })} ></input>
                                        <textarea className='input' type='text' placeholder='נימוק' aria-multiline onChange={(text) => dispatch({ type: 'update', field: 'verdictDescription', value: text })}></textarea>
                                        <button className='btn btn-smaller cancell-btn' onClick={() => {
                                            dispatch({ type: 'cancel', field: 'verdict' });
                                            dispatch({ type: 'cancel', field: 'verdictDescription' });
                                        }}>ביטול</button>
                                    </>
                                    : <button className='btn action-btn btn-small align-center' onClick={() => { dispatch({ type: 'edit', field: 'verdict' }); dispatch({ type: 'edit', field: 'verdictDescription' }); }}>סגירת הדיווח</button>
                                }

                                <button className='btn btn-small align-center' onClick={() => handleSaveChanges()}>שמור שינויים</button>
                            </> : null
                    }

                </div>}
        </>
    )
}
