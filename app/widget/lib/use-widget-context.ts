import { useContext } from 'react';
import { WidgetContext } from './context';

export function useWidgetContext() {
  return useContext(WidgetContext);
}
