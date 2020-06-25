import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';
import { loginUser, signUp } from "../data/store/actions/authActions"
import { registerUser } from "../data/store/actions/authActions"

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  registerUser: typeof registerUser;
}

interface StateProps {
  auth: any
}

interface SignupProps extends OwnProps, StateProps,  DispatchProps { }

const Signup: React.FC<SignupProps> = (props, {setIsLoggedIn, history, setUsername: setUsernameAction}) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!name) {
      setNameError(true);
      return
    }
    if(!email) {
      setUsernameError(true);
      return
    }
    if(!password) {
      setPasswordError(true);
      return
    }
    if(!password2) {
      setPassword2Error(true);
      return
    }
    if(password !== password2) {
      setPasswordError(true);
      setPassword2Error(true);
      return
    }

    if(name && email && password && (password2 === password)) {
      const newUser = {
        name: name,
        email: email,
        password: password
      };

      const success = await signUp(newUser);
      if (success) {
        props.history.push('/login', {direction: 'none'});
      } else {
        console.log("error on signup")
      }
    }
  };

  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={signup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Name</IonLabel>
              <IonInput name="name" type="text" value={name} spellCheck={false} autocapitalize="off" onIonChange={e => setName(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>
            {formSubmitted && nameError && <IonText color="danger">
              <p className="ion-padding-start">
                Name is required
              </p>
            </IonText>}
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

            <IonItem>
              <IonLabel position="stacked" color="primary">Confirm Password</IonLabel>
              <IonInput name="password2" type="password" value={password2} onIonChange={e => setPassword2(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && password2Error && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton  routerLink="/login" expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton type="submit" routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

const mapStateToProps = (state: any) => ({
  auth: state.auth
});

export default connect<OwnProps, {}, DispatchProps>({
  mapStateToProps,
  mapDispatchToProps: {
    registerUser
  },
  component: Signup
})