import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    setHistory((prevHistory) => {
      if (replace) {
        // Replace the last mode in the history with the new mode
        const newHistory = [...prevHistory.slice(0, -1), newMode];
        return newHistory;
      } else {
        // Add the new mode to the history
        return [...prevHistory, newMode];
      }
    });
  };

  const back = () => {
    if (history.length > 1) {
      // Remove the last mode from the history
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);

      // Set the mode to the previous mode in the history
      const previousMode = newHistory[newHistory.length - 1];
      setMode(previousMode);
    }
  };

  return { mode, transition, back };
}
