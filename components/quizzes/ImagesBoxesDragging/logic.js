//== Hooks
import { useEffect, useState, useRef } from "react";
//== Styles
import cls from './imagesBoxesDragging.module.scss';
import modalCls from '../../modals/QuizModal/quizModal.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [rendered, setRendered] = useState(true);
  const [studentAnswer, setStudentAnswer] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 80, y: 500 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 80, y: 500 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 130, y: 470 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 200, y: 490 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 250, y: 470 });
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

  const drop = (e) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(draggableItem);
    const answer = draggableItem.src
    setStudentAnswer(prev => ([...prev, answer]));
  }

  const touchStart = (e) => {
    if (e.currentTarget.getAttribute('data-touched') === 'true') {
      e.currentTarget.setAttribute('data-touched', false);
      e.currentTarget.style.position = 'static';
      draggableContainer.current.appendChild(e.currentTarget);
      return;
    }

    const newElement = e.currentTarget;
    [...e.changedTouches].forEach((touch) => {
      setDraggableItem(e.currentTarget);
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.zIndex = '9';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      newElement.id = touch.identifier;
    })

    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "hidden";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "hidden";
    document.querySelector(`.${modalCls.area}`).style.overflow = "hidden";
  }

  const touchMoving = (e) => {
    const element = e.currentTarget;
    [...e.changedTouches].forEach((touch) => {
      const parent = document.getElementById('quiz_modal');
      if (!element) return;
      element.style.position = 'absolute';
      element.style.zIndex = '9';
      element.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      element.style.left = `${touch.pageX - dimensions.x}px`;
    })
  }

  const touchEnd = (e) => {
    // Fix dragging area scrolling behavior on touch devices
    document.documentElement.style.overflow = "auto";
    document.querySelector(`.${modalCls.overlay}`).style.overflow = "auto";
    document.querySelector(`.${modalCls.area}`).style.overflow = "auto";

    const touch = e.changedTouches[0];
    const element = document.elementsFromPoint(touch.clientX, touch.clientY)[1];
    if (element.classList.contains(cls.item) && element.children.length === 0) {
      let appendedItem = e.currentTarget;
      appendedItem.style.position = 'static';
      element.appendChild(appendedItem);
      const answer = draggableItem.src
      setStudentAnswer(prev => ([...prev, answer]));
      e.currentTarget.setAttribute('data-touched', true);
    } else {
      e.currentTarget.style.position = 'static';
      draggableContainer.current.appendChild(e.currentTarget);
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