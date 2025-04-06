/* eslint-disable @next/next/no-img-element */
import cls from './videoSection.module.scss';

const VideoSection = ({ video, openModal, data }) => {

  const openPreview = (state, data, type) => {
    openModal(state, data, type)
  }

  return (
    <div className={cls.videoSection}>
      {data && data.type !== 'big_image_with_video' && <span>{data.title}</span>}
      <button className={`${data.type === 'big_image_with_video' ? cls.special : ''} wrapper`} onClick={() => openPreview(true, video, 'video')}>
        <img src="/imgs/video.png" alt="" />
      </button>
    </div>
  )
}

export default VideoSection