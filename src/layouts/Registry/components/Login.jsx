import { Alert, Button, Collapse, IconButton, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
import { input as element, validateEmail } from './validate';
import { BiX } from 'react-icons/bi';

const Login = ({ change, user, setUser }) => {
    //-----
    const [emailLabel, setEmailLabel] = useState('Email Address or Phone Number');
    const [passLabel, setPassLabel] = useState('Password');
    const [open, setOpen] = React.useState(false);
    const [err, seterr] = useState('');

    const _email = useRef(0);
    const _password = useRef(0);
    const navigate = useNavigate();

    const submit = async () => {
        const email = element(_email.current);
        const password = element(_password.current);
        let err = false;
        if (email.value === '') {
            err = true;
            setEmailLabel('Cannot be empty');
        } else {
            if (email.value.length === 11) {
                if (email.value.split('').every(item => typeof parseInt(item) === 'number')) {
                    email.id = 'phone';
                } else if (!validateEmail(email.value)) setEmailLabel('Invalid Email or Phone number')
            } else {
                if (!validateEmail(email.value)) setEmailLabel('Invalid Email or Phone number')
            }
        }

        if (password.value === '') {
            err = true;
            setPassLabel('Password cannot be empty');
        }

        if (!err) {
            const body = {};
            [email, password].forEach(item => {
                body[item.id] = item.value;
            });


            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                navigate('/')
            } else {
                seterr(data.msg);
                setOpen(true);
            }
        }

    }

    return (
        <>
            <div className='alert'>
                <Collapse in={open}>
                    <Alert
                        severity="error"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <BiX fontSize={20} />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {err}
                    </Alert>
                </Collapse>
            </div>

            <TextField ref={_email} helperText='Enter your Email address or Phone number' className='registry-input' type='email' id="email" label={emailLabel} variant="outlined" />
            <TextField ref={_password} helperText={<a href='/forgot-passord'>Forgot password?</a>} className='registry-input' type='password' id="password" label={passLabel} variant="outlined" />
            <Button variant='contained' color='success' size='large' onClick={submit} endIcon={<BiChevronRight />}>Sign In</Button>

            <div className="d-flex align-items-center mt-3">
                <span> I'm not a member yet?</span>
                <Button className='py-0' onClick={() => change('register')} color='info'>Register</Button>
            </div>
        </>
    )
}

export default Login