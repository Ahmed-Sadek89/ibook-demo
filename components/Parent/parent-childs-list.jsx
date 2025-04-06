import Link from 'next/link'
import cls from "./parent.module.scss";
import Grid from '@mui/material/Grid2';
import Image from 'next/image';

const ParentChildsList = ({ parentData }) => {
    return (
        <Grid item="true" size={{ xs: 12, md: 8 }} >
            <div className={cls.students}>
                <h3>قائمة الأبناء</h3>
                {parentData.data.students.length <= 0 && (
                    <h4>قائمة الأبناء فارغة حتي الاَن</h4>
                )}
                {parentData.data.students.map((student) => (
                    <div className={cls.student} key={student.id}>
                        <div className={cls.details}>
                            <Image
                                src={
                                    student.logo_file
                                        ? student.logo_file
                                        : "/imgs/default.jpg"
                                }
                                alt={student.name}
                                width={100}
                                height={100}
                            />
                            <div className={cls.info}>
                                <h5>{student.name}</h5>
                                <p>{student.username}</p>
                            </div>
                        </div> 
                        <Link href={`/student/${student.id}`}>
                            <button>عرض التفاصيل</button>
                        </Link>
                    </div>
                ))}
            </div>
        </Grid>
    )
}

export default ParentChildsList
