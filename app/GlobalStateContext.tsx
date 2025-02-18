"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { SimplePool } from 'nostr-tools';

type GlobalState = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  publicKey: React.RefObject<string>;
  pool: SimplePool;
};

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  let darkModeInitialValue = false;
  if (typeof localStorage !== 'undefined') {
    darkModeInitialValue = localStorage.getItem('darkMode') === 'true';
  }
  const [darkMode, setDarkMode] = useState(darkModeInitialValue);
  const publicKey = useRef('');
  const pool = useRef<SimplePool>(null);
  
  if (!pool.current) {
    pool.current = new SimplePool();
  }
  return (
    <GlobalStateContext.Provider value={{
      darkMode,
      setDarkMode,
      publicKey,
      pool: pool.current,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};