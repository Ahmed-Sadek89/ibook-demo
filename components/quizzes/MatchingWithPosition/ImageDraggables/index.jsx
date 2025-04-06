"use client";
import { Icon } from '@iconify/react/dist/iconify.js';
import draggablesStyles from './draggables.module.scss';

const Draggables = ({ droppingArea, dragStart, dragEnd, removeChoice, questionDetails, touchStart, touchMoving, touchEnd }) => {
  return (
    <div className={draggablesStyles.draggables} ref={droppingArea}>
      {questionDetails?.answers.map((answer, idx) => (
        <p
          className={`${draggablesStyles.item} item`}
          id={answer.id}
          key={answer.id}
          draggable={true}
          onDragStart={(e) => dragStart(e)}
          onDragEnd={(e) => dragEnd(e)}
          onTouchStart={(e) => touchStart(e)}
          onTouchMove={(e) => touchMoving(e)}
          onTouchEnd={(e) => touchEnd(e)}
        >
          {answer.title}
          <Icon icon="line-md:cancel" width="24" height="24"  onClick={(e) => removeChoice(e, idx)} style={{ color: "red", cursor: "pointer" }} />
          {/* <i className="fa-ban fa-duotone" onClick={(e) => removeChoice(e, idx)}></i> */}
        </p>
      ))}
    </div>
  )
}

export default Draggables