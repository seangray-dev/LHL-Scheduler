import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'components/Application.scss';
import DayList from './DayList';
import Appointment from './Appointment';
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from 'helpers/selectors';

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const interviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        setState({
          ...state,
          appointments,
        });

        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then((response) => {
        const appointment = {
          ...state.appointments[id],
          interview: null,
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        setState({
          ...state,
          appointments,
        });

        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      const [daysRes, appointmentsRes, interviewersRes] = all;
      const days = daysRes.data;
      const appointments = appointmentsRes.data;
      const interviewers = interviewersRes.data;
      setState((prev) => ({
        ...prev,
        days,
        appointments,
        interviewers,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  return (
    <main className='layout'>
      <section className='sidebar'>
        <img
          className='sidebar--centered'
          src='images/logo.png'
          alt='Interview Scheduler'
        />
        <hr className='sidebar__separator sidebar--centered' />
        <nav className='sidebar__menu'>
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className='sidebar__lhl sidebar--centered'
          src='images/lhl.png'
          alt='Lighthouse Labs'
        />
      </section>
      <section className='schedule'>
        {schedule}
        <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
