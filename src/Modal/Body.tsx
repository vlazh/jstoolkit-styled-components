import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import { Flex, type FlexComponentProps } from 'reflexy/styled/jss';
import type { Theme } from '../theme';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getBodyStyles() {
  return createStyles({
    root: {
      boxSizing: 'border-box',
      backgroundColor: '#fff',

      '&:first-child': {
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit',
      },

      '&:last-child': {
        borderBottomLeftRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
      },
    },
  });
}

// type MakeStylesProps = Pick<BodyProps, >;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...getBodyStyles().root,
    ...theme.rc?.Modal?.Body,
  },
}));

export type BodyProps = FlexComponentProps<'div'>;

export default function Body({
  p = 'l',
  className,
  ...rest
}: React.PropsWithChildren<BodyProps>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  return <Flex p={p} column className={css.root} {...rest} />;
}
