import React from "react";



const useMediaQuery = (query: any, whenTrue: any, whenFalse: any) => {
  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = React.useState(!!mediaQuery.matches);

  React.useEffect(() => {
    const handler = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [mediaQuery]);

  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return whenFalse;
  }

  return match ? whenTrue : whenFalse;
};


export default useMediaQuery