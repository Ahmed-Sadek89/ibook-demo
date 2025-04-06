import { useState, useEffect } from "react";
import VideoSection from "../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import cls from "./orderingQuiz.module.scss";
import { Icon } from "@iconify/react";

const cookie = new Cookies();

const OrderingQuiz = ({
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
  const [answers, setAnswers] = useState([]);
  const [changing, setChanging] = useState(false);

  const handleOndragEnd = (result) => {
    if (!result.destination) return;
    const reorderedAnswers = Array.from(answers);
    const [movedItem] = reorderedAnswers.splice(result.source.index, 1);
    reorderedAnswers.splice(result.destination.index, 0, movedItem);
    setAnswers(reorderedAnswers);
  };

  useEffect(() => {
    if (question?.answers?.length) {
      const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5);
      setAnswers(shuffledAnswers);
    }
  }, [question]);

  const submit = async () => {
    if (answers.length) {
      setLoading(true);

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: answers.map((answer) => answer.id),
      };

      try {
        const response = await apiClient.post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        });

        setLoading(false);

        if (response) {
          setResults((prev) => [...prev, response.data.data.is_correct]);

          if (questionsNum === questionNum) {
            setOpenSuccess(true);
          } else {
            setQuestionNum(questionNum + 1);
            setChanging(true);
            setTimeout(() => {
              setChanging(false);
            }, 1000);
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error("Failed to submit the quiz. Please try again.");
      }
    }
  };

  return (
    <div className={`${cls.orderingQuiz} ${changing && cls.animation}`}>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          <span>{direction === "rtl" ? "السؤال الحالي" : "Current Question"}</span>
        </div>
        <div className="lastStep">
          <p>{questionsNum}</p>
          <span>{direction === "rtl" ? "عدد الاسئلة" : "Questions Number"}</span>
        </div>
      </div>

      <div className="quesImage">
        {question?.question_img && !changing && (
          <img src={question.question_img} alt="Question Image" />
        )}
      </div>

      <div className="quizHelpers">
        {question?.question_video_link && (
          <div className={cls.videoSection}>
            <VideoSection
              video={question.question_video_link}
              openModal={setOpenPreview}
              data={false}
            />
          </div>
        )}

        {question?.question_audio && (
          <div className={cls.audioSection}>
            <AudioSection audio={question.question_audio} data={false} />
          </div>
        )}
      </div>

      <h6>
        {questionNum}) {question?.title}
      </h6>

      <div className={cls.answers}>
        <DragDropContext onDragEnd={handleOndragEnd}>
          <Droppable droppableId="answers">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {answers.map((answer, idx) => (
                  <Draggable
                    key={answer.id}
                    draggableId={String(answer.id)}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        className={cls.answerWrapper}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <span>{idx + 1}</span>
                        <p className={cls.box}>{answer.title}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
    </div>
  );
};

export default OrderingQuiz;
