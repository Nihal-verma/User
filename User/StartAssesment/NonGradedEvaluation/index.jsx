
import React, { useState, useEffect } from "react";
import {Box,Container,Typography,Select,MenuItem,Table,TableContainer,TableHead,TableBody,TableRow,
TableCell, IconButton} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useApiHelper from "../../../useApiHelper";
import "./NonGradedEvaluation.scss";
import ErrorPage from "../../../ErrorPage";

const NonGradedAssessmentEvaluation = () => {
    const [moduleData, setModuleData] = useState([]);
    const [lessonData, setLessonData] = useState([]);
    const [selectedModule, setSelectedModule] = useState("");
    const navigate = useNavigate();
    const emp_id = localStorage.getItem("UserId");
    const { fetchData, error } = useApiHelper()
    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                const response = await fetchData(`nonGraded/getNongradedDataByEmployee/${emp_id}`);
                if(!response.success){
                console.error("Error fetching module data:", response?.message);
                return
                }
                setModuleData(response?.data);
            } catch (error) {
                console.error("Error fetching module data:", error);
            }
        };

        fetchModuleData();
    }, [emp_id]);

    const getDataFromSelectedId = async () => {
        try {
            const response = await fetchData(`lesson/nameByModuleId/${selectedModule}/${emp_id}`);
            if(!response.success){
                console.error("Error fetching lesson name :", response?.message);
                return
            }
            setLessonData(response?.data);
        } catch (error) {
            console.error("Error fetching module data:", error);
        }
    };

    useEffect(() => {
        if (selectedModule) {
            getDataFromSelectedId();
        }
    }, [selectedModule]);

    const handleModuleChange = (event) => {
        const moduleId = event.target.value;
        setSelectedModule(moduleId);
    };
    const handleViewLesson =(lesson_id)=>{
    navigate(`/Evaluation/${lesson_id}`);
    }
    if (error) {
        return <ErrorPage error={error}/>
      }
    return (
        <Box className="assessment-screen">
            <Box>
            <Container>
                <Box className="assessment-top-heading">
                    <Typography component="h2">
                        Non Graded Evaluation
                    </Typography>
                </Box>
            </Container>
            <Box className="assessment-table">
                <Container>
                    <Box>
                        <Box>
                            <Box className="select-module-dropdown">
                                <Select
                                    value={selectedModule} onChange={handleModuleChange} fullWidth displayEmpty inputProps={{ 'aria-label': 'Select Module' }}>
                                    <MenuItem value="" disabled>Select Module</MenuItem>
                                    {moduleData?.map((module) => ( <MenuItem key={module?.id} value={module?.id}>{module?.module_name}</MenuItem>))}
                                </Select>
                            </Box >
                            {lessonData?.length > 0 ? (
                                <TableContainer className="module-table">
                                    <Table>
                                        <TableHead className="table-head">
                                            <TableRow className="table-heading">
                                                <TableCell>S.No</TableCell>
                                                <TableCell>Lesson Name</TableCell>
                                                <TableCell>Total Score</TableCell>
                                                <TableCell>Out Off</TableCell>
                                                <TableCell>Attempts</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="table-body">
                                            {lessonData?.map((lesson, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{lesson?.lesson_name}</TableCell>
                                                    <TableCell>{lesson?.score}</TableCell>
                                                    <TableCell>{lesson?.out_off}</TableCell>
                                                    <TableCell>{lesson?.attempt}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleViewLesson(lesson?.lesson_id)}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>No data available</Typography>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
            </Box>

        </Box>
    );
};



export default NonGradedAssessmentEvaluation;


// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Container,
//     Typography,
//     Grid,
//     Select,
//     MenuItem,
//     Table,
//     TableContainer,
//     TableHead,
//     TableBody,
//     TableRow,
//     TableCell,
//     IconButton,
// } from "@mui/material";
// import PropTypes from "prop-types";
// import { useParams, useNavigate } from "react-router-dom";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import UserHeader from "../../UserHeader/UserHeader";

// const NonGradedAssessmentEvaluation = ({setLoggedIn}) => {
//     const [moduleData, setModuleData] = useState([]);
//     const [lessonData, setLessonData] = useState([]);
//     const [selectedModule, setSelectedModule] = useState("");
//     const navigate = useNavigate();
//     const emp_id = localStorage.getItem("UserId");
//     console.log("emp_id",emp_id);
//     useEffect(() => {
//         const fetchModuleData = async () => {
//             try {
//                 const response = await fetch(`${baseUrl}/getNongradedDataByEmployee/${emp_id}`);
//                 const jsonData = await response.json();
//                 // console.log("setModuleData",setModuleData);
//                 setModuleData(jsonData.data);
//             } catch (error) {
//                 console.error("Error fetching module data:", error);
//             }
//         };

//         fetchModuleData();
//     }, [emp_id]);

//     const getDataFromSelectedId = async () => {
//         try {
//             const response = await fetch(`${baseUrl}/getLessonNameFromNonGradedAssesmentByModuleId/${selectedModule}/${emp_id}`);
//             const jsonData = await response.json();
//             setLessonData(jsonData.data);
//         } catch (error) {
//             console.error("Error fetching module data:", error);
//         }
//     };

//     useEffect(() => {
//         if (selectedModule) {
//             getDataFromSelectedId();
//         }
//     }, [selectedModule]);

//     const handleModuleChange = (event) => {
//         const moduleId = event.target.value;
//         setSelectedModule(moduleId);
//     };

   
//     const handleViewLesson =(lesson_id)=>{
// console.log("lesson_id",lesson_id);
// navigate(`/Evaluation/${lesson_id}`);
//     }

//     return (
//         <Box className="assessment-wrapper">
//             <UserHeader setLoggedIn={setLoggedIn} />
//             <Container>
//                 <Box className="assessment-top-heading" marginTop={5}>
//                     <Typography variant="h3" component="h3">
//                         Non Graded Evaluation
//                     </Typography>
//                 </Box>
//             </Container>
//             <Box sx={{ width: "100%" }} className="assessment-tab-sec">
//                 <Container maxWidth="lg">
//                     <Box className="tab-body">
//                         <Grid container spacing={2}>
//                             <Grid item xs={8}>
//                                 <Box className="assessment-left-sec">
//                                     <Box className="question-heading-wrapper">
//                                         <Select
//                                             value={selectedModule}
//                                             onChange={handleModuleChange}
//                                             fullWidth
//                                             displayEmpty
//                                             inputProps={{ 'aria-label': 'Select Module' }}
//                                         >
//                                             <MenuItem value="" disabled>Select Module</MenuItem>
//                                             {moduleData.map((module) => (
//                                                 <MenuItem key={module.id} value={module.id}>{module.module_name}</MenuItem>
//                                             ))}
//                                         </Select>
//                                     </Box>
//                                     {lessonData.length > 0 ? (
//                                         <TableContainer>
//                                             <Table>
//                                                 <TableHead>
//                                                     <TableRow>
//                                                         <TableCell>S.No</TableCell>
//                                                         <TableCell>Lesson Name</TableCell>
//                                                         <TableCell>Total Score</TableCell>
//                                                         <TableCell>Out Off</TableCell>
//                                                         <TableCell>Attempts</TableCell>
//                                                         <TableCell>Action</TableCell>
//                                                     </TableRow>
//                                                 </TableHead>
//                                                 <TableBody>
//                                                     {lessonData.map((lesson, index) => (
//                                                         <TableRow key={index}>
//                                                             <TableCell>{index + 1}</TableCell>
//                                                             <TableCell>{lesson.lesson_name}</TableCell>
//                                                             <TableCell>{lesson.score}</TableCell>
//                                                             <TableCell>{lesson.out_off}</TableCell>
//                                                             <TableCell>{lesson.attempt}</TableCell>
//                                                             <TableCell>
//                                                                 <IconButton onClick={() => handleViewLesson(lesson.lesson_id)}>
//                                                                     <VisibilityIcon />
//                                                                 </IconButton>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </TableContainer>
//                                     ) : (
//                                         <Typography>No data available</Typography>
//                                     )}
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </Box>
//                 </Container>
//             </Box>
//         </Box>
//     );
// };



// export default NonGradedAssessmentEvaluation;



// // import React, { useEffect, useState } from 'react';

// // export default function NonGradedAssesmentEvaluation() {
// //     const emp_id = localStorage.getItem("UserId");
// //     const [moduleData, setModuleData] = useState([]);
// //     const [selectdeModule, setSelectedModule] = useState({
// //         id: '',
// //         name: ''
// //       });;

// //     const fetchData = async () => {
// //         try {
// //             const response = await fetch(`${baseUrl}/getNongradedDataByEmployee/${emp_id}`);
// //             const jsonData = await response.json();
// //             console.log(jsonData);
// //             setModuleData(jsonData.data);
// //         } catch (error) {
// //             console.error("Error fetching module data:", error);
// //         }
// //     };
// // console.log("moduleDatamoduleData",moduleData);
// //     useEffect(() => {
// //         fetchData();
// //     }, []);

// //     const handleModuleChange = (e) => {
// //         const selectedModuleId = e.target.value == '' ? null : e.target.value;
// //         console.log("selectedModuleIdselectedModuleId",selectedModuleId);
// //         setSelectedModule({
// //             id: selectedModuleId,
// //             name: moduleData.find((moduleData) => moduleData.id == selectedModuleId)?.module_name || '',

// //           });
// //     };

// //     return (
// //         <div>
// //             <div className="col-6">
// //                 Module Name: <br />
// //                 <select
// //                     name="courseName"
// //                     className="text-dark"
// //                     style={{ color: 'black', padding: '5px', width: '200px', textAlign: 'center' }}
// //                     id="courseName"
// //                     // value={selectedModule ? selectedModule.id : ''}
// //                     onChange={(e) => { handleModuleChange(e) }}
// //                 >
// //                     <option value="">-</option>
// //                     {moduleData.map(({ id, module_name }) => (
// //                         <option key={id} value={id}>
// //                             {module_name}
// //                         </option>
// //                     ))}
// //                 </select>
// //             </div>
// //         </div>
// //     );
// // }



// import React, { useEffect, useState } from 'react';

// export default function NonGradedAssesmentEvaluation() {
//     const emp_id = localStorage.getItem("UserId");
//     const [moduleData, setModuleData] = useState([]);
//     const [selectdeModule, setSelectedModule] = useState({
//         id: '',
//         name: ''
//       });;

//     const fetchData = async () => {
//         try {
//             const response = await fetch(`${baseUrl}/getNongradedDataByEmployee/${emp_id}`);
//             const jsonData = await response.json();
//             console.log(jsonData);
//             setModuleData(jsonData.data);
//         } catch (error) {
//             console.error("Error fetching module data:", error);
//         }
//     };
// console.log("moduleDatamoduleData",moduleData);
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleModuleChange = (e) => {
//         const selectedModuleId = e.target.value == '' ? null : e.target.value;
//         console.log("selectedModuleIdselectedModuleId",selectedModuleId);
//         setSelectedModule({
//             id: selectedModuleId,
//             name: moduleData.find((moduleData) => moduleData.id == selectedModuleId)?.module_name || '',

//           });
//     };

//     return (
//         <div>
//             <div className="col-6">
//                 Module Name: <br />
//                 <select
//                     name="courseName"
//                     className="text-dark"
//                     style={{ color: 'black', padding: '5px', width: '200px', textAlign: 'center' }}
//                     id="courseName"
//                     // value={selectedModule ? selectedModule.id : ''}
//                     onChange={(e) => { handleModuleChange(e) }}
//                 >
//                     <option value="">-</option>
//                     {moduleData.map(({ id, module_name }) => (
//                         <option key={id} value={id}>
//                             {module_name}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//         </div>
//     );
// }
