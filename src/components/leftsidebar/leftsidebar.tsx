import React from 'react';
import './leftsidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";

const OPTIONS: {path: string, label: string, icon:IconProp}[] = [
    {
        label: 'Home',
        icon: 'home',
        path: '/home'
    },
    {
        label: 'Users',
        icon: 'user',
        path: '/users'
    },
    {
        label: 'Reports',
        icon: 'chart-area',
        path: '/reports'
    }
];

const leftsidebar: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    const options =  OPTIONS.map((o, index) => (
        <li key={index}>
            <Link to={o.path}>
                <div className={o.path === props.location.pathname? 'sidebar-icon active-bg active-color' : 'sidebar-icon'}>
                    <FontAwesomeIcon icon={o.icon}/>
                </div>
                <div className={o.path === props.location.pathname? 'label active-color': 'label'}>{o.label}</div>
            </Link>
        </li>
    ));

    return (
        <ul className="sidebar">
            {options}
        </ul>
    );
};

export const Leftsidebar = withRouter(leftsidebar);