import React, { useEffect, useState } from "react";
import { Box,Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import "./NonGradedEvaluation.scss"
import useApiHelper from "../../../useApiHelper";
import ErrorPage from "../../../ErrorPage";


export default function NonGradedEvaluationView() {
    const [data, setData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [employeeAnswers, setEmployeeAnswers] = useState([]);
    const {fetchData,error} = useApiHelper()
    const { lesson_id } = useParams();
    const emp_id = localStorage.getItem("UserId");
  
    const fetchApiData = async () => {
        try {
            const response = await fetchData(`nonGraded/getDatafromNonGradedEmployeeAnswer/${emp_id}/${lesson_id}`);
             
            if (!response.success) {
                console.error("Error fetching data:", response.message);
                return;
            }
            const initialSelectedAnswers = JSON.parse(response?.data[0]?.mcq_selectedAnswer);
            const initialCorrectAnswers = JSON.parse(response?.data[0]?.mcq_correctAnswer);
            setSelectedAnswers(initialSelectedAnswers);
            setCorrectAnswers(initialCorrectAnswers);
    
            let correctAnswers = null;
            let employeeAnswers = null; // Set employeeAnswers to null by default
            if (initialSelectedAnswers !== null && initialCorrectAnswers !== null) {
                correctAnswers = initialSelectedAnswers?.map((answer, index) => answer === initialCorrectAnswers[index]);
                employeeAnswers = initialSelectedAnswers?.map((answer, index) => {
                    if (answer === null) return null;
                    return answer === initialCorrectAnswers[index];
                });
            }
            setEmployeeAnswers(employeeAnswers);
    
            setData(response.data[0]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

   
    const backgroundColor = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
        if (isNoSelectedAnswer) {
          return null; // Render nothing if the answer is not selected
        } else if (isSelectedAnswer && isCorrectAnswer) {
          return 'green'; // Correctly selected answer
        } else if (isSelectedAnswer && !isCorrectAnswer) {
          return 'red'; // Incorrectly selected answer
        } else if (!isSelectedAnswer && isCorrectAnswer) {
          return 'green'; // Correct answer not selected
        } else {
          return null; // Default case, render nothing
        }
      };
      
    const color = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
      
        if (isNoSelectedAnswer) {
          return null; // Render nothing if the answer is not selected
        } else if (isSelectedAnswer && isCorrectAnswer) {
          return 'white'; // Correctly selected answer
        } else if (isSelectedAnswer && !isCorrectAnswer) {
          return 'white'; // Incorrectly selected answer
        } else if (!isSelectedAnswer && isCorrectAnswer) {
          return 'white'; // Correct answer not selected
        } else {
          return null; // Default case, render nothing
        }
      };

    const borderColor = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
    
      if (isNoSelectedAnswer) {
        return null; // Render nothing if the answer is not selected
      } else if (isSelectedAnswer && isCorrectAnswer) {
        return 'green'; // Correctly selected answer
      } else if (isSelectedAnswer && !isCorrectAnswer) {
        return 'red'; // Incorrectly selected answer
      } else if (!isSelectedAnswer && isCorrectAnswer) {
        return 'green'; // Correct answer not selected
      } else {
        return null; // Default case, render nothing
      }
    };
      
    if (error) {
      return <ErrorPage error={error}/>
    }
    return (
      <>
        <div className="non-graded-evaluation-page">
          {/* <UserHeader setLoggedIn={setLoggedIn} /> */}
          <Container>
            <Box className="non-graded-top-heading">
              <Typography component="h2">
                Non Graded Evaluation
              </Typography>
            </Box>
            {data ? (
             <>
                <Box>
                  {JSON.parse(data?.mcq_questions)?.map((question, index) => (
                    <Box className='mcq-question-wrapper'>
                      <Typography variant="h5">{`Question ${index + 1}:`}</Typography>
                      <Typography variant="h4">{`${question}`}</Typography>
  
                      {JSON.parse(data?.mcq_options[index])?.map((option, optionIndex) => {
                        const isCorrectAnswer = correctAnswers[index] === option;
                        const isSelectedAnswer = selectedAnswers[index] === option;
                        const isNoSelectedAnswer = selectedAnswers[index] === null ||selectedAnswers[index]===undefined;
                        const optionLabel = String.fromCharCode(65 + optionIndex); // Convert optionIndex to A, B, C, D
  
                        return (
                          <div key={optionIndex} className="mcq-option" style={{ borderColor: borderColor(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer)}} >
                            <div className="mcq-checkbox"
                              style={{
                                backgroundColor: backgroundColor(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer),
                                // borderColor: isSelectedAnswer && !isCorrectAnswer ? 'red' : 'green',
                                borderColor: borderColor(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer),
                                color:color(isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer)
                              }}
                            >
  
                              <Typography variant="body1">{optionLabel}</Typography>
                            </div>
                            <div className="msq-option-text">
                              <Typography variant="p1">{option}</Typography>
                            </div>
                          </div>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
                <hr />
                </>
            ) : (
              <Typography variant="h6">No data available.</Typography>
            )}
  
          </Container>
        </div>
      </>
    );
}

// const logicIcon = (isSelectedAnswer, isCorrectAnswer, isNoSelectedAnswer) => {
        
//   if (isNoSelectedAnswer) {
//     return null; // Render nothing if the answer is not selected
//   } else if (isSelectedAnswer && isCorrectAnswer) {
//     return <CheckIcon style={{ color: 'white' }} />; // Correctly selected answer
//   } else if (isSelectedAnswer && !isCorrectAnswer) {
//     return <CloseIcon style={{ color: 'white' }} />; // Incorrectly selected answer
//   } else if (!isSelectedAnswer && isCorrectAnswer) {
//     return <CheckIcon style={{ color: 'white' }} />; // Correct answer not selected
//   } else {
//     return null; // Default case, render nothing
//   }
// };