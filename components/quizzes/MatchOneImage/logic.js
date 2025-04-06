//== Hooks
import { useRef, useState } from "react";

let startX = 0, startY = 0;
let endX = 0, endY = 0;

export default function useLogic() {
  const [ctx, setCtx] = useState(0);
  const [isDrawing, setIsDrawing] = useState(0);
  const [rendered, setRendered] = useState(true);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const canvasElement = useRef(null);

  function startDrawing(event) {
    setCtx(canvasElement.current.getContext('2d'))
    startX = event.clientX - canvasElement.current.getBoundingClientRect().left;
    startY = event.clientY - canvasElement.current.getBoundingClientRect().top;
    setIsDrawing(true);
  }

  function endDrawing(event) {
    if (isDrawing) {
      endX = event.clientX - canvasElement.current.getBoundingClientRect().left;
      endY = event.clientY - canvasElement.current.getBoundingClientRect().top;
      drawLine();
      setIsDrawing(false);
      const answer = event.target.src
      setStudentAnswer(answer);
    }
  }

  function drawLine() {
    ctx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
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
    }, 20)
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