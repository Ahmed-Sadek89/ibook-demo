/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import VideoSection from "../../VideoSection/VideoSection";
import cls from "./bigImageWithVideo.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

const BigImageWithVideo = ({
  question,
  setOpenQuizModal,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction,
  setOpenPreview,
}) => {


  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (questionsNum === questionNum) {
      setOpenQuizModal(false);
    } else {
      setQuestionNum((questionNum += 1));
      setChanging(true);
      setTimeout(() => {
        setChanging(false);
      }, 1000);
    }
  };


  return (
    <div className={`${cls.bigImageWithVideo} ${changing && cls.animation}`}>
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

      <div className="quesImage">
        {question?.question_img && !changing && (
          <img src={question?.question_img} alt="image" />
        )}
      </div>

      <div className="quizHelpers">
        {/* {question?.question_video_link && */}

        <div className={cls.videoSection}>
          <VideoSection
            video={question?.question_video_link}
            openModal={setOpenPreview}
            data={false}
          />
        </div>

        {/* } */}
      </div>

      
      <div className={cls.btn}>
        <button onClick={submit}>
          <span>
            {questionsNum === questionNum
              ? direction === "rtl"
                ? "تأكيد"
                : "Submit"
              : direction === "rtl"
                ? "التالي"
                : "Next"}
          </span>{" "}
          <Icon
            className={questionsNum === questionNum ? cls.check : cls.next}
            icon={
              questionsNum === questionNum
                ? "fa:check-circle"
                : "fa6-regular:circle-right"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default BigImageWithVideo;
