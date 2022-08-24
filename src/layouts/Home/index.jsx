import React from 'react'
import Banner from '../../components/Banner'
import vid from '../../assets/img/home-video.mp4';
import Title from '../../components/Typo/Title';
import { Button } from '@mui/material';
import DescSection from '../../components/Section/DescSection';
import brand from '../../assets/img/brand-logo.png';
import videos from './assets/videos';
import blog_image from '../../assets/img/image2.jpeg';
import vote_image from '../../assets/img/image1.jpeg';
// import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import Section from '../../components/Section';
import VideoFrame from './components/VideoFrame';

const Home = () => {
    return (
        <div className='App-home'>
            <Banner bgType="video" source={vid} styleClass='home-banner'>
                <div className="d-flex flex-column desc">
                    <Title className="sub-title">THE NIGERIAN QUEEN 2022</Title>
                    <Title className='my-1'>
                        Vote your favorite contestant to Top 5
                    </Title>
                    <p className='lead'>#RoadToTheNigerianQueen</p>
                    <div className="d-flex">
                        <Button variant="contained" color="success" size="large" href="/vote">Vote now</Button>
                    </div>
                </div>
            </Banner>
            <DescSection
                className='about-brand'
                title='Divapee Agency.'
                placement={{ right: 'col-lg-5 col-md-5 col-sm-12 image-area', left: 'col-lg-7 col-md-7 col-sm-12 titleBox d-flex flex-column justify-content-center' }}
                right={<img className='illus-image' src={brand} alt='Not Found' />}
                route={
                    <Button className='mr-auto mt-4' variant='outlined' href='/about' color='success' endIcon={<BiChevronRight />}>Learn More</Button>
                }>
                The Nigerian Queen (beauty for purpose) is a prestigious Crown that goes beyond physical beauty, the organization aim at helping young girls find their true essence. We search for women that have a big heart towards society, we believe in uplifting and giving a voice to those who have the courage to stand out.
            </DescSection>
            <Section className="video-gallery">
                <Title className='mb-3'>Beauty for Purpose</Title>
                <div className="d-flex flex-wrap">
                    {videos.map((item, i) => <div key={i} className='col-6 d-flex align-items-center mb-4'>
                        <VideoFrame link={item} height='null' />
                    </div>)}
                </div>
                <Button target='_blank' color='success' size="large" variant='outlined' endIcon={<BiChevronRight />} className='mr-auto mt-4' href='https://www.youtube.com/channel/UCUI8aQAbfa5J7D5za5IbiVw/featured'>View all activities</Button>
            
            </Section>
            <DescSection
                className='blog-section'
                title='Our blog.'
                placement={{ right: 'col-lg-5 col-md-5 col-sm-12 image-area', left: 'col-lg-7 col-sm-12 col-md-7 titleBox d-flex flex-column justify-content-center' }}
                right={<img className='illus-image' src={blog_image} alt='Not Found' />}
                route={
                    <Button target='_blank' color='success' size="large" variant='outlined' endIcon={<BiChevronRight />} className='mr-auto mt-4' href='https://www.youtube.com/channel/UCUI8aQAbfa5J7D5za5IbiVw/featured'>View 2021 HIGHLIGHTS</Button>
                }>
                Get all the news, gist, upcoming events and information from Nigerian Queen (Beauty for Purpose). When we say, light, camera, you say action!
            </DescSection>
            <DescSection
                className='vote-info-section'
                title='Your Vote Can Pick Who Becomes The New Queen'
                placement={{ right: 'col-lg-5 col-md-5 col-sm-12 image-area', left: 'col-lg-7 col-sm-12 col-md-7 titleBox d-flex flex-column justify-content-center' }}
                right={<img className='illus-image' src={vote_image} alt='Not Found' />}
                >
                With 1 vote equals 2 point you can help your favorite contestant reach the Grand Finale faster than ever
            </DescSection>
        </div>
    )
}

export default Home