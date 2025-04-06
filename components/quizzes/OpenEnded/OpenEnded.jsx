import { useState } from "react";

import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";

import {apiClient} from "../../../Utils/axios";

import Cookies from "universal-cookie";

import cls from "./openEnded.module.scss";

const cookie = new Cookies();

const OpenEnded = ({
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
  const [field, setField] = useState("");
       
  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (field) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: field,
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
      // setResults((prev) => [...prev, response.data.data.is_correct]);
      if (questionsNum === questionNum) {
        setOpenSuccess(true);
        setOpenQuizModal(false)
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);

        setField("");
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    }
  };

  return (
    <div className={`${cls.openEnded} ${changing && cls.animation}`}>
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
      <h6>
        {questionNum}) {question?.title}
      </h6>
      <input
        type="text"
        placeholder={direction === "rtl" ? "اكتب الاجابة" : "Enter Your Answer"}
        value={field}
        onChange={(e) => setField(e.target.value)}
      />
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
  );
};

export default OpenEnded;
