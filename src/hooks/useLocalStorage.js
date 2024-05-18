"use client";
import { useEffect, useRef, useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const listenerRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    };

    listenerRef.current = handleStorageChange;

    if (listenerRef.current) {
      window.addEventListener("storage", listenerRef.current, false);
    }

    return () => {
      if (listenerRef.current) {
        window.removeEventListener("storage", listenerRef.current, false);
      }
    };
  }, [key]);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = null;
      if (key) {
        item = window.localStorage.getItem(key);
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (key) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
