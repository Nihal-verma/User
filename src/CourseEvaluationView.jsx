// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, Grid } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from "@mui/icons-material/Close";
// import VisibilityIcon from '@mui/icons-material/Visibility';


// const CourseEvaluationView = () => {
//   const { id: employeeId } = useParams();
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [courseId,setCourseId] = useState()
//   const [companyDetails, setCompanyDetails] = useState({});
//   const [assessmentType, setAssessmentType] = useState(null);
//   const [assessmentData, setAssessmentData] = useState(null);
//   const [mcqScore, setMcqScore] = useState({
//     obtained: assessmentData?.mcqScore,
//     outOf: null,
//   });
//   const [textScore, setTextScore] = useState({
//     obtained: 0,
//     outOf: null,
//   });
//   const [emailScore, setEmailScore] = useState({
//     obtained: 0,
//     outOf: null,
//   });
//   const [audioScore, setAudioScore] = useState({
//     obtained: 0,
//     outOf: null,
//   });
//   const [module, setModule] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [selectedModule, setSelectedModule] = useState({
//     id: "", // Setting initial value to an empty string
//     name: "",
//     description: "",
//   });
//   const navigate = useNavigate();
// const path ='http://172.20.1.203:4000/';


//   useEffect(() => {
//     const getModuleData = async () => {
//       try {
//         console.log("courseIdcourseIdcourseIdcourseId",courseId);
//         const response = await fetch(
//           `http://172.20.1.203:4000/superAdmin/getModuleWithAttempt/${courseId}/${employeeId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const jsonData = await response.json();
//         if (jsonData.success) {
//           const moduleInfo = jsonData.data.map(
//             ({ id, module_name, module_description,hasAttempt }) => ({
//               id,
//               name: module_name,
//               description: module_description,
//               hasAttempt:hasAttempt
//             })
//           );
//           console.log("moduleInfo",moduleInfo);
//           setModule(moduleInfo);

//           console.log("selected module in moduleApi", selectedModule.id);
//         } else {
//           console.error("Failed to fetch module data.");
//         }
//       } catch (error) {
//         console.error("Error fetching module data:", error);
//       }
//     };
    
//     getModuleData();
//   }, [companyDetails]);

//   useEffect(() => {
//     const fetchEmployeeDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://172.20.1.203:4000/superAdmin/courseEmployee/${employeeId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const jsonData = await response.json();
//         if (jsonData.success) {
//           setEmployeeDetails(jsonData.data);
//           return jsonData.data
//         } else {
//           console.error("Failed to fetch employee details.");
//         }
//       } catch (error) {
//         console.error("Error fetching employee details:", error);
//       }
//     };
//     const fetchCompanyDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://172.20.1.203:4000/superAdmin/getCompanyByEmployeeById/${employeeId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const jsonData = await response.json();
//         if (jsonData.success) {
//           console.log("company Details",jsonData.data);
//           // setCourseId(jsonData.course_id)
//           setCourseId(1)

//           setCompanyDetails(jsonData.data);
//         } else {
//           console.error("Failed to fetch company details.");
//         }
//       } catch (error) {
//         console.error("Error fetching company details:", error);
//       }
//     };
//     fetchCompanyDetails();
//     fetchEmployeeDetails();
//   }, [employeeId]);

//   useEffect(() => {
//     const fetchAssessmentDataAndSelectTab = async () => {
//       try {
//         const mcqResponse = await fetchAssessmentData("mcq");
       
//   console.log("mcqResponse",mcqResponse);
//         if (mcqResponse.success) {
//           if(mcqResponse.data.mcq_questions!=='[]'){
//             setAssessmentType("mcq");
//             return;
//           }else if(mcqResponse.data.email_question !==''){
//             setAssessmentType("email");
//             return;
//           }else if(mcqResponse.data.text_question !==''){
//             setAssessmentType("text");
//             return;
//           }else{
//             setAssessmentType("oral");
//             return
//           }
     
//         }
       
//       } catch (error) {
//         console.error("Error fetching assessment data:", error);
//       }
//     };
  
//     fetchAssessmentDataAndSelectTab();
//   }, [selectedModule]);
//   console.log("assessmentType",assessmentType);
 
