import { useMemo } from "react";
import { useRouter } from "next/navigation";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { Pie, PieChart, Legend, Tooltip } from "recharts";

import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

import { format } from 'date-fns';

import cls from "./quizzesAnswersTable.module.scss";

const QuizzesAnswersTable = ({ data, path }) => {
  const router = useRouter()

  const columns = useMemo(
    () => [
      {
        // Second group - Details
        Header: "السؤال",
        // Second group columns
        accessor: "question?.title",
      },
      {
        // first group - TV Show
        Header: "درجة السؤال",
        // First group columns
        accessor: "question.question_mark",
      },
      {
        // Second group - Details
        Header: "	حصل علي",
        // Second group columns
        accessor: "achieved_mark",
      },
      {
        // Second group - Details
        Header: "درجات النقص",
        // Second group columns
        accessor: "minus_mark",
      },
      {
        // Second group - Details
        Header: "التصحيح",
        // Second group columns
        Cell: ({ row }) => (
          <span>
            {row.original.is_correct === "0" ?
              <span className={cls.wrong}><i className="fa-solid fa-xmark"></i></span>
              :
              <span className={cls.correct}><i className="fa-check fa-sharp fa-solid"></i></span>
            }
          </span>
        ),
      },
      {
        // Second group - Details
        Header: "تم البدء في",
        // Second group columns
        Cell: ({ row }) => (
          <span>{format(new Date(row.original.created_at).getTime(), 'dd/mm/yyyy - hh:mm')}</span>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: data.attempt_answers.data },
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = tableInstance;

  const goBack = () => {
    router.push(`${path}?bookId=${data.quiz_attempt.book.id}&category=attempts&quizId=${data.quiz_attempt.quiz.id}`)
    // router.push({ pathname: path, query: { bookId: data.quiz_attempt.book.id, category: 'attempts', quizId: data.quiz_attempt.quiz.id } })
  }

  return (
    <div className={cls.quizzesReports}>
      <div className={cls.goBack}>
        <button onClick={goBack}><i className="fa-rotate-left fa-duotone"></i> رجوع للخلف</button>
      </div>
      <div className={cls.tableReports}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, headerIdx) => {
              const { key: rowKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <TableRow key={rowKey || headerIdx} {...headerGroupProps}>
                  {headerGroup.headers.map((column, columnIdx) => {
                    const { key: cellKey, ...columnProps } = column.getHeaderProps();
                    return (
                      <TableCell key={cellKey || columnIdx} {...columnProps}>
                        {column.render("Header")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row, rowIdx) => {
              prepareRow(row);
              const { key: rowKey, ...rowProps } = row.getRowProps();
              return (
                <TableRow key={rowKey || rowIdx} {...rowProps}>
                  {row.cells.map((cell, cellIdx) => {
                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <TableCell key={cellKey || cellIdx} {...cellProps}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className={cls.chartsReports}>
        <div className={cls.chartsSection}>
          <h5>الإجابات الصحيحة</h5>
          <div>
            <PieChart width={300} height={300}>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Pie
                data={data.charts.is_correct}
                dataKey="num"
                nameKey="label"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#00b894"
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesAnswersTable;
