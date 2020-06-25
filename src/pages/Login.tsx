import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { signIn, loadUserSession, setCurrentUser } from "../data/store/actions/authActions"
import { connect } from '../data/connect';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';
import { getAccounts, getFirebaseAccounts } from '../data/store/actions/accountActions';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from 'react-redux';
import { GET_ACCOUNTS } from '../data/store/actions/types';

const Login: React.FC<RouteComponentProps> = ({history}) => {

  const auth = useSelector((state: any) =>  state.auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const firebaseUser = useSelector((state: any) =>  state.auth.firebaseUser)
  const dispatch = useDispatch()

  
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   if (auth.isAuthenticated) {
  //     // getAccounts()
  //     history.push('/accounts', {direction: 'none'});
  //   } 
  // }, [auth]);

  useEffect(() => {
    // Update the document title using the browser API
    if (firebaseUser) {
     getFirebaseAccounts().then((res: any) => {
      console.log(`success ${res}`)
      dispatch({
          type: GET_ACCOUNTS,
          payload: res
        })
     }).catch((err:any) => console.log(err))
      history.push('/accounts', {direction: 'none'});
    } 
  }, [firebaseUser]);

  const login = async () => {
    console.log("TESTTTTT")
    setFormSubmitted(true);
    if(!email) {
      setUsernameError(true);
    }
    if(!password) {
      setPasswordError(true);
    }
    if(email && password) {
      const user = {
        email: email,
        password: password
      };

      await dispatch(signIn(user))

    // const res = await loginUser(user)
    // if (res) {
    //   dispatch(setCurrentUser(res));
    //   getAccounts()
    //   return <Redirect to='/accounts'/>

    // }
      // await setIsLoggedIn(true);
      // await setUsername(email);
      // await getAccounts()
    }
  };

  // if (!auth.isAuthenticated && localStorage.jwtToken) {
  //   // Set auth token header auth
  //   const token = localStorage.jwtToken;
  //   setAuthToken(token);
  //   // Decode token and get user info and exp
  //   const decoded: any = jwt_decode(token);
  //   // Set user and isAuthenticated
  //   loadUserSession(decoded);
  //   // Check for expired token
  //   const currentTime = Date.now() / 1000; // to get in milliseconds
  //   if (decoded.exp < currentTime) {
  //     // Logout user
  //     // Redirect to login
  //     history.push("/login");
  //   }
  //   else {
  //     return <Redirect to='/accounts'/>
  //   }
  // }
 

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>

        {/* <form noValidate onSubmit={() => login()}> */}
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Email</IonLabel>
              <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value!)}
                required>
              </IonInput>
            </IonItem> 

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton onClick={() => login()} expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        {/* </form> */}

      </IonContent>

    </IonPage>
  );
  
};

export default withRouter(Login)