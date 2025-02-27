import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, type FlexComponentProps } from 'reflexy/styled/jss';
import type { Theme } from '../../theme';
import UserIcon from './UserIcon';

export interface AvatarProps extends FlexComponentProps<'div'> {
  img?: string | undefined;
  size?: React.ReactText | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ size = theme.rc?.Avatar?.defaultSize || '48px' }: Pick<AvatarProps, 'size'>) => ({
    position: 'relative',
    borderRadius: '100%',
    ...theme.rc?.Avatar?.root,

    // for strengthen
    '&&': size
      ? {
          width: size,
          height: size,
        }
      : undefined,

    "&[data-img='false']": {
      backgroundColor: 'var(--rc--area-bg-color, #f4f7f8)',
      color: '#a1adbf',
      padding: `calc(${Number.isNaN(+size) ? size : `${size}px`} / 10)`,
      ...theme.rc?.Avatar?.noImg,
    },
  }),

  img: {
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    textAlign: 'center',
    objectFit: 'cover',
    ...theme.rc?.Avatar?.img,
  },

  fallbackImg: {
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: 'inherit',
    fill: 'currentColor',
    ...theme.rc?.Avatar?.fallbackImg,
  },
}));

export default function Avatar({
  img,
  size,
  className,
  children,
  ...rest
}: AvatarProps): JSX.Element {
  const css = useStyles({ classes: { root: className }, size });

  const [showFallbackUserIcon, setShowUserIcon] = useState(true);

  const onLoadSuccess = useCallback(() => {
    setShowUserIcon(false);
  }, []);

  return (
    <Flex shrink={0} className={css.root} data-img={!showFallbackUserIcon} {...rest}>
      {img && (
        <img
          src={img}
          alt=""
          className={css.img}
          onLoad={onLoadSuccess}
          hidden={showFallbackUserIcon}
        />
      )}
      {showFallbackUserIcon && <UserIcon className={css.fallbackImg} />}
      {children}
    </Flex>
  );
}
