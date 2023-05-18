import React from 'react';
import 'components/InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

const InterviewerList = (props) => {
  const interviewerItems = props.interviewers.map((interviewer) => (
    <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.value}
      setInterviewer={() => props.onChange(interviewer.id)}
    />
  ));

  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>{interviewerItems}</ul>
    </section>
  );
};

export default InterviewerList;
