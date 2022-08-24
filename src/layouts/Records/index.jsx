import React, { useContext } from 'react'
import Banner from '../../components/Banner'
import banner from '../../assets/img/banner.jpg'
import Title from '../../components/Typo/Title'
import Section from '../../components/Section'
import Contestant from './components/Contestant'
import Context from '../../context'

const Records = () => {
    const { contestants } = useContext(Context);
    return (
        <div className='App-records'>
            <Banner bgType="image" source={banner} styleClass='image-banner'>
                <div className="d-flex flex-column desc">
                    <Title color='white'>Live Records</Title>
                </div>
            </Banner>
            <Section className="records-container">
                {contestants.map(item => <Contestant key={item.id} contestant={item}/>)}
            </Section>
        </div>
    )
}

export default Records
