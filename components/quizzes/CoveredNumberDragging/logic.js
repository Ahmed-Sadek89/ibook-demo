//== Hooks
import { useEffect, useRef, useState } from "react";
//== Styles
import cls from './coveredNumber-dragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [draggedItems, setDraggedItems] = useState([]);
  const [rendered, setRendered] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 30, y: 25 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 40, y: 15 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 90, y: 20 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 160, y: 30 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 30 });
    }
  }, []);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    // let newElement = e.currentTarget.cloneNode(true);
    // newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(e.currentTarget);
  }

  const dragEnd = (e) => {
    e.preventDefault();
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, idx) => {
    e.preventDefault();
    setDraggedItems(prev => [...prev, newDraggable]);
    const element = e.currentTarget;
    element.classList.add(cls.droppedFromDrag);
    // draggableContainer.current.appendChild(newDraggable);
    element.appendChild(newDraggable);
    setAnswers(prev => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [idx]: element?.id,
      },
    }));
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      let newElement = e.currentTarget;
      newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      newElement.id = touch.identifier;
      // draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement);
    });

    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "hidden";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "hidden";
    document.querySelector(`.${modalCls.area}`).style.overflow = "hidden";
  }

  const touchMoving = (e) => {
    let element = e.currentTarget;
    element.parentElement.classList.remove(cls.dropped);
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
    if (element.classList.contains(cls.numberAnswer) && element.children.length === 0) {
      element.classList.add(cls.dropped)
      element.appendChild(newDraggable);
      const idx = element.getAttribute('data-index');
      setAnswers(prev => ({
        ...prev,
        [idx]: {
          ...prev[idx],
          [idx]: element?.id,
        },
      }));
    } else {
      newDraggable.style.position = 'static';
      draggableContainer.current.appendChild(newDraggable)
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
    rendered,
    answers
  }
}