//== Hooks
import { useRef, useState } from "react";

let startX = 0, startY = 0;
let endX = 0, endY = 0;

export default function useLogic() {
  const [ctx, setCtx] = useState(0);
  const [isDrawing, setIsDrawing] = useState(0);
  const [rendered, setRendered] = useState(true);
  const [studentAnswer, setStudentAnswer] = useState([]);
  const canvasElement = useRef(null);

  function startDrawing(event) {
    setCtx(canvasElement.current.getContext('2d'))
    startX = event.clientX - canvasElement.current.getBoundingClientRect().left;
    startY = event.clientY - canvasElement.current.getBoundingClientRect().top;
    setIsDrawing(true);
  }

  function endDrawing(event) {
    if (studentAnswer.find(item => item === event.currentTarget.id)) return;
    if (isDrawing) {
      endX = event.clientX - canvasElement.current.getBoundingClientRect().left;
      endY = event.clientY - canvasElement.current.getBoundingClientRect().top;
      drawLine();
      setIsDrawing(false);
      const answer = event.currentTarget.id;
      setStudentAnswer(prev => [...prev, answer]);
    }
  }

  function drawLine() {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  const retry = () => {
    setStudentAnswer([]);
    setRendered(false);
    setTimeout(() => {
      setRendered(true)
    }, 10)
  }

  return {
    rendered,
    canvasElement,
    startDrawing,
    endDrawing,
    retry,
    studentAnswer
  }
}