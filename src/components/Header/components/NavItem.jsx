import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../../context';
const NavItem = ({ route }) => {
    const current = route.current ? 'current' : '';
    const { user: [user, setUser] } = useContext(Context);
    const navigate = useNavigate();

    const cutSession = async (e) => {
        if (user.id) {
            e.preventDefault();

            await fetch('/logout', { method: 'GET' });
            setUser({});

            navigate('/')
        }
    }

    const setRoute = (route) => user.id ? '/' : route


    return (
        <li className={`nav-item ${current}`}>
            {
                route.route === '/login' ?
                    <Link onClick={cutSession} to={setRoute(route.route)} className="nav-link">{user.id ? 'Logout' : 'Login'}</Link>
                    : <Link to={route.route} className="nav-link">{route.name}</Link>
            }
        </li>
    )
}

export default NavItem