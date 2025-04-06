"use client"
import { useState } from "react";
import { useMultiStep } from "../../hook/useMultiStep";
import Navbar from "../Navbar/Navbar";
import StudentDetails from "../student-details/StudentDetails/StudentDetails";
import BookReports from "../student-details/BookReports/BookReports";
import QuizReports from "../student-details/QuizReports/QuizReports";
import EditStudentModal from "../modals/EditStudentModal/EditStudentModal";
import cls from "./studentDetails.module.scss";
import StudentTabs from "./student-tabs";

const Student = ({
    studentId,
    studentData,
    allBooks,
    studentCountry,
    semesters,
    levels,
}) => {
    const [openEditStudent, setOpenEditStudent] = useState(false);
    const [studentDetails, setStudentDetails] = useState({ ...studentData });
    const { currentStep, setCurrentStep, step } = useMultiStep([
        <StudentDetails
            key="first"
            studentDetails={studentDetails}
            setOpenEditStudent={setOpenEditStudent}
        />,
        <BookReports key="second" studentId={studentId} allBooks={allBooks} />,
        <QuizReports key="third" studentId={studentId} allBooks={allBooks} />,
    ]);


    const changeTab = (idx) => {
        setCurrentStep(idx);
    };
    return (
        <div className={cls.studentDetails}>
            <Navbar />
            <StudentTabs
                changeTab={changeTab}
                step={step}
                currentStep={currentStep}
            />
            {openEditStudent && (
                <EditStudentModal
                    setOpenPreview={setOpenEditStudent}
                    studentDetails={studentDetails}
                    setStudentDetails={setStudentDetails}
                    studentCountry={studentCountry}
                    semesters={semesters}
                    levels={levels}
                />
            )}
        </div>
    );
};

export default Student;