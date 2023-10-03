import React from 'react'

export default function CountBox({ title, amount }) {
    return (
        <>
            <div className='countbox'>
                <p>  {title}  </p>
                <p>  {amount}  </p>
            </div>
        </>
    )
}
