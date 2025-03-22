import {it, expect,
  beforeAll, afterEach, afterAll, vi} from 'vitest';
import {render, screen, within,
  fireEvent, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {MemoryRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import {AuthContext} from '../App';
import Login from '../Login';
import BottomBar from '../BottomBar';
import Channels from '../Channels';
import MessagePage from '../MessagePage';
import MessagePost from '../MessagePost';
import MessageTopbar from '../MessageTopbar';
import Home from '../Home';
import App from '../App';
import AuthenticatedRoute from '../AuthenticatedRoute';
import SettingPage from '../SettingPage';

const loginURL = 'http://localhost:3010/api/v0/login';
const channelURL = 'http://localhost:3010/api/v0/channels';
const messageGetURL = 'http://localhost:3010/api/v0/messages';
const messagePostURl = 'http://localhost:3010/api/v0/messages';
const workspacesURL = 'http://localhost:3010/api/v0/workspaces';
const lastLocation = 'http://localhost:3010/api/v0/lastlocation';

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Check Login Page', () => {
  const setIsAuthenticated = vi.fn();
  render(
      <AuthContext.Provider
        value={{isAuthenticated: false, setIsAuthenticated}}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
  );


  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});

it('Check Login', async () => {
  server.use(
      http.get(loginURL, async () => {
        console.log('Mock API hit! Returning response...');
        return HttpResponse.json(
            {
              'id': '550e8400-e29b-41d4-a716-446655440000',
              'email': 'tfu18@ucsc.edu',
              'token': 'mock-jwt-token',
            }, {status: 200},
        );
      }),
  );
  const setIsAuthenticated = vi.fn();
  const setLastLocation = vi.fn();
  render(
      <AuthContext.Provider
        value={{isAuthenticated: false, setIsAuthenticated, setLastLocation}}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('login');

  fireEvent.change(emailInput, {target: {value: 'tfu18@ucsc.edu'}});
  fireEvent.change(passwordInput, {target: {value: '0987654321'}});
  fireEvent.click(loginButton);

  await waitFor(() => expect(setIsAuthenticated).toHaveBeenCalledWith(true));
});

it('Login fetches lastLocation correctly', async () => {
  server.use(
      http.get(loginURL, async () => {
        return HttpResponse.json(
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'tfu18@ucsc.edu',
              token: 'mock-jwt-token',
              lastLocation: {
                workspaceId: 'workspace-123',
                channelId: 'channel-456',
                messageId: null,
              },
            },
            {status: 200},
        );
      }),
  );

  const setIsAuthenticated = vi.fn();
  const setLastLocation = vi.fn();
  render(
      <AuthContext.Provider value={{isAuthenticated: false,
        setIsAuthenticated, setLastLocation}}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('login');

  fireEvent.change(emailInput, {target: {value: 'tfu18@ucsc.edu'}});
  fireEvent.change(passwordInput, {target: {value: '0987654321'}});
  fireEvent.click(loginButton);

  await waitFor(() => expect(setIsAuthenticated).toHaveBeenCalledWith(true));
  await waitFor(() => expect(setLastLocation).toHaveBeenCalledWith({
    workspaceId: 'workspace-123',
    channelId: 'channel-456',
    messageId: null,
  }));
});

it('Check Login error', async () => {
  server.use(
      http.get(loginURL, async () => {
        console.log('Mock API hit! Returning response...');
        return HttpResponse.json(
            {
            }, {status: 404},
        );
      }),
  );
  const setIsAuthenticated = vi.fn();
  render(
      <AuthContext.Provider
        value={{isAuthenticated: false, setIsAuthenticated}}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByLabelText('login');

  fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
  fireEvent.change(passwordInput, {target: {value: 'wrongpassword'}});
  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

it('Check BottomBar Navigation', async () => {
  server.use(
      http.put(lastLocation, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );
  const setLastLocation = vi.fn();
  render(
      <AuthContext.Provider
        value={{selectedWorkspace: {id: 'workspace-1'}, setLastLocation}}>
        <MemoryRouter>
          <BottomBar />
        </MemoryRouter>,
      </AuthContext.Provider>,
  );

  const ButtonBar = screen.getByLabelText('bottom-bar');
  const homeButton = await within(ButtonBar).findByText('Home');
  fireEvent.click(homeButton);

  expect(mockNavigate).toHaveBeenCalledWith('/home');
});

it('Check BottomBar Navigation SettingPage', async () => {
  const setLastLocation = vi.fn();
  render(
      <AuthContext.Provider
        value={{selectedWorkspace: null, setLastLocation}}>
        <MemoryRouter>
          <BottomBar />
        </MemoryRouter>,
      </AuthContext.Provider>,
  );

  const ButtonBar = screen.getByLabelText('bottom-bar');
  const homeButton = await within(ButtonBar).findByText('Settings');
  fireEvent.click(homeButton);

  expect(mockNavigate).toHaveBeenCalledWith('/settings');
});

it('renders channels and navigates on selection', async () => {
  server.use(
      http.get(channelURL, async () => {
        return HttpResponse.json(
            [
              {id: '123', name: 'General'},
              {id: '456', name: 'Random'},
            ], {status: 200},
        );
      }),
  );
  server.use(
      http.put(lastLocation, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );

  const setSelectedChannels = vi.fn();

  render(
      <AuthContext.Provider value={{
        selectedWorkspace: {id: 'workspace-1'},
        channels: [{id: '123', name: 'General'},
          {id: '456', name: 'Random'}],
        setChannels: () => {},
        setSelectedChannels,
        lastLocation: {workspaceId: 'workspace-1',
          channelId: null, messageId: null},
      }}>
        <MemoryRouter>
          <Channels />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  expect(await screen.findByText('# General')).toBeInTheDocument();
  expect(screen.getByText('# Random')).toBeInTheDocument();

  fireEvent.click(screen.getByText('# General'));

  expect(setSelectedChannels)
      .toHaveBeenCalledWith({id: '123', name: 'General'});

  expect(mockNavigate).toHaveBeenCalledWith('/messages');
});

it('renders channels test setChannels', async () => {
  server.use(
      http.get(channelURL, async () => {
        return HttpResponse.json(
            [
              {id: '123', name: 'General'},
              {id: '456', name: 'Random'},
            ], {status: 200},
        );
      }),
  );

  const setSelectedChannels = vi.fn();
  const setChannels = vi.fn();

  render(
      <AuthContext.Provider value={{
        selectedWorkspace: {id: 'workspace-1', name: 'test'},
        channels: [],
        setChannels,
        setSelectedChannels,
      }}>
        <MemoryRouter>
          <Channels />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  await waitFor(() => expect(setChannels).toHaveBeenCalledTimes(1));
});

it('MessagePage calls', async () => {
  server.use(
      http.get(messageGetURL, async () => {
        return HttpResponse.json(
            [
              {
                id: '1',
                text: 'Hello',
                sender: 'Alice',
                timestamp: '2025-03-10T10:00:00Z',
                thread: [],
              },
              {
                id: '2',
                text: 'Goodbye',
                sender: 'Bob',
                timestamp: '2025-03-10T11:00:00Z',
                thread: [],
              },
            ], {status: 200},
        );
      }),
  );
  render(
      <AuthContext.Provider
        value={{selectedChannels: {id: '123', name: 'test'}}}>
        <MessagePage />
      </AuthContext.Provider>,
  );

  await waitFor(() =>
    expect(screen.getByText('test')).toBeInTheDocument());
});

it('MessagePost calls fetchMessages after sending a message', async () => {
  server.use(
      http.post(messagePostURl, async () => {
        return HttpResponse.json(
            {
              'message': 'Message created successfully',
              'id': 'a6b25a07-d3fb-4d49-983f-9b5b798a8b65',
            }, {status: 200},
        );
      }),
  );
  const fetchMessages = vi.fn();

  render(
      <AuthContext.Provider value={{
        selectedChannels: {id: '123', name: 'test'},
      }}>
        <MessagePost fetchMessages={fetchMessages} />
      </AuthContext.Provider>,
  );

  const input = screen.getByPlaceholderText(/Send a message to/);
  const sendButton = screen.getByLabelText('post');

  fireEvent.change(input, {target: {value: 'New message'}});
  fireEvent.click(sendButton);

  await waitFor(() => expect(fetchMessages).toHaveBeenCalledTimes(1));
});

it('MessagePage calls find Replies', async () => {
  server.use(
      http.get(messageGetURL, async () => {
        return HttpResponse.json(
            [
              {
                id: '1',
                text: 'Hello',
                sender: 'Alice',
                timestamp: '2025-03-10T10:00:00Z',
                thread: [{
                  id: '3',
                  text: 'See you later',
                  sender: 'Bob',
                  timestamp: '2025-03-10T11:00:00Z',
                  thread: [],
                }],
              },
              {
                id: '2',
                text: 'Goodbye',
                sender: 'Bob',
                timestamp: '2025-03-10T11:00:00Z',
                thread: [],
              },
            ], {status: 200},
        );
      }),
  );
  render(
      <AuthContext.Provider
        value={{selectedChannels: {id: '123', name: 'test'}}}>
        <MessagePage />
      </AuthContext.Provider>,
  );

  await waitFor(() =>
    expect(screen.getByText(/Replies/i)).toBeInTheDocument());
});

it('Check MessageTopbar', async () => {
  render(
      <AuthContext.Provider
        value={{selectedChannels: {id: '123', name: 'test'}}}>
        <MessageTopbar />
      </AuthContext.Provider>,
  );

  const backButton = screen.getByLabelText('Back-To-Home');
  fireEvent.click(backButton);

  expect(mockNavigate).toHaveBeenCalledWith('/home');
});

it('Home page calls test setWorkspaces', async () => {
  server.use(
      http.get(workspacesURL, async () => {
        return HttpResponse.json(
            [
              {
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'name': 'CSE186',
              },
              {
                'id': '560e8400-e29b-41d4-a716-446655440000',
                'name': 'CSE180',
              },
            ], {status: 200},
        );
      }),
  );

  const setWorkspaces = vi.fn();
  const setSelectedWorkspace = vi.fn();
  const setChannels = vi.fn();
  const setSelectedChannels = vi.fn();
  render(
      <AuthContext.Provider
        value={{workspaces: [], setWorkspaces, setSelectedWorkspace,
          selectedWorkspace: [], channels: [], setChannels, setSelectedChannels,
        }}>
        <Home />
      </AuthContext.Provider>,
  );

  await waitFor(() => expect(setWorkspaces).toHaveBeenCalledTimes(1));
});

it('Home page calls test setSelectedWorkspace', async () => {
  server.use(
      http.get(workspacesURL, async () => {
        return HttpResponse.json(
            [
              {
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'name': 'CSE186',
              },
              {
                'id': '560e8400-e29b-41d4-a716-446655440000',
                'name': 'General',
              },
            ], {status: 200},
        );
      }),
  );

  const setWorkspaces = vi.fn();
  const setSelectedWorkspace = vi.fn();
  const setChannels = vi.fn();
  const setSelectedChannels = vi.fn();
  render(
      <AuthContext.Provider
        value={{workspaces: [{
          'id': '550e8400-e29b-41d4-a716-446655440000',
          'name': 'CSE186',
        },
        {
          'id': '560e8400-e29b-41d4-a716-446655440000',
          'name': 'General',
        }], setWorkspaces, setSelectedWorkspace,
        selectedWorkspace: null, channels: [], setChannels, setSelectedChannels,
        }}>
        <Home />
      </AuthContext.Provider>,
  );

  const listButton = screen.getByLabelText('workspaces-drop-down');
  fireEvent.click(listButton);
  const newWorkspaces = screen.getByText('General');
  fireEvent.click(newWorkspaces);

  await waitFor(() => expect(setSelectedWorkspace).toHaveBeenCalledTimes(1));
});

it('Home page calls test empty api respond', async () => {
  server.use(
      http.get(workspacesURL, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );

  const setWorkspaces = vi.fn();
  const setSelectedWorkspace = vi.fn();
  const setChannels = vi.fn();
  const setSelectedChannels = vi.fn();
  render(
      <AuthContext.Provider
        value={{workspaces: [], setWorkspaces, setSelectedWorkspace,
          selectedWorkspace: [], channels: [], setChannels, setSelectedChannels,
        }}>
        <Home />
      </AuthContext.Provider>,
  );

  await waitFor(() =>
    expect(screen.getByText('Select a Workspace')).toBeInTheDocument());
});

it('renders mobile mode (default)', () => {
  vi.stubGlobal('innerWidth', 1024);
  render(
      <AuthContext.Provider value={{isAuthenticated: false}}>
        <App />
      </AuthContext.Provider>,
  );
  vi.stubGlobal('innerWidth', 500);
  fireEvent(window, new Event('resize'));

  expect(screen.getByLabelText('login')).toBeInTheDocument();
});

const MockComponent = () =>
  <div data-testid="mock-component">Protected Content</div>;
it('renders protected route when authenticated', () => {
  render(
      <AuthContext.Provider value={{isAuthenticated: true}}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<AuthenticatedRoute isAuthenticated={true} />}>
              <Route path="/protected" element={<MockComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('renders protected route when not authenticated', () => {
  render(
      <AuthContext.Provider value={{isAuthenticated: false}}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<AuthenticatedRoute isAuthenticated={false} />}>
              <Route path="/protected" element={<MockComponent />} />
            </Route>
            <Route path="/login"
              element={<div data-testid="login-page">Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  expect(screen.getByText('Login Page')).toBeInTheDocument();
});

it('renders authenticated BottomBar in mobile mode', async () => {
  server.use(
      http.get(loginURL, async () => {
        console.log('Mock API hit! Returning response...');
        return HttpResponse.json(
            {
              'id': '550e8400-e29b-41d4-a716-446655440000',
              'email': 'tfu18@ucsc.edu',
              'token': 'mock-jwt-token',
            }, {status: 200},
        );
      }),
  );
  vi.stubGlobal('innerWidth', 500);
  render(
      <AuthContext.Provider>
        <App />
      </AuthContext.Provider>,
  );

  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const loginButton = screen.getByLabelText('login');

  fireEvent.change(emailInput, {target: {value: 'tfu18@ucsc.edu'}});
  fireEvent.change(passwordInput, {target: {value: '0987654321'}});
  fireEvent.click(loginButton);

  await waitFor(() =>
    expect(screen.getByLabelText('bottom-bar')).toBeInTheDocument());
});

it('renders test SettingPage', async () => {
  const setIsAuthenticated = vi.fn();
  const setStatus = vi.fn();
  render(
      <AuthContext.Provider
        value={{
          setIsAuthenticated, selectedWorkspace: {id: '123', name: 'CSE186'},
          userName: 'molly', status: 'Active', setStatus}}>
        <MemoryRouter>
          <SettingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const status = screen.getByLabelText('status');
  const statusText = await within(status).findByText('Active');

  expect(screen.getByText('Sign out of CSE186')).toBeInTheDocument();
  expect(screen.getByText('Set yourself as AWAY')).toBeInTheDocument();
  expect(screen.getByText('molly')).toBeInTheDocument();
  expect(statusText).toBeInTheDocument();
});

it('test logout', async () => {
  const setIsAuthenticated = vi.fn();
  const setStatus = vi.fn();
  render(
      <AuthContext.Provider
        value={{
          setIsAuthenticated, selectedWorkspace: {id: '123', name: 'CSE186'},
          userName: 'molly', status: 'Active', setStatus}}>
        <MemoryRouter>
          <SettingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const logout = screen.getByLabelText('logout');
  fireEvent.click(logout);

  expect(mockNavigate).toHaveBeenCalledWith('/login');
});

it('SettingPage click update', async () => {
  const setIsAuthenticated = vi.fn();
  const setStatus = vi.fn();
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  render(
      <AuthContext.Provider
        value={{
          setIsAuthenticated, selectedWorkspace: {id: '123', name: 'CSE186'},
          userName: 'molly', status: 'Active', setStatus}}>
        <MemoryRouter>
          <SettingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const update = await screen.findByText('Update');
  fireEvent.click(update);

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Status updated to: Active');
  });
});

it('SettingPage change status', async () => {
  const setIsAuthenticated = vi.fn();
  const setStatus = vi.fn();
  render(
      <AuthContext.Provider
        value={{
          setIsAuthenticated, selectedWorkspace: {id: '123', name: 'CSE186'},
          userName: 'molly', status: 'Active', setStatus}}>
        <MemoryRouter>
          <SettingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const statusBox = screen.getByPlaceholderText('Update your status');
  fireEvent.change(statusBox, {target: {value: 'Leave'}});

  await waitFor(() => {
    expect(setStatus).toHaveBeenCalled();
    expect(setStatus).toHaveBeenCalledWith('Leave');
  });
});

it('SettingPage Set yourself as AWAY', async () => {
  const setIsAuthenticated = vi.fn();
  const setStatus = vi.fn();
  render(
      <AuthContext.Provider
        value={{
          setIsAuthenticated, selectedWorkspace: {},
          userName: 'molly', status: 'Active', setStatus}}>
        <MemoryRouter>
          <SettingPage />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const statusBox = screen.getByText('Set yourself as AWAY');
  fireEvent.click(statusBox);

  await waitFor(() => {
    expect(setStatus).toHaveBeenCalledWith('Away');
  });
});

it('Workspace selection updates lastLocation', async () => {
  server.use(
      http.get(workspacesURL, async () => {
        return HttpResponse.json(
            [
              {
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'name': 'CSE186',
              },
              {
                'id': '560e8400-e29b-41d4-a716-446655440000',
                'name': 'General',
              },
            ], {status: 200},
        );
      }),
  );
  server.use(
      http.put(lastLocation, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );

  const setSelectedWorkspace = vi.fn();
  const setLastLocation = vi.fn();
  const setWorkspaces = vi.fn();
  const setChannels = vi.fn();
  const setSelectedChannels = vi.fn();

  render(
      <AuthContext.Provider value={{setSelectedWorkspace,
        setLastLocation, workspaces: [{
          'id': '550e8400-e29b-41d4-a716-446655440000',
          'name': 'CSE186',
        },
        {
          'id': '560e8400-e29b-41d4-a716-446655440000',
          'name': 'General',
        }], setWorkspaces, lastLocation: {}, selectedWorkspace: null,
        channels: [], setChannels, setSelectedChannels}}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const listButton = await screen.findByLabelText('workspaces-drop-down');
  fireEvent.click(listButton);
  const newWorkspaces = await screen.findByText('General');
  fireEvent.click(newWorkspaces);

  await waitFor(() => expect(setLastLocation).toHaveBeenCalled());
});

it('Check MessageTopbar setLastLocation', async () => {
  server.use(
      http.put(lastLocation, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );

  const setLastLocation = vi.fn();
  render(
      <AuthContext.Provider
        value={{selectedChannels: {id: '123', name: 'test'},
          selectedWorkspace: {
            'id': '550e8400-e29b-41d4-a716-446655440000',
            'name': 'CSE186',
          }, setLastLocation}}>
        <MemoryRouter>
          <MessageTopbar />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  const backButton = screen.getByLabelText('Back-To-Home');
  fireEvent.click(backButton);

  await waitFor(() => expect(setLastLocation).toHaveBeenCalled());
});

it('selects last visited channel and navigates', async () => {
  server.use(
      http.get(channelURL, async () => {
        return HttpResponse.json(
            [
              {id: '123', name: 'General'},
              {id: '456', name: 'Random'},
            ], {status: 200},
        );
      }),
  );
  server.use(
      http.put(lastLocation, async () => {
        return HttpResponse.json(
            [
            ], {status: 200},
        );
      }),
  );

  const setChannels = vi.fn();
  const setSelectedChannels = vi.fn();
  const setLastLocation = vi.fn();

  render(
      <AuthContext.Provider
        value={{
          selectedWorkspace: {id: 'workspace-1'},
          channels: [{channelId: '123'}],
          setChannels,
          setSelectedChannels,
          lastLocation: {workspaceId: 'workspace-1',
            channelId: '123', messageId: null},
          setLastLocation,
        }}
      >
        <MemoryRouter>
          <Channels />
        </MemoryRouter>
      </AuthContext.Provider>,
  );

  await waitFor(() => expect(setSelectedChannels)
      .toHaveBeenCalledWith({id: '123', name: 'General'}));
  expect(mockNavigate).toHaveBeenCalledWith('/messages');
});
