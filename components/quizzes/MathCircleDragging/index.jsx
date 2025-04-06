import { Fragment, useState, useMemo } from "react";
//== Modules
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//= I18n
;
//== Component Logic
import useLogic from './logic';
//== Utils
import shuffleArray from "../../../Utils/shuffleArray";
//== Styles
import cls from './mathcircle-dragging.module.scss';

const cookie = new Cookies();

function MathCircleDragging({
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
    if (Object.values(answers).length) {
      console.log(question?.answers)
      console.log(answers)
      setLoading(true);
      let studentAnswers = [];
      document.querySelectorAll(`#question-container`).forEach(element => {
        let topRight = element.querySelector(`.${cls.mathDashEq}:nth-of-type(1) .${cls.mathEq}:nth-of-type(1)`);
        let bottomRight = element.querySelector(`.${cls.mathDashEq}:nth-of-type(1) .${cls.mathEq}:nth-of-type(2)`);
        let topLeft = element.querySelector(`.${cls.mathDashEq}:nth-of-type(2) .${cls.mathEq}:nth-of-type(1)`);
        let bottomLeft = element.querySelector(`.${cls.mathDashEq}:nth-of-type(2) .${cls.mathEq}:nth-of-type(2)`);

        studentAnswers.push(`${topLeft.textContent.trim()}/${bottomLeft.textContent.trim()}-${topRight.textContent.trim()}/${bottomRight.textContent.trim()}`)
      });
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: [`${studentAnswers.join('|')}`]
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

  if (!rendered) return null;
  return (
    <div className={cls.mathcircleDragging}>
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
        <img src={question?.question_img} alt="math circle" />
        <div className={cls.questionParts}>
          {question?.answers[0]?.title?.split("{dash}").filter(str => str !== "").map((answer, idx) => (
            <div className={cls.questionTop} id={"question-container"} key={answer.id}>
              <p>{answer}</p>
              <div className={cls.questionEquation}>
                <span>=</span>
                <div className={cls.mathDashEq}>
                  <div className={cls.mathEq} id={`${idx}-1`} data-index={idx} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, idx)} />
                  <b></b>
                  <div className={cls.mathEq} id={`${idx}-2`} data-index={idx} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, idx)} />
                </div>
                <span>بأبسط صورة</span>
                <div className={cls.mathDashEq}>
                  <div className={cls.mathEq} id={`${idx}-3`} data-index={idx} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, idx)} />
                  <b></b>
                  <div className={cls.mathEq} id={`${idx}-4`} data-index={idx} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, idx)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={cls.choices} ref={draggableContainer}>
        {
          shuffledAnswers[0]?.answer_two_gap_match?.split("-").map((answer, idx) => (
            <Fragment key={idx}>
              {
                answer.split(/[\/|]/).map((number, index) => (
                  <span
                    key={number}
                    id={number}
                    data-id={`{"${idx}": "${number}"}`}
                    data-index={idx}
                    draggable={true}
                    onDragStart={(e) => dragStart(e)}
                    onDragEnd={(e) => dragEnd(e)}
                    onTouchStart={(e) => touchStart(e)}
                    onTouchMove={(e) => touchMoving(e)}
                    onTouchEnd={(e) => touchEnd(e)}
                  >
                    {number}
                  </span>
                ))
              }
            </Fragment>
          ))
        }
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
              className={`${direction === 'rtl' ? cls.ar : cls.en} ${cls.next
                } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default MathCircleDragging;