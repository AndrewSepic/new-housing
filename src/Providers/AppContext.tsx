import { createContext, useState, useContext, useMemo } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

type AppContextValue = {
  year: string;
  setYear: Dispatch<SetStateAction<string>>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: {children: ReactNode}) {
  const [year, setYear] = useState('2022');
  
  const value = useMemo(() => ({ year, setYear }), [year, setYear]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const ctx = useContext(AppContext)
    if(!ctx) throw new Error('useAppContext must be used within <AppProvider>')
    return ctx
}

