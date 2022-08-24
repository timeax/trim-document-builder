import Title from '../../../components/Typo/Title'
import Button from '@mui/material/Button';
import { BiChevronRight } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
const Card = ({ fname, lname, sname, reg, image, onClick }) => {
    const navigate = useNavigate();

    return (
        <div className='card-container mx-2'>
            <div className="card">
                <div className="image-container">
                    <img crossOrigin='anonymous' src={image} onClick={onClick} alt="" />
                </div>
                <div className="details">
                    <Title className='sub-title'><span>{fname} {sname}</span> <span>{lname}</span> </Title>
                    <Button variant='contained' onClick={() => navigate(`/contestants/${reg}`)} endIcon={<BiChevronRight />} color='success'>View profile</Button>
                </div>
            </div>
        </div>
    )
}

Card.defaultProps = {
    lname: ''
}

export default Card
