import CloseIcon from '@mui/icons-material/Close';
import {
    AppBar,
    Dialog,
    DialogContent,
    IconButton,
    Slide,
    styled,
    Toolbar,
    Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
  },
  '& .MuiDialogContent-root': {
    padding: 0, // Remove default padding to allow content to control its own spacing
  },
}));

const DialogAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
}));

export interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  customHeader?: React.ReactNode;
  disableEscapeKeyDown?: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({
  open,
  onClose,
  title,
  children,
  hideCloseButton = false,
  customHeader,
  disableEscapeKeyDown = false,
}) => {
  return (
    <FullScreenDialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{ transition: Transition }}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {customHeader || (
        <DialogAppBar>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flex: 1 }}>
              {title}
            </Typography>
            {!hideCloseButton && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        </DialogAppBar>
      )}
      <DialogContent>
        {children}
      </DialogContent>
    </FullScreenDialog>
  );
};
