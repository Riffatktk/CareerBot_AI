import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    const startValue = 0;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * (target - startValue) + startValue);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { count, ref };
}
