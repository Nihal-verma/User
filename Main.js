import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import UserLogin from "./User/UserLogin/UserLogin";
import TnaAssessment from "./User/StartAssesment/TnaAssessment/TnaAssessment.jsx";
import NewCourse from "./User/MyCourse/CourseComponent.jsx";
import LinkExpirePage from "./User/BeforeAssesssment/LinkExpirePage";
import InvalidUser from "./User/BeforeAssesssment/InvalidUser";
import ThankYouPage from "./User/StartAssesment/ThankYouPage";
import GradedAssesment from "./User/StartAssesment/GradedAssesment/GradedAssesment.jsx";
import NonGradedAssesment from "./User/StartAssesment/NonGraded/NonGradedAssesment.jsx";
import NonGradedAssesmentEvaluation from "./User/StartAssesment/NonGradedEvaluation/index.jsx";
import NonGradedEvaluationView from "./User/StartAssesment/NonGradedEvaluation/NonGradedEvaluationView.jsx";
import FinalAssessment from "./User/StartAssesment/FinalAssessment/FinalAssessment.jsx";
import SingleVideo from './User/SingleVideo/SingleVideo.jsx';
import Events from "./User/Events/index.jsx";
import BeforeAssesssment from './User/BeforeAssesssment/BeforeAssesssment.jsx';
import UserHeader from "./User/UserHeader/UserHeader.jsx";
import ErrorPage from "./ErrorPage.jsx";
const Main = ({ isLoggedIn, setLoggedIn }) => {
  const location = useLocation();
  const showHeader = ["/course", "/Events", "/NonGradedEvaluation", "/video","/Evaluation"].some((path) => location.pathname.startsWith(path));

  return (
    <>
      {isLoggedIn && showHeader && <UserHeader setLoggedIn={setLoggedIn} />}
      <Routes>
        <Route path="/course" element={isLoggedIn ? <NewCourse setLoggedIn={setLoggedIn} /> : <Navigate to='/' />} />
        <Route path="/GradedAssesment/:moduleId" element={isLoggedIn ? <GradedAssesment /> : <Navigate to='/' />} />
        <Route path="/video/:moduleId" element={isLoggedIn ? <SingleVideo /> : <Navigate to='/' />} />
        <Route path="/NonGradedAssesment/:moduleId/:lessonId" element={isLoggedIn ? <NonGradedAssesment /> : <Navigate to='/' />} />
        <Route path="/NonGradedEvaluation" element={isLoggedIn ? <NonGradedAssesmentEvaluation setLoggedIn={setLoggedIn} /> : <Navigate to='/' />} />
        <Route path="/Evaluation/:lesson_id" element={isLoggedIn ? <NonGradedEvaluationView setLoggedIn={setLoggedIn} /> : <Navigate to='/' />} />
        <Route path="/FinalAssessment" element={isLoggedIn ? <FinalAssessment /> : <Navigate to='/' />} />
        <Route path="/Events" element={isLoggedIn ? <Events setLoggedIn={setLoggedIn} /> : <Navigate to='/' />} />
        <Route path="/" element={<UserLogin setLoggedIn={setLoggedIn} />} />
        <Route path="/StartAssement/:tnaLicenseCode/:comp_id/:uniqueToken" element={<TnaAssessment />} />
        <Route path="/linkExpire" element={<LinkExpirePage />} />
        <Route path="/InvalidUser" element={<InvalidUser />} />
        <Route path="/ThankYouPage" element={<ThankYouPage />} />
        <Route path="/TnaMcq/:tnaLicenseCode/:comp_id/:uniqueToken" element={<BeforeAssesssment />} />
        <Route path="*" element={<ErrorPage />} /> {/* Add the ErrorPage route */}
      </Routes>
    </>
  );
};

export default Main;