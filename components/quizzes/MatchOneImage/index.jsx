import { useState } from "react";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
// axios
import { apiClient } from '../../../Utils/axios';

import Cookies from "universal-cookie";
//== Component Logic
import useLogic from './logic';
//== Styles
import cls from './matchOneImage.module.scss';

const cookie = new Cookies();

const MatchOneImage = ({
  question,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction,
  setOpenPreview,
  setLoading,
  setResults,
  setOpenSuccess,
}) => {
  const { rendered, canvasElement, startDrawing, endDrawing, retry, studentAnswer } = useLogic();

  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (studentAnswer) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: question.answers.find(answer => answer.answer_img === studentAnswer).id,
      };
      console.log(data)
      const response = await apiClient
        .post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        })
        .catch((err) => console.log(err));

      if (!response) return;

      setLoading(false);

      setResults((prev) => [...prev, response.data.data.is_correct]);

      if (questionsNum === questionNum) {
        setOpenSuccess(true);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);

        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    }
  };

  if (!rendered) return;
  return (
    <div className={cls.matchOneImage}>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          {direction === "rtl" ? (
            <span>السؤال الحالي</span>
          ) : (
            <span>Current Question</span>
          )}
        </div>

        <div className="lastStep">
          <p>{questionsNum}</p>
          {direction === "rtl" ? (
            <span>عدد الاسئلة</span>
          ) : (
            <span>Questions Number</span>
          )}
        </div>
      </div>
      <h6>{question?.title}</h6>

      <div className="quizHelpers">
        {question?.question_video_link && (
          <div className={cls.videoSection}>
            <VideoSection
              video={question?.question_video_link}
              openModal={setOpenPreview}
              data={false}
            />
          </div>
        )}

        {question?.question_audio && (
          <div className={cls.audioSection}>
            <AudioSection audio={question?.question_audio} data={false} />
          </div>
        )}
      </div>

      <div className={cls.wrapper}>
        <div className={cls.images}>
          {question.answers.slice(1, 3).map((answer, idx) => (
            <img src={answer.answer_img} alt={answer.title} onClick={(e) => endDrawing(e)} key={idx} />
          ))}
        </div>
        <canvas id="canvas" width="380" height="350" ref={canvasElement}></canvas>
        <div className={cls.images}>
          <img src={question.answers[0].answer_img} alt="main_image" onClick={(e) => startDrawing(e)} />
        </div>
        <div className={cls.images}>
          {question.answers.slice(3, 5).map((answer, idx) => (
            <img src={answer.answer_img} alt={answer.title} onClick={(e) => endDrawing(e)} key={idx} />
          ))}
        </div>
      </div>
      {/* <div className={cls.actions}>
        <button onClick={retry}><i className="fa-arrows-rotate fa-regular"></i> إعادة المحاولة</button>
      </div> */}

      <div className={cls.btn}>
        {questionsNum === questionNum ? (
          <button onClick={submit}>
            {direction === "rtl" ? <span>تأكيد </span> : <span>Submit </span>}

            <i className="fa-badge-check fa-light"></i>
          </button>
        ) : (
          <button onClick={submit}>
            {direction === "rtl" ? <span>التالي </span> : <span>Next </span>}

            <i
              className={`       ${cls.next
                } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default MatchOneImage;