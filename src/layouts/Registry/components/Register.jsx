import { Button, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { input as element, validateEmail } from './validate';
const Register = ({ change }) => {
    const [e, ps, p, cps, n] = ['Email Address', 'Password', 'Phone Number', 'Confirm Password', 'Name']
    const [nameLabel, setName] = useState(n);
    const [emailLabel, setEmail] = useState(e);
    const [passLabel, setPass] = useState(ps);
    const [phoneLabel, setPhone] = useState(p);
    const [confirmPass, setConfirm] = useState(cps);
    //-----
    const _email = useRef(0);
    const _name = useRef(0);
    const _phone = useRef(0);
    const _password = useRef(0);
    const _confirm = useRef(0);
    //----
    const submit = async () => {
        const email = element(_email.current);
        const name = element(_name.current);
        const phone = element(_phone.current);
        const password = element(_password.current);
        const confirm = element(_confirm.current);

        let err = false;
        let body = {};
        //---
        if (email.value === '') {
            setEmail('Email cannot be empty');
            err = true;
        } else if (!validateEmail(email.value)) setEmail('Invalid Email or Phone number');

        if (name.value === '') {
            setName('Name cannot be empty');
            err = true;
        }

        if (phone.value === '') {
            setPhone('Phone field cannot be empty');
            err = true;
        } else if (phone.value.length < 11 || phone.value.length > 11) {
            setPhone('Number cannot be less than or greater than 11');
            err = true;
        }
        if (password.value === '') {
            setPass('Password field cannot be empty');
            err = true;
        } else {
            if(password.value.length < 6) {
                setPass('Value must be a least 6 characters');
                err = true;
            }
            if (confirm.value === '') {
                setConfirm('Password field cannot be empty');
                err = true;
            } else if (confirm.value !== password.value) {
                setConfirm('Passwords do not match');
                err = true;
            }
        }

        if (!err) {
            [email, phone, password, name].forEach(item => body[item.id] = item.value);
            console.log(body);
            const res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            console.log(data);

            if(data.success) change('login');
            else {
                setEmail(data.errs.email === '' ? e : data.errs.email);
                setPhone(data.errs.phone === '' ? p : data.errs.phone);
            }
        }
    }

    return (
        <>
            <TextField ref={_name} helperText='Enter your Name' className='registry-input' type='text' id="name" label={nameLabel} variant="outlined" />
            <TextField ref={_email} helperText='Enter your Email address' className='registry-input' type='email' id="email" label={emailLabel} variant="outlined" />
            <TextField ref={_phone} helperText='Enter your Phone Number' className='registry-input' type='number' id="phone" label={phoneLabel} variant="outlined" />
            <TextField ref={_password} helperText='Enter your password' className='registry-input' type='password' id="password" label={passLabel} variant="outlined" />
            <TextField ref={_confirm} helperText='Confirm your password' className='registry-input' type='password' id="password" label={confirmPass} variant="outlined" />
            <Button onClick={submit} variant='contained' color='success' size='large' endIcon={<BiChevronRight />}>Register</Button>

            <div className="d-flex align-items-center mt-3">
                <span>I have an account</span>
                <Button className='py-0' onClick={() => change('login')} color='info'>Login</Button>
            </div>
        </>
    )
}

export default Register
