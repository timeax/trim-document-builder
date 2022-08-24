import { IconButton, Link, TextField } from '@mui/material';
import logo from '../../assets/img/logo.png';
import Title from '../Typo/Title';
import links from './assets/social';
import { BiSend } from 'react-icons/bi'

const Footer = () => {
  const { socialLinks, hotlinks, company } = links;
  return (
    <footer>
      <div className="container">
        <div className="footer-flex">
          <div className="footer-flex-col footer-flex-col-1">
            <div className="d-flex header">
              <img src={logo} alt="" />
              <Title className="sub-title">Divapee</Title>
            </div>
            <div className="social-links">
              {socialLinks.map((item, i) => {
                return (
                  <IconButton key={i} target='_blank' href={item.route}>{item.icon}</IconButton>
                )
              })}
            </div>
            <div className="address-box">
              <span className='my-2 mb-3'>No 39 inesirm road, off Ada George road, 08039286380, 001 Entertainment 500001, Port Harcourt, Nigeria</span>
              <span>info@tnq.ng</span>
              <span>+234 704 823 4001</span>
            </div>
          </div>
          <div className="footer-flex-col footer-flex-col-2">
            <div className="quick-links">
              <ul>
                <Title className='sub-title'>Our Company</Title>
                {company.map(item => <li key={item.route}><Link to={item.route}>{item.name}</Link></li>)}
              </ul>
              <ul>
                <Title className='sub-title'>Hot Links</Title>
                {hotlinks.map(item => <li key={item.route}><Link to={item.route}>{item.name}</Link></li>)}
              </ul>
            </div>
          </div>
          <div className="footer-flex-col footer-flex-col-3">
            <div className="newsletter">
              <div className="title-container">
                <Title className="sub-title">SUBSCRIBE TO OUR NEWS</Title>
                <span>Subscribe to get our latest news in <br /> your mailbox</span>
              </div>
              <div className="form">
                <TextField variant='outlined' type='email' />
                <IconButton><BiSend /></IconButton>
              </div>
            </div>
          </div>
          <span className="copyright">
            The Nigerian Queen Limited Copyright © 2022. All rights reserved
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer