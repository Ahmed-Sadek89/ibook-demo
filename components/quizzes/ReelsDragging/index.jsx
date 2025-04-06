import { useState, useMemo } from "react";
//== Modules
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//== Component Logic
import useLogic from './logic';
//= Utils
import shuffleArray from "../../../Utils/shuffleArray";
//== Styles
import cls from './reels-dragging.module.scss';

const cookie = new Cookies();

function ReelsDragging({
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
}) {
  const { draggableContainer, dragStart, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, rendered, answers } = useLogic();

  const [changing, setChanging] = useState(false);

  const shuffledAnswers = useMemo(() => shuffleArray(question?.answers), [question?.answers]);

  const submit = async () => {
    if (answers.length) {
      setLoading(true);
      console.log(answers)
      const orderedAnswer = answers
        .sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])
        .map(obj => Object.values(obj)[0]);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: orderedAnswer,
      };
      console.log(data);
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

  if (!rendered) return null;
  return (
    <div className={cls.reelsDragging}>
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

      <div className={cls.circles} ref={draggableContainer}>
        {shuffledAnswers.map((answer, index) => (
          <span
            key={index}
            id={answer.id}
            draggable={true}
            onDragStart={(e) => dragStart(e)}
            onDragEnd={(e) => dragEnd(e)}
            onTouchStart={(e) => touchStart(e)}
            onTouchMove={(e) => touchMoving(e)}
            onTouchEnd={(e) => touchEnd(e)}
          >
            {answer.title}
          </span>
        ))}
      </div>
      <div className={cls.items}>
        {console.log(question?.answers)}
        {question?.answers.map((answer, index) => (
          <div className={cls.item} key={index}>
            <img
              src={answer.answer_img}
              alt="reel"
            />
            <div data-index={index} className={cls.circle} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, index)}></div>
          </div>
        ))}
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
              className={`       ${cls.next
                } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default ReelsDragging;