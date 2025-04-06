//== Hooks
import { useEffect, useState, useRef } from "react";
//== Styles
import cls from './trueDragging.module.scss';

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [draggedItems, setDraggedItems] = useState([]);
  const [studentAnswer, setStudentAnswer] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const draggableContainer = useRef(null);

  useEffect(() => {
    if (window.matchMedia(`(max-width: 400px)`).matches) {
      setDimensions({ x: 20, y: 20 });
    } else if (window.matchMedia(`(max-width: 550px)`).matches) {
      setDimensions({ x: 50, y: 30 });
    } else if (window.matchMedia(`(max-width: 750px)`).matches) {
      setDimensions({ x: 60, y: 30 });
    } else if (window.matchMedia(`(max-width: 992px)`).matches) {
      setDimensions({ x: 160, y: 30 });
    } else if (window.matchMedia(`(max-width: 1200px)`).matches) {
      setDimensions({ x: 220, y: 30 });
    }
  }, []);

  const dragStart = (e) => {
    let newElement = e.currentTarget;
    const imageFoundBefore = e.currentTarget.parentElement.parentElement.querySelector('img').src;
    if (imageFoundBefore) {
      setStudentAnswer(prev => [...prev.filter(el => el !== imageFoundBefore)]);
    }
    setDraggableItem(newElement);
    // newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(newElement)
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
    let updatedAnswers = [...studentAnswer];
    draggableContainer.current.appendChild(newDraggable);
    e.currentTarget.appendChild(newDraggable);
    const answer = e.currentTarget.parentNode.querySelector('img').src;
    if (draggedItems.find(d => d === answer)) {
      updatedAnswers = [...updatedAnswers.filter(item => item !== answer)];
    }
    setDraggedItems(prev => [...prev, answer]);
    updatedAnswers = [...updatedAnswers, answer];
    setStudentAnswer([...updatedAnswers]);
  }

  const touchStart = (e) => {
    [...e.changedTouches].forEach((touch) => {
      let newElement = e.currentTarget;
      setDraggableItem(newElement);
      const imageFoundBefore = e.currentTarget.parentElement.parentElement.querySelector('img').src;
      if (imageFoundBefore) {
        setStudentAnswer(prev => [...prev.filter(el => el !== imageFoundBefore)]);
      }
      // newElement.id = Math.random() * 20;
      const parent = document.getElementById('quiz_modal');
      newElement.style.position = 'absolute';
      newElement.style.top = `${touch.pageY - parent.getBoundingClientRect().y - dimensions.y}px`;
      newElement.style.left = `${touch.pageX - dimensions.x}px`;
      // newElement.id = touch.identifier;
      draggableContainer.current.appendChild(newElement);
      setNewDraggable(newElement);
    })
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
    if (!newDraggable) return;
    const touch = e.changedTouches[0];
    const element = document.elementsFromPoint(touch.clientX, touch.clientY)[1];
    if (element?.classList?.contains(cls.number) && element.children.length === 0) {
      const answer = element.parentNode.querySelector('img').src;
      newDraggable.style.position = 'static';
      let updatedAnswers = [...studentAnswer];
      element.appendChild(newDraggable);
      setDraggedItems(p => [...p, answer]);
      if (updatedAnswers.find(d => d === answer)) {
        updatedAnswers = [...updatedAnswers.filter(item => item !== answer)];
      }
      updatedAnswers = [...updatedAnswers, answer];
      setStudentAnswer([...updatedAnswers]);
    } else {
      newDraggable.style.position = 'static';
      document.getElementById("checkMarks").appendChild(newDraggable);
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