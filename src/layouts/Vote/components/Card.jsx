import { Button } from '@mui/material';
import React from 'react'
import { BiFingerprint } from 'react-icons/bi';
import Title from '../../../components/Typo/Title';

const Card = ({image, fname, sname, lname, func, id}) => {
    const openUI = () => {
        func(id)
    }
    return (
        <>
            <div className='card-container mx-2'>
                <div className="card">
                    <div className="image-container">
                        <img src={image} alt="" />
                    </div>
                    <div className="details">
                        <Title className='sub-title'><span>{fname} {sname}</span> <span>{lname}</span> </Title>
                        <Button variant='contained' onClick={openUI} endIcon={<BiFingerprint />} color='success'>Vote</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
