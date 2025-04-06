import BookReportTable from "./book-report-table";
import BookReportCategoryChart from "./book-report-category-chart";
import BookReportProcedureChart from "./book-report-procedure-chart";
import BookReportKindChart from "./book-report-kind-chart";
import BookReportSelectedBookChart from "./book-report-selected-book-chart";
import BookReportPageChart from "./book-report-page-chart";
import BookReportPageDepartmentChart from "./book-report-page-department-chart";
import BookReportStudentChart from "./book-report-student-chart";

const BookReportDataAnalysis = ({ bookCharts, bookData, cls }) => {
    return (
        <>
            <BookReportTable bookData={bookData} />
            <div className={cls.chartsReports}>
                <BookReportCategoryChart data={bookCharts.event_category} />
                <BookReportProcedureChart data={bookCharts.event_action} />
                <BookReportKindChart data={bookCharts.type} />
                <BookReportSelectedBookChart data={bookCharts.book_id} />
                <BookReportPageChart data={bookCharts.page_id} />
                <BookReportPageDepartmentChart data={bookCharts.page_section_id} />
                <BookReportStudentChart data={bookCharts.student_id} />
            </div>
        </>
    )
}

export default BookReportDataAnalysis
