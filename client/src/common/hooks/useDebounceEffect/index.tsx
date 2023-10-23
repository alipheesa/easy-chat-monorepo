import { useEffect, DependencyList } from "react";

const useDebounceEffect = (
  fn: () => void,
  waitTime: number,
  deps?: DependencyList
) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
};

export default useDebounceEffect;
