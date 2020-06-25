import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from '../data/connect';
import './Login.scss';
import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { auth } from "firebase";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
    auth: any
}

interface MenuProps extends RouteComponentProps, StateProps { }

const LandingPage: React.FC<MenuProps> = ({ auth, history }) => {

  useEffect(() => {
    console.log(localStorage.getItem("jwtToken"))
    if (auth.isAuthenticated) {
      history.push("/accounts")
    }
    // eslint-disable-next-line
  }, []);
    return (
      <IonPage id="landing-page">
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
          <div className="col s12 center-align">

          <h4>

          <span style={{ fontFamily: "monospace" }}>Whats in your {" "}</span> 
              <b>WALLET?</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              The one App for all of your financial needs.
            <br />
              <span style={{ fontFamily: "monospace" }}> Welcome to Wallet Watch</span>
            </p>
            </div>
          
            <IonRow>
              <IonCol>
                <IonButton routerLink="/login" expand="block">Login</IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
              </IonCol>
            </IonRow>  
        </IonContent>
  
      </IonPage>
    );
  };

export default withRouter(connect<OwnProps & RouteComponentProps>({
  mapStateToProps: (state) => ({
    auth: state.auth
  }),
  component: LandingPage
}));

