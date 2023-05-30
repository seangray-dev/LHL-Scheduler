import React from 'react';

import 'components/Appointment/styles.scss';

import Header from 'components/Appointment/Header';
import Empty from 'components/Appointment/Empty';
import Show from 'components/Appointment/Show';
import Form from 'components/Appointment/Form';
import useVisualMode from 'hooks/useVisualMode';
import Status from 'components/Appointment/Status';
import Confirm from './Confirm';
import Error from './Error';

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const EDIT = 'EDIT';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    if (mode === CREATE) {
      props
        .bookInterview(props.id, interview)
        .then(() => {
          transition(SHOW);
        })
        .catch((error) => {
          transition(ERROR_SAVE, true);
        });
    } else if (mode === EDIT) {
      props
        .bookInterview(props.id, interview)
        .then(() => {
          transition(SHOW);
        })
        .catch((error) => {
          transition(ERROR_SAVE, true);
        });
    }
  }

  function cancelInterview() {
    if (mode === CONFIRM) {
      transition(DELETING, true);

      props
        .cancelInterview(props.id)
        .then(() => {
          transition(EMPTY);
        })
        .catch((error) => {
          transition(ERROR_DELETE, true);
        });
    } else {
      transition(CONFIRM);
    }
  }

  function editInterview() {
    transition(EDIT);
  }

  return (
    <article className='appointment' data-testid='appointment'>
      <Header time={props.time} />
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelInterview}
          onEdit={editInterview}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {(mode === CREATE || mode === EDIT) && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
          onDelete={cancelInterview}
          name={props.interview ? props.interview.student : ''}
          interviewer={props.interview ? props.interview.interviewer.id : null}
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
      {mode === ERROR_SAVE && (
        <Error message={'Error saving appointment'} onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message={'Error deleting appointment'} onClose={back} />
      )}
    </article>
  );
}
