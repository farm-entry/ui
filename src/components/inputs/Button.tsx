import * as React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  '&.size-small': {
    padding: '6px 12px',
    fontSize: '0.875rem',
  },
  '&.size-large': {
    padding: '10px 20px',
    fontSize: '1.125rem',
  },
  // Primary variant
  '&.variant-primary': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  // Secondary variant
  '&.variant-secondary': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // Tertiary variant
  '&.variant-tertiary': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // Disabled state for all variants
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { 
    variant = 'primary',
    size = 'medium',
    children,
    className,
    ...rest
  } = props;

  return (
    <StyledButton
      ref={ref}
      className={`variant-${variant} size-${size} ${className || ''}`}
      {...rest}
    >
      {children}
    </StyledButton>
  );
});