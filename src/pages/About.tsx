import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonButton, IonIcon, IonDatetime, IonSelectOption, IonList, IonItem, IonLabel, IonSelect, IonPopover } from '@ionic/react';
import './About.scss';
import { calendar, pin, more } from 'ionicons/icons';

interface AboutProps { }

const About: React.FC<AboutProps> = () => {

  return (
    <IonPage id="about-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="about-header">
          <img src="assets/img/ionic-logo-white.svg" alt="ionic logo" />
        </div>
        <div className="about-info">
          <h4 className="ion-padding-start">Wallet Watch</h4>
          <p className="ion-padding-start ion-padding-end">
            Wallet Watch is the last app you will ever need to for all of your financial needs!
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(About);