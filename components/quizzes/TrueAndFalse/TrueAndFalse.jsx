import { useState } from "react";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import cls from "./trueAndFalse.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const cookie = new Cookies();

const TrueAndFalse = ({
  question,
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
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState("");

  const [changing, setChanging] = useState(false);

  const checkAnswer = (check, answer) => {
    setState(check);
    setAnswer(answer);
  };

  Object.keys(question.answers).forEach((key) => {
    if (question.answers[key].answer_two_gap_match === `${state}`) {
      console.log(`the answer is ${question.answers[key].id}`);
    }
  });

  const submit = async () => {
    setState("");
    let currentAnswer = "";
    Object.keys(question.answers).forEach((key) => {
      if (question.answers[key].answer_two_gap_match === `${state}`) {
        currentAnswer = question.answers[key].id;
      }
    });

    if (currentAnswer) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: currentAnswer,
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
    <div className={`${cls.trueAndFalse} ${changing && cls.animation}`}>
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
          <Image src={question?.question_img} alt="image" width={100} height={100} style={{objectFit: "contain"}} />
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
        <h5>ضع علامة صح او خطأ امام الاجابه المناسبه</h5>
      ) : (
        <h5>Put a mark of true or false in front of the appropriate answer</h5>
      )}

      <div className={cls.question}>
        <h6>
          {" "}
          {questionNum}) {question?.title}
        </h6>

        <div className={cls.checks}>
          <Icon
            className={state === true ? cls.correct : ""}
            icon="material-symbols-light:check-rounded"
            width="24" height="24"
            onClick={() => checkAnswer(true, question.answers[0])}
          />

          <Icon
            onClick={() => checkAnswer(false, question.answers[1])}
            className={state === false ? cls.wrong : ""}
            icon="ci:close-sm"
            width="14" height="14"
          />

        </div>
      </div>

      <div className={cls.btn}>
        <button onClick={submit}>
          {questionsNum === questionNum
            ? direction === "rtl"
              ? "تأكيد"
              : "Submit"
            : direction === "rtl"
              ? "التالي"
              : "Next"}
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

export default TrueAndFalse;
