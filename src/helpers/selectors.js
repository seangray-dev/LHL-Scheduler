export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay) {
    return [];
  }

  return selectedDay.appointments.map((id) => state.appointments[id]);
}

export function getInterview(state, interview) {
  const interviewers = {
    1: {
      id: 1,
      name: 'Sylvia Palmer',
      avatar: 'https://i.imgur.com/LpaY82x.png',
    },
    2: {
      id: 2,
      name: 'Tori Malcolm',
      avatar: 'https://i.imgur.com/Nmx0Qxo.png',
    },
  };

  return (
    interview && {
      ...interview,
      interviewer: interviewers[interview.interviewer],
    }
  );
}
