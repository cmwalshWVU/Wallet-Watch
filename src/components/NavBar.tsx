import {
    IonMenuButton
  } from '@ionic/react';
import Menu from './Menu'
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';


interface NavBarProps extends RouteComponentProps { }

const NavBar: React.FC<NavBarProps> = ({ history }) => {
    const [menuOpen, setmenuOpen] = useState(true);

    const presentPopover = (e: React.MouseEvent) => {
        setmenuOpen(true);
    };
        
    return (
        <>
            <IonMenuButton onClick={presentPopover} ></IonMenuButton>
            {menuOpen ? <Menu /> : null}
        </>
    );
};

export default withRouter(NavBar)