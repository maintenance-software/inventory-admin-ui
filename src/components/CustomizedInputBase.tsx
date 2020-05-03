import React, { FC, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {useTranslation} from "react-i18next";
import LanguageIcon from '@material-ui/icons/Language';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import UserAccount from "./session";
import {ISession} from "../graphql/session.type";
import FormControl from '@material-ui/core/FormControl';
import {fetchLocalizations} from "../api/localization.api";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         padding: '2px 4px',
         display: 'flex',
         alignItems: 'center',
         width: '100%',
      },
      input: {
         marginLeft: theme.spacing(1),
         flex: 1,
      },
      iconButton: {
         padding: 10,
      },
      divider: {
         height: 28,
         margin: 4,
      },
   }),
);

export const CustomizedInputBase: FC<{session: ISession}> = ({session}) => {
   const classes = useStyles();
   const [lang, setLang] = useState<string>('en');
   const [t, i18n] = useTranslation();
   const handleLanguageChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
      const newLang = event.target.value as string;
      try {
         const localizations = await fetchLocalizations(newLang);
         for (const key in localizations) {
            // @ts-ignore
            i18n.addResource(newLang, 'translation', key, localizations[key]);
         }
      } catch (e) {
         console.error(e);
      }
      await i18n.changeLanguage(newLang);
      setLang(newLang);
   };

   return (
      <Paper component="form" className={classes.root}>
         <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
         </IconButton>
         <InputBase
            className={classes.input}
            placeholder="Search Google Maps"
            inputProps={{ 'aria-label': 'search google maps' }}
         />
         <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
         </IconButton>
         <Divider className={classes.divider} orientation="vertical" />
         <IconButton color="primary" className={classes.iconButton} aria-label="directions">
            <DirectionsIcon />
         </IconButton>
         <Divider className={classes.divider} orientation="vertical" />
         <FormControl>
            <TextField
               id="current-language"
               select
               value={lang}
               onChange={handleLanguageChange}
               InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                     <InputAdornment position="start"><LanguageIcon/></InputAdornment>
                  ),
               }}
            >
               <MenuItem value="en">English</MenuItem>
               <MenuItem value="es">Español</MenuItem>
               <MenuItem value="fr">Frances</MenuItem>
            </TextField>
         </FormControl>
         {/*<Divider className={classes.divider} orientation="vertical" />*/}
         {/*<UserAccount firstName={session.firstName} lastName={session.lastName}/>*/}
      </Paper>
   );
};
