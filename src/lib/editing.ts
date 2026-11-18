import { createContext, useContext } from 'react';
export const EditingContext = createContext(false);
export const useCanEdit = () => useContext(EditingContext);
