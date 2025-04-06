import {
    Legend,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
} from "recharts";
import cls from "./bookReports.module.scss";

const BookReportPageDepartmentChart = ({ data }) => {
    return (
        <div className={cls.chartsSection}>
            <h5>قسم الصفحة</h5>
            <div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="page_section.title" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="num" fill="#8884d8" />
                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BookReportPageDepartmentChart
