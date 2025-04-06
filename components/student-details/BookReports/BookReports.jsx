import { useState } from "react";
import Choose from "../../UIs/Choose/Choose";
import Loader from "../../UIs/Loader/Loader";
import Container from "@mui/material/Container";
import cls from "./bookReports.module.scss";
import BookReportDataAnalysis from "./book-report-data-analysis";
import { getBookReportByStudentIdAndBookId } from "../../../api/book-report-by-bookId-and-studentId";

const BookReports = ({ studentId, allBooks }) => {
  const [choosedBook, setChoosedBook] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [bookCharts, setBookCharts] = useState({});
  const [loading, setLoading] = useState(false);

  const chooseBook = async (book) => {
    setLoading(true);
    setChoosedBook(book);
    const bookDetails = await getBookReportByStudentIdAndBookId(studentId, book.id)
      .catch(() => {
        setLoading(false);
      });

    if (!bookDetails?.success) return;
    setBookData(bookDetails.data.book_reports.data);
    setBookCharts(bookDetails.data.charts);
    setLoading(false);
  };

  return <div className={cls.bookReportsWrapper}>
    <Container maxWidth="xl">
      <div className={cls.choosingBook}>
        <label>إختر كتاب</label>
        <Choose
          placeholder="إختر كتاب"
          results={allBooks}
          choose={chooseBook}
          value={choosedBook ? choosedBook.title : ""}
          keyword="title"
        />
      </div>
      <div className={cls.bookReports}>
        {loading && <Loader />}
        {bookData.length && !loading ? (
          <BookReportDataAnalysis bookCharts={bookCharts} bookData={bookData} cls={cls} />
        ) : null}

        {!choosedBook && !loading && (
          <div className={cls.notChoosed}>
            <h4>إختر كتاب أولاَ لتظهر التقارير!</h4>
          </div>
        )}

        {bookData.length <= 0 && !loading && choosedBook && (
          <div className={cls.notChoosed}>
            <h4>هذا الكتاب ليس له أي تقاير حتي الاَن!</h4>
          </div>
        )}
      </div>
    </Container>
  </div>;
};

export default BookReports;
