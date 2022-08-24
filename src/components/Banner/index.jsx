import Props from 'prop-types'
import { useEffect, useRef } from 'react';

const Banner = ({ bgType, children, source, styleClass }) => {
    let style = {}
    const ref = useRef(0);
    const section = useRef(0);

    useEffect(() => {
        if (ref.current !== 0) {
            const app = document.querySelector('.App');
            const header = app.querySelector('header');
            // console.log(app.scrollWidth)

            window.addEventListener('resize', e => {
                fixHeight();
            });

            function fixHeight() {

                if (getComputedStyle(ref.current).position === 'fixed') ref.current.style.width = app.scrollWidth + 'px';
                else ref.current.style.width = null;
                //-----
                if (window.matchMedia('(min-width: 1024px)').matches) {
                    if (getComputedStyle(header).position === 'relative') {
                        section.current.style.height = `calc(100vh - ${header.getBoundingClientRect().height}px)`;
                    }
                } else {
                    section.current.style.height = null;
                }
            }
            setTimeout(() => fixHeight(), 1000);
        }
    });

    if (bgType === 'image') style.backgroundImage = `url(${source})`;
    return (
        <div
            ref={section}
            className={`app-hero-section ${styleClass} ${bgType}-background`}
            style={style}>
            {bgType === 'video' ? <video ref={ref} src={source} loop={true} autoPlay="autoplay" width="100%" muted></video> : ''}
            <div className="overlay">
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    )
}

Banner.defaultProps = {
    bgType: 'solid',
    source: 'var(--dark)',
    styleClass: 'h-100'

}

Banner.propTypes = {
    bgType: Props.string.isRequired,
    source: Props.string,
}

export default Banner