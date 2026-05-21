import { useRef } from 'react';

function ScrollAnimation({ children, className = '' }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className={`${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollAnimation;
