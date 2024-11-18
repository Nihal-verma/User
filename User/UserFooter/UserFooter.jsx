import React from 'react';
import { Box, Container, Grid, List, ListItem, Typography, Link, ListItemIcon, Stack} from '@mui/material';
import style from "./UserFooter.module.scss"
import logo from "../../Images/footer-logo.svg"
import {ReactComponent as Call} from '../../Images/call.svg';
import {ReactComponent as Mail} from '../../Images/mail.svg';


const UserFooter = () => {

  return (
    <Box className={style.footerWrapper}>
        <Container maxWidth="xl">
            <Box className={style.footerInner}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={4}>
                        <Box className={style.footerLogo}>
                            <img src={logo} alt="logo" />
                        </Box>
                        <Box mt={2}>
                            <Typography component="p" className={style.footer_text}> Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box className={`${style.footer_heading_wrapper}`}>
                            <Box className={`${style.footer_heading} `}>
                                <Typography component="h4" variant='h4'>Quick Links</Typography>
                                <List>
                                    <ListItem ps={0}>
                                        <Link href="#">About</Link>
                                    </ListItem>
                                    <ListItem ps={0}>
                                        <Link href="#">Blog</Link>
                                    </ListItem>
                                    <ListItem ps={0}>
                                        <Link href="#">Course</Link>
                                    </ListItem>
                                    <ListItem ps={0}>
                                        <Link href="#">Contact</Link>
                                    </ListItem>
                                </List>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        `<Box className={`${style.footer_heading} `}>
                            <Typography component="h4" variant='h4'>Contact us</Typography>
                            <List>
                                <ListItem ps={0}>
                                    <ListItemIcon className={style.icon_box}>
                                        <Call />
                                    </ListItemIcon>
                                    <Link href="#">(209) 555-0104</Link>
                                </ListItem>
                                <ListItem ps={0}>
                                    <ListItemIcon className={style.icon_box}>
                                        <Mail />
                                    </ListItemIcon>
                                    <Link href="#">michelle.rivera@example.com</Link>
                                </ListItem>
                            </List>
                        </Box>`
                    </Grid>
                </Grid>
            </Box>
            <hr/>
            <Box className={style.footerBottom}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                    <Typography className={style.copyRigth}>Copyright 2023 | All Rights Reserved</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2} className={style.stack_end}>
                            <Link href="#">Terms & conditions</Link>
                            <Typography className={style.sapretor}>|</Typography>
                            <Link href="#">Privacy Policy</Link>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </Box>
  );
};

export default UserFooter;