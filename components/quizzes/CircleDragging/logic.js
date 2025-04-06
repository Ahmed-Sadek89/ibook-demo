//== Hooks
import { useEffect, useRef, useState } from "react";

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [newDraggable, setNewDraggable] = useState(null);
  const [draggableContainer, setDraggableContainer] = useState(null);
  const [choosedIndexes, setChoosedIndexes] = useState([]);
  const [rendered, setRendered] = useState(true);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    setDraggableContainer(e.currentTarget.parentNode);
    let newElement = e.currentTarget.cloneNode(true)
    newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
    setNewDraggable(newElement);
  }

  const dragEnd = (e) => {
    e.preventDefault()
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e, index) => {
    e.preventDefault();
    if (choosedIndexes.includes(index)) return;
    draggableContainer.appendChild(draggableItem);
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(newDraggable);
    setChoosedIndexes(prev => [...prev, index]);
  }

  const retry = () => {
    setRendered(false);
    setTimeout(() => {
      setRendered(true)
    }, 20)
  }

  return {
    dragStart,
    dragEnd,
    dragOver,
    drop,
    retry,
    rendered
  }
}