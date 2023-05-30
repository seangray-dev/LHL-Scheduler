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

  const setDay = (day) => setState({ ...state, day });

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

      setState({
        ...state,
        appointments,
      });
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

      setState({
        ...state,
        appointments,
      });
      return response;
    } catch (error) {
      throw Error;
    }
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};

export default useApplicationData;
