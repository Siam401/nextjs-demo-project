import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

function TopBar() {
  const router = useRouter();

  return (
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        React App
      </Typography>
      <Button
        key="Simple"
        onClick={() => router.push('/simple')}
        sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
      >
        Simple
      </Button>
      <Button
        key="Complex"
        onClick={() => router.push('/complex')}
        sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
      >
        Complex
      </Button>
    </Toolbar>
  );
}

export default TopBar;