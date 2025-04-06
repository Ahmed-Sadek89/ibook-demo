import { useState, useRef, useEffect } from "react";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import cls from "./imageMatchingImage.module.scss";
import { apiClient } from "../../../Utils/axios";

const cookie = new Cookies();

const ImageMatchingImage = ({
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
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [choosedOptions, setChoosedOptions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const canvas = useRef();
  const [matchIndex, setMatchIndex] = useState(1);
  const [alreadyHere, setAlreadyHere] = useState(false);
  const [changing, setChanging] = useState(false);
  const [canvasDrawingWidth, setCanvasDrawingWidth] = useState(0);
       

  useEffect(() => {
    setTimeout(() => {
      if (canvas.current) {
        if (window.matchMedia(`(max-width: 550px)`).matches) {
          canvas.current.width = 80;
          setCanvasDrawingWidth(80);
        }

        let listHeight = document
          .querySelector(`.${cls.list}`)
          .getBoundingClientRect().height;
        let matchHeight = document
          .querySelector(`.${cls.match}`)
          .getBoundingClientRect().height;

        canvas.current.height =
          matchHeight > listHeight ? matchHeight : listHeight;
      }
    }, 0);
  }, [canvas, question.answers]);

  const drawCanvasLine = (from, to) => {
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    if (direction === "rtl") {
      ctx.moveTo(0, to);
      ctx.lineTo(canvasDrawingWidth || 200, from);
      ctx.stroke();
    } else {
      ctx.moveTo(0, from);
      // ctx.lineTo(200, from);
      ctx.lineTo(canvasDrawingWidth || 200, to);
      ctx.stroke();
    }

    ctx.fillStyle = color;

    if (direction === "rtl") {
      // Arrow
      ctx.moveTo(canvasDrawingWidth ? canvasDrawingWidth + 5 : 205, from);
      ctx.arc(canvasDrawingWidth ? canvasDrawingWidth + 5 : 205, from, 10, 0, 2 * Math.PI);
      ctx.fill();
      // Arrow
      ctx.moveTo(3, to);
      ctx.arc(-5, to, 10, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.moveTo(canvasDrawingWidth ? canvasDrawingWidth + 5 : 205, to);
      ctx.arc(canvasDrawingWidth ? canvasDrawingWidth + 5 : 205, to, 10, 0, 2 * Math.PI);
      ctx.fill();
      // Arrow
      ctx.moveTo(3, from);
      ctx.arc(-5, from, 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const selectOption = (e, answer, choosedOption, index) => {
    const foundChoosed = choosedOptions.findIndex(
      (option) => option === choosedOption
    );
    if (choosedOption && foundChoosed >= 0) {
      setAlreadyHere(true);
      return;
    }
    setChoosedOptions((prev) => [...prev, choosedOption]);
    setSelectedOption({ element: e.target, answer });
    setAlreadyHere(false);
    setMatchIndex(index + 1)
  };

  const drawLine = (e, ans) => {
    // CHECK IF ANSWER ALREADY EXISTS
    if (!selectedOption) return;
    const answerFound = allAnswers.find((answer) => answer.id === ans.id);
    if (answerFound || alreadyHere) {
      setChoosedOptions((prev) => [
        ...prev.filter((option) => option !== selectedOption.answer.title),
      ]);
      setSelectedOption(null);
      return;
    }

    setAlreadyHere(false);

    const FROM_PARENT = document.querySelector(`.${cls.list}`).offsetTop;
    let FROM_OPTION;
    if (selectedOption)
      FROM_OPTION =
        selectedOption.element.offsetTop -
        FROM_PARENT +
        selectedOption.element.offsetHeight / 2;

    const TO_PARENT = document.querySelector(`.${cls.match}`).offsetTop;

    const TO_OPTION =
      e.target.offsetTop - TO_PARENT + e.target.offsetHeight / 2;

    drawCanvasLine(FROM_OPTION, TO_OPTION);

    setAllAnswers((prev) => [...prev, { ...ans, index: matchIndex }]);
    setSelectedOption(null);
  };

  useEffect(() => {
    var randomOptions = [];

    for (var index = 0; index < question.answers.length; index++) {
      var randomNum = Math.floor(Math.random() * question.answers.length);

      if (
        randomOptions.find(
          (option) => option.id === question.answers[randomNum].id
        )
      ) {
        index--;
        continue;
      }
      randomOptions.push(question.answers[randomNum]);
    }

    setOptions(randomOptions);
  }, []);

  const submit = async () => {
    if (allAnswers.length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: allAnswers.sort((a, b) => a.index - b.index).map((answer) => answer.answer_img)
      };
      const response = await apiClient
        .post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        })
        .catch((err) => errorNotify(err));

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

  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.matching} ${changing && cls.animation}`}>
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

      <div className={`${cls.wrapper} wrapper`}>
        <div className={cls.match}>
          {question.answers.map((answer, idx) => (
            <div
              key={answer.id}
              onClick={(e) => selectOption(e, answer, answer.title, idx)}
              className={cls.one}>
              <p className="B">
                {answer.answer_img ? (
                  <img src={answer.answer_img} alt="answerImage" />
                ) : (
                  <span>{answer.title}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        <canvas id="matching_area" ref={canvas} width="200"></canvas>

        <div className={cls.list}>
          {options.map(answer => (
            <div
              key={answer.id}
              className={cls.one}>
              <p className={`A ${answer.answer_img ? cls.big : ''}`} onClick={(e) => drawLine(e, answer)}>
                {answer.title.startsWith('https') ? (
                  <img src={answer.title} alt="answerImage" />
                ) : (
                  <span>{answer.title}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

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

      {/* {openSuccess && <CorrectAnswer results={results} />}
      {openWrong && <WrongAnswer results={results} />} */}
    </div>
  );
};

export default ImageMatchingImage;
