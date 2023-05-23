export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay) {
    return [];
  }

  return selectedDay.appointments.map((id) => state.appointments[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewers = state.interviewers;

  return {
    ...interview,
    interviewer: interviewers[interviewerId],
  };
}

export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay) return [];

  return selectedDay.interviewers.map((id) => state.interviewers[id]);
}
