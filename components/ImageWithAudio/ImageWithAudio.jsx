import Image from 'next/image';
import cls from './imageWithAudio.module.scss';
import { Icon } from '@iconify/react/dist/iconify.js';

const ImageWithAudio = ({ section, page, openSectionPreviewModal }) => {
  const openPreview = () => {
    openSectionPreviewModal(true, section)
  }

  return (
    <div className={cls.section} onClick={openPreview}>
      <Image
        width={1000}
        height={1000}
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

export default ImageWithAudio