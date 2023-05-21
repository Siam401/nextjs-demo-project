import Head from 'next/head';
import MasterLayout from '@/layouts/MasterLayout';
import { Container, TextField, Button, Box, Grid, Paper, Alert, Fade } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { signIn } from "next-auth/react";
import { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import { useRouter } from 'next/router';
const SignIn: NextPage = (props): JSX.Element => {

  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault();
    setLoading(true)
    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    });

    if (!res?.error) {
      router.push('/simple')
    } else {
      setError(true);
      setLoading(false)
    }

    console.log(res);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <MasterLayout>
        <Container>
          <Paper elevation={1} sx={{ px: 3, py: 4 }}>
            <div className="text-xl font-bold text-center mb-5">
              Login Form
            </div>
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {error &&
                    <Fade
                      in={error}
                      timeout={1000}
                      addEndListener={() => {
                        setTimeout(() => {
                          setError(false)
                        }, 4000);
                      }}
                    >
                      <Alert variant="outlined" severity="error">
                        Credintial doesn't match!
                      </Alert>
                    </Fade>
                  }

                  <Box sx={{ mt: 3 }}>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            name="email"
                            type="email"
                            fullWidth
                            required
                            id="email"
                            label="Email"
                            value={userInfo.email}
                            onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            name="password"
                            type="password"
                            fullWidth
                            required
                            id="password"
                            label="Password"
                            value={userInfo.password}
                            onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <LoadingButton
                            color="primary"
                            type="submit"
                            loading={loading}
                            variant="outlined"
                          >
                            <span>Login</span>
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </MasterLayout >
    </>
  )
}

export default SignIn;