import cls from "./addStudent.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid2';
import dayjs from "dayjs";

const CalenderInput = ({ birthDate, emptyFields, handleChange }) => {
    return (
        <Grid item="true" size={{ xs: 12, sm: 6 }}>
            <div className={cls.specialField}>
                <label htmlFor="birthDate">تاريخ الميلاد</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={birthDate ? dayjs(birthDate) : null}
                        onChange={handleChange}
                        textField={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                {emptyFields && !birthDate && (
                    <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
            </div>
        </Grid>
    )
}

export default CalenderInput
