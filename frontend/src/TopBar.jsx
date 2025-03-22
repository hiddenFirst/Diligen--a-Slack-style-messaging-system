import {AppBar, Toolbar, Typography} from '@mui/material';
import {useAuth} from './App';
import Workspaces from './Workspaces';

/**
 * @returns {object} JSX
 */
export default function TopBar() {
  const {selectedWorkspace} = useAuth();

  return (
    <AppBar aria-label = 'header'
      position="static" sx={{backgroundColor: '#4A235A'}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h6">
          {selectedWorkspace?.name || 'Select a Workspace'}
        </Typography>
        <Workspaces />
      </Toolbar>
    </AppBar>
  );
}
