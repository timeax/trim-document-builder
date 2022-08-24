import Banner from '../../components/Banner'
import banner from '../../assets/img/banner.jpg';
import Title from '../../components/Typo/Title';
import { Button } from '@mui/material';
import DescSection from '../../components/Section/DescSection';
import preamble from '../../assets/img/preamble.png'
import vote from '../../assets/img/vote.png'
import { BiChevronRight } from 'react-icons/bi';
const About = () => {
  return (
    <div className='App-about'>
      <Banner bgType="image" source={banner} styleClass='image-banner'>
        <div className="d-flex flex-column desc">
          <Title className='my-auto'>
            About The Nigerian Queen
          </Title>
        </div>
      </Banner>
      <DescSection
        className='about-brand'
        subTitle='THE NIGERIAN QUEEN (beauty for purpose) beauty pageant is a brand from 001 Entertainment outfit, targeted at redefining beauty with a connotation of purpose, and with a sole aim of carrying out humanitarian activities.'
        title='Preamble.'
        placement={{ right: 'col-lg-6 col-md-6 col-sm-12 image-area', left: 'col-lg-6 col-md-6 col-sm-12 d-flex flex-column justify-content-center' }}
        right={<img className='illus-image' src={preamble} alt='Not Found' />}
        route={
          <Button className='mr-auto mt-4' variant='outlined' href='/about' color='success' endIcon={<BiChevronRight />}>Learn More</Button>
        }>
        Our Pedigree for The Nigerian Queen pageant is a search of rare combination of beauty and brains. Impeccable young ladies that would uphold strong values, beauty, intellects and prestige. The Nigerian Queen (beauty for purpose) is a prestigious Crown that goes beyond physical beauty, the organization aim at helping young girls find their true essence. We search for women that have a big heart towards society, we believe in uplifting and giving a voice to those who have the courage to stand out.

        This platform is all about Impact, not just a beautiful girl with a designer gown and a crown, But a girl that can create long lasting Impact and change the world in her own little way. A platform that develop potentials and talents, using pageantry as a tool for promoting peace, progress and youth development.

        We believe that change will come if we all command it from our own little corner; our pageantry platform also helps to project and celebrate our unique rich cultural heritage to every part of Africa and the entire world at large.
      </DescSection>

      <DescSection
        className='vote-info-section'
        title='Vote For Your Favorite Contestant Into The Grand Finale'
        placement={{ right: 'col-lg-5 col-md-5 col-sm-12 image-area', left: 'col-lg-7 col-sm-12 col-md-7 titleBox d-flex flex-column justify-content-center' }}
        right={<img className='illus-image' src={vote} alt='Not Found' />}
        route={
          <Button variant='contained' color='success' className='mr-auto' size='large' href='/vote' endIcon={<BiChevronRight/>}>VOTE NOW</Button>
        }
      >
        With 1 vote equals 2 point you can help your favorite contestant reach the Grand Finale faster than ever
      </DescSection>
    </div>
  )
}

export default About