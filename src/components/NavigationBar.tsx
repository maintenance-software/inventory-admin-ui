import React from 'react';
import { emphasize, withStyles, Theme } from '@material-ui/core/styles';
import ReplyIcon from '@material-ui/icons/Reply';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useHistory} from "react-router";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
   breadcrumbsContainer: {
      paddingBottom: theme.spacing(1),
   },
   margin: {
      marginRight: theme.spacing(2),
   }
}));

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

// function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
//    event.preventDefault();
//    console.info('You clicked a breadcrumb.');
// }

export const NavigationBar = () => {
   const styles = useStyles();
   const history = useHistory();
   const pathItems: string[] = history.location.pathname.split('/').filter(p => !!p);

   const handleGoUp = () => {
      const path = '/' + pathItems.slice(0, pathItems.length - 1).join('/');
      history.push(path);
   };

   const handleGoBack = () => {
      history.goBack();
   };

   const handleBreadcrumbItem = (index: number) => {
      const path = '/' + pathItems.slice(0, index + 1).join('/');
      history.push(path);
   };

   return (
      <>
         <Box>
            <IconButton onClick={handleGoBack} aria-label="go-back" size="small"  className={styles.margin}>
               <ReplyIcon/>
            </IconButton>
            <IconButton onClick={handleGoUp} aria-label="go-up"  size="small" className={styles.margin}>
               <ArrowUpwardIcon/>
            </IconButton>
         </Box>
         <Box>
            <Breadcrumbs aria-label="breadcrumb">
               {pathItems.map((pathItem, index) => {
                  if(index === 0) {
                     return (<StyledBreadcrumb
                           key={pathItem}
                           component="a"
                           href="#"
                           label={pathItem}
                           icon={<HomeIcon fontSize="small"/>}
                           onClick={(event: React.MouseEvent<Element, MouseEvent>) => {event.preventDefault(); handleBreadcrumbItem(index)}}
                        />
                     );
                  } else {
                     return (<StyledBreadcrumb
                        key={pathItem}
                        component="a"
                        href="#"
                        label={pathItem}
                        onClick={(event: React.MouseEvent<Element, MouseEvent>) => {event.preventDefault(); handleBreadcrumbItem(index)}}
                     />);
                  }
               })}
            </Breadcrumbs>
         </Box>
      </>
   );
};
