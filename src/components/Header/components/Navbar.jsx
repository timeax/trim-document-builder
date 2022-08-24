import { useLocation, useNavigate } from 'react-router-dom';
import NavItem from './NavItem';
import Button from '@mui/material/Button';
import { BiFingerprint } from 'react-icons/bi';
import { useRef } from 'react';
const Navbar = ({ routes, showFunc, visible }) => {
    const ref = useRef(0);
    //-----
    const location = useLocation();
    const navigate = useNavigate();
    // --
    const show = () => getComputedStyle(ref.current).position === 'fixed' && showFunc();
    //--
    routes = routes.map(route => {
        if (route.route.endsWith('/:id')) {
            route.route = route.route.substring(0, route.route.length - 4);
            // console.log(route.route)
        }
        if (location.pathname === route.route) route.current = true;
        else route.current = false;
        return <NavItem key={route.key} route={route} />;
    });
    //-----
    return (
        <div ref={ref} className={`navbar-container ${visible && 'hide'}`} onClick={show}>
            <div className="nav">
                {routes}
                <div className='nav2'>
                    <Button className='vote-button' onClick={() => navigate('/vote')} variant='contained' color='success' endIcon={<BiFingerprint />}>Vote</Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar