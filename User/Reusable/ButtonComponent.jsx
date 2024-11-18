import React from 'react';
import { Box, Button } from '@mui/material';

const ButtonComponent = (props) => {
  const { buttonText,type, buttonVariant, startIcon, endIcon, customStyle, onClick, buttonStyle,buttonClass} = props;
  return (
    <Box className='btn-wrapper' sx={{ display: 'inline-block', ...customStyle }}>
      <Button className={buttonClass} sx={{...buttonStyle}} type={type} variant={buttonVariant} startIcon={startIcon} endIcon={endIcon} onClick={onClick} >
        {buttonText}
      </Button>
    </Box>
  );
};

export default ButtonComponent;