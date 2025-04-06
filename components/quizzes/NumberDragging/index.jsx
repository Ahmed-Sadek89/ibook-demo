import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { Icon } from "@iconify/react/dist/iconify.js";
import { apiClient } from '../../../Utils/axios';
import Cookies from "universal-cookie";
import cls from './numberDragging.module.scss';

const cookie = new Cookies();

const NumberDragging = ({
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

  const [changing, setChanging] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [studentAnswer, setStudentAnswer] = useState(() =>
    Array(question.answers.length).fill(null)
  );
  console.log({ studentAnswer, shuffledAnswers })

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // Swap current element with a random element
      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex],
        shuffledArray[currentIndex],
      ];
    }
    return shuffledArray;
  }

  useMemo(() => {
    setShuffledAnswers(shuffleArray(question.answers));
  }, [question.answers])

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Handle drag from the pool ("checkmarks") to an answer slot
    if (
      source.droppableId === "checkmarks" &&
      destination.droppableId.startsWith("answer-")
    ) {
      // Compute the filtered pool (only items not in studentAnswer)
      const filteredPool = shuffledAnswers.filter(
        (answer) =>
          !studentAnswer.some(
            (studentAns) => studentAns && studentAns.id === answer.id
          )
      );

      // Use the filtered pool for lookup
      const draggedItem = filteredPool[source.index];
      const destIndex = parseInt(destination.droppableId.split("-")[1]);
      setStudentAnswer((prev) => {
        const newAnswers = [...prev];
        newAnswers[destIndex] = draggedItem;
        return newAnswers;
      });
    }
  };

  const handleRemoveCheckmark = (index) => {
    setStudentAnswer(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = null;
      return newAnswers; // new array reference is returned
    });
  };

  const submit = async () => {
    // FIX HERE
    if (studentAnswer.includes(null)) {
      // You can display an error message or prevent submission here
      console.error("Please fill all answer slots before submitting.");
      return;
    }

    // Since studentAnswer is already ordered by slot index, we simply map it to extract ids.
    const orderedAnswer = studentAnswer.map(answer => answer.title);
    console.log({ orderedAnswer });

    setLoading(true);
    const data = {
      quiz_attempt_id: attemptId,
      question_id: question.id,
      given_answer: orderedAnswer
    };
    try {
      const response = await apiClient.post(`/crm/students/quiz/answer_question`, data, {
        headers: {
          Authorization: `Bearer ${cookie.get("ibook-auth")}`,
        },
      });
      setResults((prev) => [...prev, response.data.data.is_correct]);
      setLoading(false);
      if (questionsNum === questionNum) {
        setOpenSuccess(true);
      } else {
        // It is recommended to use the updater function for state changes.
        setQuestionNum(prev => prev + 1);
        setChanging(true);
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={cls.numberDragging}>
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

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Droppable Container for the pool */}
        <Droppable droppableId="checkmarks" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={cls.images}>
              {shuffledAnswers
                .filter(
                  (answer) =>
                    !studentAnswer.some(
                      (studentAns) => studentAns && studentAns.id === answer.id
                    )
                )
                .map((answer, idx) => (
                  <Draggable
                    key={`pool-${answer.id}`}
                    draggableId={`pool-${answer.id}`}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cls.image_item}
                      >
                        {answer.title}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className={cls.images}>
          <div className={cls.items} id="number_dragging_items">
            {question.answers.map((answer, index) => (
              <Droppable key={index} droppableId={`answer-${index}`}>
                {(provided) => (
                  <div className={cls.item} ref={provided.innerRef} {...provided.droppableProps}>
                    <img src={answer.answer_img} alt={answer.title} className={cls.image} />
                    <div className={cls.choice}>
                      {studentAnswer[index] && (
                        <Draggable draggableId={`student-${studentAnswer[index].id}`} index={0}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <div className={cls.image_item}>
                                {studentAnswer[index].title}
                                <Icon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCheckmark(index);
                                  }}
                                  icon="raphael:no"
                                  className={cls.removeIcon}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
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

export default NumberDragging;
