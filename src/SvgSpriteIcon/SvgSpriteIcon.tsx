import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/system/useTheme';
import clsx from 'clsx';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import type { Theme } from '../theme';
import useSvgSpriteIconHref from './useSvgSpriteIconHref';

/** Uses in '*.svg' imports which processed by svg-sprite-loader. */
export interface SvgSymbolInfo {
  id: string;
  viewBox: string;
  content: string;
}

export interface SvgSpriteIconProps<N extends string> extends React.SVGAttributes<SVGSVGElement> {
  name: N;
  size?: number | string | undefined;
  scaleOnHover?: boolean | number | undefined;
  useProps?: Omit<React.SVGAttributes<SVGUseElement>, 'xlinkHref'> | undefined;
  htmlRef?: React.Ref<SVGSVGElement> | undefined;
  componentRef?: this['htmlRef'] | undefined;
}

type MakeStylesProps = ExcludeTypes<
  Required<Pick<SvgSpriteIconProps<string>, 'scaleOnHover'>>,
  false
>;

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  scalable: {
    transition: 'transform 0.1s',
    cursor: 'pointer',

    '&:hover': {
      transform: ({ scaleOnHover }: MakeStylesProps) => {
        return typeof scaleOnHover === 'number' ? `scale(${scaleOnHover})` : `scale(1.2)`;
      },
    },
  },
});

/** Uses with svg-sprite-loader */
function SvgSpriteIcon<N extends string>({
  name,
  size,
  width,
  height,
  scaleOnHover,
  useProps,
  htmlRef,
  componentRef,
  className,
  children,
  ...rest
}: SvgSpriteIconProps<N>): JSX.Element | null {
  const css = useStyles({ scaleOnHover: scaleOnHover || 1 });
  const { rc } = useTheme<Theme>();
  const refs = useRefs(htmlRef, componentRef);

  const href = useSvgSpriteIconHref(name);
  if (!href) return null;

  const w = width ?? size ?? rc?.SvgSpriteIcon?.defaultSize ?? 18;
  const h = height ?? size ?? w;

  return (
    <svg
      ref={refs}
      width={w}
      height={h}
      className={clsx(css.root, scaleOnHover && css.scalable, className)}
      {...rest}
    >
      <use xlinkHref={href} fill="currentColor" {...useProps} />
      {children}
    </svg>
  );
}

SvgSpriteIcon.spriteId = 'svgsprite';

export default SvgSpriteIcon;
