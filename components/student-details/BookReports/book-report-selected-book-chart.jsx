import cls from "./bookReports.module.scss";
import {
    Pie,
    PieChart,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const BookReportSelectedBookChart = ({ data }) => {
    return (
        <div className={cls.chartsSection}>
            <h5>الكتاب</h5>
            <div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip />
                        <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                        />
                        <Pie
                            data={data}
                            dataKey="num"
                            nameKey="book.title_ar"
                            innerRadius={40}
                            outerRadius={100}
                            fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BookReportSelectedBookChart
