import cls from './bookBackCover.module.scss';

const BookBackCover = ({ data, direction }) => {
  return (
    // <h2>{data}</h2>
    <div className={cls.bookBackCover}>
      {direction === 'rtl' ?
        <h2>نهاية الكتاب</h2>
        :
        <h2>Book End</h2>
      }
    </div>
  )
}

export default BookBackCover;