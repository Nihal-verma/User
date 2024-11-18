import React from "react";
import CryptoJS from 'crypto-js';
import { Box, Container,AppBar,Toolbar, Tabs, Tab, Typography, Button, Stack,Link, Grid } from "@mui/material";
import Logo from "../../../Images/logo_lms.svg";
import NonGradedTimer from "../../../components/timer/NonGradedTimer"
import PropTypes from "prop-types";
import "./Nongraded.scss"
import {List, ListItem} from "@mui/joy";
import { useState, useEffect } from "react";
import { useParams ,useNavigate} from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'
const secretKey = process.env.REACT_APP_SECRET_KEY ; // Use a strong secret key

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const NonGradedAssesment = () => {
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [currentSetData, setCurrentSetData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqQuestionIndex, setMcqQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const {moduleId,lessonId} = useParams()
  const comp_id = localStorage.getItem("UserCompId")
  const userId = localStorage.getItem("UserId")
  const [moduleIdData,setModuleIdData] = useState(moduleId)
  const [scoreValue,setScoreValue] = useState(false)
  const navigate = useNavigate()
  const [value, setValue] = useState(0)
  const [totalMCQQuestions, setTotalMCQQuestions] = useState(0); 
  const token = localStorage.getItem("UserCourseToken")
  const [timeUp,setTimeUp] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [])
  
  if(scoreValue==true){
    navigate(`/video/${moduleId}`)
  }
  const isLastMCQQuestion = currentQuestionIndex == totalMCQQuestions - 2 ||currentQuestionIndex == totalMCQQuestions  -1;

  useEffect(() => {
    const storedActiveTab = parseInt(localStorage.getItem("activeTab"));
    if (!isNaN(storedActiveTab)) {
      setValue(storedActiveTab);
    }
  }, []);

  useEffect(() => {
    const storedQuestions = localStorage.getItem('quizQuestions');
    if (storedQuestions) {
      const parsedQuestions = decryptData(storedQuestions);
      setMcqQuestions(parsedQuestions?.mcqQuestions);
      setCurrentSetData(parsedQuestions?.mcqQuestions);
      setCurrentQuestionIndex(parsedQuestions?.currentQuestionIndex);
      setMcqQuestionIndex(parsedQuestions?.mcqQuestionIndex);
      setSelectedOptions(parsedQuestions?.selectedOptions);
    } else {
      fetch(`${baseUrl}/nonGraded/getNonGradedMcqQuestions/${comp_id}/${moduleId}/${lessonId}`)
        .then((response) => response.json())
        .then((data) => {
          const mcqQuestions = data?.data.MCQ || [];
          const availableSets = Object.keys(data.data);
          const randomSet = availableSets[Math.floor(Math.random() * availableSets.length)];
          const randomSetMcqQuestions = data?.data[randomSet]?.filter((question) => question?.category === 'MCQ') || [];
          setMcqQuestions(randomSetMcqQuestions);
          setCurrentSetData(randomSetMcqQuestions);
          const savedSelectedOptions = JSON.parse(localStorage.getItem('selectedOptions'));
          if (savedSelectedOptions) {
            setSelectedOptions(savedSelectedOptions);
          }
          localStorage.setItem(
            'quizQuestions',
            encryptData({
              mcqQuestions: randomSetMcqQuestions,
              currentQuestionIndex: 0,
              mcqQuestionIndex: 0,
              selectedOptions: savedSelectedOptions || [],
              quizSubmitted: false,
            })
          );
        })
        .catch((error) => console.error('Error fetching quiz data:', error));
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem('nonGradedtimer');
    localStorage.setItem("nonGradedtimer", 600);
    // const time = localStorage.getItem("nonGradedtimer")
  }, [moduleIdData]);

  useEffect(()=>{
    setTotalMCQQuestions(mcqQuestions.length)

  },[mcqQuestions])
  
const handlePrevious = () => {
    if (value === 0) {
      if (currentQuestionIndex >= 2) {
        setCurrentQuestionIndex(currentQuestionIndex - 2);
        setQuizSubmitted(false);
      } else {
        setQuizSubmitted(false);
      }
    } 
  };
  
const handleNext = () => {
      if(value===0){
        if (currentQuestionIndex < mcqQuestions.length - 2) {
          setTotalMCQQuestions(mcqQuestions.length)
          setCurrentQuestionIndex(currentQuestionIndex + 2);
        } else {
          setQuizSubmitted(true);
        } 
      }
};

useEffect(()=>{
  if(isLastMCQQuestion){
    setQuizSubmitted(true)
  }
},[isLastMCQQuestion])
  
const renderNavigationButtons = () => {
    if (isLastMCQQuestion) {
      return (
        <>
          <Button
            onClick={handlePrevious}
            variant="outlined"
            className="btn-secondary"
          >
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="btn-primary"
          >
            Submit
          </Button>
        </>
      );
    } else {
      return (
        <>
         {currentQuestionIndex!=0 &&( <Button
            onClick={handlePrevious}
            variant="outlined"
            className="btn-secondary"
          >
            Previous
          </Button>)}
          <Button
            onClick={handleNext}
            variant="contained"
            className="btn-primary"
          >
            Next
          </Button>
        </>
      );
    }
};

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  useEffect(() => {
    const savedSelectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
    if (savedSelectedOptions) {
      setSelectedOptions(savedSelectedOptions);
    }
  }, []);

  const handleOptionSelect = (index, selectedOption) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedSelectedOptions = [...prevSelectedOptions];
      updatedSelectedOptions[index] = selectedOption;
      localStorage.setItem(
        "selectedOptions",
        JSON.stringify(updatedSelectedOptions)
      );
      return updatedSelectedOptions;
    });
  };

  const renderQuestionBoxes = () => {
    if (!mcqQuestions || mcqQuestions.length === 0) {
      return null;
    }
    return (
      <div className="question-box-container-ng">
        {mcqQuestions?.map((question, index) => (
          <div
            key={index}
            className={`question-box-ng ${selectedOptions[index] ? "selected" : ""
              }`}
            onClick={() => handleQuestionClick(index)}
          >
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestions = () => {
    return mcqQuestions?.slice(currentQuestionIndex,currentQuestionIndex + 2)?.map((question, index)=> (
          <Box key={question.id} className="mcq-question-wrapper-ng">
                <Box className="mcq-question-header-ng">
                    <Typography component="h5">
                        Question {currentQuestionIndex + index + 1}
                    </Typography>
                </Box>
                <Box className="question-card-body-ng">
                    <Typography component="h5">{question?.questions}</Typography>
                    <Box className="mcq-wrapper-ng">
                        <List>
                            {question?.options ? (
                                JSON.parse(question?.options)?.map((option, optionIndex) => (
                                    <ListItem
                                        key={optionIndex}
                                        onClick={() => handleOptionSelect(currentQuestionIndex + index, option)}
                                        className={`list-item-ng ${selectedOptions[currentQuestionIndex + index] === option ? 'selected' : ''}`}
                                    >
                                        <div className="mcq-checkbox-ng">
                                            {String.fromCharCode(65 + optionIndex)}
                                        </div>
                                        <div className="mcq-option-text-ng" style={{ marginLeft: '8px' }}>{option}</div>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>Options are not available</ListItem>
                            )}
                        </List>
                    </Box>
                </Box>
            </Box>
        ));
};


const handleSubmit = async () => {
  const allQuestions = [...mcqQuestions];

  const correctAnswers = currentSetData?.map((question, index) => ({
    questionIndex: index,
    correctAnswer: question?.correctAnswer,
  }));

  const score = Object.entries(selectedOptions)?.reduce(
    (totalScore, [questionIndex, selectedAnswer]) => {
      const matchingCorrectAnswer = correctAnswers?.find(
        (answer) => answer?.questionIndex === parseInt(questionIndex, 10)
      );
      const isCorrect = matchingCorrectAnswer && matchingCorrectAnswer?.correctAnswer === selectedAnswer;
      return totalScore + (isCorrect ? 1 : 0);
    },
    0
  );

  const fetchData = await fetch(
    `${baseUrl}/nonGraded/NonGradedAssesmentAnswerByEmployee/${userId}/${moduleId}/${lessonId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mcq: allQuestions,
        mcq_selectedAnswer: selectedOptions,
        mcq_score: score * 2,
      }),
    }
  );

  const jsonData = await fetchData.json();
  if (jsonData.success) {
    setScoreValue(true);
    localStorage.removeItem('nonGradedtimer');
    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('selectedOptions');
    alert('Your Answer has been submitted');
  } else {
    alert(jsonData.message);
  }
};

 
  useEffect(() => {
    const fetchData = async () => {
      if (timeUp) {
        await handleSubmit();
      }
    };
    fetchData();
  }, [timeUp]);
  return (
    <>
    <AppBar position="static" sx={{ backgroundColor: "#ffffff", color: "#565D6D", display:"flex", justifyContent:"space-between"}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Link className="header-logo" to="#app-bar-with-responsive-menu" >
              <img src={Logo} alt="Logo" />
            </Link>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
              className="header-search-wrapper" >
              <Box sx={{ flexGrow: 0 }}>
                <NonGradedTimer setTimeUp={setTimeUp} />
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    <Box className="assesment-wrapper-ng">
      <Box>
        <Box className="assesment-inner-ng">
          <Box sx={{ width: "100%" }} className="assesment-tab-sec-ng">
            <Box className="tab-header-ng">
              <Tabs value={0} aria-label="basic tabs example">
                <Tab label="MCQ Questions" />
              </Tabs>
            </Box>
            <Container maxWidth="lg">
              <Box className="tab-body">
                <CustomTabPanel value={value} index={0}className="tab-body-inner-ng">
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ flex: "1" }}>
                      <Box className="assessment-question-wrapper-ng">
                        <Box className="question-heading-wrapper-ng">
                          <Typography component="h4">
                            MCQ Questions
                          </Typography>
                        </Box>
                        <Grid container spacing={2} className="question-wrapper-ng">
                          <Grid item xs={8} className="max-col-ng" >
                            <Box className="assessment-left-sec-ng">
                              {renderQuestions()}
                              <Box mt={2}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" marginBottom={2}>
                                {renderNavigationButtons()}
                                </Stack>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={4} className="max-col-ng">
                            <Box sx={{ flex: "1", textAlign: "right" }}>
                              {renderQuestionBoxes()}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </CustomTabPanel>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default NonGradedAssesment;
