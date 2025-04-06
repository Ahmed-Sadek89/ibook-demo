//== Hooks
import { useEffect, useRef, useState } from "react";

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [rendered, setRendered] = useState(true);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    let newElement = e.currentTarget.cloneNode(true)
    newElement.id = Math.random() * 20;
    e.dataTransfer.effectAllowed = 'move';
  }

  const dragEnd = (e, index) => {
    e.preventDefault();
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
    if (e.currentTarget.children.length >= 1) return;
    e.currentTarget.appendChild(draggableItem);
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