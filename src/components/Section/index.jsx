import React from 'react'

const Section = ({ className, children }) => {
    return (
        <div className={`app-section  ${className}`}>
            <div className="container">
                {children}
            </div>
        </div>
    )
}

export default Section