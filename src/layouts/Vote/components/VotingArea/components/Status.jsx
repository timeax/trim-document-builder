import React from 'react'
const Status = ({ labels, next, prev, setText, current }) => {
    return (
        <div className='status-bar'>
            {
                labels.map((label, index) => {
                    return (
                        <div key={index} className={`status ${index === current ? 'current' : ''} ${index < current ? 'active' : ''}`}>
                            <span className="status-text">{label.name}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

Status.defaultProps = {
    current: 3
}

export default Status
