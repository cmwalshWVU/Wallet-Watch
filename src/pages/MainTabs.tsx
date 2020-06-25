import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { analytics, briefcase, cash, calendar, contacts, map, informationCircle } from 'ionicons/icons';
import AccountsPage from './AccountsPage';
import About from './About';
import ArticleList from '../components/ArticleList';
import NewsPage from './NewsPage';
import TickersPage from './TickersPage';

interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/tickers" />
        {/* 
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.        
        */}
        <Route path="/accounts" render={() =><AccountsPage />} exact={true} />
        <Route path="/tabs/news" render={() =><NewsPage />} exact={true} />
        <Route path="/tabs/about" render={() => <About />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="accounts" href="/accounts">
          <IonIcon icon={briefcase} />
          <IonLabel>Accounts</IonLabel>
        </IonTabButton>
        <IonTabButton tab="news" href="/tabs/news">
          <IonIcon icon={map} />
          <IonLabel>News</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/tabs/about">
          <IonIcon icon={informationCircle} />
          <IonLabel>About</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;