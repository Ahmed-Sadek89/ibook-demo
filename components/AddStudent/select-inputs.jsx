import Grid from '@mui/material/Grid2';
import Choose from '../UIs/Choose/Choose';
import cls from "./addStudent.module.scss";

const SelectInputs = ({ state, setState, levels, semesters }) => {
    const fields = [
        {
            label: "الدولة",
            name: "country",
            results: [],
            value: state.country?.title || "",
            choose: (value) =>
                setState((prev) => ({
                    ...prev,
                    country: value,
                    city: "",
                })),
            error: state.emptyFields && !state.country,
            disabled: true
        },
        {
            label: "المدينة",
            name: "city",
            results: state.country?.cities || [],
            value: state.city?.title || "",
            choose: (value) =>
                setState((prev) => ({
                    ...prev,
                    city: value,
                })),
            error: state.emptyFields && !state.city
        },
        {
            label: "الصف الدراسي",
            name: "level",
            results: levels,
            value: state.level?.title || "",
            choose: (value) =>
                setState((prev) => ({
                    ...prev,
                    level: value,
                    classes: [],
                    studentClass: "",
                })),
            error: state.emptyFields && !state.level
        },
        {
            label: "الفصل الدراسي",
            name: "semester",
            results: semesters,
            value: state.semester?.title || "",
            choose: (value) =>
                setState((prev) => ({
                    ...prev,
                    semester: value,
                })),
            error: state.emptyFields && !state.semester
        },
        {
            label: "الفصل المدرسي",
            name: "studentClass",
            results: state.classes || [],
            value: state.studentClass?.title || "",
            choose: (value) =>
                setState((prev) => ({
                    ...prev,
                    studentClass: value,
                }))
        }
    ];

    return (
        <>
            {fields.map((field, index) => (
                <Grid item="true" size={{ xs: 12, sm: 6 }} key={index}>
                    <div className={cls.field}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <Choose
                            placeholder={field.label}
                            results={field.results}
                            choose={field.choose}
                            value={field.value}
                            keyword="title"
                            error={field.error}
                            disabled={field.disabled}
                        />
                        {field.error && <span>هذا الحقل لا يجب أن يكون فارغاَ</span>}
                    </div>
                </Grid>
            ))}
        </>
    );
};

export default SelectInputs;
