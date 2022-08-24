/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import { Card, Button, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { input as element, validateEmail } from '../../../Registry/components/validate'
import { handlePayment } from './asset'
import Status from './components/Status'
import LoadingButton from '@mui/lab/LoadingButton';

const VoteArea = ({ setUi, id, contestant, user }) => {
    const [current, setCurrent] = useState(0);
    const [btnText, setText] = useState('Vote');
    const [btnText1, setText1] = useState('Cancel');
    const [loading, setLoading] = React.useState(false);
    //--
    const [amount, setAmount] = useState(1000);
    const [email, setemail] = useState(user.email)
    const [fname, setname] = useState(user.name.trim().split(' ')[0])
    const [lname, setlname] = useState(user.name.trim().split(' ')[1])
    //
    const fnameRef = useRef(0)
    const lnameRef = useRef(0)
    const emailRef = useRef(0)

    //---
    const changeForm = (type = 'next') => {
        if (type === 'next') {
            if (!validate()) return;
            if (current === 3) return payment();
            else {
                if (current <= 2) setCurrent(current + 1);

                setText1('Back');
                setText('Next');
                if (current + 1 === 3) setText('Pay');
            }
        } else {

            if (type === 'cancel') {
                if (current === 0) return setUi(-1);
                let r = current > 0 ? current - 1 : current;
                setCurrent(r);
                setText1(r > 0 ? 'Back' : 'Cancel');
                if (r === 0) setText('Vote')
            }
        }
        // /---
    }

    function validate() {
        if (current === 2) {
            const _email = element(emailRef.current).value;
            const name = element(fnameRef.current).value;
            const _lname = element(lnameRef.current).value;
            //--
            if (!validateEmail(_email)) return false;
            if (name === '' || _lname === '') return false;

            setemail(_email);
            setlname(_lname);
            setname(name);
        }

        return true;
    }

    async function payment() {
        const info = { email: email, name: { first: fname, last: lname }, amount };
        setLoading(true);
        // console.log(info)
        // console.log(data);
        const data = await handlePayment(info);
        if (data.failed) {
            setUi(-1);
        } else {
            const body = {
                points: 10,
                userId: user.id,
                reg: contestant.id
            };

            const res = await fetch('/insert_records', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            });

            const msg = await res.json();

            if (msg.success) {
                setLoading(false);
                setUi(-1);
            } else setUi(-1);

        }
    }

    //-----
    const details = [
        {
            name: 'Vote',
            id: 'profile'
        },

        {
            name: 'Amount',
            id: 'amount'
        },

        {
            name: 'Information',
            id: 'info'
        },

        {
            name: 'Payment',
            id: 'payment'
        }
    ];

    const ProfileArea = () => {
        return (
            <>
                <div className="profile-area">
                    <div className="d-flex profile-name py-3">
                        <label className='me-2'>Name</label> <p className="lead">{contestant.fname} {contestant.lname} {contestant.mname}</p>
                    </div>

                    <div className="d-flex">
                        <label htmlFor="" className='ml-auto'>RegNumber: <b>{contestant.id}</b></label>
                    </div>
                </div>
            </>
        )
    }

    const AmountForm = () => {
        return <>
            <div className="pricing-area d-flex flex-column">
                <label htmlFor="">Amount: N{amount}</label>
                <label htmlFor="">Points: {10}</label>
            </div>
        </>
    }

    const InfoForm = () => {
        return <>
            <div className="form">
                <div className="form-group">
                    <label htmlFor="fname">First Name</label>
                    <TextField className='input' defaultValue={fname} ref={fnameRef} type="text"></TextField>
                </div>
                <div className="form-group">
                    <label htmlFor="fname" >Last Name</label>
                    <TextField className='input' defaultValue={lname} ref={lnameRef} type="text"></TextField>
                </div>
                <div className="form-group">
                    <label htmlFor="fname">Email Address</label>
                    <TextField className='input' defaultValue={email} ref={emailRef} type="email"></TextField>
                </div>

            </div>
        </>
    }

    const PayForm = () => {
        return <>
            Summary
        </>
    }

    const getCurrentForm = (key) => {
        switch (key) {
            case 0: return <ProfileArea />;
            case 1: return <AmountForm />;
            case 2: return <InfoForm />;
            case 3: return <PayForm />;
        }
    }

    return (
        <div className='voting-container'>
            {/* <Button className='mb-2' variant='outlined' startIcon={<BiChevronLeft />} onClick={() => setUi(-1)}>Back</Button> */}

            <Card variant='elevation' className='h-75 voting-card'>
                <div className="card-flex">
                    <div className="image-container" style={{ backgroundImage: `url(${contestant.img})` }}></div>
                    <div className="vote-system">
                        <div className="header">
                            <Status labels={details} current={current} />
                        </div>
                        <div className="status-content">
                            {getCurrentForm(current)};
                        </div>
                        <div className="footer">
                            <Button variant='contained' onClick={() => changeForm('cancel')} className='mx-4' color='warning'>{btnText1}</Button>
                            <LoadingButton
                                onClick={() => changeForm('next')}
                                endIcon={<BiChevronRight />}
                                loading={loading}
                                loadingPosition="end"
                                variant="contained"
                                color='success'
                            >
                                {btnText}
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            </Card >
        </div >
    )
}

export default VoteArea
