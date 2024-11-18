

import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./Record.scss";

const RecordView = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    let intervalId;
    if (isActive && !recordingStopped) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            stopRecording();
            setIsActive(false);
            setRecordingStopped(true);
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive, recordingStopped]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setMediaBlobUrl(audioUrl);
      audioChunksRef.current = [];
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handleStartStop = () => {
    if (!isActive) {
      startRecording();
      setIsActive(true);
      setSeconds(0);
      setRecordingStopped(false);
    } else {
      stopRecording();
      setIsActive(false);
      setRecordingStopped(true);
    }
  };

  const handleClear = () => {
    setIsActive(false);
    setSeconds(0);
    setRecordingStopped(false);
    setMediaBlobUrl(null);
  };

  const formatSeconds = (seconds) => String(seconds).padStart(2, "0");

  return (
    <Box className="record-answer">
      <Box className="record-status">
        <Typography variant="h4">
          {isActive ? "Recording..." : recordingStopped ? "Stopped" : "Ready"}
        </Typography>
      </Box>
      {/* <Box className="record-control"> */}
{/* //         <Box className="record-second">{String(second).padStart(2, "0")}</Box>
//         <Button */}
{/* //           className="start-stop-btn"
//           onClick={() => {
//             if (!isActive) {
//               startRecording();
//             } else {
//               stopRecording();
//               stopTimer();
//             }
//           }}
//           style={{ backgroundColor: isActive ? "#12AD46" : "#E7242A" }}
//         >
//           {isActive ? "Stop" : "Start"}
//         </Button>
//         <Button className="clear-btn" onClick={stopTimer}>
//           Clear
//         </Button>
//       </Box> */}
      <Box className="record-control">
        <Box className="record-second">{formatSeconds(seconds)}</Box>
        <Button
          className="start-stop-btn"
          onClick={handleStartStop}
          style={{ backgroundColor: isActive ?"#12AD46" :"#E7242A" }}
        >
          {isActive ? "Stop" : "Start"}
        </Button>
        <Button className="clear-btn" onClick={handleClear}>
          Clear
        </Button>
      </Box>
      <Box className="record-media-wrapper">
        {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
      </Box>
      {recordingStopped && mediaBlobUrl && (
        <Box className="download-btn-wrapper">
          <a
            href={mediaBlobUrl}
            className="download-audio-btn"
            download="recording.wav"
          >
            Download
          </a>
        </Box>
      )}
    </Box>
  );
};

export default RecordView;

