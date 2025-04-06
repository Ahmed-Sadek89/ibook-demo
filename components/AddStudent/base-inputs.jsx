import InputField from "./input-field";

const BaseInputs = ({ state, handleInputChange }) => {
    const { studentData, emptyFields, validEmail } = state;
    const fields = [
        {
            label: "إسم المستخدم ( باللغة الإنجليزية )",
            name: "username",
            value: studentData.username,
            placeholder: "إسم المستخدم",
            type: "text",
            errorCondition: emptyFields && !studentData.username,
            errorMessage: "هذا الحقل لا يجب أن يكون فارغاَ"
        },
        {
            label: "إسم الطالب",
            name: "name",
            value: studentData.name,
            placeholder: "إسم الطالب",
            type: "text",
            errorCondition: emptyFields && !studentData.name,
            errorMessage: "هذا الحقل لا يجب أن يكون فارغاَ"
        },
        {
            label: "البريد الإلكتروني",
            name: "email",
            value: studentData.email,
            placeholder: "البريد الإلكتروني",
            type: "email",
            errorCondition: emptyFields && !studentData.email || !validEmail,
            errorMessage: emptyFields && !studentData.email ? "هذا الحقل لا يجب أن يكون فارغاَ" : "البريد الإلكتروني غير صالح"
        },
        {
            label: "كلمة السر",
            name: "password",
            value: studentData.password,
            placeholder: "كلمة السر",
            type: "password",
            errorCondition: emptyFields && !studentData.password,
            errorMessage: "هذا الحقل لا يجب أن يكون فارغاَ"
        },
        {
            label: "رقم الموبايل",
            name: "phone",
            value: studentData.phone,
            placeholder: "رقم الموبايل",
            type: "number",
            errorCondition: false,
            errorMessage: ""
        }
    ];

    return (
        <>
            {fields.map((field, index) => (
                <InputField
                    key={index}
                    label={field.label}
                    value={field.value}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={handleInputChange}
                    errorCondition={field.errorCondition}
                    errorMessage={field.errorMessage}
                />
            ))}
        </>
    );
};

export default BaseInputs;
