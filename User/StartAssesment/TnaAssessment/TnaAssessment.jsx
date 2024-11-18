import React from "react";
import { Box, Container, Typography, Button, Stack, ListItemButton, ListItemText, InputBase, InputLabel, TextField, FormControl, Grid, AppBar, Link, Toolbar } from "@mui/material";

import Logo from "../../../Images/logo_lms.svg";

import Timer from "../../../components/timer/TnaTimer"
import PropTypes from "prop-types";
import { ListItemDecorator, List, ListItem, RadioGroup, Radio, Input, Textarea } from "@mui/joy";
import { useState, useEffect ,useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecordView from "../../Record/Record";
import "./TnaAssessment.scss"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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

const TnaAssessment = () => {
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [emailQuestions, setEmailQuestions] = useState([]);
  const [textQuestions, setTextQuestions] = useState([]);
  const [oralQuestions, setOralQuestions] = useState([]);
  const [currentSetData, setCurrentSetData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqQuestionIndex, setMcqQuestionIndex] = useState(0);
  const [selectedTnaOptions, setSelectedTnaOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [fileData, setFileData] = useState()
  const [textBoxColor, setTextBoxColor] = useState(false)
  const [emailBoxColor, setEmailBoxColor] = useState(false)
  const [oralBoxColor, setOralBoxColor] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 849);
  const [previousTabHidden,setPreviousTabHidden]= useState(false)
  const {tnaLicenseCode,comp_id,uniqueToken} = useParams()
  const [emailAnswer, setEmailAnswer] = useState(
    localStorage.getItem("TnaEmailAnswer") || ""
  );
  const [textAnswer, setTextAnswer] = useState(
    localStorage.getItem("TnaTextAnswers") || ""
  );
  const [scoreValue, setScoreValue] = useState(false);
 
  const [selectedTnaTabIndex, setSelectedTnaTabIndex] = useState(
    parseInt(localStorage.getItem("selectedTnaTabIndex")) || 0
  );
  const [allQuestions, setAllquestions] = useState();

  const handleTabChange = (index) => {
    setSelectedTnaTabIndex(index);
    localStorage.setItem("selectedTnaTabIndex", index); // Store active tab index
  };

  useEffect(() => {
    const storedActiveTab = parseInt(localStorage.getItem("selectedTnaTabIndex"));
    if (!isNaN(storedActiveTab)) {
      setSelectedTnaTabIndex(storedActiveTab);
    }
  }, []);

  const navigate = useNavigate();
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


  useEffect(() => {
    localStorage.setItem('selectedTnaTabIndex', selectedTnaTabIndex);
  }, [selectedTnaTabIndex]);

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
  

  const renderTabButtons = () => {
    const questionTypes = [];
    if (mcqQuestions?.length > 0 || mcqQuestions !== '[]') {
      questionTypes?.push({ label: 'MCQ Questions', data: mcqQuestions });
    }
    if (emailQuestions?.length > 0 || emailQuestions !== '[]' || emailQuestions !== '') {
      questionTypes?.push({ label: 'Email Questions', data: emailQuestions });
    }
    if (textQuestions?.length > 0 || textQuestions !== '[]' || textQuestions !== '') {
      questionTypes?.push({ label: 'Free Text Writing', data: textQuestions });
    }
  

    const handleTabNext = () => {
      if (selectedTnaTabIndex === 0) {
        setSelectedTnaTabIndex(1); // Switch to Email Questions tab
      } else if (selectedTnaTabIndex === 1) {
        setSelectedTnaTabIndex(2); // Switch to Free Text Writing tab
      }  else {
        setSelectedTnaTabIndex(1); // Switch to Email Questions tab
      }
    };

    const handleTabPrevious = () => {
      if (selectedTnaTabIndex === 0) {
        if (mcqQuestions?.length > 0) {
          // If no MCQ questions, stay on the current tab
        }
      } else if (selectedTnaTabIndex === 1) {
        if (mcqQuestions?.length > 0) {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions?.length - 2);
        } else {
          setSelectedTnaTabIndex(1);
        }
      } else if (selectedTnaTabIndex === 2) {
        if (emailQuestions?.length > 0) {
          setSelectedTnaTabIndex(1); // Switch to Email Questions tab
        } else if (mcqQuestions?.length > 0) {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
        } else {
          setSelectedTnaTabIndex(2);
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
      <div className="tab-buttons-container-ta">
        <div className="tab-arrow-btn-ta">
          {selectedTnaTabIndex > questionTab[0] && (
            <ArrowBackIcon onClick={handleTabPrevious} disabled={selectedTnaTabIndex === 0} />
          )}
        </div>
        <div>
          {questionTypes[selectedTnaTabIndex]?.data?.length > 0 && (
            <Button onClick={() => handleTabChange(selectedTnaTabIndex)} sx={buttonStyle(true)}>
              {questionTypes[selectedTnaTabIndex].label}
            </Button>
          )}
        </div>
        <div className="tab-arrow-btn-ta">
          {selectedTnaTabIndex < questionTab[questionTab?.length - 1] && (
            <ArrowForwardIcon onClick={handleTabNext} disabled={selectedTnaTabIndex === questionTypes?.length - 1} />
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
      <div className="tab-buttons-container-ta">
        {mcqQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(0)} sx={buttonStyle(selectedTnaTabIndex === 0)}>
            MCQ Questions
          </Button>
        )}
        {emailQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(1)} sx={buttonStyle(selectedTnaTabIndex === 1)}>
            Email Questions
          </Button>
        )}
        {textQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(2)} sx={buttonStyle(selectedTnaTabIndex === 2)}>
            Free Text Writing
          </Button>
        )}
       
      </div>
    );
  };


  useEffect(() => {
    localStorage.setItem("TnaEmailAnswer", emailAnswer);
  }, [emailAnswer]);

  useEffect(() => {
    localStorage.setItem("TnaTextAnswers", textAnswer);
  }, [textAnswer]);

  const handleEmailAnswerChange = (e) => {
    setEmailAnswer(e.target.value);
  };

  const handleTextAnswerChange = (e) => {
    setTextAnswer(e.target.value);
  };

  const handleFileUpload = async (event) => {
    const file = event.target?.files[0];
    setFileData(file)
  };


  useEffect(() => {
    const storedQuestions = localStorage.getItem("TnaTnaQuizQuestions");

    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      setMcqQuestions(parsedQuestions?.mcqQuestions);
      setEmailQuestions(parsedQuestions?.emailQuestions);
      setTextQuestions(parsedQuestions?.textQuestions);
      setCurrentSetData(parsedQuestions?.mcqQuestions);
      setCurrentQuestionIndex(parsedQuestions?.currentQuestionIndex);
      setMcqQuestionIndex(parsedQuestions?.mcqQuestionIndex);
      setSelectedTnaOptions(parsedQuestions?.selectedTnaOptions);

    } else {
            // Fetch quiz data from your API
            fetch(
              `${baseUrl}/tna/getMcq/${tnaLicenseCode}/${comp_id}/${uniqueToken}`
            )
              .then((response) => response.json())
              .then((data) => {
                // Filter questions based on different categories
                const mcqQuestions = data?.data?.MCQ || [];
                const emailQuestions = data?.data?.Email || [];
                const textQuestions = data?.data?.Text || [];
      
                // Select a random set from available sets
                const availableSets = Object.keys(data?.data);
                const randomSet =
                  availableSets[Math.floor(Math.random() * availableSets.length)];
                // Store the data of the selected set for MCQ
                const randomSetMcqQuestions =
                  data.data[randomSet]?.filter(
                    (question) => question?.category === "MCQ"
                  ) || [];
                setMcqQuestions(randomSetMcqQuestions);
      
                // Store the data of the selected set for Email
                const randomSetEmailQuestions =
                  data.data[randomSet]?.filter(
                    (question) => question?.category === "Email"
                  ) || [];
                setEmailQuestions(randomSetEmailQuestions);
      
                // Store the data of the selected set for Text
                const randomSetTextQuestions =
                  data.data[randomSet]?.filter(
                    (question) => question?.category === "Text"
                  ) || [];
                setTextQuestions(randomSetTextQuestions);
                // -----------------------without correct answer
                const updatedMcqQuestions = randomSetMcqQuestions.map(({ correctAnswer, ...rest }) => rest);

                // Choose which category to set as current questions (e.g., MCQ)
                setCurrentSetData(randomSetMcqQuestions);
      
                // Retrieve selected options from localStorage
                const savedselectedTnaOptions = JSON.parse(
                  localStorage.getItem("selectedTnaOptions")
                );
                if (savedselectedTnaOptions) {
                  setSelectedTnaOptions(savedselectedTnaOptions);
                }
      
                // Store fetched questions data in localStorage
                localStorage.setItem(
                  "TnaQuizQuestions",
                  JSON.stringify({
                    mcqQuestions: updatedMcqQuestions,
                    emailQuestions: randomSetEmailQuestions,
                    textQuestions: randomSetTextQuestions,
                    currentQuestionIndex: 0,
                    mcqQuestionIndex: 0,
                    selectedTnaOptions: savedselectedTnaOptions || [],
      
                    quizSubmitted: false,
                   
                  })
                );
              })
              .catch((error) => console.error("Error fetching quiz data:", error));
          }
  }, []);

 
  const handleNext = () => {
    // console.log("selectedTnaTabIndex If", selectedTnaTabIndex)
    // console.log("currentQuestionIndex", currentQuestionIndex);
    if (selectedTnaTabIndex === 0) {
      if (currentQuestionIndex < mcqQuestions?.length - 2) {
        setTotalMCQQuestions(mcqQuestions?.length)
        setCurrentQuestionIndex(currentQuestionIndex + 2);
      } else if (emailQuestions?.length > 0) {
        setSelectedTnaTabIndex(1); // Switch to Email Questions tab
        setCurrentQuestionIndex(0); // Reset current question index for Email Questions
      } else if (textQuestions?.length > 0) {
        setSelectedTnaTabIndex(2); // Switch to text Questions tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions?.length > 0) {
        setSelectedTnaTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTnaTabIndex(0); // Switch to Mcq Questions tab

      }
    } else if (selectedTnaTabIndex === 1) {
      if (textQuestions?.length > 0) {
        setSelectedTnaTabIndex(2); // Switch to Free Text Writing tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions?.length > 0) {
        setSelectedTnaTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTnaTabIndex(1); // Switch to email Questions tab

      }
    } else if (selectedTnaTabIndex === 2) {
      if (oralQuestions?.length > 0) {
        setSelectedTnaTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedTnaTabIndex(2); // Switch to Text Questions tab

      }
    }
  };

  const handlePrevious = () => {
    if (selectedTnaTabIndex === 0) {
      if (mcqQuestions?.length > 0) {
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
    } else if (selectedTnaTabIndex === 1) {
      if (currentQuestionIndex === 0) {
        if (mcqQuestions?.length > 0) {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions?.length - 2);
        } else { setSelectedTnaTabIndex(1) }

      } else {
        setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
      }
    } else if (selectedTnaTabIndex === 2) {
      if (emailQuestions?.length > 0) {
        setSelectedTnaTabIndex(1); // Switch to Email Questions tab
      } else if (mcqQuestions?.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions?.length - 2);
        } else {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedTnaTabIndex(2)
      }
    } else if (selectedTnaTabIndex === 3) {
      if (textQuestions?.length > 0) {
        setSelectedTnaTabIndex(2)
      } else if (emailQuestions?.length > 0) {
        setSelectedTnaTabIndex(1)
      } else if (mcqQuestions?.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions?.length - 2);
        } else {
          setSelectedTnaTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedTnaTabIndex(3)
      }; // Switch to Free Text Writing tab
    }
  };

  useEffect(() => {
    console.log("entered mcq", mcqQuestions?.length);

    if (mcqQuestions?.length > 0) {
      console.log("entered if length is more than 1");
      return handleTabChange(0)
    }
    else {
      if (emailQuestions?.length > 0) {
        console.log("entered email");
        return handleTabChange(1)
      }
      if (textQuestions?.length > 0) {
        console.log("entered Text");
        return handleTabChange(2)
      }
      if (oralQuestions?.length > 0) {
        return handleTabChange(3)
      }
    }


  }, [allQuestions])

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  useEffect(() => {
    const savedselectedTnaOptions = JSON.parse(localStorage.getItem("selectedTnaOptions"));
    if (savedselectedTnaOptions) {
      setSelectedTnaOptions(savedselectedTnaOptions);
    }
  }, []);

  const handleOptionSelect = (index, selectedOption) => {
    setSelectedTnaOptions((prevselectedTnaOptions) => {
      const updatedselectedTnaOptions = [...prevselectedTnaOptions];
      updatedselectedTnaOptions[index] = selectedOption;
      localStorage.setItem("selectedTnaOptions", JSON.stringify(updatedselectedTnaOptions));
      return updatedselectedTnaOptions;
    });
  };

  const renderQuestionBoxes = () => {
    if (!mcqQuestions || mcqQuestions.length === 0) {
      return null;
    }
    return (
      <div className="question-box-container-ta">
        {mcqQuestions?.map((question, index) => (
          <div
            key={index}
            className={`question-box-ta ${selectedTnaOptions[index] ? "selected-ta" : ""
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
      <div className="question-box-container-ta">
        {textQuestions?.map((question, index) => (
          <div key={index} className={`question-box-ta ${textBoxColor == true ? "selected-ta" : ""}`}
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
      <div className="question-box-container-ta">
        {/* {console.log("emailQuestions", emailQuestions)} */}
        {emailQuestions?.map((question, index) => (
          <div key={index} onClick={() => handleQuestionClick(index)}
            className={`question-box-ta ${emailBoxColor == true ? "selected-ta" : ""
              }`}>
            Q{index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestions = () => {
    return mcqQuestions?.slice(currentQuestionIndex, currentQuestionIndex + 2)?.map((question, index) => (
        <Box key={question?.id} className="mcq-question-wrapper-ta">
          <Box className="mcq-question-header-ta">
            <Typography variant="h5">{`Question ${currentQuestionIndex+index + 1}:`}</Typography>
          </Box>
          <Box className="question-card-body-ta">
            <Typography variant="h5">{question?.questions}</Typography>
            <Box className="mcq-wrapper-ta">
              <List> {question?.options ? (
                JSON.parse(question?.options)?.map((option, optionIndex) => (
                  <ListItem key={optionIndex}
                    onClick={() => handleOptionSelect(currentQuestionIndex + index, option)}
                    className={`list-item-ta ${selectedTnaOptions[currentQuestionIndex + index] === option ? 'selected' : ''}`}
                  >
                    <div className="mcq-checkbox-ta">
                      {String.fromCharCode(65 + optionIndex)}
                    </div>
                    <div className="mcq-option-text-ta" style={{ marginLeft: '8px' }}>{option}</div>
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
    navigate('/ThankYouPage')
  }

  const handleSubmit = async () => {
        const allQuestions = [...mcqQuestions, ...textQuestions, ...emailQuestions];
      // console.log("selectedTnaOptions",selectedTnaOptions);
        if (!quizSubmitted) {
          const correctAnswers = currentSetData?.map((question, index) => ({
            questionIndex: index,
            correctAnswer: question.correctAnswer,
          }));
      
          const score = Object.entries(selectedTnaOptions).reduce(
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
      
          const mcqQuestionsCount = currentSetData?.length; // Number of MCQ questions
          const maxScore = mcqQuestionsCount * 2; // Max score for MCQ questions
          // Proceed with API call
          const fetchData = await fetch(
            `${baseUrl}/tna/submitAnswer/${tnaLicenseCode}/${comp_id}/${uniqueToken}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mcq: allQuestions,
                mcq_selectedAnswer: selectedTnaOptions,
                email_answer: emailAnswer,
                text_answer: textAnswer,
                mcq_score: score * 2, // Using updated score value
                mcq_score_out_off: maxScore, // Using updated maxScore value
              }),
            }
          );
      
          const jsonData = await fetchData.json();
          if (jsonData.success) {
            setScoreValue(true)
            localStorage.clear()
            return alert(jsonData.message);
          }
          return alert(jsonData.message);
        }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (timeUp) {
        console.log("entered time up");
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
        if (mcqQuestions?.length <= 0) {
          setPreviousTabHidden(true);
        } else {
          setPreviousTabHidden(false);
        }
      } else if (value === 2) {
        if (emailQuestions?.length <= 0) {
          if (mcqQuestions?.length <= 0) {
            setPreviousTabHidden(true);
          } else {
            setPreviousTabHidden(false);
          }
        } else {
          setPreviousTabHidden(false);
        }
      } else if (value === 3) {
        if (textQuestions?.length <= 0) {
          if (emailQuestions?.length <= 0) {
            if (mcqQuestions?.length <= 0) {
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

    updatePreviousTabHidden(selectedTnaTabIndex);
  }, [selectedTnaTabIndex, currentQuestionIndex, mcqQuestions.length, emailQuestions.length]);

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
      <Box className="assesment-wrapper-ta">
        <Box>
          <Box className="assesment-inner-ta">
            <Box className="assesment-tab-sec-ta">
              <Box className="tab-header-ta">
                {isLargeScreen ? renderTabFullButtons() : renderTabButtons()}
              </Box>
              <Container>
                <Box className="tab-body-ta">
                  <CustomTabPanel value={selectedTnaTabIndex} index={0} className="tab-body-inner-ta">
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ flex: "1" }}>
                        <Box className="assessment-question-wrapper-ta">
                          <Box className="question-heading-wrapper-ta">
                            <Typography component="h4">
                              MCQ Questions
                            </Typography>
                          </Box>
                          <Grid container spacing={2} className="question-wrapper-ta">
                            <Grid item xs={8} className="max-col-ta">
                              <Box className="assessment-left-sec-ta">
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
                                    {isLastMCQQuestion && emailQuestions?.length <= 0 && textQuestions?.length <= 0 && oralQuestions?.length <= 0 ? (
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
                            <Grid item xs={4} className="max-col-ta">
                              <Box sx={{ flex: "1", textAlign: "right" }}>
                                {renderQuestionBoxes()}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={selectedTnaTabIndex} index={1} className="tab-body-inner-ta">
                    <Box className="assessment-question-wrapper-ta">
                      <Box className="question-heading-wrapper-ta">
                        <Typography component="h4">
                          Email Questions
                        </Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ta">
                        <Grid item xs={8} className="max-col-ta">
                          <Box>
                            <Box className="mcq-question-wrapper-ta">
                              <Box className="mcq-question-header-ta">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ta">
                                <Typography variant="h5">{emailQuestions?.[0]?.topic}</Typography>
                                <Box className="email-wrapper-ta">
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
                                {textQuestions?.length <= 0 && oralQuestions?.length <= 0 ? ( // Check if it's the last MCQ question
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
                  <CustomTabPanel value={selectedTnaTabIndex} index={2} className="tab-body-inner-ta">
                    <Box className="assessment-question-wrapper-ta">
                      <Box className="question-heading-wrapper-ta">
                        <Typography component="h4"> Free Text Questions</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ta">
                        <Grid item xs={8} className="max-col-ta">
                          <Box>
                            <Box className="mcq-question-wrapper-ta">
                              <Box className="mcq-question-header-ta">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ta">
                                <Typography variant="h5">{textQuestions?.[0]?.topic}</Typography>
                                <Box className="text-wrapper-ta">
                                  <Textarea
                                    name="textAnswer"
                                    placeholder="Type your Free Text Answer here…"
                                    variant="outlined"
                                    minRows={5}
                                    value={textAnswer}
                                    onClick={handleTextBox}
                                    onPaste={handlePaste}
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
                                {oralQuestions?.length <= 0 ? ( // Check if it's the last MCQ question
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
                  {oralQuestions?.length > 0 && (<CustomTabPanel value={selectedTnaTabIndex} index={3} className="tab-body-inner-ta">
                    <Box className="assessment-question-wrapper-ta">
                      <Box className="question-heading-wrapper-ta">
                        <Typography component="h4">Oral Communication</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-ta">
                        <Grid item xs={8} className="max-col-ta">
                          <Box>
                            <Box className="mcq-question-wrapper-ta">
                              <Box className="mcq-question-header-ta">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-ta">
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
                        <Grid item xs={4} className="max-col-ta">
                          <Box className="record-warpper-ta">
                            <Box className="mcq-question-header-ta">
                              <Typography variant="h5">Record your answer</Typography>
                            </Box>
                            <Box onClick={handleOralBox}>
                              <RecordView />
                            </Box>
                            <Box className="choose-audio-wrapper">
                              <Typography variant="h5">Submit Your Audio file Here :-</Typography>
                              {/* <input type="file" /> */}
                              <input type="file" onChange={handleFileUpload} />
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

export default TnaAssessment;


// import React from "react";
// import {
//   Box,
//   Container,
//   Tabs,
//   Tab,
//   Typography,
//   Button,
//   Stack,
//   ListItemButton,
//   ListItemText,
//   InputBase,
//   InputLabel,
//   TextField,
//   FormControl,
//   Grid,
// } from "@mui/material";
// import Timer from "../../../components/timer/timer"
// import { alpha, styled } from "@mui/material/styles";

// import PropTypes from "prop-types";
// import "./TnaAssessment.scss";
// import {
//   ListItemDecorator,
//   List,
//   ListItem,
//   RadioGroup,
//   Radio,
//   Input,
//   Textarea,
// } from "@mui/joy";

// import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
// import { useState, useEffect } from "react";
// import { useParams ,useNavigate} from "react-router-dom";
// const baseUrl = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'

// const CssTextField = styled(TextField)({
//   "& label.Mui-focused": {
//     color: "#A0AAB4",
//   },
//   "& .MuiInput-underline:after": {
//     borderBottomColor: "#B2BAC2",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "#E0E3E7",
//     },
//     "&:hover fieldset": {
//       borderColor: "#B2BAC2",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#6F7E8C",
//     },
//   },
// });

// const BootstrapInput = styled(InputBase)(({ theme }) => ({
//   "label + &": {
//     marginTop: theme.spacing(3),
//   },
//   "& .MuiInputBase-input": {
//     borderRadius: 4,
//     position: "relative",
//     backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
//     border: "1px solid",
//     borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
//     fontSize: 16,
//     width: "auto",
//     padding: "10px 12px",
//     transition: theme.transitions.create([
//       "border-color",
//       "background-color",
//       "box-shadow",
//     ]),
//     // Use the system font instead of the default Roboto font.
//     fontFamily: [
//       "-apple-system",
//       "BlinkMacSystemFont",
//       '"Segoe UI"',
//       "Roboto",
//       '"Helvetica Neue"',
//       "Arial",
//       "sans-serif",
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(","),
//     "&:focus": {
//       boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

// const ValidationTextField = styled(TextField)({
//   "& input:valid + fieldset": {
//     borderColor: "#E0E3E7",
//     borderWidth: 1,
//   },
//   "& input:invalid + fieldset": {
//     borderColor: "red",
//     borderWidth: 1,
//   },
//   "& input:valid:focus + fieldset": {
//     borderLeftWidth: 4,
//     padding: "4px !important", // override inline-style
//   },
// });

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// const TnaAssessment = () => {
//   const [mcqQuestions, setMcqQuestions] = useState([]);
//   const [emailQuestions, setEmailQuestions] = useState([]);
//   const [textQuestions, setTextQuestions] = useState([]);
//   const [currentSetData, setCurrentSetData] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [mcqQuestionIndex, setMcqQuestionIndex] = useState(0);
//   const [selectedTnaOptions, setSelectedTnaOptions] = useState([]);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timeUp,setTimeUp] = useState(false)
//   const [emailAnswer, setEmailAnswer] = useState(
//     localStorage.getItem("emailAnswer") || ""
//   );
//   const [textAnswer, setTextAnswer] = useState(
//     localStorage.getItem("textAnswers") || ""
//   );
//   const {tnaLicenseCode,comp_id,uniqueToken} = useParams()
//   const [scoreValue,setScoreValue] = useState(false)
//   const navigate = useNavigate()
  
//   const handlePaste = (event) => {
//     event.preventDefault();
//     // alert("Pasting is not allowed in this textarea.");
//   };
//   const [value, setValue] = useState(
//     parseInt(localStorage.getItem("activeTab")) || 0
//   );

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     localStorage.setItem("activeTab", newValue); // Store active tab index
//   };

//   useEffect(() => {
//     // Load selected tab from localStorage when the component mounts
//     const storedActiveTab = parseInt(localStorage.getItem("activeTab"));
//     if (!isNaN(storedActiveTab)) {
//       setValue(storedActiveTab);
//     }
//   }, []);
//   // Update localStorage when emailAnswer or textAnswer changes
//   useEffect(() => {
//     localStorage.setItem("emailAnswer", emailAnswer);
//   }, [emailAnswer]);

//   useEffect(() => {
//     localStorage.setItem("textAnswers", textAnswer);
//   }, [textAnswer]);

//   // Event handler to update emailAnswer
//   const handleEmailAnswerChange = (e) => {
//     setEmailAnswer(e.target.value);
//   };

//   // Event handler to update textAnswer
//   const handleTextAnswerChange = (e) => {
//     setTextAnswer(e.target.value);
//   };
//   useEffect(() => {
//     // Check if questions data is stored in localStorage
//     const storedQuestions = localStorage.getItem("TnaQuizQuestions");

//     if (storedQuestions) {
//       // If questions data is found in localStorage, parse and set it
//       const parsedQuestions = JSON.parse(storedQuestions);
//       setMcqQuestions(parsedQuestions.mcqQuestions);
//       setEmailQuestions(parsedQuestions.emailQuestions);
//       setTextQuestions(parsedQuestions.textQuestions);
//       setCurrentSetData(parsedQuestions.mcqQuestions);
//       setCurrentQuestionIndex(parsedQuestions.currentQuestionIndex);
//       setMcqQuestionIndex(parsedQuestions.mcqQuestionIndex);
//       setSelectedTnaOptions(parsedQuestions.selectedTnaOptions);

      
//     } else {
//       // Fetch quiz data from your API
//       fetch(
//         `${baseUrl}/superAdmin/getMcq/${tnaLicenseCode}/${comp_id}/${uniqueToken}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           // Filter questions based on different categories
//           const mcqQuestions = data.data.MCQ || [];
//           const emailQuestions = data.data.Email || [];
//           const textQuestions = data.data.Text || [];

//           // Select a random set from available sets
//           const availableSets = Object.keys(data.data);
//           const randomSet =
//             availableSets[Math.floor(Math.random() * availableSets.length)];

//           // Store the data of the selected set for MCQ
//           const randomSetMcqQuestions =
//             data.data[randomSet]?.filter(
//               (question) => question.category === "MCQ"
//             ) || [];
//           setMcqQuestions(randomSetMcqQuestions);

//           // Store the data of the selected set for Email
//           const randomSetEmailQuestions =
//             data.data[randomSet]?.filter(
//               (question) => question.category === "Email"
//             ) || [];
//           setEmailQuestions(randomSetEmailQuestions);

//           // Store the data of the selected set for Text
//           const randomSetTextQuestions =
//             data.data[randomSet]?.filter(
//               (question) => question.category === "Text"
//             ) || [];
//           setTextQuestions(randomSetTextQuestions);

//           // Choose which category to set as current questions (e.g., MCQ)
//           setCurrentSetData(randomSetMcqQuestions);

//           // Retrieve selected options from localStorage
//           const savedselectedTnaOptions = JSON.parse(
//             localStorage.getItem("selectedTnaOptions")
//           );
//           if (savedselectedTnaOptions) {
//             setSelectedTnaOptions(savedselectedTnaOptions);
//           }

//           // Store fetched questions data in localStorage
//           localStorage.setItem(
//             "TnaQuizQuestions",
//             JSON.stringify({
//               mcqQuestions: randomSetMcqQuestions,
//               emailQuestions: randomSetEmailQuestions,
//               textQuestions: randomSetTextQuestions,
//               currentQuestionIndex: 0,
//               mcqQuestionIndex: 0,
//               selectedTnaOptions: savedselectedTnaOptions || [],

//               quizSubmitted: false,
             
//             })
//           );
//         })
//         .catch((error) => console.error("Error fetching quiz data:", error));
//     }
//   }, []);

//   const handleNext = () => {
//     if (value === 0) {
//       // If currently on MCQ Questions tab
//       if (currentQuestionIndex < mcqQuestions.length - 2) {
//         setCurrentQuestionIndex(currentQuestionIndex + 2);
//       } else {
//         setValue(1); // Switch to Email Questions tab
//         setCurrentQuestionIndex(0); // Reset current question index for Email Questions
//       }
//     } else if (value === 1) {
//       setValue(2); // Switch to the next tab (Free Text Writing)
//     } else {
//     }
//   };

//   const handlePrevious = () => {
//     if (value === 0) {
//       if (currentQuestionIndex >= 2) {
//         setCurrentQuestionIndex(currentQuestionIndex - 2);
//       }
//     } else if (value === 1) {
//       if (currentQuestionIndex === 0) {
//         setValue(0); // Switch to MCQ Questions tab
//         setCurrentQuestionIndex(mcqQuestions.length - 2);
//       } else {
//         setCurrentQuestionIndex(currentQuestionIndex - 1);
//       }
//     } else if (value === 2) {
//       if (currentQuestionIndex === 0) {
//         setValue(1);
//         setCurrentQuestionIndex(emailQuestions.length - 1);
//       } else {
//         setCurrentQuestionIndex(currentQuestionIndex - 1);
//       }
//     }
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestionIndex(index);
//   };
//   useEffect(() => {
//     // Load selected options from localStorage when the component mounts
//     const savedselectedTnaOptions = JSON.parse(localStorage.getItem("selectedTnaOptions"));
//     if (savedselectedTnaOptions) {
//       setSelectedTnaOptions(savedselectedTnaOptions);
//     }
//   }, []);

//   const handleOptionSelect = (index, selectedOption) => {
//     setSelectedTnaOptions((prevselectedTnaOptions) => {
//       const updatedselectedTnaOptions = [...prevselectedTnaOptions];
//       updatedselectedTnaOptions[index] = selectedOption === "" ? null : selectedOption;
//       localStorage.setItem(
//         "selectedTnaOptions",
//         JSON.stringify(updatedselectedTnaOptions)
//       );
//       return updatedselectedTnaOptions;
//     });
//   };
  
//   const renderQuestionBoxes = () => {
//     if (!mcqQuestions || mcqQuestions.length === 0) {
//       return null;
//     }

//     return (
//       <div className="question-box-container">
//         {mcqQuestions?.map((question, index) => (
//           <div
//             key={index}
//             className={`question-box ${
//               selectedTnaOptions[index] ? "selected" : ""
//             }`}
//             onClick={() => handleQuestionClick(index)}
//           >
//             Q{index + 1}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderTextQuestionBoxes = () => {
//     if (!textQuestions || textQuestions.length === 0) {
//       return null;
//     }

//   return (
//     <div className="question-box-container">
//         {textQuestions.map((question, index) => (
//         <div key={index} className={`question-box ${selectedTnaOptions[index] ? "selected" : ""}`}
//           onClick={() => handleQuestionClick(index)}>
//           Q{index + 1}
//         </div>
//         ))}
//     </div>
//   );
//   };

//   const renderEmailQuestionBoxes = () => {
//     if (!emailQuestions || emailQuestions.length === 0) {
//       return null;
//     }

//     return (
//       <div className="question-box-container">
//         {emailQuestions?.map((question, index) => (
//           <div key={index} onClick={() => handleQuestionClick(index)}          
//             className={`question-box ${
//               selectedTnaOptions[index] ? "selected" : ""
//             }`}>
//             Q{index + 1}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderQuestions = () => {
//     return mcqQuestions
//       .slice(currentQuestionIndex, currentQuestionIndex + 2) // Slice the array to get two questions
//       ?.map((question, index) => (
//         <Box key={question.id} className="question-card">
//           <Box className="question-card-header">
//             <Typography component="p">
//               Question {currentQuestionIndex + index + 1}
//             </Typography>
//           </Box>
//           <Box className="question-card-body">
//             <Typography component="strong">{question.questions}</Typography>
//             <Box className="question-wrapper">
//               <RadioGroup
//                 aria-label="Your plan"
//                 name={`question_${question.id}`}
//                 value={selectedTnaOptions[currentQuestionIndex + index] || ""}
//                 onChange={(e) =>
//                   handleOptionSelect(
//                     currentQuestionIndex + index,
//                     e.target.value
//                   )
//                 }
//               >
//                 <List>
//                   {question.options ? (
//                     JSON.parse(question.options)?.map((option, optionIndex) => (
//                       <ListItem key={optionIndex} value={option}>
//                         <ListItemDecorator>
//                           {String.fromCharCode(65 + optionIndex)}
//                         </ListItemDecorator>
//                         <Radio value={option} label={option} />
//                       </ListItem>
//                     ))
//                   ) : (
//                     <ListItem>Options are not available</ListItem>
//                   )}
//                 </List>
//               </RadioGroup>
//             </Box>
//           </Box>
//         </Box>
//       ));
//   };

//   if(scoreValue==true){
//     navigate('/ThankYouPage')
//   }
//   const handleSubmit = async () => {
//     const allQuestions = [...mcqQuestions, ...textQuestions, ...emailQuestions];
//   console.log("selectedTnaOptions",selectedTnaOptions);
//     if (!quizSubmitted) {
//       const correctAnswers = currentSetData?.map((question, index) => ({
//         questionIndex: index,
//         correctAnswer: question.correctAnswer,
//       }));
  
//       const score = Object.entries(selectedTnaOptions).reduce(
//         (totalScore, [questionIndex, selectedAnswer]) => {
//           const matchingCorrectAnswer = correctAnswers.find(
//             (answer) => answer.questionIndex === parseInt(questionIndex, 10)
//           );
//           const isCorrect =
//             matchingCorrectAnswer &&
//             matchingCorrectAnswer.correctAnswer === selectedAnswer;
//           return totalScore + (isCorrect ? 1 : 0);
//         },
//         0
//       );
  
//       const mcqQuestionsCount = currentSetData.length; // Number of MCQ questions
//       const maxScore = mcqQuestionsCount * 2; // Max score for MCQ questions
  
//       // console.log("score", score);
//       // console.log("maxScore", maxScore);
  
//       // Proceed with API call
//       const fetchData = await fetch(
//         `${baseUrl}/superAdmin/tnaAnswerByEmployee/${tnaLicenseCode}/${comp_id}/${uniqueToken}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mcq: allQuestions,
//             mcq_selectedAnswer: selectedTnaOptions,
//             email_answer: emailAnswer,
//             text_answer: textAnswer,
//             mcq_score: score * 2, // Using updated score value
//             mcq_score_out_off: maxScore, // Using updated maxScore value
//           }),
//         }
//       );
  
//       const jsonData = await fetchData.json();
//       if (jsonData.success) {
//         setScoreValue(true)
//         localStorage.clear()
//         return alert(jsonData.message);
//       }
//       return alert(jsonData.message);
//     }
//   };
 
//   useEffect(() => {
//     const fetchData = async () => {
//       if (timeUp) {
//         // console.log("entered time up");
//         await handleSubmit();
//       }
//     };
  
//     fetchData();
//   }, [timeUp]);
  

//   return (
//     <Box className="assesment-wrapper">
//       <Box className="header-user">
//         <Container>
//           <Box className="logo-left">
//             <Box className="flex-wrapper-space-between">
//               <Typography className="logo">Hybrid LMS</Typography>
//             <Timer setTimeUp={setTimeUp}/>
//             </Box>
//           </Box>
//         </Container>
//       </Box>
//       <Box>
//         <Box className="assesment-inner">
//           <Container>
//             <Box className="assesment-top-heading">
//               <Typography component="h3">
//                 Steps to Guide the Process before Assesssment
//               </Typography>
//             </Box>
//           </Container>
//           <Box sx={{ width: "100%" }} className="assesment-tab-sec">
//             <Box className="tab-header">
//               <Tabs
//                 value={value}
//                 onChange={handleChange}
//                 aria-label="basic tabs example"
//               >
//                 <Tab label="MCQ Questions" />
//                 <Tab label="Email Questions" />
//                 <Tab label="Free Text Writing" />
//               </Tabs>
//             </Box>
//             <Container maxWidth="lg">
//               <Box className="tab-body">
//                 <CustomTabPanel
//                   value={value}
//                   index={0}
//                   className="tab-body-inner"
//                 >
//                   <Box sx={{ display: "flex" }}>
//                     <Box sx={{ flex: "1" }}>
//                       <Box className="assessment-question-wrapper">
//                         <Grid container spacing={2}>
//                           <Grid item xs={8}>
//                             <Box className="assessment-left-sec">
//                               {/* Time duration and end test button */}
//                               <Box className="time-duration-wrapper">
//                                 <Box className="time-duration-item">
//                                   <Typography component="strong">
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                               <Box className="question-heading-wrapper">
//                                 <Typography component="h4">
//                                   MCQ Questions
//                                 </Typography>
//                               </Box>
//                               {renderQuestions()}
//                               <Box mt={2}>
//                                 <Stack
//                                   direction="row"
//                                   spacing={2}
//                                   justifyContent="flex-end"
//                                   marginBottom={2}
//                                 >
//                                   <Button
//                                     onClick={handlePrevious}
//                                     variant="outlined"
//                                     className="btn-secondary"
//                                   >
//                                     Previous
//                                   </Button>
//                                   <Button
//                                     onClick={handleNext}
//                                     variant="contained"
//                                     className="btn-primary"
//                                   >
//                                     Next
//                                   </Button>
//                                 </Stack>
//                               </Box>
//                             </Box>
//                           </Grid>
//                           <Grid item xs={4}>
//                             {/* Render question boxes on the right side */}
//                             <Box sx={{ flex: "1", textAlign: "right" }}>
//                               {renderQuestionBoxes()}
//                             </Box>
//                           </Grid>
//                         </Grid>
//                       </Box>
//                     </Box>
//                   </Box>
//                 </CustomTabPanel>

//                 <CustomTabPanel
//                   value={value}
//                   index={1}
//                   className="tab-body-inner"
//                 >
//                   <Box className="assesment-question-wrapper">
//                     <Box className="assement-left-sec">
//                       <Box>
//                         <Box className="time-duration-wrapper">
//                           <Box className="time-duration-item">
//                             <Typography component="strong">
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Box className="question-heading-wrapper">
//                         <Typography component="h4">Email Questions</Typography>
//                       </Box>
//                       <Box className="question-card">
//                         <Box className="question-card-header">
//                           <Typography component="p">Question 1</Typography>
//                         </Box>
//                         <Box className="question-card-body">
//                           <Typography component="strong">
//                             {emailQuestions[0]?.topic}
//                           </Typography>
//                           <Box className="qustion-wrapper">
//                             <Textarea
//                               name="emailAnswer"
//                               placeholder="Type your Email Answer here…"
//                               variant="outlined"
//                               minRows={5}
//                               value={emailAnswer}
//                               onChange={handleEmailAnswerChange}
//                               onPaste={handlePaste}
//                             />
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Box mt={2}>
//                         <Stack
//                           direction="row"
//                           spacing={2}
//                           justifyContent="flex-end"
//                         >
//                           <Button
//                             onClick={handlePrevious}
//                             variant="outlined"
//                             className="btn-secondary"
//                           >
//                             Previous
//                           </Button>
//                           <Button
//                             onClick={handleNext}
//                             variant="contained"
//                             className="btn-primary"
//                           >
//                             Next
//                           </Button>
//                         </Stack>
//                       </Box>
//                     </Box>
//                   </Box>
//                   {renderEmailQuestionBoxes()}
//                 </CustomTabPanel>
//                 <CustomTabPanel
//                   value={value}
//                   index={2}
//                   className="tab-body-inner"
//                 >
//                   <Box className="assesment-question-wrapper">
//                     <Box className="assement-left-sec">
//                       <Box className="question-heading-wrapper">
//                         <Typography component="h4">
//                           Free Text Questions
//                         </Typography>
//                       </Box>
//                       <Box className="question-card">
//                         <Box className="question-card-header">
//                           <Typography component="p">Question 1</Typography>
//                         </Box>
//                         <Box className="question-card-body">
//                           <Typography component="strong">
//                             {textQuestions[0]?.topic}
//                           </Typography>
//                           <Box className="qustion-wrapper">
//                             <Textarea
//                               name="textAnswer"
//                               placeholder="Type your Free Text here…"
//                               variant="outlined"
//                               minRows={5}
//                               value={textAnswer}
//                               onChange={handleTextAnswerChange}
//                               onPaste={handlePaste}
//                             />
//                           </Box>
//                         </Box>
//                       </Box>

//                       <Box mt={2}>
//                         <Stack
//                           direction="row"
//                           spacing={2}
//                           justifyContent="flex-end"
//                         >
//                           <Button
//                             onClick={handlePrevious}
//                             variant="outlined"
//                             className="btn-secondary"
//                           >
//                             Previous
//                           </Button>
//                           <Button
//                             onClick={handleSubmit}
//                             variant="contained"
//                             className="btn-primary"
//                           >
//                             Submit
//                           </Button>
//                         </Stack>
//                       </Box>
//                     </Box>
//                   </Box>
//                   {renderTextQuestionBoxes()}
//                 </CustomTabPanel>
//               </Box>
//             </Container>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default TnaAssessment