import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Container, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import './index.scss'
import useApiHelper from '../../useApiHelper';
import ErrorPage from '../../ErrorPage';


export default function Events() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate()
  const comp_id = localStorage.getItem("UserCompId")
  const token = localStorage.getItem("UserToken")
  const { fetchData, error } = useApiHelper()

  const data = async () => {
    try {
      const response = await fetchData(`events/get/${comp_id}`);
      if (!response.success) {
        console.error("Unable to get Data")
        return
      }
      const dataWithIndex = response?.data?.map((item, index) => {
        const [dd, mm, yyyy] = item?.split('/');
        const eventDate = new Date(`${yyyy}-${mm}-${dd}`);
        return {
          id: index + 1,
          date: item,
          sno: index + 1,
          status: eventDate > new Date() ? 'on' : 'off'
        };
      });
      setRows(dataWithIndex);
    } catch (error) {
      console.warn("Internal Error", error);
    }
  };

  useEffect(() => {
    data()
    if (!token) {
      navigate('/')
    }
  }, [])



  if (error) {
    <ErrorPage error={error} />
  }

  return (
    <Box className="event-section">
      <Container maxWidth="xl">
        <Box className="event-top-heading">
          <Typography component="h2">
            Company Events
          </Typography>
        </Box>
        {rows?.length > 0 ? (
          <Box className="coursetable">
            <TableContainer component={Paper} className="table-wrapper">
              <Table aria-label="simple table">
                <TableHead className="table-header">
                  <TableRow>
                    <TableCell component="th" align="center">S. No.</TableCell>
                    <TableCell component="th">Event Dates</TableCell>
                    <TableCell component="th" align="center">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="table-body">
                  {rows?.map((row, index) => (
                    <TableRow
                      key={index}
                    >
                      <TableCell component="td" align="center">{index + 1}</TableCell>
                      <TableCell component="td">
                        <Link className="session-image-wrapper">
                          {row?.date}
                        </Link>
                      </TableCell>
                      <TableCell component="td" align="center">
                        <div style={{ display: "inline" }} className={row?.status === "off" ? "secondary-btn" : "primary-btn"}>
                          {row.status === "off" ? "Completed" : "Upcominig"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (<Box>
          <Typography varient='h1'>
            No Events Found
          </Typography>
        </Box>)}

      </Container>
    </Box>
  )
}
