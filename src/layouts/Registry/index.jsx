import { useState, useContext, useEffect } from "react"
import Title from "../../components/Typo/Title";
import brand from '../../assets/img/logo.png';
import Login from "./components/Login";
import Register from "./components/Register";
import { Link, useNavigate } from "react-router-dom";
import Context from '../../context';

const Registry = ({ type }) => {
    const [state, setState] = useState('login')
    const { user: [user, setUser] } = useContext(Context);
    const navigate = useNavigate()

    useEffect(() => {
        if (user._id) navigate('/')
    });

    return (
        <div className='App-registry'>
            <div className="form-container">
                <div className="form">
                    <div className="header">
                        <Link to="/"><img src={brand} alt="" /></Link>
                        <Title>
                            {state === 'login' ? 'Login Into Your Account' : 'Create An Account'}
                        </Title>
                    </div>
                    {state === 'login' ? <Login user={user} setUser={setUser} change={setState} /> : <Register change={setState} />}
                </div>
            </div>
        </div>
    )
}

export default Registry