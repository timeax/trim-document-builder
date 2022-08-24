import Section from "."
import Title from "../Typo/Title"

const DescSection = ({ children, className, title, right, placement, route, subTitle }) => {
    return (
        <Section className={`desc-section ${className}`}>
            <div className="row">
                <div className={`left-content ${placement.left}`}>
                    <Title>{title}</Title>
                    {subTitle !== '' ? <Title className="sub-title">{subTitle}</Title> : ''}
                    <p className='lead'>{children}</p>

                    {route ? route : ''}
                </div>
                <div className={`right-content mt-md-3 ${placement.right}`}>{right}</div>
            </div>
        </Section>
    )
}
DescSection.defaultProps = {
    subTitle: '',
    placement: {}
}
export default DescSection