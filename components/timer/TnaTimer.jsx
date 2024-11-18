import React, { useEffect, useState } from "react";
import "./timer.css";
import { Typography } from "@mui/material";
const TnaTimer = ({setTimeUp}) => {
    const initialTime = parseInt(localStorage.getItem("TnaTimer")) || 3600; // Initial time in seconds (3600 seconds = 1 hour)
    const [time, setTime] = useState(initialTime);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        localStorage.setItem("TnaTimer", time);
    }, [time]);
    if(time ==0){
        console.log("hello");
       return setTimeUp(true)
    }
    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    return (
        <div>         
            <div className="starttimer">Start Timer <Typography component={'h5'}> {formatTime(time)} </Typography> </div>
        </div>
    );
};
export default TnaTimer;