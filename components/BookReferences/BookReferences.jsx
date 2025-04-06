import cls from './bookReferences.module.scss';

const BookIndex = ({ data, bookDetails }) => {

  if (!data.map(item => item.reference).filter(item => item).length) return null

  return (
    <div className={cls.bookIndex}>
      {bookDetails.direction === 'rtl' ? 
        <h4>مراجع الكتاب</h4>
        :
        <h4>Book References</h4>
      }
      <ul>
        { data.map(link => (
          <li key={link.id}>
            <a href={link.reference_link} rel="noreferrer" target='_blank'>
              <span><i className="fa-thin fa-circle-dot"></i> <span dangerouslySetInnerHTML={{ __html: link.reference }}></span></span>
            </a>
            <span>{ link.page.page_index }</span>
          </li>
        )) }
      </ul>
    </div>
  )
}

export default BookIndex