"use client";
import Cookies from "universal-cookie";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
//== Components
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import draggablesStyles from "./ImageDraggables/draggables.module.scss";
import droppablesStyles from "./ImageDroppables/droppables.module.scss";
import cls from "./draggingParts.module.scss";

import { apiClient } from "../../../Utils/axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useEffect, useState } from "react";

const cookie = new Cookies();

const MatchingWithPosition = ({
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
  const [studentAnswer, setStudentAnswer] = useState({});
  const [droppedAnswers, setDroppedAnswers] = useState([]);
  console.log({ studentAnswer, droppedAnswers })

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;

    // If dropped outside a valid drop zone, do nothing
    if (!destination) return;

    // If dragged back to the original list, remove from drop zone
    if (destination.droppableId === "answers") {
      const updatedDroppedAnswers = { ...droppedAnswers };

      Object.keys(updatedDroppedAnswers).forEach((key) => {
        updatedDroppedAnswers[key] = updatedDroppedAnswers[key].filter((item) => item.id !== draggableId);
      });

      setDroppedAnswers(updatedDroppedAnswers);
      return;
    }

    // If the drop zone already has an answer, do nothing
    if (droppedAnswers[destination.droppableId]?.length) return;

    // Find the dragged item
    const draggedItem = question.answers.find((answer) => answer.id.toString() === draggableId);
    if (!draggedItem) return;

    // Update droppedAnswers state
    setDroppedAnswers({
      ...droppedAnswers,
      [destination.droppableId]: [draggedItem],
    });

  };
  useEffect(() => {
    const updatedAnswers = {};

    Object.entries(droppedAnswers).forEach(([dropZone, dropped]) => {
      if (dropped?.length) {
        updatedAnswers[dropZone] = dropped[0].id;
      }
    });

    setStudentAnswer((updatedAnswers));
  }, [droppedAnswers]);


  const submit = async () => {
    if (Object.values(droppedAnswers).some((arr) => arr.length > 0)) {
      setLoading(true);

      // Create an array with length equal to the number of answers
      const orderedAnswers = Array.from({ length: question.answers.length }, (_, index) => {
        const dropZoneKey = `answer-drop-${index}`;
        return droppedAnswers[dropZoneKey]?.[0]?.id || null;
      });

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: orderedAnswers, // Now in correct order
      };

      try {
        const response = await apiClient.post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        });

        if (response?.data?.data?.is_correct !== undefined) {
          setResults((prev) => [...prev, response.data.data.is_correct]);
        }

        if (questionsNum === questionNum) {
          setOpenSuccess(true);
        } else {
          setQuestionNum((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error submitting quiz answer:", err);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          {direction === "rtl" ? <span>السؤال الحالي</span> : <span>Current Question</span>}
        </div>
        <div className="lastStep">
          <p>{questionsNum}</p>
          {direction === "rtl" ? <span>عدد الاسئلة</span> : <span>Questions Number</span>}
        </div>
      </div>

      <h2 className={cls.title}>{question?.title}</h2>

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

      <div className={`${cls.content} ${cls[question?.additional_image_direction]}`}>
        {question?.additional_image ? (
          <Image
            width={100}
            height={100}
            className={cls.additionalImage}
            src={question?.additional_image}
            alt="question_image"
          />
        ) : null}

        <div className={cls.wrapper}>
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Draggable Answers List */}
            <Droppable droppableId="answers" direction="vertical">
              {(provided) => (
                <div className={draggablesStyles.draggables} {...provided.droppableProps} ref={provided.innerRef}>
                  {question?.answers
                    .filter((answer) =>
                      !Object.values(droppedAnswers).flat().some((dropped) => dropped.id === answer.id)
                    )
                    .map((answer, index) => (
                      <Draggable key={answer.id} draggableId={answer.id.toString()} index={index}>
                        {(provided) => (
                          <p
                            className={`${draggablesStyles.item} item`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {answer.title}
                          </p>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className={droppablesStyles.dropables}>
              {/* Drop Zones */}
              <img className={droppablesStyles.question_image} src={question.question_img} alt="question_image" />

              {question?.answers.map((answer, index) => (
                <Droppable droppableId={`answer-drop-${index}`} key={index}>
                  {(provided, snapshot) => (
                    <div
                      className={droppablesStyles.dropable}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        position: "absolute",
                        top: `${answer.answer_two_gap_match.split(",")[1]}px`,
                        left: `${answer.answer_two_gap_match.split(",")[0]}px`,
                      }}
                    >
                      {droppedAnswers[`answer-drop-${index}`]?.[0] && (
                        <p
                          key={droppedAnswers[`answer-drop-${index}`][0].id}
                        >
                          {droppedAnswers[`answer-drop-${index}`][0].title}
                          <Icon
                            icon="raphael:no"
                            width="20"
                            height="20"
                            onClick={() => {
                              const updatedDroppedAnswers = { ...droppedAnswers };
                              updatedDroppedAnswers[`answer-drop-${index}`] = [];
                              setDroppedAnswers(updatedDroppedAnswers);
                            }}
                            style={{ color: "red", cursor: "pointer" }}
                          />
                        </p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>


        </div>
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
          </span>{" "}
          <Icon
            icon={
              questionsNum === questionNum
                ? "fa:check-circle"
                : "fa6-regular:circle-right"
            }
          />
        </button>
      </div>
    </>
  );
};

export default MatchingWithPosition;
