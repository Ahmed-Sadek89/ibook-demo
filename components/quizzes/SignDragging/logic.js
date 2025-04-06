//== Hooks
import { useEffect, useRef, useState } from "react";
//== Styles
import cls from './signDragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 20, y: 20 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 50, y: 30 });
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
    let newElement = e.currentTarget.cloneNode(true)
    newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(newElement)
  }

  const dragEnd = (e) => {
    e.preventDefault()
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, index) => {
    e.preventDefault();
    const element = e.currentTarget;
    if (draggableItem.tagName !== 'IMG') return
    if (element.children.length >= 1) return;
    element.appendChild(newDraggable);
    setAnswers(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [index]: draggableItem.getAttribute('data-sign'),
      },
    }));
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget.cloneNode(true);
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.width = '40px';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement);
    });

    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "hidden";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "hidden";
    document.querySelector(`.${modalCls.area}`).style.overflow = "hidden";
  }

  const touchMoving = (e) => {
    if (draggableItem.tagName !== 'IMG') return
    [...e.changedTouches].forEach((touch) => {
      const parent = document.getElementById('quiz_modal');
      if (!newDraggable) return;
      newDraggable.style.position = 'absolute';
      newDraggable.style.zIndex = '9';
      newDraggable.style.width = '40px';
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
    if (element?.classList?.contains(cls.number) && element.children.length === 0) {
      let appendedItem = newDraggable.cloneNode(true);
      appendedItem.style.position = 'static';
      element.appendChild(appendedItem);
      const idx = element.getAttribute('data-index');
      setAnswers(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          [idx]: draggableItem.getAttribute('data-sign'),
        },
      }));
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
    rendered,
    answers
  }
}