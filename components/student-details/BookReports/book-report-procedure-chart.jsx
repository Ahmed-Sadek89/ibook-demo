import cls from "./bookReports.module.scss";
import {
    Pie,
    PieChart,
    Legend,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";


const BookReportProcedureChart = ({data}) => {
    return (
        <div className={cls.chartsSection}>
            <h5>إجراء الحدث</h5>
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
                            fill="#6c5ce7"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BookReportProcedureChart
