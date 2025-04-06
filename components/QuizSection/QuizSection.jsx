import Image from "next/image";
import cls from "./quizSection.module.scss";
import { Icon } from "@iconify/react";

const QuizSection = ({ section, openQuiz }) => {
  const openQuizPreview = (state, data) => {
    openQuiz(state, data);
  };

  return (
    <div className={cls.quizSection}>
      <button onClick={() => openQuizPreview(true, section)}>
        {section?.photo_file && (
          <Image
            src={section.photo_file}
            alt="quizImage"
            layout="responsive" // Dynamically adjusts height based on width
            width={1000} // Original aspect ratio width
            height={1000} // Original aspect ratio height
          />
        )}
        <div className={cls.questionIcon}>
          <Icon
            icon="mdi:comment-question"
            width="100"
            height="100"
            color="rgb(255 64 4 / 30%)"
          />
        </div>
      </button>
    </div>
  );
};

export default QuizSection;
