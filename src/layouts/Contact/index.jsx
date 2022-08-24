import { Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import Banner from '../../components/Banner'
import Section from '../../components/Section'
import banner from '../../assets/img/banner.jpg'

import Title from '../../components/Typo/Title'
import { BiSend } from 'react-icons/bi'
const Contact = () => {
  const [state, setstate] = useState('Abia');

  const handleChange = (event) => {
    setstate(event.target.value);
  };

  const states = [{
    value: 'Abia',
    label: 'Abia'
  }, {
    value: 'Lagos',
    label: 'Ikeja'
  }];
  return (
    <div className='App-contact'>
      <Banner bgType="image" source={banner} styleClass='image-banner'>
        <div className="d-flex flex-column desc">
          <Title color='white'>Contact Us</Title>
        </div>
      </Banner>
      <Section className='contact-container'>
        <div className="d-flex">
          <div className="contact-form">
            <Title color='var(--theme)'>Stay up-to-date on The Nigerian Queen</Title>
            <p>Sign up below for the latest news on The Nigerian Queen</p>

            <div className="form">
              <TextField className='contact-input' id="fname" label="First Name" variant="outlined" />
              <TextField className='contact-input' id="lname" label="Last Name" variant="outlined" />
              <TextField className='contact-input' id="email" label="Email Address" variant="outlined" />
              <TextField className='contact-input' id="phone" type='number' label="Phone Number" variant="outlined" />

              <TextField
                className='contact-input' id="outlined-select-currency"
                select
                label="State"
                value={state}
                onChange={handleChange}
                helperText="Please select your State"
              >
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <div className="d-flex flex-column options">
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked />} label="General Updates" />
                  <FormControlLabel control={<Checkbox />} label="Becoming a Contestant" />
                  <FormControlLabel control={<Checkbox />} label="Volunteering" />
                  <FormControlLabel control={<Checkbox />} label="Sponsorship" />
                  <FormControlLabel control={<Checkbox />} label="I would like to receive email communications." />
                </FormGroup>
              </div>
            </div>

            <Button className='mr-auto mt-3' variant='contained' size='large' color='success' endIcon={<BiSend />}>Submit</Button>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Contact