//   const fetchAssessmentData = async (type) => {
//     console.log("selectedCourse.id]", selectedModule.id);
//     try {
//       const response = await fetch(
//         `http://172.20.1.203:4000/superAdmin/getDatafromCourseEmployeeAnswer/${employeeId}/${selectedModule.id}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const jsonData = await response.json();
//       if (jsonData.success) {
//         setAssessmentData(jsonData.data[0]);
//         setAssessmentType(type);
//         return { success: true, data: jsonData.data[0] };
//       } else {
//         setAssessmentData(null);
//         alert(jsonData.message);
//         console.error(`Failed to fetch ${type} data.`);
//         return { success: false, message: `Failed to fetch ${type} data.` };
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type} data:`, error);
//       return { success: false, message: `Error fetching ${type} data: ${error.message}` };
//     }
//   };

//   const handleMarksChange = (field, value) => {
//     const numericValue = Number(value);
//     const sanitizedValue = numericValue === 0 ? "" : numericValue;
//     switch (assessmentType) {
//       case "mcq":
//         setMcqScore({
//           ...mcqScore,
//           [field]: sanitizedValue,
//         });
//         break;
//       case "text":
//         setTextScore({
//           ...textScore,
//           [field]: sanitizedValue,
//         });
//         break;
//       case "email":
//         setEmailScore({
//           ...emailScore,
//           [field]: sanitizedValue,
//         });
//         break;
//       case "audio":
//         setAudioScore({
//           ...audioScore,
//           [field]: sanitizedValue,
//         });
//         break;
//       default:
//         break;
//     }
//   };

//   const handleSaveMarks = async () => {
//     try {
//       const response = await fetch(
//         `http://172.20.1.203:4000/superAdmin/updateCourseScore/${employeeId}/${selectedModule.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mcq: {
//               mcq_score: mcqScore.obtained,
//               mcq_score_out_off: mcqScore.outOf,
//             },
//             text: {
//               text_score: textScore.obtained,
//               text_score_out_off: textScore.outOf,
//             },
//             email: {
//               email_score: emailScore.obtained,
//               email_score_out_off: emailScore.outOf,
//             },
//             audio: {
//               audio_score: audioScore.obtained,
//               audio_score_out_off: audioScore.outOf,
//             },
//           }),
//         }
//       );
//       const jsonData = await response.json();
//       if (jsonData.success) {
//         console.log("Marks submitted successfully.");
//         navigate(-1);
//       } else {
//         console.error("Failed to submit marks.");
//       }
//     } catch (error) {
//       console.error("Error submitting marks:", error);
//     }
//   };

//   function handleBack() {
//     navigate(-1);
//   }

//   const handleModuleClick = async (moduleId) => {
//     setSelectedModule({
//       id: moduleId,
//       name: module.find((module) => module.id === moduleId)?.name || "",
//       description: module.find((module) => module.id === moduleId)?.description || "",
//     });
//   };
  
//   const logicIcon = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
//     if (isNoSelectedAnswer) {
//         return null; // Render nothing if the answer is not selected
//     } else if (isSelectedAnswer && isCorrectAnswer) {
//         return <CheckIcon style={{ color: 'white' }} />;
//     } else if (isSelectedAnswer && !isCorrectAnswer) {
//         return <CloseIcon style={{ color: 'white' }} />;
//     } else if (!isSelectedAnswer && isCorrectAnswer) {
//         return <CheckIcon style={{ color: 'white' }} />;
//     } else {
//         return null; // Default case, render nothing
//     }
// };

// const backgroundColor = (isSelectedAnswer, isCorrectAnswer,isNoSelectedAnswer)=>{
//     if(isNoSelectedAnswer){
//         return null;  
//     }
//     else if (isSelectedAnswer && isCorrectAnswer) {
//         return 'green'
//     } else if (isSelectedAnswer && !isCorrectAnswer) {
//         return 'red'
//     } else if (!isSelectedAnswer  && isCorrectAnswer) {
//         return 'green'
//     } else {
//         return null; // Render nothing if the answer is not selected
//     }
// }
  
//   console.log("assessmeeenttttDAta",assessmentData);
//   return (
//     <Box m="28px">
  
