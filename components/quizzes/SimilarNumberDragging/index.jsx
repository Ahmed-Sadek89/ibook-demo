import { useState } from "react";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
// axios
import { apiClient } from '../../../Utils/axios';

import Cookies from "universal-cookie";

;
//== Component Logic
import useLogic from './logic';
//== Styles
import cls from './similarNumberDragging.module.scss';

const cookie = new Cookies();

const NumberDragging = ({
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
  const { draggableContainer, dragStart, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, studentAnswer } = useLogic();

  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (studentAnswer) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: question.answers.find(answer => answer.answer_img === studentAnswer).id,
      };
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

  return (
    <>
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
      <div className={cls.similarNumberDragging}>
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

        <div className={cls.images} ref={draggableContainer}>
          {question.answers.map((answer, idx) => (
            <img
              key={idx}
              src={answer.answer_img}
              alt={answer.title}
              draggable={true}
              onDragStart={(e) => dragStart(e)}
              onDragEnd={(e) => dragEnd(e, idx)}
              onTouchStart={(e) => touchStart(e)}
              onTouchMove={(e) => touchMoving(e)}
              onTouchEnd={(e) => touchEnd(e)}
            />
          ))}
        </div>
        <div className={cls.items}>
          <div className={cls.item}>
            {question.answers.find(answer => answer.is_correct === "1").title}
          </div>
          <div
            className={`${cls.item} ${cls.droppableItem}`}
            onDragOver={(e) => dragOver(e)}
            onDrop={(e) => drop(e)}
          >
          </div>
        </div>
      </div>
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
              className={`       ${cls.next} fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </>
  )
}

export default NumberDragging;