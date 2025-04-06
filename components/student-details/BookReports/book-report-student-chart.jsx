import {
    Pie,
    PieChart,
    ResponsiveContainer,
} from "recharts";
import cls from "./bookReports.module.scss";

const BookReportStudentChart = ({ data }) => {
    return (
        <div className={cls.chartsSection}>
            <h5>الطالب</h5>
            <div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={730} height={250}>
                        {/* <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" /> */}
                        <Pie
                            data={data}
                            dataKey="num"
                            nameKey="page_section.title"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#82ca9d"
                            label
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BookReportStudentChart
