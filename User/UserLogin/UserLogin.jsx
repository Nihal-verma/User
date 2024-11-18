import {Box,Button,FormControl,Grid,IconButton,InputAdornment,InputLabel,OutlinedInput,TextField,
  Typography,} from "@mui/material";
import React,{useState,useEffect} from "react";
import "./UserLogin.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logoImg from "../../Images/login-img.png"
import { useNavigate } from "react-router-dom";
import useApiHelper from "../../useApiHelper";
import ErrorPage from "../../ErrorPage";

const UserLogin = ({ setLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { postData, error } = useApiHelper();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      console.log("empty field");
      return;
    }

    const response = await postData("auth/loginUser", {
      email: email,
      password: password,
    });

    if (response.success) {
      localStorage.setItem("UserCompId", response.data.comp_Id);
      localStorage.setItem("UserId", response.data.emp_id);
      localStorage.setItem("UserLoginId", response.insertedId);
      localStorage.setItem("UserCourseToken", response.data.courseToken);
      localStorage.setItem("UserToken", response.data.token);
      setLoggedIn(true);
      navigate("/course");
    } else {
      console.log("fail");
      return alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("UserToken");
      if (token) {
        try {
          const response = await postData("auth/checkAuthentication", {
            token: token,
          });
          if (response.success) {
            setLoggedIn(true);
            return navigate("/course");
          } else {
            setLoggedIn(false);
            navigate("/");
          }
        } catch (error) {
          console.error("Error:", error);
          setLoggedIn(false);
        }
      }
    };
    fetchData();
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <Box className="user-login-container" onKeyDown={handleKeyDown}>
      <Box className="header-user">
        <Box className="logo-left">
          <Typography className="logo">Hybrid LMS</Typography>
        </Box>
      </Box>

      <Box className="user-login-container">
        <Box className="left-section">
          <img src={logoImg} alt="Logo" />
        </Box>
        <Box className="right-section">
          <Box className="right-login-container">
            <Typography className="login-title">Login to Your Account👋</Typography>
            <Box className="user-input-container">
              <Box mt={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Box>
              <Box mt={4}>
                <Grid item xs={12} md={6}>
                  <FormControl sx={{ width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
              </Box>
              <Box mt={4}>
                <Grid item xs={12} md={6}>
                  <Box className="sign-in-btn">
                    <Button variant="contained" onClick={handleSubmit}>
                      Sign In
                    </Button>
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLogin;
