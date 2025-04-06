//== Hooks 
import { useEffect, useState, useRef } from "react";
//== Styles
import cls from './ImageDroppables/droppables.module.scss'
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState({});
  const [showCorrection, setShowCorrection] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [changing, setChanging] = useState(false);
  const droppingArea = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 20, y: 20 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 45, y: 25 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 80, y: 30 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 160, y: 30 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 30 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
  }

  const dragEnd = (e) => {
    // setDraggableItem(null)
    e.currentTarget.style.opacity = "1"
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, index) => {
    e.preventDefault();
    if (draggableItem && !e.currentTarget.children.length) e.currentTarget.appendChild(draggableItem);
    setStudentAnswer({ ...studentAnswer, [index]: draggableItem?.id })
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      console.log(e.currentTarget)
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget;
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      // newElement.id = touch.identifier;
      droppingArea.current.appendChild(newElement);
      setNewDraggable(newElement)
    });

    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "hidden";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "hidden";
    document.querySelector(`.${modalCls.area}`).style.overflow = "hidden";
  }

  const touchMoving = (e) => {
    [...e.changedTouches].forEach((touch) => {
      const parent = document.getElementById('quiz_modal');
      if (!newDraggable) return;
      newDraggable.style.position = 'absolute';
      newDraggable.style.zIndex = '2';
      newDraggable.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newDraggable.style.left = `${touch.pageX - dimensions.x}px`;
    })
  }

  const touchEnd = (e) => {
    if (!newDraggable) return;
    const touch = e.changedTouches[0];
    const element = document.elementsFromPoint(touch.clientX, touch.clientY)[1];
    if (element.classList.contains(cls.dropable) && element.children.length === 0) {
      let appendedItem = newDraggable;
      appendedItem.style.position = 'static';
      element.appendChild(appendedItem);
      const idx = element.getAttribute('data-index');
      setStudentAnswer({ ...studentAnswer, [idx]: draggableItem?.id });
    } else {
      e.currentTarget.style.position = 'static';
      droppingArea.current.appendChild(e.currentTarget)
    }

    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "auto";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "auto";
    document.querySelector(`.${modalCls.area}`).style.overflow = "auto";
  }

  const removeChoice = (e, idx) => {
    if (e.currentTarget.parentElement) droppingArea.current?.insertBefore(e.currentTarget.parentElement, droppingArea?.current.children[idx]);
    const answers = { ...studentAnswer };
    for (const key in answers) {
      if (answers[key] === e.currentTarget.parentElement?.innerText) {
        delete answers[key];
        break;
      }
    }
    setStudentAnswer({ ...answers })
  }

  return {
    studentAnswer,
    droppingArea,
    dragStart,
    dragEnd,
    dragOver,
    drop,
    touchStart,
    touchMoving,
    touchEnd,
    removeChoice,
    rendered,
    setChanging
  }
}