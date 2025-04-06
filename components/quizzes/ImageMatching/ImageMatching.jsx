import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Update imports
import VideoSection from "../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import cls from "./imageMatching.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const cookie = new Cookies();

const DragQuiz = ({
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
  const [randomImages, setRandomImages] = useState([]);
  const [changing, setChanging] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const allAnswers = Array.from(randomImages);
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setRandomImages(allAnswers);
  };

  const submit = async () => {
    if (randomImages.length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: randomImages.map((answer) => answer.id).reverse(),
      };
      console.log({answers: data})
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

  useEffect(() => {
    let randomImages = [];

    for (var index = 0; index < question.answers.length; index++) {
      const randomNum = Math.floor(Math.random() * question.answers.length);
      if (
        randomImages.find(
          (answer) => answer.id === question.answers[randomNum].id
        )
      ) {
        index--;
        continue;
      } else {
        randomImages.push(question.answers[randomNum]);
      }
    }
    setRandomImages(randomImages);
  }, [question.answers]);

  return (
    <div className={`${cls.dragQuiz} ${changing && cls.animation}`}>
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
        {" "}
        {questionNum}) {question?.title}
      </h6>

      <div className={cls.wrapper} >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="matching" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cls.imagesBox}
                style={{ direction: "initial !important", flexWrap: "nowrap !important" }}
              >
                {randomImages &&
                  randomImages.map((answer, idx) => (
                    <Draggable
                      key={answer.id}
                      draggableId={answer.id.toString()}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          className={cls.imageWrapper}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Image
                            width={500}
                            height={500}
                            src={answer.answer_img}
                            alt="answerImage"
                            className={cls.imageItem}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className={`${cls.answers} ${cls[direction]}`} style={{ direction: "initial !important", flexWrap: "nowrap !important" }}>
          {question.answers.map((answer, idx) => (
            <h6 key={answer.id}>{answer.title}</h6>
          ))}
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

export default DragQuiz;
