import React from 'react';
import { emphasize, withStyles, Theme } from '@material-ui/core/styles';
import {useHistory} from "react-router";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledBreadcrumb = withStyles((theme: Theme) => ({
   root: {
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: theme.palette.grey[800],
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
         backgroundColor: theme.palette.grey[300],
      },
      '&:active': {
         boxShadow: theme.shadows[1],
         backgroundColor: emphasize(theme.palette.grey[300], 0.12),
      },
   },
}))(Chip) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
   event.preventDefault();
   console.info('You clicked a breadcrumb.');
}

export const RouterBreadcrumbs= () => {
   const history = useHistory();
   const pathItems: string[] = history.location.pathname.split('/');
   console.log(pathItems);
   return (
      <Breadcrumbs aria-label="breadcrumb">
         {pathItems.filter(i => i).map((pathItem, index) => {
            if(index === 0) {
               return (<StyledBreadcrumb
                     key={pathItem}
                     component="a"
                     href="#"
                     label={pathItem}
                     icon={<HomeIcon fontSize="small"/>}
                     onClick={handleClick}
                  />
               );
            } else {
               return (<StyledBreadcrumb
                           key={pathItem}
                           component="a"
                           href="#"
                           label={pathItem}
                           onClick={handleClick}
                        />);
            }
         })}
      </Breadcrumbs>
   );
};
