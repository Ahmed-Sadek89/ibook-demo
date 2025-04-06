import { useEffect, useState, useRef } from "react";
import Choose from "../../UIs/Choose/Choose";
import Loader from "../../Loader/Loader";
import Cookies from "universal-cookie";
import Grid from "@mui/material/Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import * as EmailValidator from "email-validator";
import { toast } from "react-toastify";
import cls from "./editStudentModal.module.scss";
import { apiClient } from "../../../Utils/axios";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";

const cookie = new Cookies();

const PreviewModal = ({
  setOpenPreview,
  studentDetails,
  studentCountry,
  semesters,
  levels,
  setStudentDetails,
}) => {
  const [studentData, setStudentData] = useState({
    username: studentDetails.username,
    name: studentDetails.name,
    email: studentDetails.email,
    password: "",
    phone: studentDetails.phone,
  });
  const [studentGender, setStudentGender] = useState("");
  const [birthDate, setBirthDate] = useState(studentDetails.birth_date);
  const [country, setCountry] = useState(studentCountry);
  const [city, setCity] = useState(studentDetails.city);
  const [semester, setSemester] = useState(studentDetails.semester);
  const [level, setLevel] = useState(studentDetails.level);
  const [classes, setClasses] = useState([]);
  const [studentClass, setStudentClass] = useState(studentDetails.school_class);
  const [emptyFields, setEmptyFields] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const gender = [
    {
      title: "ذكر",
      query: "male",
    },
    {
      title: "انثي",
      query: "female",
    },
  ];

  useEffect(() => {
    setStudentGender(
      gender.find((gender) => gender.query === studentDetails.gender)
    );
  }, []);

  const overlay = useRef();

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if (overlay.current === e.target) setOpenPreview(false);
  };

  const close = async () => {
    setOpenPreview(false);
  };

  const fetchSchoolClasses = async () => {
    const response = await apiClient.get(
      `/crm/school_classes?lang=ar&level_id=${level.id}`
    );
    if (response.data.success) {
      setClasses(response.data.data.school_classes);
    }
  };

  useEffect(() => {
    fetchSchoolClasses();
  }, [level]);

  const handleStudentDataChange = (e) => {
    setStudentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const editStudent = async () => {
    const student = {
      ...studentData,
      gender: studentGender.query,
      birth_date: birthDate,
      country_id: country.id,
      city_id: city.id,
      semester_id: semester.id,
      level_id: level.id,
      school_class_id: studentClass.id,
    };

    for (const [key, value] of Object.entries(student)) {
      if (key !== "phone" && key !== "school_class_id" && key !== "password") {
        if (value === "" || value === undefined) {
          return setEmptyFields(true);
        }
      }
    }

    if (!EmailValidator.validate(studentData.email)) {
      return setValidEmail(false);
    }

    setLoading(true);

    const { data } = await apiClient
      .post(
        `/crm/parents/students/update/${studentDetails.id}?lang=ar`,
        student,
        {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        }
      )
      .catch((err) => {
        setLoading(false);
        close();
        errorNotify("Something went wrong!");
      });

    if (data.success) {
      setStudentDetails({ ...data.data });
      successNotify("تم تعديل بيانات الطالب بنجاح");
    } else {
      Object.values(data.errors).forEach((error) => errorNotify(error[0]));
    }

    setLoading(false);

    close();
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      {loading && <Loader />}

      <div className={cls.area}>
        <div className={`${cls.close}`} onClick={close}>
          <Icon icon="ic:baseline-close" width="20px" height="20px" />
        </div>
        <div className={cls.area__wrapper}>

          <div className={cls.title}>
            <h4>تعديل بيانات الطالب</h4>
          </div>

          <div className={cls.studentForm}>
            <Grid container spacing={2}>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">إسم المستخدم ( باللغة الإنجليزية )</label>
                  <input
                    type="text"
                    placeholder="إسم المستخدم"
                    value={studentData.username || ""}
                    name="username"
                    onChange={(e) => handleStudentDataChange(e)}
                    className={
                      emptyFields && !studentData.username ? cls.error : ""
                    }
                  />
                  {emptyFields && !studentData.username && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">إسم الطالب</label>
                  <input
                    type="text"
                    placeholder="إسم الطالب"
                    value={studentData.name || ""}
                    name="name"
                    onChange={(e) => handleStudentDataChange(e)}
                    className={
                      emptyFields && !studentData.name ? cls.error : ""
                    }
                  />
                  {emptyFields && !studentData.name && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={studentData.email || ""}
                    name="email"
                    onChange={(e) => handleStudentDataChange(e)}
                    className={
                      (emptyFields && !studentData.email) || !validEmail
                        ? cls.error
                        : ""
                    }
                  />
                  {emptyFields && !studentData.email && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                  {!validEmail && <span>البريد الإلكتروني غير صالح</span>}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">كلمة السر</label>
                  <input
                    type="password"
                    placeholder="كلمة السر"
                    value={studentData.password || ""}
                    name="password"
                    onChange={(e) => handleStudentDataChange(e)}
                  />
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">رقم الموبايل</label>
                  <input
                    type="number"
                    placeholder="رقم الموبايل"
                    value={studentData.phone}
                    name="phone"
                    onChange={(e) => handleStudentDataChange(e)}
                  />
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">الجنس</label>
                  <Choose
                    placeholder="الجنس"
                    results={gender}
                    choose={setStudentGender}
                    value={studentGender.title ? studentGender.title : ""}
                    keyword="title"
                    error={emptyFields && !studentGender}
                  />
                  {emptyFields && !studentGender && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.specialField}>
                  <label htmlFor="">تاريخ الميلاد</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={birthDate ? dayjs(birthDate) : null}
                      onChange={(newValue) => setBirthDate(newValue)}
                      textField={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {/* //old */}
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      mask="____/__/__"
                      value={birthDate || ""}
                      onChange={(newValue) => setBirthDate(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider> */}
                  {emptyFields && !birthDate && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">الدولة</label>
                  <Choose
                    placeholder="الدولة"
                    results={[]}
                    choose={setCountry}
                    value={country.title ? country.title : ""}
                    keyword="title"
                    error={emptyFields && !country}
                    disabled={true}
                  />
                  {emptyFields && !country && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label htmlFor="">المدينة</label>
                  <Choose
                    placeholder="المدينة"
                    results={country.cities}
                    choose={setCity}
                    value={city.title ? city.title : ""}
                    keyword="title"
                    error={emptyFields && !city}
                  />
                  {emptyFields && !city && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label>الصف الدراسي</label>
                  <Choose
                    placeholder="الصف الدراسي"
                    results={levels}
                    choose={setLevel}
                    value={level.title ? level.title : ""}
                    keyword="title"
                    error={emptyFields && !level}
                  />
                  {emptyFields && !level && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label>الفصل الدراسي</label>
                  <Choose
                    placeholder="الفصل الدراسي"
                    results={semesters}
                    choose={setSemester}
                    value={semester.title ? semester.title : ""}
                    keyword="title"
                    error={emptyFields && !semester}
                  />
                  {emptyFields && !semester && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                  )}
                </div>
              </Grid>
              <Grid item="true" size={{ xs: 12, sm: 6 }}>
                <div className={cls.field}>
                  <label>الفصل المدرسي</label>
                  <Choose
                    placeholder="الفصل المدرسي"
                    results={classes}
                    choose={setStudentClass}
                    value={studentClass.title ? studentClass.title : ""}
                    keyword="title"
                  />
                </div>
              </Grid>
            </Grid>
            <div className={cls.btn}>
              <button onClick={editStudent}>حفظ البيانات</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
