import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Cookies from "universal-cookie";
import { apiClient } from "../../../Utils/axios";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import cls from "./trueDragging.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

const cookie = new Cookies();

const TrueDragging = ({
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
  const [checkmarks, setCheckmarks] = useState(
    Array(question.answers.length).fill("/imgs/check-mark.png") // Initialize checkmarks
  );
  const [studentAnswer, setStudentAnswer] = useState([]);
  const [changing, setChanging] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Ensure there's a destination and handle the drag event
    if (!destination) return;

    const sourceIndex = source.index; // Index of the dragged checkmark
    const destIndex = parseInt(destination.droppableId.split('-')[1]); // Target answer slot index

    if (destination.droppableId.startsWith("answer-")) {
      const draggedCheckmark = checkmarks[sourceIndex];

      setCheckmarks((prev) => {
        const newCheckmarks = [...prev];
        newCheckmarks.splice(sourceIndex, 1);
        return newCheckmarks;
      });

      // Add the dragged checkmark to the studentAnswer array at the corresponding index
      setStudentAnswer((prev) => {
        const newAnswers = [...prev];
        newAnswers[destIndex] = question.answers[destIndex];  // Store the answer object in studentAnswer
        return newAnswers;
      });
    }
  };

  const handleRemoveCheckmark = (index) => {
    setStudentAnswer(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = null;
      return newAnswers;
    });

    setCheckmarks(prev => {
      const newCheckmarks = [...prev];
      const firstAvailableIndex = newCheckmarks.findIndex(v => v === false);
      if (firstAvailableIndex !== -1) {
        newCheckmarks[firstAvailableIndex] = true;
      }
      return newCheckmarks;
    });
  };

  const submit = async () => {
    console.log("submit");
    if (studentAnswer.length) {
      setLoading(true);

      // Collect valid answer IDs from studentAnswer
      const answersArray = studentAnswer
        .map((answer) => {
          if (answer) {
            // Find the correct answer by matching the answer_img
            const matchedAnswer = question.answers.find(
              (ans) => ans.answer_img === answer.answer_img
            );
            return matchedAnswer?.id;  // Use the answer ID
          }
          return null;
        })
        .filter((id) => id !== null);  // Filter out null values

      console.log({ answersArray });

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

        setLoading(false);

        if (response?.data?.success) {
          setResults((prev) => [...prev, response.data.data.is_correct]);

          if (questionsNum === questionNum) {
            setOpenSuccess(true);
          } else {
            setQuestionNum((prev) => prev + 1);
            setChanging(true);
            setTimeout(() => setChanging(false), 1000);
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className={cls.trueDragging}>
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

      <div className="quizHelpers">
        {question?.question_video_link && (
          <div className={cls.videoSection}>
            <VideoSection video={question?.question_video_link} openModal={setOpenPreview} data={false} />
          </div>
        )}
        {question?.question_audio && (
          <div className={cls.audioSection}>
            <AudioSection audio={question?.question_audio} data={false} />
          </div>
        )}
      </div>
      <div className={cls.items}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={cls.trueDragging}>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
              <div style={{ display: "inline-flex" }}>
                <h6>{question?.title}
                  <span>
                    <Droppable droppableId="checkmarks" direction="horizontal">
                      {(provided) => (
                        <span
                          className={cls.checkMarks}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {question.answers.map((checkmark, index) => (
                            <Draggable key={`check-${index}`} draggableId={`check-${index}`} index={index}>
                              {(provided) => (
                                <img
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  src={'/imgs/check-mark.png'}
                                  alt={`check-mark-${index}`}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </span>
                      )}
                    </Droppable>
                  </span>
                </h6>
              </div>
              <div className="quesImage">
                {question?.question_img && !changing && (
                  <img src={question?.question_img} alt="image" />
                )}
              </div>
            </div>

            <div className={cls.items} style={{ display: "inline-flex", width: "100%" }}>
              {question.answers.map((answer, index) => (
                <Droppable key={index} droppableId={`answer-${index}`}>
                  {(provided) => (
                    <div
                      className={cls.item}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}
                    >
                      <img src={answer.answer_img} alt={answer.title} />
                      <div className={cls.number}>
                        {studentAnswer[index] && (
                          <div style={{ position: "relative" }}>
                            <img
                              src={'/imgs/check-mark.png'}
                              alt={`check-mark-${index}`}
                            />
                            <Icon onClick={() => handleRemoveCheckmark(index)} icon="raphael:no"
                              style={{
                                color: "red", background: "none", cursor: "pointer",
                                position: 'absolute',
                                bottom: '10px',
                                right: '2px',

                              }} />
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
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
    </div>
  );
};

export default TrueDragging;