//       {/* Company and Employee Details */}
//       <div>
//         <button className="secondary-btn pull-right" onClick={handleBack}>
//           Back
//         </button>
//         <div>
//             <h1 className="page-heading">Company Name: {companyDetails.comp_name}</h1>
//         </div>
//       </div>
//       <div className="card-bg mt-4">
//         <div>
//           <Typography variant="h4">Email: {companyDetails.comp_email}</Typography>
//           <Typography className="mt-2" variant="h4">Number: {companyDetails.comp_phone}</Typography>
//         </div>
//         <hr />
//         <div>
//           <Typography variant="h4">Employee Details:</Typography>
//           <Typography className="mt-2" variant="h5"> Employee Name: {employeeDetails.emp_name}</Typography>
//           <Typography className="mt-1" variant="h5">Email: {employeeDetails.emp_email}</Typography>
//           <Typography className="mt-1" variant="h5">Number: {employeeDetails.emp_contact}</Typography>
//         </div>        
//       </div>
//       <div className="card-bg mt-4">
//         <div style={{ overflowX: "auto", height: "260px" }}>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Module ID</th>
//                 <th>Module Name</th>
//                 <th>Attempted</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {module.map(({ id, name, hasAttempt }) => (
//                 <tr key={id}>
//                   <td>{id}</td>
//                   <td>{name}</td>
//                   <td style={{ color: hasAttempt ? 'green' : 'red' }}>{hasAttempt ? '✔️' : '❌'}</td>
//                   <td><VisibilityIcon  className="icon" style={{ cursor: 'pointer' }} onClick={(e) =>
//                       {e.stopPropagation(); // To prevent the row click event from firing
//                         handleModuleClick(id); // Pass the module ID to the handler function
//                       }} />                    
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="card-bg mt-4">
//         <Box display="flex" >
//           {assessmentData && (
//             <>
//               {assessmentData.mcq_questions.length > 0 && assessmentData.mcq_questions !=='[]' && (
//                 <button  className={assessmentType == 'mcq' ? "primary-btn me-2" : "secondary-btn ms-0 me-2"} onClick={() => fetchAssessmentData("mcq")}>
//                   Multiple Choice Questions 
//                 </button>
//               )}

//               {assessmentData.email_question !== "" && assessmentData.email_question !== null && (
//                 <button  className={assessmentType == 'email' ? "primary-btn me-2" : "secondary-btn ms-0 me-2"} onClick={() => fetchAssessmentData("email")} >
//                   Email Writing Assessment
//                 </button>
//               )}

//               {assessmentData.text_question !== "" && assessmentData.text_question !== null && (
//                 <button className={assessmentType == 'text' ? "primary-btn me-2" : "secondary-btn ms-0 me-2"}onClick={() => fetchAssessmentData("text")}>
//                   Free Writing Assessment</button>
//               )}

//               {assessmentData.audio_question !== "" && assessmentData.audio_question !== null && (
//                 <button className={assessmentType == 'audio' ? "primary-btn me-2" : "secondary-btn ms-0 me-2"} onClick={() => fetchAssessmentData("audio")}>
//                   Oral communication
//                 </button>
//               )}

//               <div className="ms-5">
//                 <button className="primary-btn " onClick={handleSaveMarks}>Save</button>
//               </div>             
//             </>
//           )}
//         </Box>
//         {assessmentData && (
//           <Box style={{ marginTop: "20px" }}>
           
//             {assessmentType === "mcq" && (
//               <Box >
//                 <Box sx={{maxHeight: 'calc(100vh - 450px)', minHeight: 150, overflow: 'auto'}} >
               
//                  {JSON.parse(assessmentData.mcq_questions).map((question, index) => (
//                                 <Box key={index}>
//                                     <Typography variant="body1">{`Question ${index + 1}: ${question}`}</Typography>
//                                     {JSON.parse(assessmentData.mcq_options[index]).map((option, optionIndex) => {
//                                         const isCorrectAnswer = JSON.parse(assessmentData.mcq_correctAnswer)[index] === option;
//                                         const isSelectedAnswer = selectedAnswers[index] === option;
//                                         const isNoSelectedAnswer = selectedAnswers[index] === null;

//                                         return (
//                                             <div key={optionIndex} style={{ display: 'flex', alignItems: 'center' }}>
//                                                 <div
//                                                     className="checkbox"
//                                                     style={{
//                                                         width: '20px',
//                                                         height: '20px',
//                                                         borderRadius: '50%',
//                                                         border: '1px solid black',
//                                                         backgroundColor:backgroundColor(isSelectedAnswer, isCorrectAnswer,isNoSelectedAnswer),
//                                                         borderColor: isSelectedAnswer && !isCorrectAnswer ? 'red' : 'black',
//                                                         marginRight: '8px',
//                                                         display: 'flex',
//                                                         justifyContent: 'center',
//                                                         alignItems: 'center',
//                                                     }}
//                                                 >
//                                                       {logicIcon(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer)}
//                                                 </div>
//                                                 <Typography variant="body1">{option}</Typography>
//                                             </div>
//                                         );
//                                     })}
//                                 </Box>
//                             ))}
//                 </Box>

