import React from 'react'

const Title = ({ children, className, color, size }) => {
    const styleObj = {};

    if(size) styleObj.fontSize = size;
    if(color) styleObj.color = color;

    return (
        <h1 className={`title ${className}`} style={styleObj}>{children}</h1>
    )
}

export default Title;