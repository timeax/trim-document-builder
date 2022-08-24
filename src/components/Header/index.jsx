import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { IconButton } from '@mui/material';
import Navbar from './components/Navbar';
import logo from './assets/logo.png'

const Header = ({ routes }) => {
    const [visible, setVisible] = useState(true);
    const location = useLocation();
    //----
    const style = location.pathname !== '/' ? 'image-bg' : 'video-bg';
    //--
    const setVisibility = () => {
        const showing = !visible;
        setVisible(showing);
        document.body.style.overflow = !showing ? 'hidden' : null;
    }
    //--
    return (
        <div className='header-container'>
            <header className={style}>
                <nav>
                    <div className="container">
                        <Link to='/' className='navbar-brand'><img src={logo} alt='Divapee' /></Link>
                        <Navbar routes={routes} visible={visible} showFunc={setVisibility} />
                        <IconButton className='navbar-toggler' onClick={setVisibility}><BiMenu></BiMenu></IconButton>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header