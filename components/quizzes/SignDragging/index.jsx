import { useState } from "react";
//== Modules
import {apiClient} from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//== I18n
  ;
//== Component Logic
import useLogic from './logic';
//== Styles
import cls from './signDragging.module.scss';

const cookie = new Cookies();

const SignDragging = ({
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
  const { draggableContainer, dragStart, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, rendered, answers } = useLogic();
       
  const [changing, setChanging] = useState(false);

  const order = {
    0: direction === 'rtl' ? 'أ' : 'A',
    1: direction === 'rtl' ? 'ب' : 'B',
    2: direction === 'rtl' ? 'ج' : 'C',
    3: direction === 'rtl' ? 'د' : 'D',
    4: direction === 'rtl' ? 'هـ' : 'E',
    5: direction === 'rtl' ? 'و' : 'F',
  }

  const submit = async () => {
    if (Object.values(answers).length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer:
          Object.values(answers).map(answer => Object.values(answer).flat(1)).flat(),
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

  const replaceSymbol = (title) => {
    const modifiedTitle = title.replace(">", "#").replace("<", "#");
    const titleSplit = modifiedTitle.split("#");

    return <h6>
      <span>
        {titleSplit[0]}
        <img
          src="/imgs/greater-than.png"
          alt="check-mark"
          data-sign="<"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e)}
          onTouchStart={(e) => touchStart(e)}
          onTouchMove={(e) => touchMoving(e)}
          onTouchEnd={(e) => touchEnd(e)}
        />
        {titleSplit[1]}
        <img
          src="/imgs/less-than.png"
          alt="check-mark"
          data-sign=">"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e)}
          onTouchStart={(e) => touchStart(e)}
          onTouchMove={(e) => touchMoving(e)}
          onTouchEnd={(e) => touchEnd(e)}
        />
        {titleSplit[2]}
      </span>
    </h6>;
  };

  if (!rendered) return null;
  return (
    <div className={cls.signDragging} ref={draggableContainer}>
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
      {replaceSymbol(question?.title)}

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

      <div className={cls.items}>
        {question?.answers?.map((answer, index) => (
          <div className={cls.item} key={answer.id}>
            <span>{order[index]})</span>
            {answer?.title?.split('{dash}')[0]}
            <div data-index={index} id={answer.id} className={cls.number} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, index)}></div>
            {answer?.title?.split('{dash}')[1]}
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

export default SignDragging;