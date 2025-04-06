import { Icon } from '@iconify/react/dist/iconify.js';
import cls from './bookIndex.module.scss';

const BookIndex = ({ data, goToPage, indexNum, bookDetails }) => {
  return (
    <div className={cls.bookIndex}>
      {bookDetails.direction === 'rtl' ?
        <h4>فهرس الكتاب</h4>
        :
        <h4>Book Index</h4>
      }
      <ul>
        {data.map(link => (
          <li key={link.id} onClick={() => goToPage(+link.page_index + indexNum)}
            style={bookDetails.direction === 'rtl' ? { flexDirection: "row" } : { flexDirection: "row-reverse" }}
          >
            <div
            className={cls.pageTitles}
              style={bookDetails.direction === 'rtl' ? { flexDirection: "row" } : { flexDirection: "row-reverse" }}
            >
              <Icon icon="ix:circle-dot" /> <span>{link.title}</span>
            </div>
            <span>{link.page_index}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookIndex