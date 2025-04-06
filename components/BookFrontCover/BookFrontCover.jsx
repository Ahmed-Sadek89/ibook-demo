import Image from 'next/image';
import cls from './bookFrontCover.module.scss';

const BookFrontCover = ({ logo, title, level }) => {
  return (
    <div className={cls.front}>

      <Image width={530} height={130} src={logo} alt="logoImage" />

      {/* <h2>{title}</h2> */}

      {/* <h4>{ level.title }</h4> */}

      {/* <span dangerouslySetInnerHTML={{ __html: level.details }}></span> */}

    </div>
  )
}

export default BookFrontCover