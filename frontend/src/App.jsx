/*
#######################################################################
#
# Copyright (C) 2020-2025 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import {BrowserRouter as Router,
  Routes, Route, Navigate} from 'react-router-dom';
import {createContext, useContext,
  useState, useEffect} from 'react';
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
import Login from './Login';
import Home from './Home';
import BottomBar from './BottomBar';
import MessagePage from './MessagePage';
import AuthenticatedRoute from './AuthenticatedRoute';
import SettingPage from './SettingPage';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/**
 * Simple component with no state.
 * @returns {object} JSX
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('Active');
  const [lastLocation, setLastLocation] = useState({
    workspaceId: null,
    channelId: null,
    messageId: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      workspaces, setWorkspaces,
      selectedWorkspace, setSelectedWorkspace,
      channels, setChannels,
      selectedChannels, setSelectedChannels,
      userName, setUserName,
      status, setStatus,
      lastLocation, setLastLocation,
    }}>
      {isMobile ? (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AuthenticatedRoute
              isAuthenticated={isAuthenticated} />}>
              <Route path="/home" element={<Home />} />
            </Route>
            <Route element={<AuthenticatedRoute
              isAuthenticated={isAuthenticated} />}>
              <Route path="/messages" element={<MessagePage />} />
            </Route>
            <Route element={<AuthenticatedRoute
              isAuthenticated={isAuthenticated} />}>
              <Route path="/settings" element={<SettingPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          {isAuthenticated && <BottomBar />}
        </Router>
      ) : (
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
            <Box component="form" sx={{mt: 1}}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
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
        </Container>
      )}
    </AuthContext.Provider>
  );
}

export default App;
