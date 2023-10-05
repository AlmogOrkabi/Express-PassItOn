import React, { useState, useEffect, useContext, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

const initialState = {
    status: {
        edited: false,
        value: ''
    },
    verdict: {
        edited: false,
        value: '',
    },
    verdict_description: {
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



    const { index } = useParams();
    const [report, setReport] = useState(reports[index]);
    const [zoomedImg, setZoomedImg] = useState(null);
    // const [editStatus, setEditStatus] = useState(false);

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
        const selectedValue = event.target.value;
        dispatch({ type: 'update', field: 'status', value: selectedValue });
    }


    return (
        <>
            <div className='sub-container-2'>
                <h1>דף דיווח</h1>
                {formState.status.edited ?
                    <div>
                        <label for="statuses">סטטוס: </label>

                        <select name="statuses" id="cars" onChange={(e) => handleSelect(e)}>
                            {
                                reportStatuses.map((s) => { return <option value={s}>{s}</option> })

                            }

                        </select>
                        <IconButton aria-label="cancel" onClick={() => { dispatch({ type: 'cancel', field: 'status' }) }}>
                            <ClearIcon />
                        </IconButton>
                    </div>
                    :
                    <p>סטטוס: {report.status}    <IconButton aria-label="cancel" onClick={() => { dispatch({ type: 'edit', field: 'status' }) }}>
                        <EditIcon />
                    </IconButton></p>
                }
                {report.admin || formState.admin.edited ? <p>הדיווח בטיפול: {report.admin || formState.admin.value}</p> : null}
                <p>סוג דיווח: {report.reportType}</p>
                <p>תיאור: {report.description}</p>
                <p>המשתמש המדווח: {report.owner.username}</p>
                <div className='pictures-container'>
                    {report.photos.map((photo, index) => {
                        return <div key={index} className={zoomedImg === index ? 'zoomed-photo-container' : ''} onClick={() => setZoomedImg(() => zoomedImg !== null ? null : index)} >
                            <img className={zoomedImg === index ? 'zoomed-photo' : 'photo'} src={photo.url} alt='' />
                        </div>
                    })}
                </div>

                <input className='input' type='text' placeholder='פסק דין'></input>
                <textarea className='input' type='text' placeholder='נימוק' aria-multiline></textarea>
                <button className='btn btn-small align-center'>שמור שינויים</button>

            </div>
        </>
    )
}
