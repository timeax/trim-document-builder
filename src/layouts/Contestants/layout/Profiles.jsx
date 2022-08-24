import banner from '../../../assets/img/banner.jpg';
import Banner from '../../../components/Banner';
import Section from '../../../components/Section';
import Title from '../../../components/Typo/Title'
import Card from '../components/Card';

const Profiles = ({ contestants }) => {
    const showProfile = (profile) => {
        // console.log(profile)
    }
    
    return (
        <>
            <Banner bgType="image" source={banner} styleClass='image-banner'>
                <div className="d-flex flex-column desc">
                    <Title color='white'>2022 Contestants</Title>
                </div>
            </Banner>

            <Section className='profile-container'>
                <div className="d-flex flex-wrap profiles">
                    {contestants.map(profile => {
                        return (
                            <Card
                                key={profile.id}
                                onClick={() => showProfile(profile)}
                                fname={profile.fname}
                                lname={profile.mname}
                                image={profile.img}
                                sname={profile.lname}
                                reg={profile.reg}
                            />
                        )
                    })}
                </div>
            </Section>
        </>
    )
}

export default Profiles
