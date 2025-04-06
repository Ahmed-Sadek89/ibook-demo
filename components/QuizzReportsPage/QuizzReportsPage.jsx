"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar/Navbar";
import Choose from "./../../components/UIs/Choose/Choose";
import Loader from '../../components/UIs/Loader/Loader';
import QuizzesDetailsTable from '../../components/quizzesReports/QuizzesDetailsTable/QuizzesDetailsTable';
import QuizzesAttemptsTable from './../../components/quizzesReports/QuizzesAttemptsTable/QuizzesAttemptsTable';
import QuizzesAnswersTable from './../../components/quizzesReports/QuizzesAnswersTable/QuizzesAnswersTable';
import Container from "@mui/material/Container";
import { apiClient } from "../../Utils/axios";
import cls from "./quizzesReports.module.scss";
import Cookies from "universal-cookie";

const QuizReportsPage = ({ allBooks }) => {
    const cookie = new Cookies();
    const [choosedBook, setChoosedBook] = useState(null);
    const [quizzesData, setQuizzesData] = useState({});
    const [attemptsData, setAttemptsData] = useState({})
    const [answersData, setAnswersData] = useState({})
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category')
    const fetchQuizDetails = async (bookId) => {
        setLoading(true)
        const response = await apiClient.get(`/crm/students/quiz/quizzes?selected_book_id=${bookId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookie.get("ibook-auth")}`,
                },
            }).catch(() => {
                setLoading(false)
            })
        setQuizzesData(response.data.data);
        setChoosedBook({ ...response.data.data.quizzes_attempts.data[0]?.book, title: response.data.data.quizzes_attempts.data[0]?.book.title_en })
        setLoading(false)
    }

    const fetchQuizAttempts = async (quizId) => {
        setLoading(true)
        const response = await apiClient.get(`/crm/students/quiz/quiz_attempts/${quizId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookie.get("ibook-auth")}`,
                },
            }).catch(() => {
                setLoading(false)
            })
        setAttemptsData(response.data.data)
        setLoading(false)
    }

    const fetchQuizAnswers = async (quizAttemptId) => {
        setLoading(true)
        const response = await apiClient.get(`/crm/students/quiz/attempt_answers/${quizAttemptId}`,
            {
                headers: {
                    Authorization: `Bearer ${cookie.get("ibook-auth")}`,
                },
            }).catch(() => {
                setLoading(false)
            })
        setAnswersData(response.data.data)
        setLoading(false)
    }
    const bookId = searchParams.get('bookId');
    const quizId = searchParams.get('quizId')
    const quizAttemptId = searchParams.get('quizAttemptId')
    useEffect(() => {
        if (category === 'attempts') {
            fetchQuizAttempts(quizId)
        }
        if (category === 'answers') {
            fetchQuizAnswers(quizAttemptId)
        }
        if (bookId) {
            fetchQuizDetails(bookId)
        }
    }, [])

    const chooseBook = async (book) => {
        // router.push({ path: '/quizzes-reports', query: { bookId: book.id } })
        router.push(`/quizzes-reports?bookId=${book.id}`)
        setLoading(true)
        setChoosedBook(book);
        const quizzesDetails = await apiClient.get(
            `/crm/students/quiz/quizzes?selected_book_id=${book.id}`,
            {
                headers: {
                    Authorization: `Bearer ${cookie.get("ibook-auth")}`,
                },
            }
        ).catch(() => {
            setLoading(false)
        })

        setQuizzesData(quizzesDetails.data.data);
        setLoading(false)
    };

    const showSpecificTable = {
        attempts: <QuizzesAttemptsTable path="/quizzes-reports" data={attemptsData} fetchQuizAnswers={fetchQuizAnswers} />,
        answers: <QuizzesAnswersTable path="/quizzes-reports" data={answersData} />
    }


    return (
        <div className={cls.quizzesReports}>
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

                <div className={cls.reports}>

                    {loading && <Loader />}

                    {quizzesData?.quizzes_attempts?.data.length && !loading ? (
                        <>
                            {!category ?
                                <QuizzesDetailsTable path={'/quizzes-reports'} data={quizzesData} fetchQuizAttempts={fetchQuizAttempts} />
                                :
                                showSpecificTable[category]
                            }
                        </>
                    ) : null}

                    {!choosedBook && !loading && (
                        <div className={cls.notChoosed}>
                            <h4>إختر كتاب أولاَ لتظهر التقارير!</h4>
                        </div>
                    )}

                    {quizzesData?.quizzes_attempts?.data.length <= 0 && !loading && choosedBook && (
                        <div className={cls.notChoosed}>
                            <h4>هذا الكتاب ليس له أي تقاير حتي الاَن!</h4>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default QuizReportsPage;
