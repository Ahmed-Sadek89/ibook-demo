//== Hooks
import { useEffect, useState, useRef } from "react";
//== Styles
import cls from './numberWordsDragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [answers, setAnswers] = useState([]);
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 10, y: 20 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 12, y: 12 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 80, y: 15 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 120, y: 15 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 190, y: 15 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
  }

  const dragEnd = (e) => {
    e.preventDefault()
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, index) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(draggableItem);
    let updatedAnswers = [...answers]
    const indexToDelete = answers.findIndex(obj => Object.keys(obj)[0] === index.toString());
    console.log(draggableItem)
    if (indexToDelete < 0) {
      setAnswers(prev => [...prev, { [index]: draggableItem.id }]);
    } else {
      updatedAnswers[indexToDelete] = { [index]: draggableItem.id };
      setAnswers(updatedAnswers);
    }
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget.cloneNode(true);
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      if (e.currentTarget.offsetWidth > 100) {
        newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - e.currentTarget.offsetHeight / 2}px`;
        newElement.style.left = `${touch.pageX - e.currentTarget.offsetWidth / 2}px`;
      } else {
        newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
        newElement.style.left = `${touch.pageX - dimensions.x}px`;
      }
      // newElement.id = touch.identifier;
      draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement);
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
      newDraggable.style.zIndex = '9';
      if (e.currentTarget.offsetWidth > 100) {
        newDraggable.style.top = `${touch.pageY - parent.getBoundingClientRect().y - e.currentTarget.offsetHeight / 2}px`;
        newDraggable.style.left = `${touch.pageX - e.currentTarget.offsetWidth / 2}px`;
      } else {
        newDraggable.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
        newDraggable.style.left = `${touch.pageX - dimensions.x}px`;
      }
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
    if ((element.tagName === 'SPAN' || element.classList.contains(cls.box)) && element.children.length === 0) {
      let appendedItem = newDraggable.cloneNode(true);
      appendedItem.style.position = 'static';
      element.appendChild(appendedItem);
      let updatedAnswers = [...answers]
      const index = element.getAttribute('data-index');
      const indexToDelete = answers.findIndex(obj => Object.keys(obj)[0] === index.toString());
      if (indexToDelete < 0) {
        setAnswers(prev => [...prev, { [index]: newDraggable.id }]);
      } else {
        updatedAnswers[indexToDelete] = { [index]: e.currentTarget.id };
        setAnswers(updatedAnswers);
      }
    }
    newDraggable.remove();
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
    answers
    // rendered,
    // studentAnswer
  }
}