//                 <hr />

//                 <div className="d-flex mt-4">
//                   <div>
//                     <label for="formControlInput1" class="form-label">Obtained Marks</label>
//                     <input className="form-control" type="number" value={mcqScore.obtained ? mcqScore.obtained : 0} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
//                   </div>
//                   <div className="ms-3">
//                     <label for="formControlInput1" class="form-label">Out of Marks</label>                
//                     <input className="form-control" type="number" value={mcqScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
//                   </div>
//                 </div>
//               </Box>
//             )}

//             {assessmentType === "email" && (
//               <Box>
//                 <Typography className="my-2" variant="h4">{`Question: ${JSON.parse(assessmentData.email_question )}`}</Typography>
//                 <Typography className="my-2" variant="h5">Answer:</Typography>
//                 <textarea class="form-control" value={ JSON.parse(assessmentData.email_answer) || "Not answered" }
//                   readOnly style={{ width: "100%", height: "100px" }} // Adjust the width and height as needed  
//                 />

//                 <hr/>
                
//                 <div className="d-flex mt-4">
//                   <div>
//                     <label for="formControlInput1" class="form-label">Obtained Marks</label>
//                     <input className="form-control" type="number" value={emailScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
//                   </div>
//                   <div className="ms-3">
//                     <label for="formControlInput1" class="form-label">Out of Marks</label>                
//                     <input className="form-control" type="number" value={emailScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
//                   </div>
//                 </div>
//               </Box>
//             )}

//             {assessmentType === "text" && (
//               <Box>
//                 <Typography className="my-2" variant="h4">{`Question: ${JSON.parse( assessmentData.text_question )}`}</Typography>
//                 <Typography className="my-2" variant="h5">Answer:</Typography>
//                 <textarea class="form-control" value={JSON.parse(assessmentData.text_answer) || "Not answered" }
//                   readOnly style={{ width: "100%", height: "100px" }} // Adjust the width and height as needed  
//                 />

//                 <hr/>
                
//                 <div className="d-flex mt-4">
//                   <div>
//                     <label for="formControlInput1" class="form-label">Obtained Marks</label>
//                     <input className="form-control" type="number" value={textScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
//                   </div>
//                   <div className="ms-3">
//                     <label for="formControlInput1" class="form-label">Out of Marks</label>                
//                     <input className="form-control" type="number" value={textScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
//                   </div>
//                 </div>
//               </Box>
              
//             )}
//             {assessmentType === "audio" && (
//               <Box>
//                 <Typography className="my-2" variant="h4">{`Question: ${JSON.parse(assessmentData.audio_question)}`}</Typography>
                
//                 <Box className="d-flex mt-2">
//                 <Typography className="my-2" variant="h5">Answer:</Typography>
//                   <audio controls>
//                 <source src={`${path}${assessmentData.audio_answer}`} />

//                   Your browser does not support the audio element.
//                   {console.log("path+assessmentData.audio_answer",path+assessmentData.audio_answer)}
//                 </audio>
//                 </Box>

//                 <hr/>

//                 <div className="d-flex mt-4">
//                   <div>
//                     <label for="formControlInput1" class="form-label">Obtained Marks</label>
//                     <input className="form-control" type="number" value={audioScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
//                   </div>
//                   <div className="ms-3">
//                     <label for="formControlInput1" class="form-label">Out of Marks</label>                
//                     <input className="form-control" type="number" value={audioScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
//                   </div>
//                 </div>
//               </Box>
//             )}
//           </Box>
//         )}

//       </div>
//     </Box>
//   );
// };

// export default CourseEvaluationView;



import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid ,Tabs,Tab} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from '@mui/icons-material/Visibility';
import "./companyManagement.css";


