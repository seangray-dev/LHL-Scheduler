import React from 'react';

import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment/Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from 'components/Appointment/Status';
import Confirm from './Confirm';

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancelInterview() {
    if (mode === CONFIRM) {
      transition(DELETING);

      props
        .cancelInterview(props.id)
        .then(() => {
          transition(EMPTY);
        })
        .catch((error) => {
          console.log(error);
          transition(SHOW);
        });
    } else {
      transition(CONFIRM);
    }
  }

  return (
    <article className='appointment' data-testid='appointment'>
      <Header time={props.time} />
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelInterview}
          onEdit={() => console.log('EDIT')}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
          onDelete={cancelInterview}
        />
      )}
      {mode === SAVING && <Status message={'SAVING'}></Status>}
      {mode === DELETING && <Status message={'DELETING'}></Status>}
      {mode === CONFIRM && (
        <Confirm
          message={'Are you sure you want to delete?'}
          onCancel={back}
          onConfirm={cancelInterview}
        />
      )}
    </article>
  );
}
