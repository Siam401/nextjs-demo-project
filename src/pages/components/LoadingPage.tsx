import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function LoadingPage() {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }
      }
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
