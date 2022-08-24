import React from 'react'

const VideoFrame = ({link, height}) => {
  return (
    <div style={{height: height}} className='video-frame'>
        <iframe width="100%" height="100%" src={link} title="Nigerian Queen" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="" ></iframe>
    </div>
  )
}

export default VideoFrame;