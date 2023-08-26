// hooks/useSessionStorage.js
import { useState, useEffect } from 'react';

function useSessionStorage(key, initialValue) {
  // Get value from sessionStorage or use the initial value
  const storedValue = window.sessionStorage.getItem(key);
  //if sessionStorage is
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState(initial);

  // Update sessionStorage whenever value changes
  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useSessionStorage;
