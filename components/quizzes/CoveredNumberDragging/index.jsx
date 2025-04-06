import { useMemo, useState } from "react";
//== Modules
import {apiClient} from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//= I18n
  ;
//== Component Logic
import useLogic from './logic';
//== Utils
import e2a from '../../../Utils/englishToArabic';
//== Styles
import cls from './coveredNumber-dragging.module.scss';

const cookie = new Cookies();

function CoveredNumberDragging({
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
  const { draggableContainer, dragStart, moving, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, retry, rendered, answers } = useLogic();
       
  const [changing, setChanging] = useState(false);

  const generatedAnswers = useMemo(() => {
    return question?.answers[0]?.answer_two_gap_match.split('|').map(answer => {
      const arrayOfAnswers = [...generateChoices(answer)]
      return arrayOfAnswers.sort(() => Math.random() - 0.5);
    })
  }, [question]);

  function generateChoices(uniqueNum) {

    const uniqueNumbers = new Set();

    if (uniqueNum < 5) {
      while (uniqueNumbers.size < 3) {
        const randomNumber = Math.floor(Math.random() * 4) + 6;
        uniqueNumbers.add(randomNumber);
      }
    } else {
      while (uniqueNumbers.size < 3) {
        const randomNumber = Math.floor(Math.random() * 5);
        uniqueNumbers.add(randomNumber);
      }
    }

    const uniqueArray = Array.from(uniqueNumbers);

    const firstTwoElements = uniqueArray.slice(0, 2);

    firstTwoElements.push(uniqueNum);

    return firstTwoElements;
  }

  const submit = async () => {
    if (Object.values(answers).length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer:
          Object.values(answers).map(answer => Object.values(answer).flat(1)).flat()
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

  if (!rendered) return null;
  return (
    <div className={cls.coveredNumberDragging}>
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
      <h6>
        {question?.title}
        <span ref={draggableContainer} className={cls.circles}>
          {question?.answers[0]?.title?.split("{dash}").map((_, idx) => (
            <img
              key={idx}
              src="/imgs/circle.svg"
              alt="circle"
              draggable={true}
              onDragStart={(e) => dragStart(e)}
              onDragEnd={(e) => dragEnd(e)}
              onTouchStart={(e) => touchStart(e)}
              onTouchMove={(e) => touchMoving(e)}
              onTouchEnd={(e) => touchEnd(e)}
            />
          ))}
        </span>
      </h6>

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

      <div className={cls.columns}>
        <div className={cls.column}>
          <p>العدد</p>
          {
            question?.answers[0]?.title?.split("{dash}")?.filter(item => item !== '').map(answer => (
              <div className={cls.answers} key={answer.id}>
                <div className={cls.number}>
                  <span>{answer[0] === '-' ? answer.split('-')[1].substring(2) : answer.split('-')[0].substring(2)}</span>
                  <img src="/imgs/hand3.png" alt="hand_image" />
                  <span>{answer[0] === '-' ? answer.split('-')[1].substring(0, 1) : answer.split('-')[0].substring(0, 1)}</span>
                </div>
              </div>
            ))
          }
        </div>
        <div className={cls.column}>
          <p>{question?.title_middle}</p>
          {
            question?.answers[0]?.title?.split("{dash}")?.filter(item => item !== '').map(answer => (
              <div className={cls.answers} key={answer.id}>
                <div className={cls.number}>
                  <span>{answer[0] === '-' ? answer.split('-')[2] : answer.split('-')[1]}</span>
                </div>
              </div>
            ))
          }
        </div>
        <div className={cls.column}>
          <p>الرقم المغطى</p>
          {
            generatedAnswers.map((answerArray, idx) => (
              <div className={cls.answers} key={idx}>
                {answerArray.map(number => (
                  <div
                    key={number}
                    id={number}
                    data-index={idx}
                    className={`${cls.number} ${cls.numberAnswer}`}
                    onDragOver={(e) => dragOver(e)}
                    onDrop={(e) => drop(e, idx)}
                  >
                    {direction === 'rtl' ? e2a(`${number}`) : number}
                  </div>
                ))}
              </div>
            ))
          }
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
              className={`${direction === 'rtl' ? cls.ar : cls.en} ${cls.next
                } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default CoveredNumberDragging;