import React from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export default function useSafeGoBack<T extends ParamListBase>(nav: NavigationProp<T>) {
  return React.useCallback(<K extends keyof T>(fallback: K, params?: T[K]) => {
    if (nav.canGoBack()) nav.goBack();
    else {
      // @ts-expect-error generic cast for react-navigation
      nav.navigate(fallback as never, params as never);
    }
  }, [nav]);
}
