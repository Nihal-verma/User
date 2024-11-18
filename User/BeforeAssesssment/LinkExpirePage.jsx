import React, { useEffect } from 'react';

export default function LinkExpirePage() {
  useEffect(() => {
    // Replace current state with a new state, effectively removing the previous page from the history stack
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function (event) {
      window.history.go(1); // Prevent navigating back using the browser's back button
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div><h1>Sorry, the link has expired.</h1></div>
    </div>
  );
}
