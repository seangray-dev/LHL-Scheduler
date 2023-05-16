import React from 'react';
import 'components/InterviewerListItem.scss';
import classNames from 'classnames';

const InterviewerListItem = (props) => {
  const interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected,
  });

  return (
    <li
      className={interviewerClass}
      onClick={() => props.setInterviewer(props.id)}>
      <img
        className='interviewers__item-image'
        src='https://i.imgur.com/LpaY82x.png'
        alt={props.name}
      />
      {props.selected && props.name}{' '}
    </li>
  );
};

export default InterviewerListItem;
