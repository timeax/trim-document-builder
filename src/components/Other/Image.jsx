import Types from 'prop-types';

const Image = ({src, type, position, size, repeat, className}) => {
  return (
    <div>

    </div>
  )
}

Image.defaultProps = {
    src: '',
    type: 'background',
    position: 'center',
    size: 'cover',
    repeat: 'no-repeat',
    className: ''
}

Image.propTypes = {
    src: Types.string.isRequired,
    type: Types.string.isRequired,
    position: Types.string,
    size: Types.string,
    repeat: Types.string,
    className: Types.string
}

export default Image