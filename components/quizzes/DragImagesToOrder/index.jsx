import { useState, useMemo } from 'react';
//== Modules
import {apiClient} from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//= Component logic
import useLogic from './logic';
//= Utils
import shuffleArray from '../../../Utils/shuffleArray';
//= Styles
import cls from './dragImagesToOrder.module.scss';

const cookie = new Cookies();

const DragImagesToOrder = ({
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
  const { draggableContainer, dragStart, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, answers } = useLogic();
  const [changing, setChanging] = useState(false);

  const shuffledAnswers = useMemo(() => shuffleArray(question?.answers), [question?.answers])

  const submit = async () => {
    if (answers.length) {
      setLoading(true);
      const orderedAnswer = answers
        .sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])
        .map(obj => Object.values(obj)[0]);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: orderedAnswer,
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
    <div className={cls.dragImagesToOrder} ref={draggableContainer}>
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

      <div className={cls.choosingImages}>
        {shuffledAnswers?.map(answer => (
          <div className={cls.img} key={answer.id}>
            <div className={cls.area}>
              <img
                src={answer.answer_img}
                alt="phone"
                id={answer.id}
                draggable={true}
                onDragStart={(e) => dragStart(e)}
                onDragEnd={(e) => dragEnd(e)}
                onTouchStart={(e) => touchStart(e)}
                onTouchMove={(e) => touchMoving(e)}
                onTouchEnd={(e) => touchEnd(e)}
              />
            </div>
            <p>{answer.title}</p>
          </div>
        ))}
      </div>
      <div className={cls.droppables}>
        {question?.answers?.map((answer, index) => (
          <div key={answer.id} data-index={index} id='drop' className={cls.droppable} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, index)}></div>
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
              className={`${direction === 'rtl' ? cls.ar : cls.en} ${cls.next
                } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default DragImagesToOrder;