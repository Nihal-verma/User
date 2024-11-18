import React from "react";
import { Box, Container, Typography, Button, Stack, ListItemButton, ListItemText, InputBase, InputLabel, TextField, FormControl, Grid, AppBar, Link, Toolbar } from "@mui/material";

import Logo from "../../../Images/logo_lms.svg";

import Timer from "../../../components/timer/timer"
import PropTypes from "prop-types";
import { ListItemDecorator, List, ListItem, RadioGroup, Radio, Input, Textarea } from "@mui/joy";
import { useState, useEffect ,useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecordView from "../../Record/Record";
import "./gradedAssessment.scss"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useApiHelper from "../../../useApiHelper";
import ErrorPage from "../../../ErrorPage";
const baseUrl = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

const GradedAssesment = () => {
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [emailQuestions, setEmailQuestions] = useState([]);
  const [textQuestions, setTextQuestions] = useState([]);
  const [oralQuestions, setOralQuestions] = useState([]);
  const [currentSetData, setCurrentSetData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqQuestionIndex, setMcqQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [fileData, setFileData] = useState()
  const [textBoxColor, setTextBoxColor] = useState(false)
  const [emailBoxColor, setEmailBoxColor] = useState(false)
  const [oralBoxColor, setOralBoxColor] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 849);
  const [previousTabHidden,setPreviousTabHidden]= useState(false)
const {fetchData,fetchDataWithoutAuth, postData, error} = useApiHelper()
  const [emailAnswer, setEmailAnswer] = useState(
    localStorage.getItem("emailAnswer") || ""
  );
  const [textAnswer, setTextAnswer] = useState(
    localStorage.getItem("textAnswers") || ""
  );
  const { moduleId } = useParams()
  const [scoreValue, setScoreValue] = useState(false)
  const emp_id = localStorage.getItem("UserId")
  const comp_id = localStorage.getItem("UserCompId")
  const token = localStorage.getItem("UserCourseToken")
  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [])
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    parseInt(localStorage.getItem("selectedTabIndex")) || 0
  );;
  const [allQuestions, setAllquestions] = useState()

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
    localStorage.setItem("selectedTabIndex", index); // Store active tab index
  };

  useEffect(() => {
    const storedActiveTab = parseInt(localStorage.getItem("selectedTabIndex"));
    if (!isNaN(storedActiveTab)) {
      setSelectedTabIndex(storedActiveTab);
    }
  }, []);

  const navigate = useNavigate()
  const [totalMCQQuestions, setTotalMCQQuestions] = useState(0);
  const isLastMCQQuestion = currentQuestionIndex === totalMCQQuestions - 2 || currentQuestionIndex === totalMCQQuestions - 1;

  const handleResize = useCallback(() => {
    setIsLargeScreen(window.innerWidth > 768);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);


  useEffect(() => {localStorage.setItem('selectedTabIndex', selectedTabIndex);
  }, [selectedTabIndex]);

  const questionTab = []
  if (mcqQuestions.length > 0) {
    questionTab.push(0)
  }
  if (emailQuestions.length > 0) {
    questionTab.push(1)
  }
  if (textQuestions.length > 0) {
    questionTab.push(2)
  }
  if (oralQuestions.length > 0) {
    questionTab.push(3)
  }

  const renderTabButtons = () => {
    const questionTypes = [];
    if (mcqQuestions.length > 0 || mcqQuestions !== '[]') {
      questionTypes.push({ label: 'MCQ Questions', data: mcqQuestions });
    }
    if (emailQuestions.length > 0 || emailQuestions !== '[]' || emailQuestions !== '') {
      questionTypes.push({ label: 'Email Questions', data: emailQuestions });
    }
    if (textQuestions.length > 0 || textQuestions !== '[]' || textQuestions !== '') {
      questionTypes.push({ label: 'Free Text Writing', data: textQuestions });
    }
    if (oralQuestions.length > 0 || oralQuestions !== '[]' || oralQuestions !== '') {
      questionTypes.push({ label: 'Oral Communication', data: oralQuestions });
    }

    const handleTabNext = () => {
      if (selectedTabIndex === 0) {
        setSelectedTabIndex(1); // Switch to Email Questions tab
      } else if (selectedTabIndex === 1) {
        setSelectedTabIndex(2); // Switch to Free Text Writing tab
      } else if (oralQuestions.length > 0) {
        setSelectedTabIndex(3); // Switch to Oral Questions tab
      } else {
        setSelectedTabIndex(1); // Switch to Email Questions tab
      }
    };

    const handleTabPrevious = () => {
      if (selectedTabIndex === 0) {
        if (mcqQuestions.length > 0) {
          // If no MCQ questions, stay on the current tab
        }
      } else if (selectedTabIndex === 1) {
        if (mcqQuestions.length > 0) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedTabIndex(1);
        }
      } else if (selectedTabIndex === 2) {
        if (emailQuestions.length > 0) {
          setSelectedTabIndex(1); // Switch to Email Questions tab
        } else if (mcqQuestions.length > 0) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
        } else {
          setSelectedTabIndex(2);
        }
      } else if (selectedTabIndex === 3) {
        if (textQuestions.length > 0) {
          setSelectedTabIndex(2);
        } else if (emailQuestions.length > 0) {
          setSelectedTabIndex(1);
        } else if (mcqQuestions.length > 0) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
        } else {
          setSelectedTabIndex(3);
        }
      }
    };

    const buttonStyle = (isSelected) => ({
      color: '#fff',
      borderBottom: isSelected ? '3px solid #fff' : 'none',
      borderRadius: '0px',
      paddingBottom: '16px',
    });

    return (
      <div className="tab-buttons-container-ga">
        <div className="tab-arrow-btn-ga">
          {selectedTabIndex > questionTab[0] && (
            <ArrowBackIcon onClick={handleTabPrevious} disabled={selectedTabIndex === 0} />
          )}
        </div>
        <div>
          {questionTypes[selectedTabIndex]?.data?.length > 0 && (
            <Button onClick={() => handleTabChange(selectedTabIndex)} sx={buttonStyle(true)}>
              {questionTypes[selectedTabIndex]?.label}
            </Button>
          )}
        </div>
        <div className="tab-arrow-btn-ga">
          {selectedTabIndex < questionTab[questionTab?.length - 1] && (
            <ArrowForwardIcon onClick={handleTabNext} disabled={selectedTabIndex === questionTypes?.length - 1} />
          )}
        </div>
      </div>
    );
  };

  const renderTabFullButtons = () => {
    const buttonStyle = (isSelected) => ({
      color: '#fff',
      borderBottom: isSelected ? '3px solid #fff' : 'none',
      borderRadius: '0px',
      paddingBottom: '16px',
    });

    return (
      <div className="tab-buttons-container-ga">
        {mcqQuestions?.length > 0 && (
          <Button onClick={() => handleTabChange(0)} sx={buttonStyle(selectedTabIndex === 0)}>
            MCQ Questions
          </Button>
        )}
        {emailQuestions?.length > 0 && (
          <Button onClick={() => handleTabChange(1)} sx={buttonStyle(selectedTabIndex === 1)}>
            Email Questions
          </Button>
        )}
        {textQuestions?.length > 0 && (
          <Button onClick={() => handleTabChange(2)} sx={buttonStyle(selectedTabIndex === 2)}>
            Free Text Writing
          </Button>
        )}
        {oralQuestions?.length > 0 && (
          <Button onClick={() => handleTabChange(3)} sx={buttonStyle(selectedTabIndex === 3)}>
            Oral Communication
          </Button>
        )}
      </div>
    );
  };


  useEffect(() => {
    localStorage.setItem("emailAnswer", emailAnswer);
  }, [emailAnswer]);

  useEffect(() => {
    localStorage.setItem("textAnswers", textAnswer);
  }, [textAnswer]);

  const handleEmailAnswerChange = (e) => {
    setEmailAnswer(e.target.value);
  };

  const handleTextAnswerChange = (e) => {
    setTextAnswer(e.target.value);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileData(file)
  };


  useEffect(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");

    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      setMcqQuestions(parsedQuestions.mcqQuestions);
      setEmailQuestions(parsedQuestions.emailQuestions);
      setTextQuestions(parsedQuestions.textQuestions);
      setOralQuestions(parsedQuestions.oralQuestions)
      setCurrentSetData(parsedQuestions.mcqQuestions);
      setCurrentQuestionIndex(parsedQuestions.currentQuestionIndex);
      setMcqQuestionIndex(parsedQuestions.mcqQuestionIndex);
      setSelectedOptions(parsedQuestions.selectedOptions);

    } else {
      fetch(
        `${baseUrl}/graded/getQuestions/${comp_id}/${moduleId}`
      )
        .then((response) => response.json())
        .then((data) => {
          const availableSets = Object.keys(data.data);
          const randomSet = availableSets[Math.floor(Math.random() * availableSets.length)];
          const randomSetMcqQuestions =
            (data.data[randomSet]?.filter(
              (question) => question.category === "MCQ"
            )) || [];
         
          setMcqQuestions(randomSetMcqQuestions);

          const randomSetEmailQuestions =
            (data.data[randomSet]?.filter(
              (question) => question?.category === "Email"
            )) || [];
          setEmailQuestions(randomSetEmailQuestions);

          // Store the data of the selected set for Text
          const randomSetTextQuestions =
            (data.data[randomSet]?.filter(
              (question) => question?.category === "Text"
            )) || [];
          setTextQuestions(randomSetTextQuestions);
          const randomSetOralQuestions =
            (data.data[randomSet]?.filter(
              (question) => question?.category === "Audio"
            )) || [];
          setOralQuestions(randomSetOralQuestions);
          setCurrentSetData(randomSetMcqQuestions);
          const savedSelectedOptions = JSON.parse(
            localStorage.getItem("selectedOptions")
          );
          if (savedSelectedOptions) {
            setSelectedOptions(savedSelectedOptions);
          }
          setAllquestions(...randomSetMcqQuestions, ...randomSetEmailQuestions, ...randomSetOralQuestions, ...randomSetTextQuestions)
          localStorage.setItem(
            "quizQuestions",
            JSON.stringify({
              mcqQuestions: randomSetMcqQuestions,
              emailQuestions: randomSetEmailQuestions,
              textQuestions: randomSetTextQuestions,
              oralQuestions: randomSetOralQuestions,
              currentQuestionIndex: 0,
              mcqQuestionIndex: 0,
              selectedOptions: savedSelectedOptions || [],
              quizSubmitted: false,

            })
          );
        })
        .catch((error) => console.error("Error fetching quiz data:", error));
    }
  }, []);

 
  const handleNext = () => {

    if (selectedTabIndex === 0) {
      if (currentQuestionIndex < mcqQuestions.length - 2) {
        setTotalMCQQuestions(mcqQuestions.length)
        setCurrentQuestionIndex(currentQuestionIndex + 2);
      } else if (emailQuestions.length > 0) {
        setSelectedTabIndex(1); // Switch to Email Questions tab
        setCurrentQuestionIndex(0); // Reset current question index for Email Questions
      } else if (textQuestions.length > 0) {
        setSelectedTabIndex(2); // Switch to text Questions tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions.length > 0) {
        setSelectedTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTabIndex(0); // Switch to Mcq Questions tab

      }
    } else if (selectedTabIndex === 1) {
      if (textQuestions.length > 0) {
        setSelectedTabIndex(2); // Switch to Free Text Writing tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions.length > 0) {
        setSelectedTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTabIndex(1); // Switch to email Questions tab

      }
    } else if (selectedTabIndex === 2) {
      if (oralQuestions.length > 0) {
        setSelectedTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTabIndex(2); // Switch to Text Questions tab

      }
    }
  };

  const handlePrevious = () => {
    if (selectedTabIndex === 0) {
      if (mcqQuestions.length > 0) {
        if (currentQuestionIndex > 1) {
          setCurrentQuestionIndex(currentQuestionIndex - 2);
        } else if (currentQuestionIndex === 1) {
          setCurrentQuestionIndex(0);
        } else {
          // No more previous questions, stay on the MCQ Questions tab
        }
      } else {
        // If no MCQ questions, stay on the current tab
      }
    } else if (selectedTabIndex === 1) {
      if (currentQuestionIndex === 0) {
        if (mcqQuestions.length > 0) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else { setSelectedTabIndex(1) }

      } else {
        setSelectedTabIndex(0); // Switch to MCQ Questions tab
      }
    } else if (selectedTabIndex === 2) {
      if (emailQuestions.length > 0) {
        setSelectedTabIndex(1); // Switch to Email Questions tab
      } else if (mcqQuestions.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedTabIndex(2)
      }
    } else if (selectedTabIndex === 3) {
      if (textQuestions.length > 0) {
        setSelectedTabIndex(2)
      } else if (emailQuestions.length > 0) {
        setSelectedTabIndex(1)
      } else if (mcqQuestions.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedTabIndex(3)
      }; // Switch to Free Text Writing tab
    }
  };

  useEffect(() => {

    if (mcqQuestions.length > 0) {
      return handleTabChange(0)
    }
    else {
      if (emailQuestions.length > 0) {
        return handleTabChange(1)
      }
      if (textQuestions.length > 0) {
        return handleTabChange(2)
      }
      if (oralQuestions.length > 0) {
        return handleTabChange(3)
      }
    }


  }, [allQuestions])

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
      localStorage.setItem("selectedOptions", JSON.stringify(updatedSelectedOptions));
      return updatedSelectedOptions;
    });
  };

  const renderQuestionBoxes = () => {
    if (!mcqQuestions || mcqQuestions.length === 0) {
      return null;
    }
    return (
      <div className="question-box-container-ga">
        {mcqQuestions?.map((question, index) => (
          <div
            key={index}
            className={`question-box-ga ${selectedOptions[index] ? "selected-ga" : ""
              }`}
            onClick={() => handleQuestionClick(index)}
          >
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const handleEmailBox = () => {
    setEmailBoxColor(true)
  }

  const handleTextBox = () => {
    setTextBoxColor(true)
  }

  const handleOralBox = () => {
    setOralBoxColor(true)
  }

  const renderTextQuestionBoxes = () => {

    if (!textQuestions || textQuestions.length === 0) {
      return null;
    }

    return (
      <div className="question-box-container-ga">
        {textQuestions?.map((question, index) => (
          <div key={index} className={`question-box-ga ${textBoxColor == true ? "selected-ga" : ""}`}
            onClick={() => handleQuestionClick(index)}>
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderOralQuestionBoxes = () => {
    if (!oralQuestions || oralQuestions.length === 0) {
      return null;
    }

    return (
      <div className="question-box-container-ga">
        {oralQuestions?.map((question, index) => (
          <div key={index} className={`question-box-ga ${oralBoxColor == true ? "selected-ga" : ""}`}
            onClick={() => handleQuestionClick(index)}>
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderEmailQuestionBoxes = () => {
    if (!emailQuestions || emailQuestions.length === 0) {
      return null;
    }

    return (
      <div className="question-box-container-ga">
        {emailQuestions?.map((question, index) => (
          <div key={index} onClick={() => handleQuestionClick(index)}
            className={`question-box-ga ${emailBoxColor == true ? "selected-ga" : ""
              }`}>
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestions = () => {
    return mcqQuestions
      .slice(currentQuestionIndex, currentQuestionIndex + 2)
      ?.map((question, index) => (
        <Box key={question?.id} className="mcq-question-wrapper-ga">
          <Box className="mcq-question-header-ga">
            <Typography variant="h5">{`Question ${currentQuestionIndex+index + 1}:`}</Typography>
          </Box>
          <Box className="question-card-body-ga">
            <Typography variant="h5">{question?.questions}</Typography>
            <Box className="mcq-wrapper-ga">
              <List> {question?.options ? (
                JSON.parse(question?.options)?.map((option, optionIndex) => (
                  <ListItem
                    key={optionIndex}
                    onClick={() => handleOptionSelect(currentQuestionIndex + index, option)}
                    className={`list-item-ga ${selectedOptions[currentQuestionIndex + index] === option ? 'selected' : ''}`}
                  >
                    <div className="mcq-checkbox-ga">
                      {String.fromCharCode(65 + optionIndex)}
                    </div>
                    <div className="mcq-option-text-ga" style={{ marginLeft: '8px' }}>{option}</div>
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

  if (scoreValue === true) {
    navigate('/course')
  }
  const handleSubmit = async () => {
    const allQuestions = [...mcqQuestions, ...textQuestions, ...emailQuestions, ...oralQuestions];
    if (!quizSubmitted) {
      const correctAnswers = currentSetData?.map((question, index) => ({
        questionIndex: index,
        correctAnswer: question?.correctAnswer,
      }));

      const score = Object.entries(selectedOptions).reduce(
        (totalScore, [questionIndex, selectedAnswer]) => {
          const matchingCorrectAnswer = correctAnswers?.find(
            (answer) => answer?.questionIndex === parseInt(questionIndex, 10)
          );
          const isCorrect =
            matchingCorrectAnswer &&
            matchingCorrectAnswer?.correctAnswer === selectedAnswer;
          return totalScore + (isCorrect ? 1 : 0);
        },
        0
      );
      const mcqQuestionsCount = currentSetData.length; // Number of MCQ questions
      const maxScore = mcqQuestionsCount * 2; // Max score for MCQ questions
      const formData = new FormData();
      formData.append('file', fileData);
      const dataToPost = {
        mcq: allQuestions,
        mcq_selectedAnswer: selectedOptions,
        email_answer: emailAnswer,
        text_answer: textAnswer,
        mcq_score: score * 2,
      }
      // console.log("dataToPostdataToPost",dataToPost);
      const jsonData = await postData(`graded/submitAnswer/${emp_id}/${moduleId}`,dataToPost   
      );

      if (jsonData.success) {
        localStorage.removeItem("textAnswers");
        localStorage.removeItem("quizQuestions");
        localStorage.removeItem("emailAnswer");
        localStorage.removeItem("timer");
        localStorage.removeItem("selectedOptions");

        if (fileData) {
          const audioDataJson = await postData(`graded/audioAnswer/${emp_id}/${moduleId}`,formData);
          if (audioDataJson.success === false) {
            return false
          }

        }
        const notifyData = { comp_id: comp_id, module_id: moduleId }
        const updateNotify = await postData(`superAdmin/updateNotify/${emp_id}`,notifyData);

        if (!updateNotify.success) {
          alert("Unable to update");
          return 
        }
        setScoreValue(true)
         alert("Your Answer has been submitted");
         return
      }
      return alert(jsonData.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (timeUp) {
        // console.log("entered time up");
        await handleSubmit();
      }
    };
    fetchData();
  }, [timeUp]);
  const handlePaste = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const updatePreviousTabHidden = (value) => {
      if (value === 0) {
        if (currentQuestionIndex === 0) {
          setPreviousTabHidden(true);
        } else {
          setPreviousTabHidden(false);
        }
      } else if (value === 1) {
        if (mcqQuestions.length <= 0) {
          setPreviousTabHidden(true);
        } else {
          setPreviousTabHidden(false);
        }
      } else if (value === 2) {
        if (emailQuestions.length <= 0) {
          if (mcqQuestions.length <= 0) {
            setPreviousTabHidden(true);
          } else {
            setPreviousTabHidden(false);
          }
        } else {
          setPreviousTabHidden(false);
        }
      } else if (value === 3) {
        if (textQuestions.length <= 0) {
          if (emailQuestions.length <= 0) {
            if (mcqQuestions.length <= 0) {
              setPreviousTabHidden(true);
            }else{
            setPreviousTabHidden(false);

            }
          } else {
            setPreviousTabHidden(false);
          }
        } else {
          setPreviousTabHidden(false);
        }
      } else {
        setPreviousTabHidden(false);
      }
    };

    updatePreviousTabHidden(selectedTabIndex);
  }, [selectedTabIndex, currentQuestionIndex, mcqQuestions.length, emailQuestions.length]);

  if(error){
    <ErrorPage/>
  }
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#ffffff", color: "#565D6D", display:"flex", justifyContent:"space-between"}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent:"space-between"}}>
            <Link className="header-logo" to="#app-bar-with-responsive-menu" >
              <img src={Logo} alt="Logo" />
            </Link>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
              className="header-search-wrapper">
              <Box sx={{ flexGrow: 0 }}>
                <Timer setTimeUp={setTimeUp} />
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box className="assesment-wrapper-ga">
     
        <Box>
          <Box className="assesment-inner-ga">
            <Box className="assesment-tab-sec-ga">
              <Box className="tab-header-ga">
                {isLargeScreen ? renderTabFullButtons() : renderTabButtons()}
              </Box>
              <Container>
                <Box className="tab-body-ga">
                  <CustomTabPanel value={selectedTabIndex} index={0} className="tab-body-inner-ga">
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ flex: "1" }}>
                        <Box className="assessment-question-wrapper-ga">
                          <Box className="question-heading-wrapper-ga">
                            <Typography component="h4">
                              MCQ Questions
                            </Typography>
                          </Box>
                          <Grid container spacing={2} className="question-wrapper-ga">
                            <Grid item xs={8} className="max-col-ga">
                              <Box className="assessment-left-sec-ga">
                                {renderQuestions()}
                                <Box mt={2}>
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    justifyContent="flex-end"
                                  >
                                   {!previousTabHidden &&(<Button
                                    onClick={handlePrevious}
                                    variant="outlined"
                                    className="btn-secondary"
                                  >
                                    Previous
                                  </Button>)}
                                    {isLastMCQQuestion && emailQuestions.length <= 0 && textQuestions.length <= 0 && oralQuestions.length <= 0 ? (
                                      <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        className="btn-primary"
                                      >
                                        Submit
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={handleNext}
                                        variant="contained"
                                        className="btn-primary"
                                      >
                                        Next
                                      </Button>
                                    )}
                                  </Stack>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={4} className="max-col-ga">
                              <Box sx={{ flex: "1", textAlign: "right" }}>
                                {renderQuestionBoxes()}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={selectedTabIndex} index={1} className="tab-body-inner-ga">
                    <Box className="assessment-question-wrapper-ga">
                      <Box className="question-heading-wrapper-ga">
                        <Typography component="h4">
                          Email Questions
                        </Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ga">
                        <Grid item xs={8} className="max-col-ga">
                          <Box>
                            <Box className="mcq-question-wrapper-ga">
                              <Box className="mcq-question-header-ga">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ga">
                                <Typography variant="h5">{emailQuestions[0]?.topic}</Typography>
                                <Box className="email-wrapper-ga">
                                  <Textarea
                                    name="emailAnswer"
                                    placeholder="Type your Email Answer here…"
                                    variant="outlined"
                                    minRows={5}
                                    value={emailAnswer}
                                    onClick={handleEmailBox}
                                    onPaste={handlePaste}
                                    onChange={handleEmailAnswerChange}
                                  />
                                </Box>
                              </Box>
                            </Box>
                            <Box mt={2}>
                              <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                              >
                                {!previousTabHidden &&(<Button
                                    onClick={handlePrevious}
                                    variant="outlined"
                                    className="btn-secondary"
                                  >
                                    Previous
                                  </Button>)}
                                {textQuestions.length <= 0 && oralQuestions.length <= 0 ? ( // Check if it's the last MCQ question
                                  <Button
                                    onClick={handleSubmit} // If it's the last MCQ question, change the onClick handler to handleSubmit
                                    variant="contained"
                                    className="btn-primary"
                                  >
                                    Submit
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    className="btn-primary"
                                  >
                                    Next
                                  </Button>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4} className="question-box-hide">
                          {renderEmailQuestionBoxes()}
                        </Grid>
                      </Grid>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={selectedTabIndex} index={2} className="tab-body-inner-ga">
                    <Box className="assessment-question-wrapper-ga">
                      <Box className="question-heading-wrapper-ga">
                        <Typography component="h4"> Free Text Questions</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ga">
                        <Grid item xs={8} className="max-col-ga">
                          <Box>
                            <Box className="mcq-question-wrapper-ga">
                              <Box className="mcq-question-header-ga">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ga">
                                <Typography variant="h5">{textQuestions[0]?.topic}</Typography>
                                <Box className="text-wrapper-ga">
                                  <Textarea
                                    name="textAnswer"
                                    placeholder="Type your Free Text Answer here…"
                                    variant="outlined"
                                    minRows={5}
                                    value={textAnswer}
                                    onClick={handleTextBox}
                                    // onPaste={handlePaste}
                                    onChange={handleTextAnswerChange}
                                  />
                                </Box>
                              </Box>
                            </Box>

                            <Box mt={2}>
                              <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                              >
                               {!previousTabHidden &&(<Button
                                    onClick={handlePrevious}
                                    variant="outlined"
                                    className="btn-secondary"
                                  >
                                    Previous
                                  </Button>)}
                                {oralQuestions.length <= 0 ? ( // Check if it's the last MCQ question
                                  <Button
                                    onClick={handleSubmit} // If it's the last MCQ question, change the onClick handler to handleSubmit
                                    variant="contained"
                                    className="btn-primary"
                                  >
                                    Submit
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    className="btn-primary"
                                  >
                                    Next
                                  </Button>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4} className="question-box-hide">
                          {renderTextQuestionBoxes()}

                        </Grid>
                      </Grid>
                    </Box>
                  </CustomTabPanel>
                  {oralQuestions.length > 0 && (<CustomTabPanel value={selectedTabIndex} index={3} className="tab-body-inner-ga">
                    <Box className="assessment-question-wrapper-ga">
                      <Box className="question-heading-wrapper-ga">
                        <Typography component="h4">Oral Communication</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ga">
                        <Grid item xs={8} className="max-col-ga">
                          <Box>
                            <Box className="mcq-question-wrapper-ga">
                              <Box className="mcq-question-header-ga">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ga">
                                <Typography variant="h6">
                                  {oralQuestions[0]?.topic}
                                </Typography>
                              </Box>
                            </Box>

                            <Box mt={2}>

                            </Box>
                            <Box mt={2}>
                              <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                              >
                               {!previousTabHidden &&(<Button
                                    onClick={handlePrevious}
                                    variant="outlined"
                                    className="btn-secondary"
                                  >
                                    Previous
                                  </Button>)}
                                <Button
                                  onClick={handleSubmit}
                                  variant="contained"
                                  className="btn-primary"
                                >
                                  Submit
                                </Button>
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4} className="max-col-ga">
                          <Box className="record-warpper-ga">
                            <Box className="mcq-question-header-ga">
                              <Typography variant="h5">Record your answer</Typography>
                            </Box>
                            <Box onClick={handleOralBox}>
                              <RecordView />
                            </Box>
                            <Box className="choose-audio-wrapper">
                              <Typography variant="h5">Submit Your Audio file Here :-</Typography>
                              <input type="file"  onChange={handleFileUpload}  />
                              {/* <input type="file" onChange={handleFileUpload} /> */}
                            </Box>
                          </Box>

                        </Grid>
                        {/* <Grid item xs={4}>
                        {renderOralQuestionBoxes()}

                      </Grid> */}
                      </Grid>

                    </Box>
                  </CustomTabPanel>)}
                </Box>
              </Container>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GradedAssesment;
