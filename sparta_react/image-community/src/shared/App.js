import './App.css';
import { Route } from 'react-router-dom';
import PostList from '../pages/PostList';
import Login from '../pages/Login';

import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import Header from '../components/Header';
import Signup from '../pages/Signup';
import { useDispatch } from 'react-redux';
import { actionCreators as userAction } from '../redux/modules/user';
import { useEffect } from 'react';
import { apiKey } from './firebase';
import { Button, Grid } from '../elements';
import Permit from './Permit';
import PostWrite from '../pages/PostWrite';
import PostDetail from '../pages/PostDetail';
import Notification from '../pages/Notification';
function App() {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key);
  useEffect(() => {
    if (is_session) {
      dispatch(userAction.loginCheckFB());
    }
  }, []);

  return (
    <div className="App">
      <Grid>
        <Header />
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact render={(props) => <Login />} />
          <Route path="/signup" exact render={(props) => <Signup />} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/write/:id" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/noti" exact component={Notification} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button
          is_float
          text="+"
          _onClick={() => history.push('/write')}
        ></Button>
      </Permit>
    </div>
  );
}

export default App;
