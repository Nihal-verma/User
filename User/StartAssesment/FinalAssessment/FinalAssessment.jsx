import React from "react";
import { Box, Container, Typography, Button, Stack, ListItemButton, ListItemText, InputBase, InputLabel, TextField, FormControl, Grid, AppBar, Link, Toolbar } from "@mui/material";
import Logo from "../../../Images/logo_lms.svg";
import Timer from "../../../components/timer/FinalGradedTimer"
import PropTypes from "prop-types";
import { ListItemDecorator, List, ListItem, RadioGroup, Radio, Input, Textarea } from "@mui/joy";
import { useState, useEffect ,useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecordView from "../../Record/Record";
import "./finalAssessment.scss"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useApiHelper from "../../../useApiHelper";
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

const FinalAssessment = () => {
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
  const [emailAnswer, setEmailAnswer] = useState(
    localStorage.getItem("FinalEmailAnswer") || ""
  );
  const [textAnswer, setTextAnswer] = useState(
    localStorage.getItem("finalTextAnswer") || ""
  );
  const { moduleId } = useParams()
  const [scoreValue, setScoreValue] = useState(false)
  const emp_id = localStorage.getItem("UserId")
  const comp_id = localStorage.getItem("UserCompId")
  const token = localStorage.getItem("UserCourseToken")
  const {fetchData} = useApiHelper()
  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [])
  const [selectedFinalTabIndex, setSelectedFinalTabIndex] = useState(
    parseInt(localStorage.getItem("selectedFinalTabIndex")) || 0
  );;
  const [allQuestions, setAllquestions] = useState()
  const handleTabChange = (index) => {
    setSelectedFinalTabIndex(index);
    localStorage.setItem("selectedFinalTabIndex", index); // Store active tab index
  };

  useEffect(() => {
    const storedActiveTab = parseInt(localStorage.getItem("selectedFinalTabIndex"));
    if (!isNaN(storedActiveTab)) {
      setSelectedFinalTabIndex(storedActiveTab);
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


  useEffect(() => {
    localStorage.setItem('selectedFinalTabIndex', selectedFinalTabIndex);
  }, [selectedFinalTabIndex]);

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
      if (selectedFinalTabIndex === 0) {
        setSelectedFinalTabIndex(1); // Switch to Email Questions tab
      } else if (selectedFinalTabIndex === 1) {
        setSelectedFinalTabIndex(2); // Switch to Free Text Writing tab
      } else if (oralQuestions.length > 0) {
        setSelectedFinalTabIndex(3); // Switch to Oral Questions tab
      } else {
        setSelectedFinalTabIndex(1); // Switch to Email Questions tab
      }
    };

    const handleTabPrevious = () => {
      if (selectedFinalTabIndex === 0) {
        if (mcqQuestions.length > 0) {
          // If no MCQ questions, stay on the current tab
        }
      } else if (selectedFinalTabIndex === 1) {
        if (mcqQuestions.length > 0) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedFinalTabIndex(1);
        }
      } else if (selectedFinalTabIndex === 2) {
        if (emailQuestions.length > 0) {
          setSelectedFinalTabIndex(1); // Switch to Email Questions tab
        } else if (mcqQuestions.length > 0) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
        } else {
          setSelectedFinalTabIndex(2);
        }
      } else if (selectedFinalTabIndex === 3) {
        if (textQuestions.length > 0) {
          setSelectedFinalTabIndex(2);
        } else if (emailQuestions.length > 0) {
          setSelectedFinalTabIndex(1);
        } else if (mcqQuestions.length > 0) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
        } else {
          setSelectedFinalTabIndex(3);
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
      <div className="tab-buttons-container-fa">
        <div className="tab-arrow-btn-fa">
          {selectedFinalTabIndex > questionTab[0] && (
            <ArrowBackIcon onClick={handleTabPrevious} disabled={selectedFinalTabIndex === 0} />
          )}
        </div>
        <div>
          {questionTypes[selectedFinalTabIndex]?.data.length > 0 && (
            <Button onClick={() => handleTabChange(selectedFinalTabIndex)} sx={buttonStyle(true)}>
              {questionTypes[selectedFinalTabIndex].label}
            </Button>
          )}
        </div>
        <div className="tab-arrow-btn-fa">
          {selectedFinalTabIndex < questionTab[questionTab.length - 1] && (
            <ArrowForwardIcon onClick={handleTabNext} disabled={selectedFinalTabIndex === questionTypes.length - 1} />
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
      <div className="tab-buttons-container-fa">
        {mcqQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(0)} sx={buttonStyle(selectedFinalTabIndex === 0)}>
            MCQ Questions
          </Button>
        )}
        {emailQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(1)} sx={buttonStyle(selectedFinalTabIndex === 1)}>
            Email Questions
          </Button>
        )}
        {textQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(2)} sx={buttonStyle(selectedFinalTabIndex === 2)}>
            Free Text Writing
          </Button>
        )}
        {oralQuestions.length > 0 && (
          <Button onClick={() => handleTabChange(3)} sx={buttonStyle(selectedFinalTabIndex === 3)}>
            Oral Communication
          </Button>
        )}
      </div>
    );
  };


  useEffect(() => {
    localStorage.setItem("FinalEmailAnswer", emailAnswer);
  }, [emailAnswer]);

  useEffect(() => {
    localStorage.setItem("finalTextAnswer", textAnswer);
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
    const storedQuestions = localStorage.getItem("FinalQuizQuestions");

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
        `http://172.20.1.203:4000/final/getQuestions/${comp_id}`
      )
        .then((response) => response.json())
        .then((data) => {
          const availableSets = Object.keys(data.data);
          const randomSet = availableSets[Math.floor(Math.random() * availableSets.length)];
          const randomSetMcqQuestions =
            (data?.data[randomSet]?.filter(
              (question) => question?.category === "MCQ"
            )) || [];
         
          setMcqQuestions(randomSetMcqQuestions);

          const randomSetEmailQuestions =
            (data.data[randomSet]?.filter(
              (question) => question?.category === "Email"
            )) || [];
          setEmailQuestions(randomSetEmailQuestions);

          // Store the data of the selected set for Text
          const randomSetTextQuestions =
            (data?.data[randomSet]?.filter(
              (question) => question?.category === "Text"
            )) || [];
          setTextQuestions(randomSetTextQuestions);
          const randomSetOralQuestions =
            (data?.data[randomSet]?.filter(
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
            "FinalQuizQuestions",
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
    if (selectedFinalTabIndex === 0) {
      if (currentQuestionIndex < mcqQuestions.length - 2) {
        setTotalMCQQuestions(mcqQuestions.length)
        setCurrentQuestionIndex(currentQuestionIndex + 2);
      } else if (emailQuestions.length > 0) {
        setSelectedFinalTabIndex(1); // Switch to Email Questions tab
        setCurrentQuestionIndex(0); // Reset current question index for Email Questions
      } else if (textQuestions.length > 0) {
        setSelectedFinalTabIndex(2); // Switch to text Questions tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions.length > 0) {
        setSelectedFinalTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedFinalTabIndex(0); // Switch to Mcq Questions tab

      }
    } else if (selectedFinalTabIndex === 1) {
      if (textQuestions.length > 0) {
        setSelectedFinalTabIndex(2); // Switch to Free Text Writing tab
        setCurrentQuestionIndex(0)
      } else if (oralQuestions.length > 0) {
        setSelectedFinalTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedFinalTabIndex(1); // Switch to email Questions tab

      }
    } else if (selectedFinalTabIndex === 2) {
      if (oralQuestions.length > 0) {
        setSelectedFinalTabIndex(3); // Switch to oral Questions tab
        setCurrentQuestionIndex(0)
      } else {
        setSelectedFinalTabIndex(2); // Switch to Text Questions tab

      }
    }
  };

  const handlePrevious = () => {
    if (selectedFinalTabIndex === 0) {
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
    } else if (selectedFinalTabIndex === 1) {
      if (currentQuestionIndex === 0) {
        if (mcqQuestions.length > 0) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else { setSelectedFinalTabIndex(1) }

      } else {
        setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
      }
    } else if (selectedFinalTabIndex === 2) {
      if (emailQuestions.length > 0) {
        setSelectedFinalTabIndex(1); // Switch to Email Questions tab
      } else if (mcqQuestions.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedFinalTabIndex(2)
      }
    } else if (selectedFinalTabIndex === 3) {
      if (textQuestions.length > 0) {
        setSelectedFinalTabIndex(2)
      } else if (emailQuestions.length > 0) {
        setSelectedFinalTabIndex(1)
      } else if (mcqQuestions.length > 0) {
        if (currentQuestionIndex > 1) {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
          setCurrentQuestionIndex(mcqQuestions.length - 2);
        } else {
          setSelectedFinalTabIndex(0); // Switch to MCQ Questions tab
        }

      } else {
        setSelectedFinalTabIndex(3)
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
      <div className="question-box-container-fa">
        {mcqQuestions?.map((question, index) => (
          <div
            key={index}
            className={`question-box-fa ${selectedOptions[index] ? "selected-fa" : ""
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
      <div className="question-box-container-fa">
        {textQuestions?.map((question, index) => (
          <div key={index} className={`question-box-fa ${textBoxColor == true ? "selected" : ""}`}
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
      <div className="question-box-container-fa">
        {oralQuestions?.map((question, index) => (
          <div key={index} className={`question-box-fa ${oralBoxColor == true ? "selected" : ""}`}
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
      <div className="question-box-container-fa">
        {emailQuestions?.map((question, index) => (
          <div key={index} onClick={() => handleQuestionClick(index)}
            className={`question-box-fa ${emailBoxColor == true ? "selected" : ""
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
        <Box key={question.id} className="mcq-question-wrapper-fa">
          <Box className="mcq-question-header-fa">
            <Typography variant="h5">{`Question ${currentQuestionIndex+index + 1}:`}</Typography>
          </Box>
          <Box className="question-card-body-fa">
            <Typography variant="h5">{question.questions}</Typography>
            <Box className="mcq-wrapper-fa">
              <List> {question.options ? (
                JSON.parse(question.options)?.map((option, optionIndex) => (
                  <ListItem
                    key={optionIndex}
                    onClick={() => handleOptionSelect(currentQuestionIndex + index, option)}
                    className={`list-item-fa ${selectedOptions[currentQuestionIndex + index] === option ? 'selected' : ''}`}
                  >
                    <div className="mcq-checkbox-fa">
                      {String.fromCharCode(65 + optionIndex)}
                    </div>
                    <div className="mcq-option-text-fa" style={{ marginLeft: '8px' }}>{option}</div>
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
      const correctAnswers = currentSetData.map((question, index) => ({
        questionIndex: index,
        correctAnswer: question.correctAnswer,
      }));

      const score = Object.entries(selectedOptions).reduce(
        (totalScore, [questionIndex, selectedAnswer]) => {
          const matchingCorrectAnswer = correctAnswers.find(
            (answer) => answer.questionIndex === parseInt(questionIndex, 10)
          );
          const isCorrect =
            matchingCorrectAnswer &&
            matchingCorrectAnswer.correctAnswer === selectedAnswer;
          return totalScore + (isCorrect ? 1 : 0);
        },
        0
      );
      const mcqQuestionsCount = currentSetData.length; // Number of MCQ questions
      const maxScore = mcqQuestionsCount * 2; // Max score for MCQ questions
      const formData = new FormData();
      formData.append('file', fileData);
      const fetchData = await fetch(`http://172.20.1.203:4000/final/submitFinalAnswer/${emp_id}/${comp_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mcq: allQuestions,
            mcq_selectedAnswer: selectedOptions,
            email_answer: emailAnswer,
            text_answer: textAnswer,
            mcq_score: score * 2,
          }),
        }
      );

      const jsonData = await fetchData.json();
      if (jsonData.success) {
        localStorage.removeItem("finalTextAnswer");
        localStorage.removeItem("FinalQuizQuestions");
        localStorage.removeItem("FinalEmailAnswer");
        localStorage.removeItem("FinalAssessmentTimer");
        localStorage.removeItem("selectedOptions");

        if (fileData) {
          const audioDAta = await fetch(`http://172.20.1.203:4000/final/submitAudio/${emp_id}/${comp_id}`,
            {
              method: "POST",
              body: formData
            }
          );
          const audioDataJson = await audioDAta.json();
          // console.log(audioDataJson);
          if (audioDataJson.success === false) {
            return false
          }

        }
        // const updateNotify = await fetch(
        //   `${baseUrl}/superAdmin/updateNotify/${emp_id}`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ comp_id: comp_id, module_id: moduleId }),
        //   }
        // );

        // const jsonData = await updateNotify.json();

        // if (!jsonData.success) {
        //   alert("Unable to update");
        // }
        setScoreValue(true)
        return alert("Your Answer has been submitted");
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

    updatePreviousTabHidden(selectedFinalTabIndex);
  }, [selectedFinalTabIndex, currentQuestionIndex, mcqQuestions.length, emailQuestions.length]);

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
      <Box className="assesment-wrapper-fa">
        <Box>
          <Box className="assesment-inner-fa">
            <Box className="assesment-tab-sec-fa">
              <Box className="tab-header-fa">
                {isLargeScreen ? renderTabFullButtons() : renderTabButtons()}
              </Box>
              <Container>
                <Box className="tab-body-fa">
                  <CustomTabPanel value={selectedFinalTabIndex} index={0} className="tab-body-inner-fa">
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ flex: "1" }}>
                        <Box className="assessment-question-wrapper-fa">
                          <Box className="question-heading-wrapper-fa">
                            <Typography component="h4">
                              MCQ Questions
                            </Typography>
                          </Box>
                          <Grid container spacing={2} className="question-wrapper-fa">
                            <Grid item xs={8} className="max-col-fa">
                              <Box className="assessment-left-sec-fa">
                                {renderQuestions()}
                                <Box mt={2}>
                                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                                   {!previousTabHidden &&(<Button onClick={handlePrevious} variant="outlined"className="btn-secondary" >
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
                            <Grid item xs={4} className="max-col-fa">
                              <Box sx={{ flex: "1", textAlign: "right" }}>
                                {renderQuestionBoxes()}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={selectedFinalTabIndex} index={1} className="tab-body-inner-fa">
                    <Box className="assessment-question-wrapper-fa">
                      <Box className="question-heading-wrapper-fa">
                        <Typography component="h4">
                          Email Questions
                        </Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-fa">
                        <Grid item xs={8} className="max-col-fa">
                          <Box>
                            <Box className="mcq-question-wrapper-fa">
                              <Box className="mcq-question-header-fa">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-fa">
                                <Typography variant="h5">{emailQuestions[0]?.topic}</Typography>
                                <Box className="email-wrapper-fa">
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
                  <CustomTabPanel value={selectedFinalTabIndex} index={2} className="tab-body-inner-fa">
                    <Box className="assessment-question-wrapper-fa">
                      <Box className="question-heading-wrapper-fa">
                        <Typography component="h4"> Free Text Questions</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-fa">
                        <Grid item xs={8} className="max-col-fa">
                          <Box>
                            <Box className="mcq-question-wrapper-fa">
                              <Box className="mcq-question-header-fa">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-fa">
                                <Typography variant="h5">{textQuestions[0]?.topic}</Typography>
                                <Box className="text-wrapper-fa">
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
                                {oralQuestions.length <= 0 ? ( // Check if it's the last MCQ question
                                  <Button onClick={handleSubmit}variant="contained"
                                    className="btn-primary" >
                                    Submit
                                  </Button>
                                ) : (
                                  <Button onClick={handleNext}variant="contained" className="btn-primary" >
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
                  {oralQuestions.length > 0 && (<CustomTabPanel value={selectedFinalTabIndex} index={3} className="tab-body-inner-fa">
                    <Box className="assessment-question-wrapper-fa">
                      <Box className="question-heading-wrapper-fa">
                        <Typography component="h4">Oral Communication</Typography>
                      </Box>
                      <Grid container spacing={2} className="question-wrapper-fa">
                        <Grid item xs={8} className="max-col-fa">
                          <Box>
                            <Box className="mcq-question-wrapper-fa">
                              <Box className="mcq-question-header-fa">
                                <Typography variant="h5">Question 1</Typography>
                              </Box>
                              <Box className="question-card-body-fa">
                                <Typography variant="h6">
                                  {oralQuestions[0]?.topic}
                                </Typography>
                              </Box>
                            </Box>
                            <Box mt={2}>
                              <Stack direction="row" spacing={2}justifyContent="flex-end">
                               {!previousTabHidden &&(<Button onClick={handlePrevious}variant="outlined" className="btn-secondary">
                                    Previous
                                  </Button>)}
                                <Button onClick={handleSubmit} variant="contained"className="btn-primary">
                                  Submit
                                </Button>
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={4} className="max-col-fa">
                          <Box className="record-warpper-fa">
                            <Box className="mcq-question-header-fa">
                              <Typography variant="h5">Record your answer</Typography>
                            </Box>
                            <Box onClick={handleOralBox}>
                              <RecordView />
                            </Box>
                            <Box className="choose-audio-wrapper">
                              <Typography variant="h5">Submit Your Audio file Here :-</Typography>
                     
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

export default FinalAssessment;



// import React from "react";
// import { Box, Container, Tabs, Tab, Typography, Button, Stack, ListItemButton, ListItemText, InputBase, InputLabel, TextField, FormControl, Grid } from "@mui/material";
// import Timer from "../../../components/timer/timer"
// import { alpha, styled } from "@mui/material/styles";
// import PropTypes from "prop-types";
// import "./finalAssessment.css";
// import { ListItemDecorator, List, ListItem, RadioGroup, Radio, Input, Textarea } from "@mui/joy";
// import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import RecordView from "../../Record/Record";
// const baseUrl = process.env.REACT_APP_BASE_URL || "http://172.20.1.203:4000"

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
//     <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

// const FinalAssesment = () => {
//   const [mcqQuestions, setMcqQuestions] = useState([]);
//   const [emailQuestions, setEmailQuestions] = useState([]);
//   const [textQuestions, setTextQuestions] = useState([]);
//   const [oralQuestions, setOralQuestions] = useState([]);
//   const [currentSetData, setCurrentSetData] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [mcqQuestionIndex, setMcqQuestionIndex] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [mcqOutOff, setMcqOutOff] = useState(0);
//   const [fileData, setFileData] = useState()


//   const [emailAnswer, setEmailAnswer] = useState(
//     localStorage.getItem("emailAnswer") || ""
//   );
//   const [textAnswer, setTextAnswer] = useState(
//     localStorage.getItem("textAnswers") || ""
//   );
//   const courseId  = 1
//   console.log("courseId",courseId);
//   const [courseIdData, setCourseIdData] = useState(courseId)
//   const [scoreValue, setScoreValue] = useState(false)
//   const emp_id = localStorage.getItem("UserId")
//   const comp_id = localStorage.getItem("UserCompId")

//   const navigate = useNavigate()

//   const [value, setValue] = useState(
//     parseInt(localStorage.getItem("activeTab")) || 0
//   );

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//     localStorage.setItem("activeTab", newValue); // Store active tab index
//   };
//   const token = localStorage.getItem("UserCourseToken")
//   useEffect(() => {
//     if (!token) {
//       navigate('/')
//     }
//   }, [])

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
//   const handleFileUpload = async (event) => {

//     const file = event.target.files[0];


//     setFileData(file)
//     console.log("file", file);
//     // setFile(file)

//   };
//   useEffect(() => {
//     // Check if questions data is stored in localStorage
//     const storedQuestions = localStorage.getItem("FinalQuizQuestions");

//     if (storedQuestions) {
//       // If questions data is found in localStorage, parse and set it
//       const parsedQuestions = JSON.parse(storedQuestions);
//       setMcqQuestions(parsedQuestions.mcqQuestions);
//       setEmailQuestions(parsedQuestions.emailQuestions);
//       setTextQuestions(parsedQuestions.textQuestions);
//       setOralQuestions(parsedQuestions.oralQuestions)
//       setCurrentSetData(parsedQuestions.mcqQuestions);
//       setCurrentQuestionIndex(parsedQuestions.currentQuestionIndex);
//       setMcqQuestionIndex(parsedQuestions.mcqQuestionIndex);
//       setSelectedOptions(parsedQuestions.selectedOptions);


//     } else {
//       // Fetch quiz data from your API
//       fetch(
//         `${baseUrl}/superAdmin/randomFinalAssementQuestions/${comp_id}/${courseId}`
//       )
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("data", data);
//           // Filter questions based on different categories
//           // const mcqQuestions = data.data.MCQ || [];
//           // const emailQuestions = data.data.Email || [];
//           // const textQuestions = data.data.Text || [];

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
//           const randomSetOralQuestions =
//             data.data[randomSet]?.filter(
//               (question) => question.category === "Audio"
//             ) || [];
//           setOralQuestions(randomSetOralQuestions)
//           // Choose which category to set as current questions (e.g., MCQ)
//           setCurrentSetData(randomSetMcqQuestions);

//           // Retrieve selected options from localStorage
//           const savedSelectedOptions = JSON.parse(
//             localStorage.getItem("selectedOptions")
//           );
//           if (savedSelectedOptions) {
//             setSelectedOptions(savedSelectedOptions);
//           }

//           // Store fetched questions data in localStorage
//           localStorage.setItem(
//             "FinalQuizQuestions",
//             JSON.stringify({
//               mcqQuestions: randomSetMcqQuestions,
//               emailQuestions: randomSetEmailQuestions,
//               textQuestions: randomSetTextQuestions,
//               oralQuestions: randomSetOralQuestions,
//               currentQuestionIndex: 0,
//               mcqQuestionIndex: 0,
//               selectedOptions: savedSelectedOptions || [],
//               quizSubmitted: false,

//             })
//           );
//         })
//         .catch((error) => console.error("Error fetching quiz data:", error));
//     }
//   }, []);

//   // Reset timer when courseId changes

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
//     } else if (value === 2) {
//       setValue(3); // Switch to the next tab (Free Text Writing)
//     }
//     else {
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
//     } else if (value === 3) {
//       if (currentQuestionIndex === 0) {
//         setValue(2);
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
//     const savedSelectedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
//     if (savedSelectedOptions) {
//       setSelectedOptions(savedSelectedOptions);
//     }
//   }, []);

//   const handleOptionSelect = (index, selectedOption) => {
//     setSelectedOptions((prevSelectedOptions) => {
//       const updatedSelectedOptions = [...prevSelectedOptions];
//       updatedSelectedOptions[index] = selectedOption;
//       localStorage.setItem(
//         "selectedOptions",
//         JSON.stringify(updatedSelectedOptions)
//       );
//       return updatedSelectedOptions;
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
//             className={`question-box ${selectedOptions[index] ? "selected" : ""
//               }`}
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
//       console.log("null text");
//       return null;
//     }

//     return (
//       <div className="question-box-container">
//         {textQuestions?.map((question, index) => (
//           <div key={index} className={`question-box ${selectedOptions[index] ? "selected" : ""}`}
//             onClick={() => handleQuestionClick(index)}>
//             Q{index + 1}
//           </div>
//         ))}
//       </div>
//     );
//   };
//   console.log("oralQuestions", oralQuestions);
//   const renderOralQuestionBoxes = () => {
//     if (!oralQuestions || oralQuestions.length === 0) {
//       console.log("null");
//       return null;
//     }

//     return (
//       <div className="question-box-container">
//         {oralQuestions?.map((question, index) => (
//           <div key={index} className={`question-box ${selectedOptions[index] ? "selected" : ""}`}
//             onClick={() => handleQuestionClick(index)}>
//             Q{index + 1}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderEmailQuestionBoxes = () => {
//     if (!emailQuestions || emailQuestions.length === 0) {
//       console.log("null email");
//       return null;
//     }

//     return (
//       <div className="question-box-container">
//         {console.log("emailQuestions", emailQuestions)}
//         {emailQuestions?.map((question, index) => (
//           <div key={index} onClick={() => handleQuestionClick(index)}
//             className={`question-box ${selectedOptions[index] ? "selected" : ""
//               }`}>
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
//                 value={selectedOptions[currentQuestionIndex + index] || ""}
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
//   console.log("scoreValue", scoreValue)
//   if (scoreValue === true) {
//     navigate('/course')
//   }
//   const handleSubmit = async () => {
//     const allQuestions = [...mcqQuestions, ...textQuestions, ...emailQuestions, ...oralQuestions];
//     console.log("allQuestions", allQuestions);
//     if (!quizSubmitted) {
//       const correctAnswers = currentSetData?.map((question, index) => ({
//         questionIndex: index,
//         correctAnswer: question.correctAnswer,
//       }));

//       const score = Object.entries(selectedOptions).reduce(
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

//       console.log("score", score);
//       console.log("maxScore", maxScore);
//       const formData = new FormData();
//       formData.append('file', fileData);




//       // Proceed with API call
//       const fetchData = await fetch(
//         `${baseUrl}/superAdmin/finalAssesmentAnswerByEmployee/${emp_id}/${courseId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mcq: allQuestions,
//             mcq_selectedAnswer: selectedOptions,
//             email_answer: emailAnswer,
//             text_answer: textAnswer,



//             mcq_score: score * 2,
//           }),
//         }
//       );

//       const jsonData = await fetchData.json();
//       if (jsonData.success) {
        
//         const audioDAta = await fetch(
//           `${baseUrl}/superAdmin/finalAssesmentAudioAnswer/${emp_id}/${courseId}`,
//           {
//             method: "POST",
//             // Omit the 'content-type' header because FormData automatically sets it
//             body: formData
//           }
//         );

//         const audioDataJson = await audioDAta.json();
//         console.log(audioDataJson);
//         if (audioDataJson.success === false) {
//           return false
//         }
//         localStorage.removeItem("textAnswers");
//         localStorage.removeItem("FinalQuizQuestions");
//         localStorage.removeItem("emailAnswer");
//         localStorage.removeItem("timer");
//         localStorage.removeItem("selectedOptions");
//         localStorage.removeItem("activeTab");
        

//         setScoreValue(true)
//         return alert("Your Answer has been submitted");
        

//       }
//       return alert(jsonData.message);
//     }
//   };

//   return (
//     <>
    
//     <Box className="assesment-wrapper-fa">
//       <Box>
//         <Box className="assesment-inner-fa">
//           <Container>
//             <Box className="assesment-top-heading-fa">
//               <Typography component="h3">
//                 Steps to Guide the Process before Assesssment
//               </Typography>
//             </Box>
//           </Container>
//           <Box sx={{ width: "100%" }} className="assesment-tab-sec-fa">
//             <Box className="tab-header-fa">
//               <Tabs
//                 value={value}
//                 onChange={handleChange}
//                 aria-label="basic tabs example"
//               >
//                 <Tab label="MCQ Questions" />
//                 <Tab label="Email Questions" />
//                 <Tab label="Free Text Writing" />
//                 <Tab label="Oral Communication" />
//               </Tabs>
//             </Box>
//             <Container maxWidth="lg">
//               <Box className="tab-body-fa">
//                 <CustomTabPanel
//                   value={value}
//                   index={0}
//                   className="tab-body-inner-fa"
//                 >
//                   <Box sx={{ display: "flex" }}>
//                     <Box sx={{ flex: "1" }}>
//                       {/* <Box className="assessment-question-wrapper"> */}
//                       <Box className="assessment-question-wrapper-fa">
//                         <Grid container spacing={2}>
//                           <Grid item xs={8}>
//                             <Box className="assessment-left-sec-fa">
//                               {/* Time duration and end test button */}
//                               <Box className="time-duration-wrapper-fa">
//                                 <Box className="time-duration-item-fa">
//                                   <Typography component="strong">
//                                     {/* <AccessAlarmIcon /> {formatTime(remainingTime)} */}
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                               {/* Question heading */}
//                               <Box className="question-heading-wrapper-fa">
//                                 <Typography component="h4">
//                                   MCQ Questions
//                                 </Typography>
//                               </Box>
//                               {/* Render MCQ questions */}
//                               {renderQuestions()}
//                               {/* Navigation buttons */}
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
//                   className="tab-body-inner-fa"
//                 >
//                   <Box className="assesment-question-wrapper-fa">
//                     <Grid container spacing={2}>
//                       <Grid item xs={8}>
//                           <Box className="">
//                             <Box>
//                               <Box className="time-duration-wrapper-fa">
//                                 <Box className="time-duration-item-fa">
//                                   <Typography component="strong">
//                                     {/* <AccessAlarmIcon /> {formatTime(remainingTime)} */}
//                                   </Typography>
//                                 </Box>
//                               </Box>
//                             </Box>
//                             <Box className="question-heading-wrapper-fa">
//                               <Typography component="h4">Email Questions</Typography>
//                             </Box>
//                             <Box className="question-card-fa">
//                               <Box className="question-card-header-fa">
//                                 <Typography component="p">Question 1</Typography>
//                               </Box>
//                               <Box className="question-card-body-fa">
//                                 <Typography component="strong">
//                                   {emailQuestions[0]?.topic}
//                                 </Typography>
//                                 <Box className="qustion-wrapper-fa">
//                                   <Textarea
//                                     name="emailAnswer"
//                                     placeholder="Type your Email Answer here…"
//                                     variant="outlined"
//                                     minRows={5}
//                                     value={emailAnswer}
//                                     onChange={handleEmailAnswerChange}
//                                   />
//                                 </Box>
//                               </Box>
//                             </Box>
//                             <Box mt={2}>
//                               <Stack
//                                 direction="row"
//                                 spacing={2}
//                                 justifyContent="flex-end"
//                               >
//                                 <Button
//                                   onClick={handlePrevious}
//                                   variant="outlined"
//                                   className="btn-secondary"
//                                 >
//                                   Previous
//                                 </Button>
//                                 <Button
//                                   onClick={handleNext}
//                                   variant="contained"
//                                   className="btn-primary"
//                                 >
//                                   Next
//                                 </Button>
//                               </Stack>
//                             </Box>
//                           </Box>
//                         </Grid>
//                         <Grid item xs={4}>
//                           {renderEmailQuestionBoxes()}
//                         </Grid>
//                       </Grid>
//                   </Box>
//                 </CustomTabPanel>
//                 <CustomTabPanel
//                   value={value}
//                   index={2}
//                   className="tab-body-inner-fa"
//                 >
//                   <Box className="assesment-question-wrapper-fa">
//                   <Grid container spacing={2}>
//                       <Grid item xs={8}>
//                     <Box className="">
//                       <Box>
//                         <Box className="time-duration-wrapper-fa">
//                           <Box className="time-duration-item-fa">
//                             <Typography component="strong">
//                               {/* <AccessAlarmIcon /> {formatTime(remainingTime)} */}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Box className="question-heading-wrapper-fa">
//                         <Typography component="h4">
//                           Free Text Questions
//                         </Typography>
//                       </Box>
//                       <Box className="question-card-fa">
//                         <Box className="question-card-header-fa">
//                           <Typography component="p">Question 1</Typography>
//                         </Box>
//                         <Box className="question-card-body-fa">
//                           <Typography component="strong">
//                             {textQuestions[0]?.topic}
//                           </Typography>
//                           <Box className="qustion-wrapper-fa">
//                             <Textarea
//                               name="textAnswer"
//                               placeholder="Type your Free Text here…"
//                               variant="outlined"
//                               minRows={5}
//                               value={textAnswer}
//                               onChange={handleTextAnswerChange}
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
//                                     onClick={handleNext}
//                                     variant="contained"
//                                     className="btn-primary"
//                                   >
//                                     Next
//                                   </Button>
//                         </Stack>
//                       </Box>
//                     </Box>
//                     </Grid>
//                       <Grid item xs={4}>
//                         {renderTextQuestionBoxes()}

//                       </Grid>
//                     </Grid>
//                   </Box>
//                 </CustomTabPanel>
//                 <CustomTabPanel
//                   value={value}
//                   index={3}
//                   className="tab-body-inner-fa"
//                 >
//                   <Box className="assesment-question-wrapper-fa">
//                   <Grid container spacing={2}>
//                       <Grid item xs={8}>
//                     <Box className="">
//                       <Box>
//                         <Box className="time-duration-wrapper-fa">
//                           <Box className="time-duration-item-fa">
//                             <Typography component="strong">
//                               {/* <AccessAlarmIcon /> {formatTime(remainingTime)} */}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </Box>
//                       <Box className="question-heading-wrapper-fa">
//                         <Typography component="h4">
//                           Oral Communication
//                         </Typography>
//                       </Box>
//                       <Box className="question-card-fa">
//                         <Box className="question-card-header-fa">
//                           <Typography component="p">Question 1</Typography>
//                         </Box>
//                         <Box className="question-card-body-fa">
//                           <Typography component="strong">
//                             {oralQuestions[0]?.topic}
//                           </Typography>

//                         </Box>
//                         <h3>Record your answer</h3>
//                         <Box>
//                           <RecordView />
//                         </Box>
//                         <Box p={2}>
//                          <h4> Submit Your Audio file Here :-</h4>
//                           <input type="file" onChange={handleFileUpload} />
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
//                     </Grid>
//                       <Grid item xs={4}>
//                         {renderOralQuestionBoxes()}

//                       </Grid>
//                     </Grid>

//                   </Box>
//                 </CustomTabPanel>

//               </Box>
//             </Container>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//     </>
//   );
// };

// export default FinalAssesment;