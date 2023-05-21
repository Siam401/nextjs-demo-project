import { LOCAL_URL } from '@/features/complex/orderSlice';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function TopBar() {
  const router = useRouter();
  const { data: session } = useSession()

  async function getAuthToken() {
    const session = await getSession()
    const token = session?.user.token
    console.log(token)
    return token
  }
  return (
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        React App
      </Typography>
      <Button key="Simple"
        onClick={() => router.push('/simple')}
        sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
      >
        Simple
      </Button>
      {
        session &&
        <Button key="Complex"
          onClick={() => router.push('/complex')}
          sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
        >
          Complex
        </Button>
      }
      {
        session &&
        <Button key="Logout"
          onClick={() => signOut(({ callbackUrl: LOCAL_URL + '/simple' }))}
          sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
        >
          Sign Out
        </Button>
      }
      {!session &&
        <Button key="Login"
          onClick={() => signIn()}
          sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
      >
          Login
        </Button>
      }
    </Toolbar>
  );
}

export default TopBar;