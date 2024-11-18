import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import {Box,Typography,AppBar,Toolbar,Menu,Tooltip,MenuItem,Container,Avatar,Link,} from "@mui/material";
import Logo from "../../Images/logo_lms.svg";
import { useNavigate, useLocation } from "react-router-dom";
import image from '../../Images/user.png';
import "./UserHeader.scss";
import { FaBars, FaTimes } from 'react-icons/fa'; 
import useApiHelper from "../../useApiHelper";
import ErrorPage from "../../ErrorPage";
const pages = ["Courses", "Evaluate", "Events"];
const settings = ["Logout"];

const UserHeader = ({ setLoggedIn }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const isRefreshing = useRef(false);
  const [userName, setUserName] = useState('');
  const {fetchData,postData,error} = useApiHelper() 
  const LoginId = localStorage.getItem("UserLoginId");
  const userId = localStorage.getItem("UserId");
  const [headerPage, setHeaderPage] = useState(localStorage.getItem('headerMenu')||pages[0]);

  const logout = async () => {
    try {
      const response = await postData(`auth/logOutUser/${LoginId}`);
      if (response.success) {
        localStorage.clear();
        navigate("/");
        setLoggedIn(false);
      }
    } catch (error) {
      console.log("Internal server Error", error);
    }
  };

  const getNameApi = async () => {
    try {
      const response = await fetchData(`employee/getName/${userId}`);
      if (!response.success) {
        console.error("Unable to get the name")
        return
      }
      setUserName(response?.data);
    } catch (error) {
      console.warn("Error Occurred while fetching name of user");
    }
  };
  
  useEffect(()=>{
    if(headerPage){
      if (headerPage === 'Evaluate') {
        navigate('NonGradedEvaluation');
      } else if (headerPage == 'Events') {
        console.log("hello");
        navigate("/Events");
      } else {
        navigate("/course");
      }
    }
    navigate()
  },[headerPage])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const handleWindowClose = async (event) => {
      if (!isRefreshing.current) {
        // await logout();
      }
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  const handleRefresh = () => {
    isRefreshing.current = true;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, []);

  useEffect(() => {
    getNameApi();
  }, []);

  const handleHeaderPage = (item) => {
    localStorage.setItem('headerMenu', item);
    setHeaderPage(item);
  };

  const handleClick = (page) => {
    setIsOpen(false)
    if (page === 'Evaluate') {
      handleHeaderPage(page)
      navigate('NonGradedEvaluation');
    } else if (page === 'Events') {
      handleHeaderPage(page)
      navigate("/Events");
    } else {
      handleHeaderPage(page)
      navigate("/course");
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (error) {
    return <ErrorPage error={error}/>
  }


  return (
    <AppBar position="static" className="header-wrapper" >
      <Container maxWidth="xl">
        <Toolbar disableGutters className="header-inner-wr">
          <Link className="header-logo" to="#app-bar-with-responsive-menu">
            <img src={Logo} alt="Logo" />
          </Link>
          <Box>
              <button className="toggle-button" onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
              </button>
              <Box  className={`menu ${isOpen ? 'show-menu' : ''}`}>
                <Box
                  sx={{display: { xs: "none", md: "flex" }}}
                  className="menu-wrapper"
                >
                  {pages?.map((page, index) => (
                    <MenuItem
                      key={index}
                      className={headerPage === page ? `selected-${page}` : ''}
                      onClick={() => handleClick(page)}
                      sx={{ display: "block" }} >
                      {page}
                    </MenuItem>
                  ))}
                </Box>
              </Box>
          </Box>
         
          <Box  className="header-search-wrapper">
            <Box marginRight={2}>
              <Typography variant="h4" className="profileName">
                <span>Welcome</span>, {userName}
              </Typography>
            </Box>
            <Box className="logout-sec">
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={image} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings?.map((setting, index) => (
                  <MenuItem key={index} onClick={logout}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UserHeader;
