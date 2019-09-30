import React, {useState} from 'react';
import './leftsidebar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

const OPTIONS: {option: string, label: string, icon:IconProp, selected: boolean}[] = [
    {
        option: 'home',
        label: 'Home',
        icon: 'home',
        selected: true
    },
    {
        option: 'user',
        label: 'Users',
        icon: 'user',
        selected: false
    },
    {
        option: 'reports',
        label: 'Reports',
        icon: 'chart-area',
        selected: false
    }
];

export const Leftsidebar: React.FC = () => {
    let selectedOption = OPTIONS.find( o => o.selected);
    if(!selectedOption)
        selectedOption = OPTIONS[0];
    const [option, setOption] = useState(selectedOption);

    const options =  OPTIONS.map((o, index) => (
        <li key={index}>
            <a href="#" onClick={e => setOption(o)}>
                <div className={o.option === option.option? 'sidebar-icon active-bg active-color' : 'sidebar-icon'}>
                    <FontAwesomeIcon icon={o.icon}/>
                </div>
                <div className={o.option === option.option? 'label active-color': 'label'}>{o.label}</div>
            </a>
        </li>
    ));

    return (
        <ul className="sidebar">
            {options}
        </ul>
    );
};