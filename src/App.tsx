import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Menu from './components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import MainTabs from './pages/MainTabs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Support from './pages/Support';
import LandingPage from './pages/LandingPage';
import { logoutUser, signOut, setCurrentUser} from './data/store/actions/authActions';

import { useDispatch, useSelector } from 'react-redux';
import AccountsPage from './pages/NewAccountPage';


const App: React.FC = ({}) => {

  const darkMode = useSelector((state: any) => state.user.darkMode)

  const dispatch = useDispatch()

  return (
    <IonApp className={`${darkMode ? 'dark-theme' : ''}`}>
      <div className="body">
        <IonReactRouter>
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/tabs" component={MainTabs} />
            <Route path="/accounts" component={AccountsPage} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/support" component={Support} />
            <Route path="/logout" render={() => {
              signOut()
              dispatch({type: "SET_FIREBASE_USER", user: null})
              dispatch(setCurrentUser(""))
              // setIsLoggedIn(false);
              // setUsername(undefined);
              console.log("LOGGING OUT")
              return <Redirect to="/login" />
            }} />
            <Route path="/" component={LandingPage} exact />
          </IonRouterOutlet>
      </IonReactRouter>
      </div>
    </IonApp>
  )
}

export default App;
