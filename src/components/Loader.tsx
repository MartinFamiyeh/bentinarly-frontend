import React from 'react';
import Logo from '../assets/icons/logo.svg';
import { Box } from '@mui/material';

interface LoaderProps {
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        animation: 'heartbeat 1.5s ease-in-out infinite',
        '@keyframes heartbeat': {
          '0%': {
            transform: 'scale(1)',
          },
          '14%': {
            transform: 'scale(1.3)',
          },
          '28%': {
            transform: 'scale(1)',
          },
          '42%': {
            transform: 'scale(1.3)',
          },
          '70%': {
            transform: 'scale(1)',
          }
        },
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Logo style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default Loader; 