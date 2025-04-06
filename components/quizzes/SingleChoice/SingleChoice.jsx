/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";

import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";

import { toast } from "react-toastify";

import { apiClient } from "../../../Utils/axios";

import Cookies from "universal-cookie";

import cls from "./singleChoice.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const cookie = new Cookies();

const SingleChoice = ({
  question,
  idx,
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
  const [choosedAnswer, setChoosedAnswer] = useState(null);
  const [wrongTries, setWrongTries] = useState(0);

  const [changing, setChanging] = useState(false);
  const inputRef = useRef();

  const submit = async () => {
    if (choosedAnswer) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: choosedAnswer.id,
      };

      const response = await apiClient.post(
        `/crm/students/quiz/answer_question`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        }
      );

      if (!response) return;

      setLoading(false);

      setResults((prev) => [...prev, response.data.data.is_correct]);

      if (questionsNum === questionNum) {
        setOpenSuccess(true);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
        setChoosedAnswer(null);
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    }
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.singelChoice} ${changing && cls.animation}`}>
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

      <div className="quesImage">
        {question?.question_img && !changing && (
          <img src={question?.question_img} alt="image" />
        )}
      </div>

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

      {direction === "rtl" ? (
        <h6 className={cls.headH6}>
          إختر الإجابة الصحيحة من الإختيارات التالية
        </h6>
      ) : (
        <h6 className={cls.headH6}>
          Choose the correct answer for the next question
        </h6>
      )}

      <h6>
        <span>{questionNum})</span> {question?.title}
      </h6>

      <div className={cls.answers}>
        {question.answers.map((answer, idx) => (
          <p key={answer.id}>
            <span className={cls.num}>{idx + 1}</span>

            <span>
              <input
                className="ui-radiobox"
                type="radio"
                ref={inputRef}
                name={question.id}
                id={answer.id}
                value={choosedAnswer ? choosedAnswer?.title : ""}
                onChange={() => setChoosedAnswer(answer)}
                checked={choosedAnswer ? choosedAnswer.id === answer.id : false}
              />{" "}
              <label htmlFor={answer.id}>{answer.title}</label>
              {answer.answer_img && (
                <Image
                  width={100}
                  height={90}
                  className={cls.ansImage}
                  src={answer.answer_img}
                  alt="answerImage"
                />
              )}
            </span>
          </p>
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

            {/* <i
              className={`       ${cls.next
                } fa-light fa-circle-right`}
            ></i> */}
            <Icon className={cls.next} icon="fa6-regular:circle-right" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleChoice;
