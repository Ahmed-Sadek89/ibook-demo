import Image from 'next/image';
import cls from './imageWithVideo.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';

const ImageWithVideo = ({ section, page, openSectionPreviewModal }) => {
  const openPreview = () => {
    openSectionPreviewModal(true, section, 'video');
  }

  return (
    <div className={cls.section} onClick={openPreview}>
      <Image
        width={900}
        height={900}
        src={section.photo_file}
        alt="imageTitle"
        className={`${page.page_sections.length === 1 ? cls.fullImage : ''} ${page.page_sections.length === 2 ? cls.halfImage : ''}`}
      />
      <div className={cls.sectionIcon}>
        <Icon icon="fa:eye" />
      </div>
    </div>
  )
}

export default ImageWithVideo;