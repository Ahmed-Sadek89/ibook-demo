import cls from "./studentDetails.module.scss";
import Image from "next/image";
import StudentDetailItem from "./student-detail-item";
import { Icon } from "@iconify/react";

const StudentDetails = ({ studentDetails, setOpenEditStudent }) => {
  return (
    <div className={cls.studentDetails}>
      <div className={cls.user}>
        <Image
          src={
            studentDetails.logo_file
              ? studentDetails.logo_file
              : "/imgs/default.jpg"
          }
          alt={studentDetails.name}
          width={150}
          height={150}
        />
        <div className={cls.details}>
          <h3>{studentDetails.name}</h3>
          <p>{studentDetails.username}</p>
          <button onClick={() => setOpenEditStudent(true)}>
            <Icon icon="flowbite:edit-outline" width="20px" height="20px" /> تعديل
          </button>
        </div>
      </div>
      <StudentDetailItem cls={cls} studentDetails={studentDetails} />
    </div>
  );
};

export default StudentDetails;
