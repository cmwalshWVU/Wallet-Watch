import React from 'react';
import { IonChip, IonLabel, IonIcon, IonAvatar, IonContent } from '@ionic/react';

export const TickerChip: React.FC = () => (
  <div>
    <IonChip>
      <IonLabel>Default</IonLabel>
    </IonChip>

    <IonChip>
      <IonLabel color="secondary">Secondary Label</IonLabel>
    </IonChip>

    <IonChip color="secondary">
      <IonLabel color="dark">Secondary w/ Dark label</IonLabel>
    </IonChip>
  </div>
);