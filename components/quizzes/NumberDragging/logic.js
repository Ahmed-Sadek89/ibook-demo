//== Hooks
import { useEffect, useRef, useState } from "react";
//== Styles
import cls from './numberDragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState([]);
  const [draggedItems, setDraggedItems] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [rendered, setRendered] = useState(true);
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 30, y: 40 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 30, y: 70 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 80, y: 30 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 140, y: 30 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 30 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    let newElement = e.currentTarget;
    // newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(newElement);
  }

  const dragEnd = (e, index) => {
    e.preventDefault();
    let updatedAnswers = [...studentAnswer];
    const elementPlace = e.currentTarget.parentNode.children[index + 1];
    e.currentTarget.parentNode.insertBefore(draggableItem, elementPlace);
    const answer = e.currentTarget.textContent;
    console.log(e.currentTarget.textContent)
    if (draggedItems.find(d => d === answer)) {
      updatedAnswers = [...Object.values(updatedAnswers).filter((obj) => Object.values(obj)[0] !== answer)];
    }
    setDraggedItems(prev => [...prev, answer]);
    updatedAnswers = [...updatedAnswers, { [index]: answer }];
    setStudentAnswer([...updatedAnswers]);
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(newDraggable);
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget;
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      // newElement.id = touch.identifier;
      draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement)
    })

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
      newDraggable.style.zIndex = '9';
      newDraggable.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newDraggable.style.left = `${touch.pageX - dimensions.x}px`;
    })
  }

  const touchEnd = (e) => {
    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "auto";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "auto";
    document.querySelector(`.${modalCls.area}`).style.overflow = "auto";

    if (!newDraggable) return;
    const touch = e.changedTouches[0];
    const element = document.elementsFromPoint(touch.clientX, touch.clientY)[1];
    const parent = element.parentElement.parentElement;
    const target = element.parentElement;
    const index = Array.from(parent.children).indexOf(target);
    if (element.classList.contains(cls.choice) && element.children.length === 0) {
      const answer = touch.target.textContent;
      newDraggable.style.position = 'static';
      let updatedAnswers = [...studentAnswer];
      element.appendChild(newDraggable);
      setDraggedItems(p => [...p, answer]);
      if (draggedItems.find(d => d === answer)) {
        updatedAnswers = [...Object.values(updatedAnswers).filter((obj) => Object.values(obj)[0] !== answer)];
      }
      updatedAnswers = [...updatedAnswers, { [index]: answer }];
      setStudentAnswer([...updatedAnswers]);
    } else {
      e.currentTarget.style.position = 'static';
    }
  }

  const retry = () => {
    setRendered(false);
    setTimeout(() => {
      setRendered(true)
    }, 20)
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
    retry,
    rendered,
    studentAnswer
  }
}