import { useState, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = () => {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
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

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  const bookInterview = async (id, interview) => {
    try {
      const response = await axios.put(`/api/appointments/${id}`, {
        interview,
      });

      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      setState((prev) => ({
        ...prev,
        appointments,
      }));

      updateSpots(state.day, appointments);

      return response;
    } catch (error) {
      throw Error;
    }
  };

  const cancelInterview = async (id) => {
    try {
      const response = await axios.delete(`/api/appointments/${id}`);

      const appointment = {
        ...state.appointments[id],
        interview: null,
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      setState((prev) => ({
        ...prev,
        appointments,
      }));

      updateSpots(state.day, appointments);

      return response;
    } catch (error) {
      throw Error;
    }
  };

  const updateSpots = (day, appointments) => {
    const days = [...state.days];
    const dayObj = days.find((d) => d.name === day);

    const appointmentIds = dayObj.appointments;
    const spots = appointmentIds.filter(
      (id) => !appointments[id].interview
    ).length;

    dayObj.spots = spots;

    setState((prev) => ({
      ...prev,
      days,
    }));
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};

export default useApplicationData;
