import Image from 'next/image';
import cls from './imageSection.module.scss';

const ImageSection = ({ image, page }) => {
  console.log({ImageSection:image})
  return (
    <div className={cls.imageSection}>
      {
        image &&
        <Image
          width={900}
          height={900}
          src={image}
          alt="pageImage"
          className={`${page.page_sections.length === 1 ? cls.fullImage : ''} ${page.page_sections.length === 2 ? cls.halfImage : ''}`}
        />
      }
    </div>
  )
}

export default ImageSection;