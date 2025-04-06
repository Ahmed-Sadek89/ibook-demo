"use client"
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Choose from "../../components/UIs/Choose/Choose";
import Loader from "../../components/UIs/Loader/Loader";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { apiClient } from "../../Utils/axios";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";
import {
  Pie,
  PieChart,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  AreaChart,
  Area,
} from "recharts";

import cls from "./reports.module.scss";

import Cookies from "universal-cookie";
const cookie = new Cookies();

const Reports = ({ allBooks}) => {
  const [choosedBook, setChoosedBook] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [bookCharts, setBookCharts] = useState({});
  const [loading, setLoading] = useState(false);

  const chooseBook = async (book) => {
    setLoading(true);
    setChoosedBook(book);
    const bookDetails = await apiClient
      .get(`/crm/students/book_reports?selected_book_id=${book.id}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("ibook-auth")}`,
        },
      })
      .catch(() => {
        setLoading(false);
      });

    if (!bookDetails.data.success) return;

    console.log(bookDetails)

    setBookData(bookDetails.data.data.book_reports.data);

    setBookCharts(bookDetails.data.data.charts);

    setLoading(false);
  };

  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "الصفحة",
        // First group columns
        accessor: "page.title",
      },
      {
        // Second group - Details
        Header: "قسم الصفحة",
        // Second group columns
        accessor: "page_section.title",
      },
      {
        // Second group - Details
        Header: "النوع",
        // Second group columns
        accessor: "type",
      },
      {
        // Second group - Details
        Header: "تصنيف الحدث",
        // Second group columns
        accessor: "event_category",
      },
      {
        // Second group - Details
        Header: "إجراء الحدث",
        // Second group columns
        accessor: "event_action",
      },
      {
        // Second group - Details
        Header: "وقت البدء",
        // Second group columns
        accessor: "session_start_time",
      },
      {
        // Second group - Details
        Header: "وقت الإنتهاء",
        // Second group columns
        accessor: "session_end_time",
      },
      {
        // Second group - Details
        Header: "الوقت الكلي",
        // Second group columns
        accessor: "total_time",
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: bookData },
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className={cls.reports}>
      <Navbar />

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
            <>
              <div className={cls.tableReports}>
                <Table {...getTableProps()}>
                  <TableHead>
                    {headerGroups.map((headerGroup, idx) => (
                      <TableRow
                        key={idx}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column, idx) => (
                          <TableCell key={idx} {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                      prepareRow(row);
                      return (
                        <TableRow key={i} {...row.getRowProps()}>
                          {row.cells.map((cell, idx) => {
                            return (
                              <TableCell key={idx} {...cell.getCellProps()}>
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
                  <h5>تصنيف الحدث</h5>
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
                          data={bookCharts.event_category}
                          dataKey="num"
                          nameKey="label"
                          innerRadius={40}
                          outerRadius={100}
                          fill="#ff7675"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

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
                          data={bookCharts.event_action}
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
                          data={bookCharts.type}
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
                          data={bookCharts.book_id}
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

                <div className={cls.chartsSection}>
                  <h5>الصفحة</h5>
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        width={730}
                        height={250}
                        data={bookCharts.page_id}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          {/* <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient> */}
                          <linearGradient
                            id="colorPv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#82ca9d"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#82ca9d"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="page_section.title" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        {/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" /> */}
                        <Area
                          type="monotone"
                          dataKey="num"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorPv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>قسم الصفحة</h5>
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bookCharts.page_section_id}>
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

                <div className={cls.chartsSection}>
                  <h5>الطالب</h5>
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart width={730} height={250}>
                        {/* <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" /> */}
                        <Pie
                          data={bookCharts.student_id}
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
              </div>
            </>
          ) : null}

          {!choosedBook && !loading && (
            <div className={cls.notChoosed}>
              <h4>إختر كتاب أولاَ لتظر التقارير!</h4>
            </div>
          )}

          {bookData.length <= 0 && !loading && choosedBook && (
            <div className={cls.notChoosed}>
              <h4>هذا الكتاب ليس له أي تقاير حتي الاَن!</h4>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};


export default Reports;
