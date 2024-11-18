import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {Box,Button,Container,Stack,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,} from "@mui/material";
import "./SingleVideo.scss";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate, useParams } from "react-router-dom";
import useApiHelper from '../../useApiHelper'; // Import your custom hook
import ErrorPage from "../../ErrorPage";
const baseURL = process.env.REACT_APP_BASE_URL || 'http://172.20.1.203:4000'


const SingleVideo = () => {
  const playerRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");
  const [module, setModule] = useState({});
  const [videoPath, setVideoPath] = useState("");
  const { moduleId } = useParams();
  const [lessonId, setLessonId] = useState();
  const [videoDuration, setVideoDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [videoProgress, setVideoProgress] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [videoData, setVideoData] = useState()
  const [currentTimerId, setCurrentTimerId] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [videoTimers, setVideoTimers] = useState({});
  const [nonGradedLessonIDs,setNonGradedLessonIDs] = useState([])
  const [allowed,setAllowed] = useState()
  const comp_id = localStorage.getItem("UserCompId")
  const emp_id = localStorage.getItem("UserId")
  const  { fetchData,fetchDataWithoutAuth, postData, error } = useApiHelper()
  const token = localStorage.getItem("UserToken")
 
  const resetFunction = ()=>{
  localStorage.removeItem("quizQuestions")
  localStorage.removeItem("textAnswers")
  localStorage.removeItem("timer")
  localStorage.removeItem("nonGradedtimer")
  localStorage.removeItem("emailAnswer")
  localStorage.removeItem("activeTab")
  localStorage.removeItem("selectedTabIndex")
  localStorage.removeItem("selectedOptions")
  }

  const fetchWatchedVideos = async () => {
    try {
      const response = await fetchData(`video/getVideoTime/${emp_id}`);
      // console.log("response",response);
      if(response.success){
        setVideoTimers(response?.data)
        return;
      }
       console.warn(response?.message)
       return
    } catch (error) {
      console.error("Error fetching watched videos:", error);
    }
  };
  
  const checkTotalScore = async () => {
    try {
      const response = await fetch(`${baseURL}/employee/checkTotalScore/${emp_id}/${moduleId}`);
      const jsonData = await response.json()
      if(jsonData.success){
       return setAllowed(jsonData?.data)
      }
      return console.warn(jsonData?.message)
    } catch (error) {
      console.error("Error fetching watched videos:", error);
    }
  };

  const playerConfig = {
    file: {
      attributes: {
        controlsList: "nodownload noplaybackrate", // Disable download control
      },
    },
  };

  const handlePlay = () => {setCurrentTimerId(setInterval(updateProgress, 1000));};

  const handlePause = () => {
    updateVideoTime()

    clearInterval(currentTimerId)
  };

  const updateProgress = () => {
      if (currentVideoId && lessonId) {
      const currentLesson = lessons?.find((lesson) => lesson?.lesson_id === lessonId);
      if (currentLesson) {
        const lessonsVideos = videos?.find((video) => video?.lesson_id === lessonId)?.videos;
        if (lessonsVideos) {
          const totalVideos = lessonsVideos?.length;
          setVideoTimers((prevTimers) => ({
            ...prevTimers,
            [lessonId]: {
              ...prevTimers[lessonId],
              [currentVideoId]: prevTimers[lessonId]?.[currentVideoId] ? prevTimers[lessonId][currentVideoId] + 1 : 1,
            },
          }));
          setPlayedSeconds((prevSeconds) => prevSeconds + 1);
        }
      }
    }
  };

  const fetchModuleData = async () => {
    try {
      const response = await fetchData(`module/getModuleNameById/${moduleId}`);
     if(!response.success){
      console.log("Unable to get Course data",response.message);
     }
     setModule(response?.data);
     
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchNonGradedLessonIds = async () => {
    try {
      const response = await fetchData(`nonGraded/getNonGradedLessonWise/${moduleId}`);
     if(response.success){
      setNonGradedLessonIDs(response?.data);
      return
     }
     console.log("Unable to get Course data",response?.message);

    } catch (error) {
      console.log("error", error);
    }
  };
 
  const hasAccessToAssessment = (lessonId, videoTimers, videoData) => {
    if (!videoTimers || Object.keys(videoTimers).length === 0) {
      console.error("Not a single video has been selected");
      return false;
    }
    if (!(lessonId in videoTimers)) {
      console.error(`Module ${lessonId} not found in videoTimers`);
      return false;
    }
    const watchedVideoIds = Object.keys(videoTimers[lessonId]);

    const lessonData = videoData?.find((data) => data?.lesson_id === parseInt(lessonId));
    if (lessonData) {
      const vidId = lessonData?.videoId;
      const lessonVideoIds = vidId?.map((v) => v?.toString());

      if (lessonVideoIds.length > 0 && watchedVideoIds.length > 0) {
        if (lessonVideoIds.every((videoId) => watchedVideoIds.includes(videoId))) {
          return true; // Return true if all videos are watched for the module
        } else {
          return false; // Return false if any video is not watched
        }
      } else {
        return false; // Return false if moduleVideoIds or watchedVideoIds are empty
      }
    } else {
      return false; // Return false if moduleData is not found
    }
  };

  const allLessonWatched = (videoTimers, videoData) => {
    if (!videoData || videoData.length === 0) {
      return false; // Return false if videoData is undefined or empty
    }
    const allLessonsIds = videoData?.map(data => data?.lesson_id);
    let watchedModuleIds = Object.keys(videoTimers);
    
    let watchedLessons = watchedModuleIds?.map((v)=>parseInt(v))
  
    return allLessonsIds?.every(lessonId => {
      if (!watchedLessons.includes(lessonId)) {
        return false;
      } else {
        // Get the module data for the current module ID
        const lessonData = videoData?.find(data => data?.lesson_id === lessonId);
        if (lessonData) {
          const moduleLessonIds = lessonData?.videoId?.map(id => id.toString());
          const watchedVideoIds = Object.keys(videoTimers[lessonId]);
          return moduleLessonIds.every(videoId => watchedVideoIds.includes(videoId));
        } else {
          return false;
        }
      }
    });
  };
  
  const fetchVideoData = async () => {
    try {
      const response = await fetchData(`video/getSessionWithVideo/${moduleId}`);

      if (response.success) {
        const videoResult = response?.data
        setVideoData(videoResult?.videoResult)
        setVideoPath(response?.path);
        const extractedVideos = response?.data?.videoResult?.map((item) => ({
          lesson_id: item?.lesson_id,
          videoId: item?.videoId,
          videos: item?.videos?.map((video) => ({ title: video, src: video })),
        }));
        setVideos(extractedVideos);
        setSelectedVideoSrc(extractedVideos[0]?.videos[0]?.src);
        const extractedLessons = response?.data?.result?.map((lesson) => ({
          lesson_id: lesson?.id,
          lesson_name: lesson?.lesson_name,
        }));
        setLessons(extractedLessons);
      } else {
        console.error("Failed to fetch video data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleVideoCompletion = () => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleStartNonGradedAssessment = async (lesson_id) => {
    updateVideoTime()
    if (!hasAccessToAssessment(lesson_id, videoTimers, videoData)) {
      alert("You need to watch all videos in this module before accessing the assessment.");
      return;
    }
    if (!lesson_id) {
      return alert("Select module by clicking on video of desired module");
    }
    try {
      const response = await fetchData(`nonGraded/getNonGraded/${moduleId}/${lesson_id}`);
      if (response.success) {
        navigate(`/NonGradedAssesment/${moduleId}/${lesson_id}`);
      } else {
        alert("No assessment is provided for this module");
        console.error("No assessment is provided for this module");
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleGradedAssessment = async () => {
    
    try {
      if (!allLessonWatched(videoTimers, videoData)) {
        alert("You need to watch all videos in all modules before accessing the assessment.");
        return;
      }
      const response = await fetchData(`graded/${moduleId}`)
      if (response.success) {
        updateVideoTime()
        navigate(`/GradedAssesment/${moduleId}`);
      } else {
        alert("No Graded Assessment is provided for this Module");
        console.error("No Graded Assessment is provided for this Module");
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const handleBack = () => {
    // updateVideoTime()
    navigate(-1);
  };

  const handleVideoClick = (lessonId, VideoName, videoSrc, videoId) => {
    setLessonId(lessonId)
    const newData = videoPath + videoSrc;
    // console.log("newData",newData);
    setSelectedVideoSrc(newData);
    setCurrentVideoId(videoId);
    setPlayedSeconds(0);
    clearInterval(currentTimerId);
    setCurrentTimerId(null);
    updateVideoTime();
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(videoProgress[videoSrc]);
      } else {
        console.log("Player or seekTo function is not available.");
      }
    } else {
      console.error("Player reference is not available.");
    }
  };

  const updateVideoTime = async () => {
    if(!lessonId||!currentVideoId){
      return false
    }
    try {
      const response = await postData(`video/videoTime/${moduleId}/${comp_id}/${emp_id}`,{
        lesson_id: lessonId,
        video_id: currentVideoId, 
        video_duration: videoDuration,
        video_watched: playedSeconds, 
      });
    } catch (error) {
      console.error('Error updating video time:', error.message);
    }
  };

  const handleGradedAssessmentClick = () => {
    if (!allowed) {
      alert('Reattempt not allowed till evaluation Or already scored above 70%');
      return;
    }
    handleGradedAssessment();
  };


  useEffect(()=>{
    fetchWatchedVideos()
    resetFunction()
    checkTotalScore()
    fetchNonGradedLessonIds()
    fetchVideoData();
    fetchModuleData();
  },[])

  useEffect(()=>{
    if(!token){
    navigate('/')
    }
  },[]);

  const navigate = useNavigate();
 
  if (error) {
    return <ErrorPage error={error}/>
  }

  return (

    <Box className="video-sec">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          mb={3}
        >
          <Box className="video-heading-wrapper">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box className="video-bradcome">
                <Typography component="h2">
                  Module :- {module?.module_name} 
                </Typography>
              </Box>
              <Box>
                <Button className="primary-btn"onClick={handleBack}>
                  Back
                </Button>
              </Box>
              
            </Stack>
          </Box>
        </Stack>
        <Box className="video-wrapper"> 
          <Box className="video-container">
            <Box>
              <ReactPlayer
                className={"video-player"}
                ref={playerRef}
                url={selectedVideoSrc}
                controls={true}
                config={playerConfig}
                playing={true}
                width={"100%"}
                height={"100%"}
                onPlay={handlePlay} // Call handlePlay when the video starts playing
                onPause={handlePause} // Call handlePause when the video is paused
                onDuration={(duration) => {
                  setVideoDuration(duration);
                  setVideoProgress((prevProgress) => ({
                    ...prevProgress,
                    [currentVideoId]: playedSeconds, // Store current video progress
                  }));
                }}
                onProgress={(progress) => {
                  // setPlayedSeconds(progress.playedSeconds);
                  setVideoProgress((prevProgress) => ({
                    ...prevProgress,
                    [selectedVideoSrc]: progress.playedSeconds,
                  }));
                }}
                onEnded={handleVideoCompletion} // Call when the video ends
              />

            </Box>
           
            <Box mt={2}>
              <Typography component="h6">Summary</Typography>
              <Typography component="h5">
                {module?.module_description}
              </Typography>
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                className="primary-btn"
                onClick={handleGradedAssessmentClick}
                disabled={!allLessonWatched(videoTimers, videoData)} // Disable until all modules are watched
              >
                Start Graded Assessment
              </Button>
            </Box>

          </Box>
          <Box className="video-sidebar">
            <TableContainer className="video-table-wrapper">
              <Table>
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell align="center">S.No</TableCell>
                    <TableCell>Lessons</TableCell>
                    <TableCell align="center" >Videos</TableCell>
                    <TableCell>Assessment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body">
                  {lessons?.map((lesson, indexing) => (
                    <TableRow key={lesson?.lesson_id}>
                      <TableCell align="center" >{indexing + 1}</TableCell>
                      <TableCell>{lesson?.lesson_name}</TableCell>
                      <TableCell>
                        <Stack direction={'row'} flexWrap={'wrap'} gap={1} justifyContent="center">
                          {videos
                            ?.filter((video) => video?.lesson_id === lesson?.lesson_id)
                            ?.map((videoGroup) =>
                              videoGroup?.videos?.map((videoItem, index) => (
                                <Button
                                  key={index}
                                  className="video-play-btn"
                                  onClick={() =>
                                    handleVideoClick(
                                      lesson?.lesson_id,
                                      videoItem?.title,
                                      videoItem?.src,
                                      videoGroup?.videoId[index] // Pass the corresponding video ID
                                    )
                                  }
                                  disabled={false} // Disable if needed
                                >
                                  <PlayArrowIcon/>
                                </Button>
                              ))
                            )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {nonGradedLessonIDs && nonGradedLessonIDs?.length > 0 && nonGradedLessonIDs.includes(lesson?.lesson_id) ? (
                          <Button
                            className="start-assessment-btn"
                            onClick={() => handleStartNonGradedAssessment(lesson?.lesson_id)}
                          >
                            Start
                          </Button>
                        ) : (
                          <Button
                            className="no-assessment-btn"
                            onClick={() => handleStartNonGradedAssessment(lesson?.lesson_id)}
                          >
                            No
                          </Button>
                        )}
                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>              
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SingleVideo;