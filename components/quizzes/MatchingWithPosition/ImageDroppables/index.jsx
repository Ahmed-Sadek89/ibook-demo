"use client";
//== Hooks
import { Fragment } from 'react';
//== droppables_styles
import droppablesStyles from './droppables.module.scss';

const Droppables = ({ dragOver, drop, questionDetails }) => {

  return (
    <div className={droppablesStyles.dropables}>
      <img className={droppablesStyles.question_image} src={questionDetails.question_img} alt="question_image" />
      {questionDetails?.answers.map((one, idx) => (
        <Fragment key={idx}>
          {one.answer_two_gap_match.split(',')[1] &&
            <div
              id={one.id}
              data-index={idx}
              className={droppablesStyles.dropable}
              onDragOver={(e) => dragOver(e)}
              onDrop={(e) => drop(e, idx)}
              style={{ top: `${one.answer_two_gap_match.split(',')[1]}px`, left: `${one.answer_two_gap_match.split(',')[0]}px` }}
            ></div>
          }
        </Fragment>
      ))}
    </div>
  )
}

export default Droppables