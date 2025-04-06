//== Hooks
import { useState } from "react";

export default function useLogic() {
  const [draggableItem, setDraggableItem] = useState(null);
  const [rendered, setRendered] = useState(true);

  const dragStart = (e) => {
    setDraggableItem(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
  }

  const dragEnd = (e, index) => {
    e.preventDefault();
    const elementPlace = e.currentTarget.parentNode.children[index + 1]
    e.currentTarget.parentNode.insertBefore(draggableItem, elementPlace);
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  const drop = (e) => {
    e.preventDefault();
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