import { useState } from "react";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import cls from "./imagesBoxesDragging.module.scss";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";

const cookie = new Cookies();

const ImagesBoxesDragging = ({
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
  const [studentAnswer, setStudentAnswer] = useState([]);
  const [answers, setAnswers] = useState(
    question.answers.map((answer) => ({ ...answer, id: answer.id }))
  );

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    let updatedAnswers = [...answers];
    let updatedStudentAnswer = [...studentAnswer];

    if (source.droppableId === "draggables" && destination.droppableId === "droppables") {
      if (studentAnswer.length === question.answers.filter(answer => answer.is_correct == "1" && answer).length) return;
      const draggedItem = updatedAnswers[source.index];

      updatedAnswers = updatedAnswers.filter((_, idx) => idx !== source.index);
      updatedStudentAnswer = [...updatedStudentAnswer, draggedItem];
    }

    if (source.droppableId === "droppables" && destination.droppableId === "draggables") {
      const returnedItem = updatedStudentAnswer[source.index];

      updatedStudentAnswer = updatedStudentAnswer.filter((_, idx) => idx !== source.index);
      updatedAnswers = [...updatedAnswers, returnedItem];
    }

    setAnswers(updatedAnswers);
    setStudentAnswer(updatedStudentAnswer);
  };

  const submit = async () => {
    if (studentAnswer.length === 0) {
      console.error("No answers selected.");
      return;
    }

    setLoading(true);

    const answersArray = studentAnswer
      .map((ans) => {
        const matchedAnswer = question.answers.find(
          (answer) => answer.answer_img === ans.answer_img
        );
        return matchedAnswer?.id;
      })
      .filter((id) => id !== undefined);

    if (answersArray.length === 0) {
      console.error("No valid answers to submit.");
      setLoading(false);
      return;
    }

    const data = {
      quiz_attempt_id: attemptId,
      question_id: question.id,
      given_answer: answersArray,
    };

    try {
      const response = await apiClient.post(
        `/crm/students/quiz/answer_question`,
        data,
        {
          headers: { Authorization: `Bearer ${cookie.get("ibook-auth")}` },
        }
      );

      if (response?.data?.data?.is_correct !== undefined) {
        setResults((prev) => [...prev, response.data.data.is_correct]);

        if (questionsNum === questionNum) {
          setOpenSuccess(true);
        } else {
          setQuestionNum((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleReturnToSecond = (id) => {
    const itemToReturn = studentAnswer.find((answer) => answer.id === id);
    if (itemToReturn) {
      setAnswers([...answers, itemToReturn]);
      setStudentAnswer(studentAnswer.filter((answer) => answer.id !== id));
    }
  };
  return (
    <>
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

      <div className={cls.imagesBoxesDragging}>
        <h6>{question?.title}</h6>
        <div className="quizHelpers">
          {question?.question_video_link && (
            <div className={cls.videoSection}>
              <VideoSection video={question.question_video_link} openModal={setOpenPreview} />
            </div>
          )}
          {question?.question_audio && (
            <div className={cls.audioSection}>
              <AudioSection audio={question.question_audio} />
            </div>
          )}
        </div>


        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppables">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${cls.dragDropZone} ${cls.droppables}`}
                style={{ display: "inline-flex" }}
              >
                {question.answers.filter(answer => answer.is_correct == "1" && answer).length > studentAnswer.length
                  ? [
                    ...studentAnswer.map((answer, idx) => (
                      <div key={answer.id} className={`${cls.itemPlaceholder} ${cls.droppableItem}`}>
                        <img src={answer.answer_img} alt={answer.title} />
                        <button
                          style={{ border: "none", background: "none" }}
                          onClick={() => handleReturnToSecond(answer.id)}
                        >
                          <Icon icon="raphael:no" style={{ color: "red", background: "none" }} />
                        </button>
                      </div>
                    )),
                    ...Array.from({ length: question.answers.filter(answer => answer.is_correct == "1" && answer).length - studentAnswer.length }).map((_, idx) => (
                      <div key={idx} className={cls.itemPlaceholder}></div>
                    )),
                  ]
                  : studentAnswer.map((answer, idx) => (
                    <div key={answer.id} className={`${cls.itemPlaceholder} ${cls.droppableItem}`}>
                      <img src={answer.answer_img} alt={answer.title} />
                      <button
                        style={{ border: "none", background: "none" }}
                        onClick={() => handleReturnToSecond(answer.id)}
                      >
                        <Icon icon="raphael:no" style={{ color: "red", background: "none" }} />
                      </button>
                    </div>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="draggables" >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${cls.dragDropZone} ${cls.draggables}`}
              >
                {answers.map((answer, idx) => (
                  <Draggable key={answer.id} draggableId={String(answer.id)} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${cls.item} ${cls.draggableItem}`}
                      >
                        <img src={answer.answer_img} alt={answer.title} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>

      <div className={cls.btn}>
        <button
          onClick={submit}
          aria-label={questionsNum === questionNum ? "Submit answers" : "Next question"}
        >
          <span>
            {questionsNum === questionNum
              ? direction === "rtl"
                ? "تأكيد"
                : "Submit"
              : direction === "rtl"
                ? "التالي"
                : "Next"}
          </span>
          <Icon
            icon={questionsNum === questionNum ? "fa:check-circle" : "fa6-regular:circle-right"}
          />
        </button>
      </div>
    </>
  );
};

export default ImagesBoxesDragging;
