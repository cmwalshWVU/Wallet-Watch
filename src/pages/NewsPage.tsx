import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol } from '@ionic/react';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import ArticleList from '../components/ArticleList';

interface OwnProps { };

interface StateProps {
  
};

interface DispatchProps { };

interface SpeakerListProps extends OwnProps, StateProps, DispatchProps { };

const NewsPage: React.FC<SpeakerListProps> = ({  }) => {

  return (
    <IonPage id="news-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Recent News</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`outer-content`}>
          <ArticleList />
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: React.memo(NewsPage)
});