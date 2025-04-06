//== Hooks
import { useEffect, useRef, useState } from "react";
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [newDraggable, setNewDraggable] = useState(null);
  const [draggedItems, setDraggedItems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 50, y: 50 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 60, y: 60 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 100, y: 75 });
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
    e.preventDefault()
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, index) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    let updatedAnswers = [...answers];
    e.currentTarget.appendChild(draggableItem);
    setDraggedItems(p => [...p, draggableItem.src]);
    if (draggedItems.find(d => d === draggableItem.src)) {
      updatedAnswers = [...Object.values(updatedAnswers).filter((obj) => Object.values(obj)[0] !== draggableItem.id)];
    }
    updatedAnswers = [...updatedAnswers, { [index]: draggableItem.id }];
    setAnswers([...updatedAnswers]);
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget.cloneNode(true);
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.width = '100px';
      newElement.style.height = '100px';
      newElement.style.borderRadius = '50%';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
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
      newDraggable.style.width = '100px';
      newDraggable.style.height = '100px';
      newDraggable.style.borderRadius = '50%';
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
    if (element.id.includes('drop') && element.children.length === 0) {
      const index = element.getAttribute('data-index');
      let updatedAnswers = [...answers];
      element.appendChild(draggableItem);
      setDraggedItems(p => [...p, draggableItem.src]);
      if (draggedItems.find(d => d === draggableItem.src)) {
        updatedAnswers = [...Object.values(updatedAnswers).filter((obj) => Object.values(obj)[0] !== draggableItem.id)];
      }
      updatedAnswers = [...updatedAnswers, { [index]: draggableItem.id }];
      setAnswers([...updatedAnswers]);
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
  }
}