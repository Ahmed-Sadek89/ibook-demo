import { useState, useRef, useEffect } from "react";
//= Components
import ImageMatching from "../../quizzes/ImageMatching/ImageMatching";
import OrderingQuiz from "./../../quizzes/OrderingQuiz/OrderingQuiz";
import SingleChoice from "../../quizzes/SingleChoice/SingleChoice";
import MultipleChoice from "./../../quizzes/MultipleChoice/MultipleChoice";
import OpenEnded from "./../../quizzes/OpenEnded/OpenEnded";
import ShortAnswer from "./../../quizzes/ShortAnswer/ShortAnswer";
import TrueAndFalse from "./../../quizzes/TrueAndFalse/TrueAndFalse";
import FillInBlank from "./../../quizzes/FillInBlank/FillInBlank";
import ImageAnswering from "../../quizzes/ImageAnswering/ImageAnswering";
import BigImageWithAudio from "../../quizzes/BigImageWithAudio/BigImageWithAudio";
import BigImageWithVideo from "../../quizzes/BigImageWithVideo/BigImageWithVideo";
import Matching from "../../quizzes/Matching/Matching";
import ImageMatchingImage from "../../quizzes/ImageMatchingImage/ImageMatchingImage";
import TrueDragging from "../../quizzes/TrueDragging";
import SignDragging from "../../quizzes/SignDragging";
import ImagesBoxesDragging from "../../quizzes/ImagesBoxesDragging";
import CircleDragging from "../../quizzes/CircleDragging";
import NumberDragging from "../../quizzes/NumberDragging";
import SimilarNumberDragging from "../../quizzes/SimilarNumberDragging";
import ImagesPuzzle from "../../quizzes/ImagesPuzzle";
import ImagesSplitting from "../../quizzes/ImagesSplitting";
import MatchOneImage from "../../quizzes/MatchOneImage";
import MatchTwoImages from "../../quizzes/MatchTwoImages";
import MatchingWithPosition from "../../quizzes/MatchingWithPosition";
import ReelsDragging from "../../quizzes/ReelsDragging";
import PyramidDragging from "../../quizzes/PyramidDragging";
import TableDragging from "../../quizzes/TableDragging";
import TableDraggingImages from "../../quizzes/TableDraggingImages";
import MathTableDragging from "../../quizzes/MathTableDragging";
import NumberWordsDragging from "../../quizzes/Number&WordsDragging";
import MathCircleDragging from "../../quizzes/MathCircleDragging";
import DragImagesToOrder from "../../quizzes/DragImagesToOrder";
import ColumnsDragging from "../../quizzes/ColumnsDragging";
import CoveredNumberDragging from "../../quizzes/CoveredNumberDragging";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";

import Loader from "../../UIs/Loader/Loader";

import Cookies from "universal-cookie";


import cls from "./quizModal.module.scss";
import { apiClient } from "../../../Utils/axios";
import { Icon } from "@iconify/react";

const cookie = new Cookies();

