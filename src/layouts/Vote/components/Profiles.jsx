import { TextField } from '@mui/material'
import React from 'react'
import Card from './Card'

const Profiles = ({searchContestant, profiles, setUi}) => {
    return (
        <>
            <TextField onChange={searchContestant} fullWidth label='Find Contestants' inputMode='search'></TextField>
            <div className="contestants">
                <div className="d-flex flex-wrap profiles">
                    {
                        profiles.length > 0 ?
                            profiles.map(profile => <Card
                                key={profile.id}
                                fname={profile.fname}
                                sname={profile.lname}
                                lname={profile.mname}
                                id={profile.id}
                                image={profile.img}
                                func={(id) => setUi(id)}
                            />) : <p className="lead">No Match Found</p>
                    }
                </div>
            </div>
        </>
    )
}

export default Profiles
