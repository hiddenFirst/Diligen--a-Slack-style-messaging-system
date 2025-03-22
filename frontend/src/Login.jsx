import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from './App';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * @returns {object} JSX
 */
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Your Website
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

/**
 * @returns {object} JSX
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {setIsAuthenticated, setUserName, setLastLocation} = useAuth();

  /**
   * 检查本地存储中的 token，若有效则自动登录
   */
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token') || 'invalid_token';
      const response = await fetch('http://localhost:3010/api/v0/login', {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`},
      });

      const data = await response.json();
      if (response.ok) {
        if (data.lastLocation) {
          setLastLocation(data.lastLocation);
        }
        navigate('/home');
        setUserName(data.name);
        setIsAuthenticated(true);
      }
    };

    checkToken();
  }, [navigate, setIsAuthenticated]);

  /**
   * @param {object} event event
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    const encodedEmail = encodeURIComponent(email);
    const url = `http://localhost:3010/api/v0/login?email=${encodedEmail}&password=${password}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || 'Default'}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setUserName(data.name);
      setLastLocation(data.lastLocation);
      navigate('/home');
    } else {
      setError(data.error || 'Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{mt: 1}}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          {error && (
            <Typography color="error" sx={{mt: 2}}>
              {error}
            </Typography>
          )}
          <Button
            aria-label='login'
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 1}}
          >
            Sign in
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
