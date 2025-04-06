import { useState, useMemo } from 'react';
//== Modules
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
//= Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
//== Components
import Grid from '@mui/material/Grid';
//= Component logic
import useLogic from './logic';
//= Utils
import shuffleArray from '../../../Utils/shuffleArray';
//= Styles
import cls from './columnsDragging.module.scss';

const cookie = new Cookies();

const ColumnsDragging = ({
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
  const { draggableContainer, draggableText, dragStart, dragEnd, dragOver, drop, touchStart, touchMoving, touchEnd, answers } = useLogic();
  const [changing, setChanging] = useState(false);

  const shuffledImages = useMemo(() => shuffleArray(question?.answers), [question?.answers]);
  const shuffledNumbers = useMemo(() => shuffleArray(question?.answers), [question?.answers]);

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
    <div className={cls.columnsDragging}>
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
      {
        question.question_img ?
          <div className={cls.questionImg}>
            <img src={question.question_img} alt="question_image" />
          </div>
          :
          null
      }
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <div className={cls.container}>
            <div className={cls.numbers}>
              {question?.answers?.map(answer => (
                <p key={answer.id}>{answer.title}</p>
              ))}
            </div>
            <div className={cls.columns}>
              <div className={cls.lines}>
                {question?.answers?.map((answer, index) => (
                  <div data-index={index} data-type="image" id={answer.id} key={answer.id} className={cls.lineDrop} data-id="lineDrop" onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, index)}></div>
                ))}
              </div>
              <div className={cls.base}>
                <span>أحاد</span>
                <span>عشرات</span>
                <span>مئات</span>
                <span>
                  أحاد
                  <br />
                  الألاف
                </span>
                <span>
                  عشرات
                  <br />
                  الألاف
                </span>
              </div>
              <div className={cls.boxes}>
                {question?.answers?.map((answer, index) => (
                  <div data-index={index} data-type="text" id={answer.id} key={answer.id} className={cls.box} data-id="boxDrop" onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, index)}></div>
                ))}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={cls.container}>
            <div className={cls.bigNumbers} ref={draggableText}>
              {shuffledNumbers?.map(answer => (
                <span
                  className={cls.draggingItem}
                  key={answer.id}
                  id={answer.id}
                  draggable={true}
                  onDragStart={(e) => dragStart(e)}
                  onDragEnd={(e) => dragEnd(e)}
                  onTouchStart={(e) => touchStart(e)}
                  onTouchMove={(e) => touchMoving(e)}
                  onTouchEnd={(e) => touchEnd(e)}
                >
                  {answer?.answer_two_gap_match}
                </span>
              ))}
            </div>
            <div className={cls.balls} ref={draggableContainer}>
              {shuffledImages?.map(answer => (
                <img
                  key={answer.id}
                  src={answer.answer_img}
                  alt="balls"
                  loading='lazy'
                  id={answer.id}
                  draggable={true}
                  onDragStart={(e) => dragStart(e)}
                  onDragEnd={(e) => dragEnd(e)}
                  onTouchStart={(e) => touchStart(e)}
                  onTouchMove={(e) => touchMoving(e)}
                  onTouchEnd={(e) => touchEnd(e)}
                />
              ))}
            </div>
          </div>
        </Grid>
      </Grid>

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

export default ColumnsDragging