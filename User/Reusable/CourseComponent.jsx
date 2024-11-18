import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const CourseComponent = (props) => {
  const {courseImg, subHeading,  courseTitle, recommendedClass, recommendedText, progressValue, certificateValue } = props;
  return (
    <Box className='course-card' >
        <Box className="course-img-wrapper">
            <img src={courseImg} alt="course image" />
        </Box>
        <Box className="course-card-body">
          <Box className="course-card-title">
            <Typography component="h6" variant='h6'>{courseTitle}</Typography>
            <Typography component="p">{subHeading}</Typography>
          </Box>
          <Box className={"course-recommended-box " + recommendedClass }>
            <Box>
              <Typography component="p">{recommendedText}</Typography>
            </Box>
            <Box>
              <CircularProgress className="cstm-progressBar" variant="determinate" value={progressValue} sx={{ display: progressValue ? 'inline-block' : 'none'}} />
              <Typography component='p'>{certificateValue}</Typography>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default CourseComponent;