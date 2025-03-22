import {useState, useEffect} from 'react';
import {Menu, MenuItem, IconButton} from '@mui/material';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import {useAuth} from './App';

/**
 * @returns {object} JSX
 */
export default function Workspaces() {
  const {workspaces, setWorkspaces,
    setSelectedWorkspace, lastLocation, setLastLocation} = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3010/api/v0/workspaces', {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`},
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        const matchedWorkspace = data.find((w) =>
          (w.id) === lastLocation?.workspaceId);
        setSelectedWorkspace(matchedWorkspace || data[0] || null);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectWorkspace = async (workspace) => {
    setSelectedWorkspace(workspace);
    handleMenuClose();

    setLastLocation({
      workspaceId: workspace.id,
      channelId: null,
      messageId: null,
    });

    const token = localStorage.getItem('token');
    await fetch('http://localhost:3010/api/v0/lastlocation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({workspaceId: workspace.id,
        channelId: null, messageId: null}),
    });
  };

  return (
    <>
      <IconButton aria-label = 'workspaces-drop-down'
        color="inherit" onClick={handleMenuOpen}>
        <ArrowDropDownCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {width: '95%', maxWidth: 'none'},
        }}
      >
        {workspaces.map((workspace) => (
          <MenuItem key={workspace.id}
            onClick={() => handleSelectWorkspace(workspace)}>
            {workspace.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
