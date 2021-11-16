import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import { Flex, FlexComponentProps } from 'reflexy';
import stopPropagation from '@js-toolkit/web-utils/stopPropagation';
import useChainRefCallback from '@js-toolkit/react-hooks/useChainRefCallback';
import SvgSpriteIcon, { SvgSpriteIconProps } from '../SvgSpriteIcon';
import type { Theme } from '../theme';
import Button from '../Button';
import MenuListItem, { MenuListItemProps } from './MenuListItem';

const useStyles = makeStyles(({ rc }: Theme) => ({
  root: { ...rc?.MenuList?.root },

  clickable: {
    cursor: 'pointer',
  },

  header: { ...rc?.MenuList?.header?.root },

  headerTitle: {
    fontWeight: 500,
    ...rc?.MenuList?.header?.title?.root,
  },

  headerAction: {
    ...rc?.MenuList?.header?.action?.root,
  },
}));

export type MenuItem<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<string>
> = Omit<MenuListItemProps<V, I>, 'onClick'> & React.Attributes;

export interface MenuListProps<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
> extends FlexComponentProps<'div'> {
  header?: string;
  headerIcon?: HI;
  headerAction?: string;
  items?: MenuItem<V, I>[];
  onItemSelect?: MenuListItemProps<V, I>['onSelect'];
  onItemMouseEnter?: MenuListItemProps<V, I>['onMouseEnter'];
  onItemMouseLeave?: MenuListItemProps<V, I>['onMouseLeave'];
  onItemProps?: (itemProps: MenuListItemProps<V, I>) => MenuListItemProps<V, I>;
  onClose?: () => void;
  onBack?: () => void;
  onHeaderAction?: () => void;
}

export default function MenuList<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
>({
  header,
  headerIcon,
  onBack,
  onClose,
  items,
  onItemSelect,
  onItemMouseEnter,
  onItemMouseLeave,
  onItemProps,
  headerAction,
  onHeaderAction,
  children,
  className,
  ...rest
}: MenuListProps<V, I, HI>): JSX.Element {
  const { rc } = useTheme<Theme>();
  const css = useStyles({
    classes: { root: className, header: rc?.MenuList?.header?.flex?.className },
  });

  const backHandler = useChainRefCallback<React.MouseEventHandler>(
    onBack && stopPropagation,
    onBack && (() => onBack())
  );

  const closeHandler = useChainRefCallback<React.MouseEventHandler>(
    onClose && stopPropagation,
    onClose && (() => onClose())
  );

  const headerActionHandler = useChainRefCallback<React.MouseEventHandler>(
    onHeaderAction && stopPropagation,
    onHeaderAction && (() => onHeaderAction())
  );

  const theme = rc?.MenuList;
  const backIconProps = onBack ? theme?.header?.backIcon : undefined;
  const closeIconProps = onClose ? theme?.header?.closeIcon : undefined;

  const headerIconProps =
    typeof headerIcon === 'string'
      ? { name: headerIcon }
      : (headerIcon as SvgSpriteIconProps<string>);
  const hasHeader = !!(header || headerIconProps || onBack || headerAction || onClose);

  const headerTitleFlex =
    typeof theme?.header?.title?.flex === 'function'
      ? theme.header.title.flex({ hasIcon: !!backIconProps || !!headerIconProps })
      : theme?.header?.title?.flex;
  const headerActionFlex = theme?.header?.action?.flex;
  const listFlex =
    typeof theme?.list?.flex === 'function' ? theme.list.flex({ hasHeader }) : theme?.list?.flex;

  return (
    <Flex column className={css.root} {...rest}>
      {hasHeader && (
        <Flex
          py="xs"
          pl="s"
          pr
          alignItems="center"
          shrink={0}
          {...theme?.header?.flex}
          className={css.header}
        >
          <Flex
            grow
            alignItems="center"
            className={onBack ? css.clickable : undefined}
            onClick={onBack ? backHandler : undefined}
          >
            {!!backIconProps && <SvgSpriteIcon size="1.5em" {...backIconProps} />}
            {!!headerIconProps && <SvgSpriteIcon {...headerIconProps} />}

            <Flex
              ml={!backIconProps && !headerIconProps ? 's' : 'xs'}
              py="xs"
              grow
              {...headerTitleFlex}
              className={css.headerTitle}
            >
              {header}
            </Flex>
          </Flex>

          {!!headerAction && (
            <Button
              ml
              shrink={0}
              size="contain"
              color="none"
              {...headerActionFlex}
              className={css.headerAction}
              onClick={headerActionHandler}
            >
              {headerAction}
            </Button>
          )}

          {!!closeIconProps && (
            <Button shrink={0} size="contain" color="none" onClick={closeHandler}>
              <SvgSpriteIcon size="0.875em" {...closeIconProps} />
            </Button>
          )}
        </Flex>
      )}

      <Flex mt={hasHeader ? 'xs' : undefined} column overflowY="auto" {...listFlex}>
        <Flex column shrink={0}>
          {items &&
            items.map((itemProps) => {
              const { value, ...restProps } = onItemProps ? onItemProps(itemProps) : itemProps;
              return (
                <MenuListItem
                  key={value}
                  value={value}
                  onSelect={onItemSelect}
                  onMouseEnter={onItemMouseEnter}
                  onMouseLeave={onItemMouseLeave}
                  {...restProps}
                />
              );
            })}

          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
