//== Hooks
import { useEffect, useState, useRef } from "react";
//== Styles
import cls from './columnsDragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [newDraggable, setNewDraggable] = useState(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [answers, setAnswers] = useState([]);
  const draggableContainer = useRef(null);
  const draggableText = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 15, y: 15 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 15, y: 15 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 60, y: 15 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 140, y: 15 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 10 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    setNewDraggable(e.currentTarget);
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
    const dropTargetType = e.currentTarget.getAttribute('data-type');
    const droppedElement = newDraggable.tagName;
    if (dropTargetType === 'text' && droppedElement === 'IMG') return;
    if (dropTargetType === 'image' && droppedElement === 'SPAN') return;
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(draggableItem);
    let updatedAnswers = [...answers]
    const indexToDelete = answers.findIndex(obj => Object.keys(obj)[0] === index.toString());
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
      let newElement = e.currentTarget;
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      // newElement.id = touch.identifier;
      setNewDraggable(newElement);
      const droppedElement = e.currentTarget.tagName;
      if (droppedElement === 'IMG') {
        draggableContainer.current.appendChild(newElement);
      } else {
        draggableText.current.appendChild(newElement);
      }
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
    const dropTargetType = element.getAttribute('data-type');
    const droppedElement = newDraggable.tagName;
    console.log(dropTargetType)
    console.log(droppedElement)
    if (dropTargetType === 'text' && droppedElement === 'IMG') {
      newDraggable.style.position = 'static';
      return
    };
    if (dropTargetType === 'image' && droppedElement === 'SPAN') {
      newDraggable.style.position = 'static';
      return
    };
    const dataIdValue = element.getAttribute('data-id');
    if ((dataIdValue === 'lineDrop' || dataIdValue === 'boxDrop') && element.children.length === 0) {
      newDraggable.style.position = 'static';
      element.appendChild(newDraggable);
      let updatedAnswers = [...answers]
      const index = element.getAttribute('data-index');
      const indexToDelete = answers.findIndex(obj => Object.keys(obj)[0] === index.toString());
      if (indexToDelete < 0) {
        setAnswers(prev => [...prev, { [index]: newDraggable.id }]);
      } else {
        updatedAnswers[indexToDelete] = { [index]: e.currentTarget.id };
        setAnswers(updatedAnswers);
      }
    } else {
      newDraggable.style.position = 'static';
    }
  }

  return {
    draggableContainer,
    draggableText,
    dragStart,
    dragEnd,
    dragOver,
    drop,
    touchStart,
    touchMoving,
    touchEnd,
    answers
  }
}