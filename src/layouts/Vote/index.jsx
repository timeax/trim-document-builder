/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import Section from '../../components/Section'
import Context from '../../context'
import Profiles from './components/Profiles'
import VoteArea from './components/VotingArea';
import { useNavigate } from 'react-router-dom';

const Vote = () => {
  const { contestants, user: [user] } = useContext(Context);
  //----
  const navigate = useNavigate();
  //----
  const [profiles, setProfiles] = useState(contestants)
  const [ui, setUi] = useState(-1);

  useEffect(() => {
    if (user.id === undefined) navigate('/login')
    setProfiles(contestants)
  }, [contestants])
  //---
  const searchContestant = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.trim() !== '') {
      const matches = contestants.filter(item => item.fname.toLowerCase().includes(value) ||
        item.lname.toLowerCase().includes(value) ||
        item.mname.toLowerCase().includes(value) ||
        item.reg?.includes(value));
      //----
      setProfiles(matches);
    } else setProfiles(contestants);
  }

  return (
    <div className='App-vote'>
      <Section>
        <div className="voting-area">
          {ui === -1 ? <Profiles searchContestant={searchContestant} setUi={setUi} profiles={profiles} /> : <VoteArea user={user} setUi={setUi} id={ui} contestant={contestants.find(item => item.id === ui)} />}
        </div>
      </Section>
    </div>
  )
}

export default Vote;