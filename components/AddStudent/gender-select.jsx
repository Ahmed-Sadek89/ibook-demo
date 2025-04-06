import Grid from '@mui/material/Grid2';
import cls from "./addStudent.module.scss";
import Choose from '../UIs/Choose/Choose';

const GenderSelect = ({ handleChooseChange, state }) => {
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
    return (
        <Grid item="true" size={{ xs: 12, sm: 6 }}>
            <div className={cls.field}>
                <label htmlFor="gender">الجنس</label>
                <Choose
                    placeholder="الجنس"
                    results={gender}
                    choose={(value) => handleChooseChange("studentGender", value)}
                    value={state.studentGender.title || ""}
                    keyword="title"
                    error={state.emptyFields && !state.studentGender}
                />
                {state.emptyFields && !state.studentGender && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
            </div>
        </Grid>
    )
}

export default GenderSelect
