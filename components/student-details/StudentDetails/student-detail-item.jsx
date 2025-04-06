import Grid from "@mui/material/Grid2";

const fields = [
    { label: "البريد الإلكتروني", value: (details) => details.email },
    { label: "رقم الموبايل", value: (details) => details.phone },
    { label: "الجنس", value: (details) => details.gender },
    { label: "الدولة", value: (details) => details.country.title },
    { label: "المدينة", value: (details) => details.city.title },
    { label: "الصف الدراسي", value: (details) => details.level.title },
    { label: "الفصل الدراسي", value: (details) => details.semester.title },
    {
        label: "الفصل المدرسي",
        value: (details) => details?.school_class?.title || "لم تتم إضافته"
    },
];

const StudentDetailItem = ({ studentDetails, cls }) => {
    return (
        <Grid container columnSpacing={2}>
            {fields.map((field, index) => (
                <Grid key={index} item="true" size={{ xs: 12, sm: 6 }}>
                    <div className={cls.field}>
                        <label>{field.label}</label>
                        <p>{field.value(studentDetails)}</p>
                    </div>
                </Grid>
            ))}
        </Grid>
    )
}

export default StudentDetailItem
