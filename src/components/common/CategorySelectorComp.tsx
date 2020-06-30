import React, { useState, FC, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {SearchInput} from "../SearchInput/SearchInput";
import Grid from '@material-ui/core/Grid';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {ISimpleSelectorOption} from './CommonTypes';
import {CategoryQL, FETCH_CATEGORIES, SAVE_CATEGORY} from "../../graphql/Item.ql";
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles({
   root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: 'none!important',
      borderLeft: 'none!important',
      borderRight: 'none!important',
      borderRadius: 0,
      paddingRight: '.5rem',
      paddingLeft: '.5rem',
      '&:focus': {
         outline: 'none',
         borderTop: 'none!important',
         borderLeft: 'none!important',
         borderRight: 'none!important',
      }
   },
   dialogContent: {
      height: '32rem',
      width: '22rem',
      paddingTop: '0!important',
      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      paddingBottom: '.5rem',
      display: 'flex',
      flexDirection: 'column',
   },
   optionContent: {
      flex: 1,
      padding: '0!important'
   }
});

interface ICategorySelectorPros {
   value: number | string;
   scope: string;
   readonly?: boolean;
   onChange?(value: string | number, label: string): void;
}

export const CategorySelectorComp: FC<ICategorySelectorPros> = ({value, readonly, scope, onChange}) => {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [searchInput, setSearchInput] = React.useState<string>( '');
   const [selectedOption, setSelectedOption] = useState<ISimpleSelectorOption | null>(null);
   const [options, setOptions] = useState<ISimpleSelectorOption[]>([]);
   const [editableOption, setEditableOption] = useState<ISimpleSelectorOption | null>(null);
   const { called, loading, data } = useQuery<{categories: CategoryQL[]}, any>(FETCH_CATEGORIES, {variables: { scope }});
   const [saveCategory] = useMutation<{saveCategory: CategoryQL}, any>(SAVE_CATEGORY);

   useEffect(() => {
      const selectedOption = options.find(o => o.value === value);
      if(selectedOption) {
         setSelectedOption(selectedOption);
      }
   }, [value]);

   useEffect(() => {
      if(data) {
         const tempOptions: ISimpleSelectorOption[] = data.categories.map(p => ({
            value: p.categoryId,
            label: p.name,
            selected: false
         }));
         const selectedOption = tempOptions.find(o => o.value === value);
         setOptions(tempOptions);
         if(selectedOption) {
            setSelectedOption(selectedOption);
         }
      }
   }, [called, loading, data]);

   const handleSaveEditCategory = async (option: ISimpleSelectorOption, nopersist: boolean) => {
      if(nopersist) {
         setEditableOption(option);
         if(option.value <= 0 && !options.find(o => o.value === option.value)) {
            const newOptions = options.map(c => ({...c})).concat(option);
            setOptions(newOptions);
         }
      } else {
         const saveResponse = await saveCategory({variables: {
               categoryId: option.value,
               name: editableOption? editableOption.label : '',
               scope: scope
            }});

         if(saveResponse.data && saveResponse.data.saveCategory) {
            const category = saveResponse.data.saveCategory;
            const newOptions = options.filter(o => o.value > 0).map(c => ({...c, label: c.value === category.categoryId? category.name : c.label}));
            if(option.value <= 0) {
               newOptions.push({value: category.categoryId, label: category.name});
            }
            setOptions(newOptions);
            setEditableOption(null);
         }
      }
   };

   const handleCancelCategory = () => {
      const newOptions = options.filter(o => o.value >= 0).map(o => ({...o}));
      setOptions(newOptions);
      setEditableOption(null);
   };

   const handOnleSelect = (v: ISimpleSelectorOption) => {
      setSelectedOption(v);
      onChange && onChange(v.value, v.label);
      setOpen(false);
   };

   return (
      <>
         <Button aria-controls="simple-selector"
                 aria-haspopup="true"
                 variant="outlined"
                 size="small"
                 disabled={readonly}
                 onClick={()=> setOpen(true)}
                 endIcon={<UnfoldMoreIcon/>}
                 className={classes.root}
         >
            {selectedOption? selectedOption.label : <h6>&nbsp;</h6>}
         </Button>
         <Dialog onClose={() => setOpen(false)} aria-labelledby="Simple Selector" open={open}>
            <DialogContent className={classes.dialogContent}>
               <Grid  style={{margin:'1rem', paddingTop: '1rem', display: 'flex'}}>
                  <form  noValidate autoComplete="off" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                     <SearchInput placeholder="Search" value={searchInput} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchInput(event.target.value)}/>
                  </form>
                  <Button variant="contained" size="small" color="primary" onClick={() => handleSaveEditCategory({value: -1, label: ''}, true)}>New</Button>
               </Grid>
               <List className={classes.optionContent}>
                  { options.length === 0? <h6 style={{paddingLeft:'1rem', paddingRight:'1rem'}}>No results</h6>:
                     options.filter(o => o.label.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1).sort((a, b) => +a.value - +b.value).map(o => (
                        <>
                           <ListItem key={o.value} onClick={() => !editableOption && handOnleSelect(o)}>
                              { editableOption && editableOption.value === o.value ?
                                 <Input
                                    value={editableOption? editableOption.label : ''}
                                    onChange={(event => editableOption && setEditableOption({...editableOption, label: event.target.value}))}
                                    inputProps={{ 'aria-label': `option ${o.value} editable` }}
                                 />
                                 :
                                 <ListItemText primary={o.label}/>
                              }
                              <ListItemSecondaryAction>
                                 <IconButton size="small" edge="end" onClick={() => handleSaveEditCategory(o, !(editableOption && editableOption.value === o.value))}>
                                    {editableOption && editableOption.value === o.value? <CheckIcon/> : <EditIcon/>}
                                 </IconButton>
                                 {editableOption && editableOption.value === o.value? <IconButton size="small" edge="end" onClick={() => handleCancelCategory()}><CancelIcon/></IconButton> : ''}
                              </ListItemSecondaryAction>
                           </ListItem>
                           <Divider />
                        </>
                  ))}
               </List>
            </DialogContent>
         </Dialog>
      </>
   );
};
