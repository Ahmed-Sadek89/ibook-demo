import { useState } from "react";

import cls from "./correctAnswer.module.scss";

const CorrectAnswer = ({ results, setOpenQuizModal }) => {
  const [studentResult, setStudentResult] = useState(
    results.filter((one) => one === 1).length
  );
  const [successResult, setSuccessResult] = useState(results.length / 2);

  return (
    <div className={cls.dropLayer}>
      <div className={cls.inside}>
        {/* <audio autoPlay src="/audios/correct.mp3"></audio> */}

        {studentResult >= successResult ? (
          <img src="/imgs/success.png" alt="correctImage" />
        ) : (
          <img src="/imgs/fail.png" alt="correctImage" />
        )}

        <div className={cls.results}>
          <h1
            className={studentResult >= successResult ? cls.success : cls.fail}
          >
            {studentResult >= successResult ? (
              <span>أحسنت</span>
            ) : (
              <span>أخطأت</span>
            )}
          </h1>
          <h3>
            لقد حصلت علي: {studentResult} \ {results.length}
          </h3>

          <button onClick={() => setOpenQuizModal(false)}>حسناَ</button>
        </div>
      </div>
    </div>
  );
};

export default CorrectAnswer;
