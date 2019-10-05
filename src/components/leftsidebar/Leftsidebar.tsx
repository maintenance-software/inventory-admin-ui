import React from 'react';
import './Leftsidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import { Link, useLocation, useParams } from 'react-router-dom';
import {useTranslation} from "react-i18next";


const OPTIONS: {path: string, localKey: string, icon:IconProp}[] = [
    {
      localKey: 'menu.home',
      icon: 'home',
      path: '/home'
    },
    {
      localKey: 'menu.users',
      icon: 'user',
      path: '/users'
    },
    {
      localKey: 'menu.reports',
      icon: 'chart-area',
      path: '/reports'
    }
];

export const Leftsidebar: React.FC = () => {
  const [t, i18n] = useTranslation();
  let location = useLocation();
  // let params = useParams();
  // console.log(location);
  // console.log(params);
    const options =  OPTIONS.map((o, index) => (
        <li key={index}>
            <Link to={o.path}>
                <div className={o.path === location.pathname? 'sidebar-icon active-bg active-color' : 'sidebar-icon'}>
                    <FontAwesomeIcon icon={o.icon}/>
                </div>
                <div className={o.path === location.pathname? 'label active-color': 'label'}>{t(o.localKey)}</div>
            </Link>
        </li>
    ));

    return (
        <ul className="sidebar">
            {options}
        </ul>
    );
};
