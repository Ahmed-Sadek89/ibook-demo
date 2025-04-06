import cls from "./addStudent.module.scss";
import Grid from '@mui/material/Grid2';

const InputField = ({
    label,
    value,
    name,
    type = "text",
    placeholder,
    onChange,
    errorCondition,
    errorMessage,
}) => (
    <Grid item="true" size={{ xs: 12, sm: 6 }}>
        <div className={cls.field}>
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                className={errorCondition ? cls.error : ""}
            />
            {errorCondition && <span>{errorMessage}</span>}
        </div>
    </Grid>
);

export default InputField
