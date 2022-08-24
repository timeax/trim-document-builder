/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Title from '../../../components/Typo/Title';
import { BsInstagram } from 'react-icons/bs';
import { BiFingerprint } from 'react-icons/bi';
import { Button, Card } from '@mui/material';
import Context from '../../../context';
import Section from '../../../components/Section';

const Profile = ({ reg }) => {
    const { contestants } = useContext(Context);
    const [profile, setProfile] = useState({});
    //---
    useEffect(() => {
        let profiles = contestants;
        //---
        if (contestants.length === 0) {
            fetch('/getContestants').then(async res => {
                profiles = await res.json();
            });
        }
        setProfile(profiles.find(item => item.reg + '' === reg) || {});
    }, []);

    ///-------
    const navigate = useNavigate();



    return (
        <Section className='contestant-page mb-4'>
            <div className="d-flex">
                <div className="profile-container">
                    <div className="navbar">
                        <Link to='/contestants'>Contestants</Link>
                        <span>/</span>
                        <b>{profile.reg}</b>
                    </div>
                    <div className="row profile-id">
                        <div className="profile-name col-6">
                            <Title>{profile.fname} {profile.lname} <br /> {profile.mname}</Title>
                            <div className="d-flex insta-link">
                                <BsInstagram />
                                <span className='mx-2'>{profile.instagram_id}</span>
                            </div>

                            <Button variant='contained' onClick={() => navigate('/vote')} endIcon={<BiFingerprint />}>Vote</Button>
                        </div>
                        <div className="image-container col-6" style={{ backgroundImage: `url(${profile.img})` }}>

                        </div>
                    </div>

                    <div className="profile-desc">
                        <Card className='card'>
                            <div className="p-3 content-wrapper">
                                <Title>meet {profile.fname} {profile.lname}</Title>
                                <div className="content">
                                    <p className="lead">{profile.description}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default Profile
