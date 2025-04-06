import { useState, useEffect } from "react";
import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";
import { toast } from "react-toastify";
import { apiClient } from "../../../Utils/axios";
import Cookies from "universal-cookie";
import cls from "./matching.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Xarrow, { Xwrapper } from "react-xarrows";

const cookie = new Cookies();

const DraggableBox = ({ id, connections, text, onClick, currentSelected, answer_img = null }) => {
  const isConnected = connections.find(index => index.end === id || index.start === id);
  const isSelected = currentSelected === id;
  const custom = (isConnected || isSelected) ? {
    border: "1px solid rgba(92, 70, 156, 0.8)",
    boxShadow: "rgba(92, 70, 156, 0.8) 0px 0px 7px"
  } : {};
  return (
    <div
      id={id}
      style={{ cursor: "pointer", userSelect: "none", textAlign: "center", width: "100%" }}
      className={cls.one}
      onClick={() => onClick(id)}
    >
      <p className={`B ${answer_img ? cls.withImage : ''}`} style={{ ...custom }} >
        {answer_img ? (
          <Image src={answer_img} alt="answerImage" width={100} height={100} />
        ) : (
          <span>{text}</span>
        )}
      </p>
    </div>
  );
};

const colors_list = [
  "#0C134F", "#5C469C", "#116D6E", "#2ecc71", "#f39c12", "#000000",
  "#735F32", "#C69749", "#704F4F", "#950101", "#F806CC", "#270082",
  "#7A0BC0", "#610094", "#B25068", "#2a293e", "#112222", "#0000aa",
  "#033500", "#6f7755", "#d1001c", "#c14a09", "#d5b60a", "#220a0a",
  "#341c02"
];

const Matching = ({
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
  const [changing, setChanging] = useState(false);
  const [selected, setSelected] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(null);
  const [connections, setConnections] = useState([]);
  useEffect(() => {
    if (!isNaN(selected[0])) {
      setCurrentSelected(selected[0])
    }
  }, [selected])
  const handleClick = (id) => {
    if (selected.includes(id)) {
      setSelected([]);
    } else if (selected.length === 1) {
      const start = selected[0];
      const end = id;
      if (start.toString().length === end.toString().length) {
        setSelected([]);
        return;
      }
      // Prevent self-connections
      if (start === end) {
        setSelected([]);
        return;
      }

      // Normalize start and end for bidirectional uniqueness
      const sortedConnection = [start, end].sort();

      // Check if the normalized connection already exists
      const isAlreadyConnected = connections.some(
        (conn) =>
          [conn.start, conn.end].sort().join() === sortedConnection.join()
      );

      // Check if the connection involves the currently selected item
      const involvesSelected = connections.some(
        (conn) => conn.start === selected[0] || conn.end === selected[0] || conn.start === id || conn.end === id
      );

      if (!isAlreadyConnected && !involvesSelected) {
        const start_elem = sortedConnection[0].toString().length > 1 ? sortedConnection[1] : sortedConnection[0];
        const end_elem = sortedConnection[0].toString().length > 1 ? sortedConnection[0] : sortedConnection[1];
        setConnections([...connections, { start: start_elem, end: end_elem }]);
      } else {
        setConnections(
          connections.filter(
            (conn) =>
              [conn.start, conn.end].sort().join() !== sortedConnection.join()
          )
        );
      }

      setSelected([]);
    } else {
      setSelected([id]);
    }
  };
  console.log({ connections, currentSelected, selected })
  const [hoveredArrow, setHoveredArrow] = useState(null);

  const handleDoubleClick = (index) => {
    setConnections((prevConnections) =>
      prevConnections.filter((_, i) => i !== index)
    );
  };

  const submit = async () => {
    if (connections.length) {
      setLoading(true);
      const given_answer = connections.map((conn) => {
        return conn.end
      });
      console.log({ given_answer })
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: connections.map((answer) => answer.end)
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
      setResults((prev) => [...prev, response?.data?.data?.is_correct]);

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
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    if (question?.answers) {
      // Shuffle answers using the Fisher-Yates algorithm
      const shuffled = [...question.answers].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [question]);
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
          <Image src={question?.question_img} alt="image" width={1000} height={1000} />
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
        {questionNum}) {question?.title}
      </h6>

      <Xwrapper>
        <div className={`${cls.wrapper} wrapper`}>
          <div style={{ width: "100%", display: "flex", padding: "10px", justifyContent: "start", alignItems: "start" }}>
            <div className={`${cls.match} ${question?.answers[0].answer_img ? cls.withImage : ''}`} style={{ width: "50% !important" }}>
              {question.answers.map((pos, idx) => (
                <DraggableBox
                  key={idx}
                  currentSelected={selected[0]}
                  connections={connections}
                  id={idx}
                  text={pos.title}
                  onClick={() => handleClick(idx)}
                  answer_img={pos.answer_img}
                />
              ))}
            </div>
          </div>
          <div style={{ width: "100%", display: "flex", padding: "10px", justifyContent: "end", alignItems: "end" }}>
            <div className={cls.list}>
              {shuffledAnswers.map((pos) => (
                <DraggableBox
                  currentSelected={selected[0]}
                  connections={connections}
                  key={pos.id}
                  id={pos.id}
                  text={pos.answer_two_gap_match}
                  onClick={() => handleClick(pos.id)}
                />
              ))}
            </div>
          </div>
          {connections.map((conn, index) => {
            const randomColor = colors_list[index];
            const headTailColor = [...colors_list].reverse()[index]
            return (
              <span
                key={index}

                title="حذف التوصيل"
                onDoubleClick={() => handleDoubleClick(index)}
                onMouseEnter={() => setHoveredArrow(index)}
                onMouseLeave={() => setHoveredArrow(null)}
                style={{ cursor: "pointer" }}
              >
                <Xarrow
                  start={currentSelected.toString().length > 1 ? conn.end.toString() : conn.start.toString()}
                  end={currentSelected.toString().length > 1 ? conn.start.toString() : conn.end.toString()}
                  strokeWidth={4}
                  curveness={0.25}
                  animateDrawing={0.5}
                  path="smooth"
                  showHead={true}
                  showTail={true}
                  lineColor={hoveredArrow === index ? "red" : randomColor}
                  headColor={hoveredArrow === index ? "red" : headTailColor}
                  tailColor={hoveredArrow === index ? "red" : headTailColor}
                />
              </span>
            );
          })}
        </div>
      </Xwrapper>
      <div
        className={cls.btn}
        style={{
          display: "flex", width: "100%", justifyContent: "center",
          alignItems: "center", columnGap: "10px", flexWrap: "wrap"
        }}
      >
        <button onClick={submit} style={{ width: "25%" }}>
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
        <button
          disabled={connections.length === 0}
          onClick={() => setConnections([])}
          style={{
            background: "#373636", color: "white", border: "none", display: "flex",
            columnGap: "5px", alignItems: "center", columnGap: "10px", width: "25%",justifyContent: "center"
          }}
        >
          <span>
            {
              direction === "rtl"?
              "اعادة المحاولة":
              "Try again"

            }
          </span>
          <Icon icon="mynaui:undo-solid" />
        </button>
      </div>
    </div>
  );
};

export default Matching;
