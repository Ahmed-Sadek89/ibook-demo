"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import Grid from "@mui/material/Grid2";
import Container from "@mui/system/Container";
import { apiClient } from "../../Utils/axios";
import cls from "./addStudent.module.scss";
import BaseInputs from "./base-inputs";
import CalenderInput from "./calender-input";
import SelectInputs from "./select-inputs";
import { makeNotification } from "../../Utils/make-notification";
import GenderSelect from "./gender-select";
import { getSchoolClassByLevelId } from "../../api/school-class-by-level-id";
import * as EmailValidator from "email-validator";
import Cookies from "universal-cookie";

const AddStudent = ({ studentCountry, semesters, levels }) => {
    const cookie = new Cookies()
    
    const [state, setState] = useState({
        studentData: {
            username: "",
            name: "",
            email: "",
            password: "",
            phone: "",
        },
        studentGender: "",
        birthDate: "",
        country: studentCountry,
        city: "",
        semester: "",
        level: "",
        classes: [],
        studentClass: "",
        emptyFields: false,
        validEmail: true,
        loading: false,
    });

    const fetchSchoolClasses = async () => {
        const response = await getSchoolClassByLevelId(state.level.id);
        if (response.success) {
            setState((prev) => ({
                ...prev,
                classes: response.data.school_classes,
            }));
        }
    };

    useEffect(() => {
        if (state.level.id) {
            fetchSchoolClasses();
        }
    }, [state.level]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prev) => ({
            ...prev,
            studentData: {
                ...prev.studentData,
                [name]: value,
            },
        }));
    };

    const handleChooseChange = (field, value) => {
        setState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addStudent = async () => {
        const student = {
            ...state.studentData,
            gender: state.studentGender.query,
            birth_date: state.birthDate,
            country_id: state.country.id,
            city_id: state.city.id,
            semester_id: state.semester.id,
            level_id: state.level.id,
            school_class_id: state.studentClass.id,
        };

        for (const [key, value] of Object.entries(student)) {
            if (key !== "phone" && key !== "school_class_id") {
                if (value === "" || value === undefined) {
                    return setState((prev) => ({ ...prev, emptyFields: true }));
                }
            }
        }

        if (!EmailValidator.validate(state.studentData.email)) {
            return setState((prev) => ({ ...prev, validEmail: false }));
        }

        setState((prev) => ({ ...prev, loading: true }));

        try {
            const { data } = await apiClient.post(
                `/crm/parents/students?lang=ar`,
                student,
                {
                    headers: {
                        Authorization: `Bearer ${cookie.get("ibook-auth")}`,
                    },
                }
            );

            if (data.success) {
                makeNotification("success", "تم إضافة الطالب بنجاح");
            } else {
                Object.values(data.errors).forEach((error) => errorNotify(error[0]));
            }
        } catch (error) {
            console.error(error)
            makeNotification("error", "An error occurred while adding the student.");
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className={cls.add_student}>
            <Navbar />
            {state.loading && <Loader />}
            <Container>
                <div className={cls.studentForm}>
                    <h3>إضافة طالب</h3>
                    <Grid container spacing={2}>
                        <BaseInputs state={state} handleInputChange={handleInputChange} />
                        <GenderSelect state={state} handleChooseChange={handleChooseChange} />
                        <CalenderInput
                            birthDate={state.birthDate}
                            handleChange={(newValue) => setState((prev) => ({ ...prev, birthDate: newValue ? newValue.toISOString() : "" }))}
                            emptyFields={state.emptyFields}
                        />
                        <SelectInputs
                            setState={setState}
                            state={state}
                            levels={levels}
                            semesters={semesters}
                        />
                    </Grid>
                    <div className={cls.btn}>
                        <button onClick={addStudent}>إضافة طالب</button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AddStudent;

