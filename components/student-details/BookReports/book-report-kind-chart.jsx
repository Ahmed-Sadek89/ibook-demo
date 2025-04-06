import cls from "./bookReports.module.scss";
import {
    Pie,
    PieChart,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const BookReportKindChart = ({ data }) => {
    return (
        <div className={cls.chartsSection}>
            <h5>النوع</h5>
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
                            nameKey="label"
                            innerRadius={40}
                            outerRadius={100}
                            fill="#00b894"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BookReportKindChart
