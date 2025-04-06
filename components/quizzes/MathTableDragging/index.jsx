import { useState, useMemo } from "react";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import shuffleArray from "../../../Utils/shuffleArray";
import cls from './mathtable-dragging.module.scss';
import { Icon } from "@iconify/react/dist/iconify.js";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const cookie = new Cookies();

function MathTableDragging({
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
}) {

  const [changing, setChanging] = useState(false);
  const shuffledArray = useMemo(() => shuffleArray(question?.answers), [question?.answers]);
  const [shuffledAnswers, setShuffledAnswers] = useState(shuffledArray || []);
  const [studentAnswer, setStudentAnswer] = useState(Array(question?.answers.length).fill(null));

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceIndex = source.index;
    const destIndex = parseInt(destination.droppableId.split('-')[1]);

    if (destination.droppableId.startsWith("answer-")) {
      if (studentAnswer[destIndex]) return;
      const draggedAnswer = shuffledAnswers[sourceIndex];

      setShuffledAnswers(prev => prev.filter((_, i) => i !== sourceIndex));
      setStudentAnswer(prev => {
        const newAnswers = [...prev];
        newAnswers[destIndex] = draggedAnswer;
        return newAnswers;
      });
    }
  };

  const handleRemoveCheckmark = (index) => {
    setStudentAnswer(prev => {
      const newAnswers = [...prev];
      const removedAnswer = newAnswers[index];

      if (!removedAnswer) return newAnswers; // تجنب إضافة عنصر فارغ

      newAnswers[index] = null;

      setShuffledAnswers(prevShuffled => {
        if (!prevShuffled.includes(removedAnswer)) {
          return [...prevShuffled, removedAnswer]; // أضف العنصر مرة واحدة فقط
        }
        return prevShuffled;
      });

      return newAnswers;
    });
  };


  const submit = async () => {
    const givenAnswer = studentAnswer.filter(a => a).map(a => a.id);
    if (givenAnswer.length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: givenAnswer,
      };

      try {
        const response = await apiClient.post(`/crm/students/quiz/answer_question`, data, {
          headers: { Authorization: `Bearer ${cookie.get("ibook-auth")}` },
        });
        setResults(prev => [...prev, response.data.data.is_correct]);

        if (questionsNum === questionNum) {
          setOpenSuccess(true);
        } else {
          setQuestionNum(prev => prev + 1);
          setChanging(true);
          setTimeout(() => setChanging(false), 1000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={cls.tableDragging}>
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
        <Droppable droppableId="checkmarks" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={cls.choices}>
              {shuffledAnswers.map((answer, index) => (
                <Draggable key={answer.id} draggableId={answer.id.toString()} index={index}>
                  {(provided) => (
                    <span ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {answer.title}
                    </span>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className={cls.items}>
          <table>
            <tbody>
              <tr>
                <td>{question.title_right}</td>
                {question.answers.map(answer => (
                  <td key={answer.id}><span>{answer.answer_two_gap_match}</span></td>
                ))}
              </tr>
              <tr>
                <td>{question.title_left}</td>
                {question.answers.map((_, index) => (
                  <Droppable key={index} droppableId={`answer-${index}`}>
                    {(provided) => (
                      <td ref={provided.innerRef} {...provided.droppableProps}>
                        <div className={cls.choice}>
                          {studentAnswer[index] && (
                            <div style={{ position: "relative" }}>
                              {studentAnswer[index].title}
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
                      </td>
                    )}
                  </Droppable>
                ))}
              </tr>
            </tbody>
          </table>
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
          {" "}
          <Icon
            icon={questionsNum === questionNum ? "fa:check-circle" : "fa6-regular:circle-right"}
          />
        </button>
      </div>
    </div >
  )
}

export default MathTableDragging;