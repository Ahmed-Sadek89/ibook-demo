import { useState } from "react";

  ;
//== Component Logic
import useLogic from './logic';
//== Styles
import cls from './circleDragging.module.scss';

const CircleDragging = ({
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
  const { dragStart, dragEnd, dragOver, drop, retry, rendered } = useLogic();
       
  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (questionsNum === questionNum) {
      setOpenQuizModal(false);
    } else {
      setQuestionNum((questionNum += 1));
      setChanging(true);
      setTimeout(() => {
        setChanging(false);
      }, 1000);
    }
  };

  if (!rendered) return null;
  return (
    <div className={cls.circleDragging}>
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
      <h2>أعد وضع دائرة حول العدد المناسب:
        <span>
          <img
            src="/imgs/circle.png"
            alt="check-mark"
            draggable={true}
            onDragStart={(e) => dragStart(e)}
            onDragEnd={(e) => dragEnd(e)}
          />
        </span>
      </h2>
      <div className={cls.items}>
        <div className={cls.item}>
          <img src="/imgs/chickens.png" alt="item_image" className={cls.image} />
          <div className={cls.choices}>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 0)}>1</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 0)}>2</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 0)}>3</span>
          </div>
        </div>
        <div className={cls.item}>
          <img src="/imgs/fish.png" alt="item_image" className={cls.image} />
          <div className={cls.choices}>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 1)}>1</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 1)}>2</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 1)}>3</span>
          </div>
        </div>
        <div className={cls.item}>
          <img src="/imgs/pencils.png" alt="item_image" className={cls.image} />
          <div className={cls.choices}>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 2)}>1</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 2)}>2</span>
            <span onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e, 2)}>3</span>
          </div>
        </div>
      </div>
      {/* <div className={cls.actions}>
        <button onClick={retry}><i className="fa-arrows-rotate fa-regular"></i> إعادة المحاولة</button>
      </div> */}

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
    </div>
  )
}

export default CircleDragging;