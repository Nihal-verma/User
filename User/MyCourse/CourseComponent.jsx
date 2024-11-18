import React, { useEffect, useState } from "react";
import {Button,Box,Container,Link,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow} from "@mui/material";
import dateIcon from "../../Images/uil_calender.svg"
import { Typography } from "@mui/material";
import courseImage from "../../Images/course-1.jpg"
import { useParams, useNavigate } from "react-router-dom";
import useApiHelper from '../../useApiHelper'; // Import your custom hook
import "./CourseComponent.scss"
import ErrorPage from "../../ErrorPage";
const baseURL = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'


const NewCourse = () => {
  const comp_id = localStorage.getItem("UserCompId");
  const emp_id = localStorage.getItem("UserId");
  const [courses, setCourses] = useState([]);
  const [allCourseIds, setAllCourseIDs] = useState([]);
  const [accessableIds, setAccessableIds] = useState([]);
  const [passedIds, setPassedIds] = useState([]);
  const [courseDetails, setCourseDetails] = useState([])
  const [completedIds, setCompletedIds] = useState([])
  const isAllCoursesCompleted = allCourseIds?.every(id => completedIds?.includes(id));
  const navigate = useNavigate();
  const token = localStorage.getItem("UserToken")
  const { fetchData,fetchDataWithoutAuth, postData, error } = useApiHelper();
  
  useEffect(() => {
    if (!token) {
      navigate('/')
    }
    
    localStorage.removeItem("FinalAssessmentTimer")
    localStorage.removeItem("selectedFinalTabIndex")
    localStorage.removeItem("FinalEmailAnswer")
    localStorage.removeItem("finalTextAnswer")
    localStorage.removeItem("FinalQuizQuestions")
    localStorage.removeItem("selectedOptions")
   
    fetchApiData();
    fetchCourseAccessData();

  }, [])

  useEffect(() => {
    let matchIds = [];
    for (let i = 0; i < accessableIds?.length; i++) {
      for (let j = 0; j < passedIds?.length; j++) {
        if (accessableIds[i] == passedIds[j]) {
          matchIds?.push(passedIds[j]);
        }
        break;
      }
    }
    checkComplete()

  }, [passedIds]);

  const fetchApiData = async () => {
    try {
      const fetchedData = await fetchData(`course/getCourseName/${comp_id}`);
      if (fetchedData.success) {
        const moduleName = fetchedData?.data?.moduleResult;
        const courseCompany = fetchedData?.data?.courseDetails[0];
        setCourseDetails(courseCompany)
        const coursesWithStartDate = moduleName?.map((module) => ({
          id: module?.id,
          name: module?.module_name,
          lessons: module?.lesson_count,
          videos: module?.total_videos,
        }));
        const allCourseIds = coursesWithStartDate?.map((row) => row?.id);
        setAllCourseIDs(allCourseIds);
        setCourses(coursesWithStartDate);
      } else {
        console.log("fail");
      }
    } catch (error) {
      console.log("Internal Server Error", error);
    }
  };

  const fetchCourseAccessData = async () => {
    try {
      const response =  await fetchData(`course/accessForCourse/${comp_id}`);
      if (response.success) {
      setAccessableIds(response)
        const moduleIds = response?.data;
        setPassedIds(moduleIds);
        try {
          const response = await postData(`course/employeeCanAccessCourse/${emp_id}`,{ moduleIds: moduleIds })

          if (response.success) {
            setPassedIds(response?.data);
          }
        } catch (error) {
          console.log("error", error)
        }
      } else {
        console.log("fail");
      }
    } catch (error) {
      console.log("Internal Server Error", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ''; // or throw an error, or return a default value
    }
    const dateParts = dateString?.split("-");
    if (dateParts.length !== 3) {
      return ''; // or throw an error, or return a default value
    }

    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  };

  const checkComplete = async () => {
    try {
      const response = await postData(`course/getUserData/${emp_id}`,{ passedIds: passedIds })
      if (response.success) {
        setCompletedIds(response?.completedIds);
      }
    } catch (error) {
      console.log("Internal Server Error", error);
    }
  }

  const handleRowClick = (module_id) => {
    navigate(`/video/${module_id}`);
  };

  const handleFinalAssesment = async () => {
    const response = await fetchDataWithoutAuth(`final/checkFinalAssessmentAllQuestion`)
    if (response.success) {
      navigate('/FinalAssessment')
      return
    }
    alert("Final Assessment Question has not been added")
  }

  if (error) {
    return <ErrorPage error={error}/>
  }



  return (
    <>
      <Box className="course-section">
        <Box className="course-top-section">
          <Container maxWidth="xl">
            <Box className="row course-top-row">
              <Box className="col-sm-6 course-title pl-0">
                <Typography variant="h4">
                  Course Name :- <span>{courseDetails?.course_name}</span>
                </Typography>
              </Box>
              <Box className="col-sm-6 text-right mycourse-box pr-0">
                <Box className="mycoursedate-sec">
                  <img src={dateIcon} alt="Logo" />
                  <h2>{formatDate(courseDetails?.start_date)}</h2> -
                  <h2>{courseDetails?.end_date}</h2>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
        <Container maxWidth="xl">
          <Box className="coursetable">
            <h3 className="coursetable-title">Course Modules </h3>
            <TableContainer component={Paper} className="table-wrapper">
              <Table aria-label="simple table">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell component="th" align="center">S. No.</TableCell>
                    <TableCell component="th">Module Name</TableCell>
                    <TableCell component="th" align="center">
                      Total Lessons
                    </TableCell>
                    <TableCell component="th" align="center">
                      Total Videos
                    </TableCell>
                    <TableCell component="th" align="center">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body">
                  {courses?.map((course, index) => (
                    <TableRow
                      key={index} onClick={() => {
                        if (passedIds?.includes(course.id)) {
                          handleRowClick(course?.id);
                        }
                      }}
                      style={{
                        cursor: passedIds?.includes(course?.id) ? "pointer" : "not-allowed",
                        color: passedIds?.includes(course?.id) ? "inherit" : "#aaa", // Lighter color for disabled rows
                      }}
                      disabled={!passedIds?.includes(course?.id)}
                      className={!passedIds?.includes(course?.id) ? "disabled-row" : ""}
                    >
                      <TableCell component="td" align="center">{index + 1}</TableCell>
                      <TableCell component="td">
                        <Link className="session-image-wrapper">
                          <Box className="session-image-inner">
                            <img src={courseImage} alt="Course" />
                          </Box>
                          {course?.name}
                        </Link>
                      </TableCell>
                      <TableCell component="td" align="center">
                        {course?.lessons}
                      </TableCell>
                      <TableCell component="td" align="center">
                        {course?.videos}
                      </TableCell>
                      <TableCell component="td" align="center">
                        {passedIds.includes(course?.id) && completedIds.includes(course?.id) ? (
                          <Box
                            className="status-completed"
                            style={{ color: "white", backgroundColor: "green", borderColor: "green" }}
                          >
                            Completed
                          </Box>
                        ) : passedIds.includes(course?.id) ? (
                          <Box className="status-inprogress">In Progress</Box>
                        ) : (
                          <Box
                            className="status-deactivated"
                            style={{ color: "white", backgroundColor: "red", borderColor: "red" }}
                          >
                            Deactivated
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className="final-ass-wrapper">
              <Button
            className={isAllCoursesCompleted ? 'final-ass-btn-active' : 'final-ass-btn-deactive'}
            onClick={handleFinalAssesment}
            disabled={!isAllCoursesCompleted}
              >
                Final Assessment
              </Button>
             
            </Box>

          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NewCourse;



// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Box,
//   Container,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Grid,
// } from "@mui/material";
// import UserHeader from "../User/UserHeader/UserHeader";
// import { useNavigate } from "react-router-dom";
// import courseImage from "../Images/course-1.jpg"; // Ensure you have the correct path to the image

// const NewCourse = ({ setLoggedIn }) => {
//   const comp_id = localStorage.getItem("UserCompId");
//   const emp_id = localStorage.getItem("UserId");
//   const [courses, setCourses] = useState([]);
//   const [allCourseIds, setAllCourseIDs] = useState([]);
//   const [accessableIds, setAccessableIds] = useState([]);
//   const [passedIds, setPassedIds] = useState([]);
//   const [courseDetails, setCourseDetails] = useState([]);
//   const [completedIds, setCompletedIds] = useState([]);

//   const navigate = useNavigate();
//   console.log("allCourseIds", allCourseIds);
//   console.log("passedIds", passedIds);
//   const token = localStorage.getItem("UserCourseToken");

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     let matchIds = [];
//     for (let i = 0; i < accessableIds.length; i++) {
//       for (let j = 0; j < passedIds.length; j++) {
//         if (accessableIds[i] === passedIds[j]) {
//           matchIds.push(passedIds[j]);
//           break;
//         }
//       }
//     }
//   }, [accessableIds, passedIds]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `http://172.20.1.203:4000/getCourseName/${comp_id}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const jsonData = await response.json();
//       if (jsonData.success) {
//         const moduleName = jsonData.data.moduleResult;
//         const courseCompany = jsonData.data.courseDetails[0];
//         setCourseDetails(courseCompany);
//         const coursesWithStartDate = moduleName.map((module) => ({
//           id: module.id,
//           name: module.module_name,
//           lessons: module.lesson_count,
//           videos: module.total_videos,
//         }));
//         const allCourseIds = coursesWithStartDate.map((row) => row.id);
//         setAllCourseIDs(allCourseIds);
//         setCourses(coursesWithStartDate);
//       } else {
//         console.log("fail");
//       }
//     } catch (error) {
//       console.log("Internal Server Error", error);
//     }
//   };

//   const fetchCourseAccessData = async () => {
//     try {
//       const response = await fetch(
//         `http://172.20.1.203:4000/accessForCourse/${comp_id}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const jsonData = await response.json();
//       console.log("jsonData for access", jsonData);
//       setAccessableIds(jsonData);

//       if (jsonData.success) {
//         const moduleIds = jsonData.data;
//         setPassedIds(moduleIds);
//         try {
//           const response = await fetch(
//             `http://172.20.1.203:4000/employeeCanAccessCourse/${emp_id}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ moduleIds: moduleIds }),
//             }
//           );

//           const jsonData = await response.json();
//           console.log("jsonData", jsonData);
//           if (jsonData.success) {
//             setPassedIds(jsonData.data);
//           }
//         } catch (error) {
//           console.log("error", error);
//         }
//       } else {
//         console.log("fail");
//       }
//     } catch (error) {
//       console.log("Internal Server Error", error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) {
//       return ""; // or throw an error, or return a default value
//     }

//     const dateParts = dateString.split("-");
//     if (dateParts.length !== 3) {
//       return ""; // or throw an error, or return a default value
//     }

//     const [year, month, day] = dateParts;
//     return `${day}/${month}/${year}`;
//   };

//   const checkComplete = async () => {
//     try {
//       const response = await fetch(
//         `http://172.20.1.203:4000/getUserData/${emp_id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ passedIds: passedIds }),
//         }
//       );

//       const jsonData = await response.json();
//       console.log("checkCompleteJsonData", jsonData);
//       if (jsonData.success) {
//         setCompletedIds(jsonData.completedIds);
//       }
//     } catch (error) {
//       console.log("Internal Server Error", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCourseAccessData();
//   }, []);

//   useEffect(() => {
//     checkComplete();
//   }, [passedIds]);

//   const handleRowClick = (module_id) => {
//     navigate(`/video/${module_id}`);
//   };

//   const handleFinalAssesment = () => {
//     navigate("/finalAssesment");
//   };

//   return (
//     <>
//       <UserHeader setLoggedIn={setLoggedIn} />
//       <Box className="sec-space">
//         <Container maxWidth="xl">
//           <div className="row">
//             <div className="col-sm-4">
//               <h2> Course Name :- {courseDetails.course_name}</h2>
//             </div>
//             <div className="col-sm-4">
//               <h2>Start Date :- {formatDate(courseDetails.start_date)}</h2>
//             </div>
//             <div className="col-sm-4">
//               <h2> End Date :- {courseDetails.end_date}</h2>
//             </div>
//           </div>
//           <Box className="coursetable">
//             <Grid container spacing={3}>
//               {courses.map((course, index) => (
//                 <Grid item xs={12} sm={6} md={3} key={course.id}>
//                   <Card
//                     onClick={() => {
//                       if (passedIds.includes(course.id)) {
//                         handleRowClick(course.id);
//                       }
//                     }}
//                     style={{
//                       cursor: passedIds.includes(course.id)
//                         ? "pointer"
//                         : "not-allowed",
//                       color: passedIds.includes(course.id) ? "inherit" : "#aaa", // Lighter color for disabled rows
//                     }}
//                   >
//                     <CardMedia
//                       component="img"
//                       height="140"
//                       image={courseImage}
//                       alt="Course Image"
//                     />
//                     <CardContent>
//                       <Typography variant="h6" component="div">
//                         {course.name}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         Lessons: {course.lessons}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         Videos: {course.videos}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {passedIds.includes(course.id) &&
//                         completedIds.includes(course.id) ? (
//                           <Box
//                             style={{
//                               color: "white",
//                               backgroundColor: "green",
//                               padding: "2px 5px",
//                               borderRadius: "5px",
//                               display: "inline-block",
//                             }}
//                           >
//                             Completed
//                           </Box>
//                         ) : passedIds.includes(course.id) ? (
//                           <Box
//                             style={{
//                               color: "white",
//                               backgroundColor: "orange",
//                               padding: "2px 5px",
//                               borderRadius: "5px",
//                               display: "inline-block",
//                             }}
//                           >
//                             In Progress
//                           </Box>
//                         ) : (
//                           <Box
//                             style={{
//                               color: "white",
//                               backgroundColor: "red",
//                               padding: "2px 5px",
//                               borderRadius: "5px",
//                               display: "inline-block",
//                             }}
//                           >
//                             Deactivated
//                           </Box>
//                         )}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//             <Box
//               style={{
//                 margin: "35px",
//                 display: "flex",
//                 flexDirection: "row-reverse",
//               }}
//             >
//               <Button
//                 onClick={handleFinalAssesment}
//                 disabled={!allCourseIds.every((id) => completedIds.includes(id))}
//                 sx={{
//                   color: (theme) =>
//                     allCourseIds.every((id) => completedIds.includes(id))
//                       ? theme.palette.common.white
//                       : theme.palette.primary.main,
//                   border: (theme) =>
//                     allCourseIds.every((id) => completedIds.includes(id))
//                       ? `1px solid ${theme.palette.primary.main}`
//                       : "1px solid #553cdf",
//                   backgroundColor: (theme) =>
//                     allCourseIds.every((id) => completedIds.includes(id))
//                       ? theme.palette.primary.main
//                       : "transparent",
//                   "&:hover": {
//                     backgroundColor: (theme) =>
//                       allCourseIds.every((id) => completedIds.includes(id))
//                         ? theme.palette.primary.dark
//                         : "#553cdf",
//                   },
//                 }}
//               >
//                 Final Assessment
//               </Button>
//             </Box>
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default NewCourse;
