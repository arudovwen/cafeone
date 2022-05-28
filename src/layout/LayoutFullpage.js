import React, { useEffect } from 'react';
import useLayout from 'hooks/useLayout';

const LayoutFullpage = ({ right }) => {
  useLayout();

  useEffect(() => {
    document.body.classList.add('h-100');
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('h-100');
    }
    return () => {
      document.body.classList.remove('h-100');
      if (root) {
        root.classList.remove('h-100');
      }
    };
  }, []);

  return (
    <>
      {/* Background Start */}
      <div className="fixed-background kenburns-top" />
      {/* Background End */}

      <div className="container-fluid p-0 h-100 position-relative">
        <div className="row g-0 h-100 justify-content-center align-items-center px-3">
          {/* Right Side Start */}
          {right}
          {/* Right Side End */}
        </div>
      </div>
    </>
  );
};
export default LayoutFullpage;