const CourseEvaluationView = () => {
  const { id: employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [courseId,setCourseId] = useState()
  const [companyDetails, setCompanyDetails] = useState({});
  const [assessmentType, setAssessmentType] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [mcqScore, setMcqScore] = useState({
    obtained: assessmentData?.mcqScore,
    outOf: null,
  });
  const [textScore, setTextScore] = useState({
    obtained: 0,
    outOf: null,
  });
  const [emailScore, setEmailScore] = useState({
    obtained: 0,
    outOf: null,
  });
  const [audioScore, setAudioScore] = useState({
    obtained: 0,
    outOf: null,
  });
  const [module, setModule] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [selectedModule, setSelectedModule] = useState({
    id: "", // Setting initial value to an empty string
    name: "",
    description: "",
  });

  // -0--------------------tab functionality--------------------------------
  const [selectedTab, setSelectedTab] = useState();

  const navigate = useNavigate();
const path ='http://172.20.1.203:4000/';

  useEffect(() => {
    const getModuleData = async () => {
      try {
        console.log("courseIdcourseIdcourseIdcourseId",courseId);
        const response = await fetch(
          `http://172.20.1.203:4000/superAdmin/getModuleWithAttempt/${courseId}/${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        if (jsonData.success) {
          const moduleInfo = jsonData.data.map(
            ({ id, module_name, module_description,hasAttempt }) => ({
              id,
              name: module_name,
              description: module_description,
              hasAttempt:hasAttempt
            })
          );
          console.log("moduleInfo",moduleInfo);
          setModule(moduleInfo);
          console.log("selected module in moduleApi", selectedModule.id);
        } else {
          console.error("Failed to fetch module data.");
        }
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    };
    
    getModuleData();
  }, [companyDetails]);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `http://172.20.1.203:4000/superAdmin/courseEmployee/${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        if (jsonData.success) {
          setEmployeeDetails(jsonData.data);
          return jsonData.data
        } else {
          console.error("Failed to fetch employee details.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(
          `http://172.20.1.203:4000/superAdmin/getCompanyByEmployeeById/${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonData = await response.json();
        if (jsonData.success) {
          console.log("company Details",jsonData.data);
          // setCourseId(jsonData.course_id)
          setCourseId(1)

          setCompanyDetails(jsonData.data);
        } else {
          console.error("Failed to fetch company details.");
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };
    fetchCompanyDetails();
    fetchEmployeeDetails();
  }, [employeeId]);

  const fetchAssessmentDataAndSelectMCQ = async () => {
    try {
      //  const AssessmentScore = await fetchAssessmentData("mcq");
       const mcqResponse = await fetchAssessmentData("mcq");
    
       if (mcqResponse.success) {
         if(mcqResponse.data.mcq_questions.length > 0){
           setAssessmentType("mcq");
         } else if(mcqResponse.data.email_question !== ''){
           setAssessmentType("email");
         } else if(mcqResponse.data.text_question !== ''){
           setAssessmentType("text");
         } else {
           setAssessmentType("oral");
         }
         // Set up marks
         setMcqScore({
           obtained: mcqResponse.data.mcq_score || 0,
           outOf: mcqResponse.data.mcq_score_outOff || null,
         });
         setTextScore({
           obtained: mcqResponse.data.text_score || 0,
           outOf: mcqResponse.data.text_score_outOff || null,
         });
         setEmailScore({
           obtained: mcqResponse.data.email_score || 0,
           outOf: mcqResponse.data.email_score_outOff || null,
         });
         setAudioScore({
           obtained: mcqResponse.data.audio_score || 0,
           outOf: mcqResponse.data.audio_score_outOff || null,
         });  
       }
    } catch (error) {
      console.error(
        "Error fetching MCQ assessment data and selecting MCQ:",
        error
      );
    }
  };
 
  const fetchAssessmentData = async (type) => {
    console.log("selectedCourse.id]", selectedModule.id);
    try {
      const response = await fetch(
        `http://172.20.1.203:4000/superAdmin/getDatafromCourseEmployeeAnswer/${employeeId}/${selectedModule.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.success) {
        setAssessmentData(jsonData.data[0]);
        setAssessmentType(type);
        return { success: true, data: jsonData.data[0] };
      } else {
        setAssessmentData(null);
        alert(jsonData.message);
        console.error(`Failed to fetch ${type} data.`);
        return { success: false, message: `Failed to fetch ${type} data.` };
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return { success: false, message: `Error fetching ${type} data: ${error.message}` };
    }
  };

  const handleMarksChange = (field, value) => {
    const numericValue = Number(value);
    const sanitizedValue = numericValue === 0 ? "" : numericValue;
    switch (assessmentType) {
      case "mcq":
        setMcqScore({
          ...mcqScore,
          [field]: sanitizedValue,
        });
        break;
      case "text":
        setTextScore({
          ...textScore,
          [field]: sanitizedValue,
        });
        break;
      case "email":
        setEmailScore({
          ...emailScore,
          [field]: sanitizedValue,
        });
        break;
      case "audio":
        setAudioScore({
          ...audioScore,
          [field]: sanitizedValue,
        });
        break;
      default:
        break;
    }
  };

  const handleSaveMarks = async () => {
    try {
      const response = await fetch(
        `http://172.20.1.203:4000/superAdmin/updateCourseScore/${employeeId}/${selectedModule.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mcq: {
              mcq_score: mcqScore.obtained,
              mcq_score_out_off: mcqScore.outOf,
            },
            text: {
              text_score: textScore.obtained,
              text_score_out_off: textScore.outOf,
            },
            email: {
              email_score: emailScore.obtained,
              email_score_out_off: emailScore.outOf,
            },
            audio: {
              audio_score: audioScore.obtained,
              audio_score_out_off: audioScore.outOf,
            },
          }),
        }
      );
      const jsonData = await response.json();
      if (jsonData.success) {
        console.log("Marks submitted successfully.");
        navigate(-1);
      } else {
        console.error("Failed to submit marks.");
      }
    } catch (error) {
      console.error("Error submitting marks:", error);
    }
  };

  function handleBack() {
    navigate(-1);
  }
  const handleModuleClick = async (moduleId) => {
    setSelectedModule({
      id: moduleId,
      name: module.find((module) => module.id === moduleId)?.name || "",
      description: module.find((module) => module.id === moduleId)?.description || "",
    });
  };
  
  // console.log("assessmentData.mcq_questions.length>0",assessmentData.mcq_questions == '[]');
  useEffect(() => {
    if (selectedModule.id !== "0") {
      console.log('selectedCourse.id',selectedModule.id)
      fetchAssessmentDataAndSelectMCQ();
    }
  }, [selectedModule])
  console.log("assessmeeenttttDAta",assessmentData);

    const logicIcon = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
    if (isNoSelectedAnswer) {
        return null; // Render nothing if the answer is not selected
    } else if (isSelectedAnswer && isCorrectAnswer) {
        return <CheckIcon style={{ color: 'white' }} />;
    } else if (isSelectedAnswer && !isCorrectAnswer) {
        return <CloseIcon style={{ color: 'white' }} />;
    } else if (!isSelectedAnswer && isCorrectAnswer) {
        return <CheckIcon style={{ color: 'white' }} />;
    } else {
        return null; // Default case, render nothing
    }
};

const backgroundColor = (isSelectedAnswer, isCorrectAnswer,isNoSelectedAnswer)=>{
    if(isNoSelectedAnswer){
        return null;  
    }
    else if (isSelectedAnswer && isCorrectAnswer) {
        return 'green'
    } else if (isSelectedAnswer && !isCorrectAnswer) {
        return 'red'
    } else if (!isSelectedAnswer  && isCorrectAnswer) {
        return 'green'
    } else {
        return null; // Render nothing if the answer is not selected
    }
}
useEffect(() => {
  const determinePreselectedTab = () => {
    console.log("entering");
    if (assessmentData) {
      if (assessmentData.mcq_questions.length > 0 && assessmentData.mcq_questions !== '[]') {
    console.log("entering mcq tab",selectedTab);

    handleTabChange(0); // MCQ tab
      } else if (assessmentData.email_question !== "" && assessmentData.email_question !== '') {
    console.log("entering email tab",selectedTab);

    handleTabChange(1); // Email tab
      } else if (assessmentData.text_question !== "" && assessmentData.text_question !== '') {
    console.log("entering Text",selectedTab);

    handleTabChange(2); // Text tab
      } else if (assessmentData.audio_question !== "" && assessmentData.audio_question !== '') {
    console.log("entering oral ",selectedTab);

    handleTabChange(3); // Audio tab
      } else {
        handleTabChange(null); // No questions available
      }
    }
  };

  determinePreselectedTab();
}, [assessmentData]);
const handleTabChange = (index) => {
  console.log("handleChange",selectedTab);
  setSelectedTab(index);
};

const renderTabButtons = () => {
  const questionArrays = [assessmentData.mcq_questions, assessmentData.email_question, assessmentData.text_question, assessmentData.audio_question];
  const preSelectedTabIndex = questionArrays.findIndex(array => array && array.length > 0);
  // console.log("preSelectedTabIndex", preSelectedTabIndex);

  return (
    <div className="tab-buttons-container">
      {assessmentData.mcq_questions !=='[]' && (
        <button className={selectedTab === 0 ? "primary-btn ms-2" : "secondary-btn"}
          variant="outlined"
          onClick={() => handleTabChange(0)}
        >
          MCQ Questions
        </button>
      )}
      {assessmentData.email_question !== '[]' && (
        <button className={selectedTab === 1 ? "primary-btn ms-2" : "secondary-btn"}
          variant="outlined"
          onClick={() => handleTabChange(1)}
        >
          Email Questions
        </button>
      )}
      {assessmentData.text_question !== "[]" && (
        <button className={selectedTab === 2 ? "primary-btn ms-2" : "secondary-btn"}
          variant="outlined"
          onClick={() => handleTabChange(2)}
        >
          Free Text Writing
        </button>
      )}
      {assessmentData.audio_question !== '[]'&& (
        <button className={selectedTab === 3 ? "primary-btn ms-2" : "secondary-btn"}
          variant="outlined"
          onClick={() => handleTabChange(3)}
        >
          Oral Communication
        </button>
      )}
      <button className="primary-btn ms-2"  variant="outlined" onClick={handleSaveMarks}>
        Save
      </button>
    </div>
  );
};

console.log("selected tab",selectedTab);
  return (
    <Box m="28px">
  
      {/* Company and Employee Details */}
      <div>
        <button className="secondary-btn pull-right" onClick={handleBack}>
          Back
        </button>
        <div>
            <h1 className="page-heading">Company Name: {companyDetails.comp_name}</h1>
        </div>
      </div>
      <div className="card-bg mt-4">
        <div>
          <Typography variant="h4">Email: {companyDetails.comp_email}</Typography>
          <Typography className="mt-2" variant="h4">Number: {companyDetails.comp_phone}</Typography>
        </div>
        <hr />
        <div>
          <Typography variant="h4">Employee Details:</Typography>
          <Typography className="mt-2" variant="h5"> Employee Name: {employeeDetails.emp_name}</Typography>
          <Typography className="mt-1" variant="h5">Email: {employeeDetails.emp_email}</Typography>
          <Typography className="mt-1" variant="h5">Number: {employeeDetails.emp_contact}</Typography>
        </div>        
      </div>
      <div className="card-bg mt-4">
        <div style={{ overflowX: "auto", height: "260px" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Module Name</th>
                <th>Attempted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {module.map(({ id, name, hasAttempt }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td style={{ color: hasAttempt ? 'green' : 'red' }}>{hasAttempt ? '✔️' : '❌'}</td>
                  <td><VisibilityIcon  className="icon" style={{ cursor: 'pointer' }} onClick={(e) =>
                      {e.stopPropagation(); // To prevent the row click event from firing
                        handleModuleClick(id); // Pass the module ID to the handler function
                      }} />                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-bg mt-4">
        <Box display="flex" >
          {assessmentData && (
            renderTabButtons()
            // <>
            //   <Tabs
            //     value={selectedTab}
            //     onChange={(event, newValue) => setSelectedTab(newValue)}
            //     variant="scrollable"
            //     scrollButtons="auto"
            //     aria-label="assessment-tabs"
            //   >{console.log("selectedTabselectedTab",selectedTab)}
            //     {assessmentData && assessmentData.mcq_questions.length > 0 && assessmentData.mcq_questions !== '[]' && (
            //       <Tab label="Multiple Choice Questions" />
            //     )}
            //     {assessmentData && assessmentData.email_question !== "" && assessmentData.email_question !== null && (
            //       <Tab label="Email Writing Assessment" />
            //     )}
            //     {assessmentData && assessmentData.text_question !== "" && assessmentData.text_question !== null && (
            //       <Tab label="Free Writing Assessment" />
            //     )}
            //     {assessmentData && assessmentData.audio_question !== "" && assessmentData.audio_question !== null && (
            //       <Tab label="Oral Communication" />
            //     )}
            //   </Tabs>
             
            // </>
          )}
        </Box>
        {assessmentData && (
          <Box style={{ marginTop: "20px" }}>
            {console.log('console.log("assessmentData",assessmentData);',assessmentData.mcq_questions)}
            { assessmentData.mcq_questions !== '[]' && selectedTab === 0 &&   (
              <Box value={selectedTab} index={0} >
                <Box sx={{maxHeight: 'calc(100vh - 450px)', minHeight: 150, overflow: 'auto'}} >
                {JSON.parse(assessmentData.mcq_questions).map(
                  (question, index) => (
                    <Box key={index}>
                      <Typography className="my-2" variant="body1">{`Question ${index + 1 }: ${question}`}</Typography>

                      {JSON.parse(assessmentData.mcq_options[index]).map(
                        (option, optionIndex) => {const isCorrectAnswer =
                            JSON.parse(assessmentData.mcq_correctAnswer)[ index ] == option;
                            const isSelectedAnswer =selectedAnswers[index] == option;
                            const isNoSelectedAnswer = selectedAnswers[index] === null;
                          // console.log("selectedAnswers",selectedAnswers)
                          return (
                            <div key={optionIndex} style={{ display: "flex", alignItems: "center" }}>
                              <div className="checkbox" style={{ width: "20px", height: "20px", borderRadius: "20%", border: "1px solid black", backgroundColor:backgroundColor(isSelectedAnswer, isCorrectAnswer,isNoSelectedAnswer),
                                  borderColor:
                                    isSelectedAnswer && !isCorrectAnswer
                                      ? "red"
                                      : "black",
                                  marginRight: "8px", display: "flex", justifyContent: "center", alignItems: "center",
                                }}
                              >
                              {logicIcon(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer)}
                              </div>
                              <Typography variant="body1">{option}</Typography>
                            </div>
                          );
                        }
                      )}
                    </Box>
                  )
                )}
                </Box>

                <hr />

                <div className="d-flex mt-4">
                  <div>
                    <label for="formControlInput1" class="form-label">Obtained Marks</label>
                    <input className="form-control" type="number" value={mcqScore.obtained ? mcqScore.obtained : 0} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
                  </div>
                  <div className="ms-3">
                    <label for="formControlInput1" class="form-label">Out of Marks</label>                
                    <input className="form-control" type="number" value={mcqScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
                  </div>
                </div>
              </Box>
            )}

            { assessmentData.email_question !== '' && selectedTab === 1 &&(
              <Box  value={selectedTab} index={1}>
                <Typography className="my-2" variant="h4">{`Question: ${JSON.parse(assessmentData.email_question )}`}</Typography>
                <Typography className="my-2" variant="h5">Answer:</Typography>
                <textarea class="form-control" value={ JSON.parse(assessmentData.email_answer) || "Not answered" }
                  readOnly style={{ width: "100%", height: "100px" }} // Adjust the width and height as needed  
                />

                <hr/>
                
                <div className="d-flex mt-4">
                  <div>
                    <label for="formControlInput1" class="form-label">Obtained Marks</label>
                    <input className="form-control" type="number" value={emailScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
                  </div>
                  <div className="ms-3">
                    <label for="formControlInput1" class="form-label">Out of Marks</label>                
                    <input className="form-control" type="number" value={emailScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
                  </div>
                </div>
              </Box>
            )}

            {assessmentData.text_question !== ''&& selectedTab === 2 && (
              <Box  value={selectedTab} index={2}>
                <Typography className="my-2" variant="h4">{`Question: ${JSON.parse( assessmentData.text_question )}`}</Typography>
                <Typography className="my-2" variant="h5">Answer:</Typography>
                <textarea class="form-control" value={JSON.parse(assessmentData.text_answer) || "Not answered" }
                  readOnly style={{ width: "100%", height: "100px" }} // Adjust the width and height as needed  
                />

                <hr/>
                
                <div className="d-flex mt-4">
                  <div>
                    <label for="formControlInput1" class="form-label">Obtained Marks</label>
                    <input className="form-control" type="number" value={textScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
                  </div>
                  <div className="ms-3">
                    <label for="formControlInput1" class="form-label">Out of Marks</label>                
                    <input className="form-control" type="number" value={textScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
                  </div>
                </div>
              </Box>
              
            )}
            { assessmentData.audio_question !== ''&& selectedTab === 3 && (
              <Box  value={selectedTab} index={3}>
                <Typography className="my-2" variant="h4">{`Question: ${JSON.parse(assessmentData.audio_question)}`}</Typography>
                
                <Box className="d-flex mt-2">
                <Typography className="my-2" variant="h5">Answer:</Typography>
                  <audio controls>
                <source src={`${path}${assessmentData.audio_answer}`} />

                  Your browser does not support the audio element.
                  {console.log("path+assessmentData.audio_answer",path+assessmentData.audio_answer)}
                </audio>
                </Box>

                <hr/>

                <div className="d-flex mt-4">
                  <div>
                    <label for="formControlInput1" class="form-label">Obtained Marks</label>
                    <input className="form-control" type="number" value={audioScore.obtained} onChange={(e) => handleMarksChange("obtained", e.target.value)}/>
                  </div>
                  <div className="ms-3">
                    <label for="formControlInput1" class="form-label">Out of Marks</label>                
                    <input className="form-control" type="number" value={audioScore.outOf} onChange={(e) => handleMarksChange("outOf", e.target.value)} />
                  </div>
                </div>
              </Box>
            )}
          </Box>
        )}

      </div>
    </Box>
  );
};

export default CourseEvaluationView;



