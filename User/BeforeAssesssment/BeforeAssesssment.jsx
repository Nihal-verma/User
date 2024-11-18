import React, { useEffect, useState } from 'react';
import "./BeforeAssesssment.scss";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ReactComponent as Test1 } from "../../Images/test1.svg";
import { ReactComponent as Test2 } from "../../Images/test2.svg";
import { ReactComponent as Test3 } from "../../Images/test3.svg";
import { ReactComponent as Test4 } from "../../Images/test4.svg";
import useApiHelper from '../../useApiHelper'; // Import your custom hook
import {useParams,useNavigate} from 'react-router-dom'

const BeforeAssesssment = () => {
localStorage.removeItem("selectedTnaOptions")
localStorage.removeItem("TnaEmailAnswer")
localStorage.removeItem("TnaTextAnswers")
localStorage.removeItem("TnaTimer")
localStorage.removeItem("TnaQuizQuestions")
localStorage.removeItem("selectedTnaTabIndex")

  const {tnaLicenseCode,comp_id,uniqueToken} = useParams()
  const { fetchDataWithoutAuth, error } = useApiHelper();

  const navigate = useNavigate() 
  const fetchApiData = async()=>{
    const response = await fetchDataWithoutAuth(`${uniqueToken}`)
      if(response.success){
        console.log("done");
      }else{
       if(response.data===false){
        console.log(response.message)
        navigate(`/InvalidUser`)
       }
       else{
        console.log(response.message)
        navigate(`/linkExpire`)
       }
      }
  }
  useEffect(()=>{
    fetchApiData()
  },[])
  const handleSubmit =async()=>{
    navigate(`/StartAssement/${tnaLicenseCode}/${comp_id}/${uniqueToken}`)
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <Box className="before-assesssment-container">
      <Box className="header-user">
        <Box className="logo-left">
          <Typography className="logo">Hybrid LMS</Typography>
        </Box>
      </Box>
      <Box className="before-assesment-main ">
        <Box className="container">
          <Typography component="h2" className="heading">
            Steps to Guide the Process before Assesssment
          </Typography>
          <Box sx={{ flexGrow: 1 }} className="ass-wrapper">
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} sm={6} mt={2}>
                <Box className="ass-box">
                  <Box className="ass-img-wrapper">
                    <Test1 />
                  </Box>
                  <Typography className="asses-heading" mt={2}>
                    MCQ Assessment
                  </Typography>
                  <Typography className="asses-subheading">
                    Test your knowledge with a set of multiple-choice questions.
                    Choose the correct answers to proceed.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={2}>
                <Box className="ass-box">
                  <Box className="ass-img-wrapper">
                    <Test2 />
                  </Box>
                  <Typography className="asses-heading" mt={2}>
                    Email Assessment
                  </Typography>
                  <Typography className="asses-subheading">
                    Evaluate your email composition skills. Compose a
                    professional email based on the given scenario.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={2}>
                <Box className="ass-box">
                  <Box className="ass-img-wrapper">
                    <Test3 />
                  </Box>
                  <Typography className="asses-heading" mt={2}>
                    Free Text Assessment
                  </Typography>
                  <Typography className="asses-subheading">
                    Express your understanding in writing. Respond to the topic
                    or scenario using your own words.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sm={6} mt={2}>
                <Box className="ass-box">
                  <Box className="ass-img-wrapper">
                    <Test4 />
                  </Box>
                  <Typography className="asses-heading" mt={2}>
                    Oral Assesment
                  </Typography>
                  <Typography className="asses-subheading">
                    Showcase your spoken communication skills{" "}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box mt={7}>
            <Typography component="h2" className="heading">
              Important Notes:
            </Typography>

            <Box mt={2}>
              <Typography className="link-title">
                Link Deactivation and Reactivation:
              </Typography>
              <Typography mt={1} className="link-sub-text">
                You will be provided with an active link for 24 hours to access
                course materials and assessments. However, once you start a
                test, the link for that specific test will automatically
                deactivate after 1 hour and 10 minutes. Some employees may have
                the option to reactivate the link for a specific test if needed.
                Please check with your instructor or course administrator for
                details on reactivatio
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography className="link-title">
                Eligibility Criteria:
              </Typography>
              <Typography mt={1} className="link-sub-text">
                To be eligible for this course, you must achieve a minimum score
                of 60% or higher in your assessments. Scoring below 60% will
                make you ineligible to continue with the course.
              </Typography>
            </Box>

            <Box mt={2}>
              <Typography className="link-title">
                Final Assessment and Weightage:
              </Typography>
              <Typography mt={1} className="link-sub-text">
                Your final course scores are calculated based on the following
                criteria:
              </Typography>
              <Typography className="link-sub-text">
                Graded Tests: These assessments carry a weightage of 20% in your
                final score.
              </Typography>
              <Typography className="link-sub-text">
                Final Presentation: Your performance in the final presentation
                contributes to 20% of your overall score.
              </Typography>
              <Typography className="link-sub-text">
                Final Assessment: The final assessment holds the highest
                weightage, contributing 60% to your final course score.
              </Typography>
              <Typography className="link-sub-text" mt={2}>
                It's important to focus on all these components to ensure a
                successful completion of the course. Good luck with your
                studies!
              </Typography>
            </Box>

            <Box mt={3} className="start-asses-btn">
              <Button variant="contained" onClick={handleSubmit} >Start The Assessment</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BeforeAssesssment;
