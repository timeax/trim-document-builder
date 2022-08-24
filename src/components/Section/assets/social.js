/* eslint-disable import/no-anonymous-default-export */
import { BsFacebook, BsLinkedin, BsWhatsapp, BsInstagram, BsTwitter } from 'react-icons/bs'

const socialLinks = [
    {
        icon: <BsFacebook />,
        route: '/'
    },

    {
        icon: <BsWhatsapp />,
        route: '/'
    },

    {
        icon: <BsTwitter />,
        route: '/'
    },

    {
        icon: <BsLinkedin />,
        route: '/'
    },

    {
        icon: <BsInstagram />,
        route: '/'
    }
];

const company = [
    {
        name: 'About',
        route: '/about'
    },
    {
        name: 'Contact us',
        route: '/contact'
    },

    {
        name: 'Terms of Service',
        route: '/terms-of-service'
    }
];

const hotlinks = [
    {
        name: 'Contestants',
        route: '/contestants'
    },

    {
        name: 'Vote',
        route: '/vote'
    },

    {
        name: 'FAQs',
        route: '/faqs'
    }
]

export default { socialLinks, company, hotlinks };