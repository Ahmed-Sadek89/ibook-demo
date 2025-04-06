import { useState } from "react";

  ;
//== Component Logic
import useLogic from './logic';
//== Styles
import cls from './imagesPuzzle.module.scss';

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
    <div className={cls.imagesPuzzle}>
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
      <h2>قم بتجميع الصورة التي أمامك:</h2>
      <div className={cls.images}>
        <img
          src="/imgs/part1.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 0)}
        />
        <img
          src="/imgs/part2.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 1)}
        />
        <img
          src="/imgs/part3.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 2)}
        />
        <img
          src="/imgs/part4.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
        <img
          src="/imgs/part5.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
        <img
          src="/imgs/part6.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
        <img
          src="/imgs/part7.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
        <img
          src="/imgs/part8.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
        <img
          src="/imgs/part9.png"
          alt="check-mark"
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e, 3)}
        />
      </div>
      <div className={cls.items}>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        </div>
        <div className={cls.item} onDragOver={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
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

export default NumberDragging;