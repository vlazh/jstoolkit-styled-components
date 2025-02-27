import React from 'react';
import { Flex, type FlexAllProps } from 'reflexy/styled/jss';
import { clsx } from 'clsx';
import type { GetOverridedKeys } from '../types/local';
import useStyles from './useStyles';

export interface ButtonSizes {}

export interface ButtonColors {}

export interface ButtonVariants {}

export type ButtonSize = GetOverridedKeys<'contain' | 'xs' | 's' | 'm' | 'l' | 'xl', ButtonSizes>;

export type ButtonColor = GetOverridedKeys<
  'none' | 'default' | 'primary' | 'secondary',
  ButtonColors
>;

export type ButtonVariant = GetOverridedKeys<'outlined' | 'filled' | 'text', ButtonVariants>;

export interface ButtonStyleProps {
  readonly size?: ButtonSize | undefined;
  readonly color?: ButtonColor | undefined;
  readonly variant?: ButtonVariant | undefined;
}

export type ButtonProps<C extends React.ElementType = 'button'> = FlexAllProps<C> &
  ButtonStyleProps;

export default function Button<C extends React.ElementType = 'button'>({
  component = 'button' as C,
  size = 'm',
  color = 'default',
  variant = 'filled',
  className,
  ...rest
}: ButtonProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className }, variant });

  const variantClassName = css[`variant-${variant}`] ?? '';
  const sizeClassName = css[`size-${size}`] ?? '';
  const colorClassName = css[`${color}-${variant}`] ?? '';

  return (
    <Flex
      center
      shrink={false}
      className={clsx(css.root, variantClassName, sizeClassName, colorClassName)}
      component={component}
      {...(rest as any)}
    />
  );
}
