//== Hooks
import { useEffect, useRef, useState } from "react";
//== Styles
import cls from './similarNumberDragging.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 20, y: 20 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 50, y: 30 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 100, y: 30 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 150, y: 30 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 30 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    let newElement = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(newElement);
  }

  const dragEnd = (e) => {
    e.preventDefault();
    if (e.currentTarget.src === studentAnswer) {
      draggableContainer.current.appendChild(e.currentTarget);
      setStudentAnswer(null);
    }
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    const element = e.currentTarget;
    console.log(element)
    if (element.classList.contains(cls.droppableItem)) {
      element.appendChild(newDraggable);
      const answer = newDraggable.src;
      setTimeout(() => {
        setStudentAnswer(answer);
      }, 500)
    }
  }

  const touchStart = (e) => {
    // let newElement = e.currentTarget;
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget;
      newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      newElement.id = touch.identifier;
      draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement)
    })
  }

  const touchMoving = (e) => {
    [...e.changedTouches].forEach((touch) => {
      const parent = document.getElementById('quiz_modal');
      if (!newDraggable) return;
      newDraggable.style.position = 'absolute';
      newDraggable.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newDraggable.style.left = `${touch.pageX - dimensions.x}px`;
    })
  }

  const touchEnd = (e) => {
    if (!newDraggable) return;
    const touch = e.changedTouches[0];
    const element = document.elementsFromPoint(touch.clientX, touch.clientY)[1];
    if (element.classList.contains(cls.droppableItem) && element.children.length === 0) {
      newDraggable.style.position = 'static'
      element.appendChild(newDraggable);
      const answer = e.currentTarget.src
      setStudentAnswer(answer);
    } else {
      setStudentAnswer(null);
      newDraggable.style.position = 'static'
    }
  }

  return {
    draggableContainer,
    dragStart,
    dragEnd,
    dragOver,
    drop,
    touchStart,
    touchMoving,
    touchEnd,
    studentAnswer
  }
}