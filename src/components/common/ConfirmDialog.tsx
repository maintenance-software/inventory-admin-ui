import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';

interface IConfirmationDialogProps {
   tittle: string;
   description?: string;
   open: boolean;
   setOpen(open: boolean): void;
   onConfirmDialog(): void
}
export const ConfirmDialog: FC<IConfirmationDialogProps> = ({tittle, description, open, setOpen, onConfirmDialog}) => {
   const theme = useTheme();
   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <Dialog
         disableBackdropClick
         disableEscapeKeyDown
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="confirm-dialog-title"
      >
         <DialogTitle id="confirm-dialog-title">{tittle}</DialogTitle>
         <DialogContent>
            {description?<DialogContentText>{description}</DialogContentText>: ''}
         </DialogContent>
         <DialogActions>
            <Button autoFocus onClick={onConfirmDialog} color="primary">
               Yes
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
               No
            </Button>
         </DialogActions>
      </Dialog>
   );
};
