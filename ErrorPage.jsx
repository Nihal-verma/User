// User/ErrorPage/ErrorPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ error }) => {
  return (
    <>
      {error ? (<div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Error Occurres </h1>
        <p>Sorry, the page you are looking is currently not working {error}.</p>

      </div>) : (<div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/course">Go back to Home</Link>
      </div>)}
    </>
  );
};

export default ErrorPage;
