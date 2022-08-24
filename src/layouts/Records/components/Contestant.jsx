import Title from '../../../components/Typo/Title'
import Progress from './Progress'

const Contestant = ({ contestant }) => {

    return (
        <div className='contestant-container'>
            <div className="profile">
                <div className="image-container" style={{
                    backgroundImage: `url(${contestant.img})`
                }}></div>
            </div>
            <div className="progress-container">
                <Progress reg={contestant.id} />
                <Title className="sub-title">
                    <span>{contestant.fname}</span>
                    <span>{contestant.lname}</span>
                    <span>{contestant.mname}</span>
                </Title>
            </div>
        </div>
    )
}

export default Contestant