const QuizModal = ({
  setOpenQuizModal,
  quizData,
  sectionId,
  direction,
  setOpenPreview,
}) => {
  // COMPONENT HOOKS
  const [questions, setQuestions] = useState();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [attemptId, setAttemptId] = useState();
  const overlay = useRef();

  const [loading, setLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(1);
  const [specialModal, setSpecialModal] = useState(false);
  const [results, setResults] = useState([]);

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if (overlay.current === e.target) setOpenQuizModal(false);
  };

  const close = () => {
    setOpenQuizModal(false);
  };

  // const fetchQuestions = async () => {
  //   setLoading(true);
  //   const response = await apiClient.get(
  //     `/crm/page_sections/${quizData.id}?lang=${"en"}`
  //   );
  //   if (!response) return;

  //   const quizesResponse = await apiClient.get(
  //     `/crm/quizzes/${response.data.data.quiz_id.id}?lang=${"en"}`
  //   );
  //   if (!quizesResponse) return;

  //   const questions = [];

  //   for (let question of quizesResponse.data.data.questions) {
  //     if (question.question_type === "image_matching") setSpecialModal(true);
  //     else setSpecialModal(false);
  //     const answersResponse = await apiClient.get(
  //       `/crm/answers?lang=${"en"}&question_id=${question.id}`
  //     );
  //     questions.push({
  //       ...question,
  //       answers: answersResponse.data.data.answers,
  //     });
  //   }

  //   setQuestions(questions);

  //   setLoading(false);
  // };
  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/crm/page_sections/${quizData.id}?lang=${"en"}`);
      if (!response) throw new Error("Failed to fetch page sections");

      const quizesResponse = await apiClient.get(`/crm/quizzes/${response.data.data.quiz_id.id}?lang=${"en"}`);
      if (!quizesResponse) throw new Error("Failed to fetch quizzes");

      const questions = [];

      for (let question of quizesResponse.data.data.questions) {
        if (question.question_type === "image_matching") setSpecialModal(true);
        else setSpecialModal(false);

        const answersResponse = await apiClient.get(`/crm/answers?lang=${"en"}&question_id=${question.id}`);
        if (!answersResponse) throw new Error(`Failed to fetch answers for question id: ${question.id}`);

        questions.push({
          ...question,
          answers: answersResponse.data.data.answers,
        });
      }

      setQuestions(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

  const startQuiz = async () => {
    const data = {
      page_section_id: quizData.id,
    };

    const response = await apiClient
      .post(`/crm/students/quiz/start`, data, {
        headers: {
          Authorization: `Bearer ${cookie.get("ibook-auth")}`,
        },
      })
      .catch((err) => console.log(err));

    if (!response) return;

    setAttemptId(response.data.data.id);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={`${cls.area} ${specialModal ? cls.specialModal : ""}`}>
        {loading ? (
          <Loader />
        ) : (
          <div className={cls.area__wrapper} id="quiz_modal">
            <div
              className={`${cls.close}       `}
              onClick={close}
            >
              {/* <i className="fa-solid fa-xmark"></i>asdas */}
              <Icon icon="ic:baseline-close" width="24" height="24" />
            </div>

            <div
              // container
              className={`${cls.area__content} ${direction === "rtl" ? cls.arabic : cls.english
                }`}
            // spacing={3}
            >
              {questions &&
                questions.length &&
                questions
                  .slice(questionNum - 1, questionNum)
                  .map((question, idx) => (
                    <div key={question.id} className={cls.question}>
                      {question.question_type === "single_choice" && (
                        <SingleChoice
                          question={question}
                          idx={idx}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "image_matching" && (
                        <ImageMatching
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "ordering" && (
                        <OrderingQuiz
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "multiple_choice" && (
                        <MultipleChoice
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "open_ended" && (
                        <OpenEnded
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "short_answer" && (
                        <ShortAnswer
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "true_false" && (
                        <TrueAndFalse
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "matching" && (
                        <Matching
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "image_matching_image" && (
                        <ImageMatchingImage
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "fill_in_the_blank" && (
                        <FillInBlank
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "image_answering" && (
                        <ImageAnswering
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "big_image_with_audio" && (
                        <BigImageWithAudio
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "big_image_with_video" && (
                        <BigImageWithVideo
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "true_dragging" && (
                        <TrueDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "images_boxes_dragging" && (
                        <ImagesBoxesDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "circle_dragging" && (
                        <CircleDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "number_dragging" && (
                        <NumberDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "similar_number_dragging" && (
                        <SimilarNumberDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "images_puzzle" && (
                        <ImagesPuzzle
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "match_one_image" && (
                        <MatchOneImage
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "matching_multiple_choice" && (
                        <MatchTwoImages
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "images_splitting" && (
                        <ImagesSplitting
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "matching_with_position" && (
                        <MatchingWithPosition
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "reels_dragging" && (
                        <ReelsDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "pyramid_dragging" && (
                        <PyramidDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "table_dragging" && (
                        <TableDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "table_dragging_images" && (
                        <TableDraggingImages
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "math_table_dragging" && (
                        <MathTableDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "number_words_dragging" && (
                        <NumberWordsDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "math_circle_dragging" && (
                        <MathCircleDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "drag_images_order" && (
                        <DragImagesToOrder
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "columns_dragging" && (
                        <ColumnsDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "sign_dragging" && (
                        <SignDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "covered_number_dragging" && (
                        <CoveredNumberDragging
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>

      {openSuccess && <CorrectAnswer results={results} setOpenQuizModal={setOpenQuizModal} />}
    </div>
  );
};

export default QuizModal;
