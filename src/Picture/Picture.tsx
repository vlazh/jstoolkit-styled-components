import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy/styled/jss';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';
import TransitionFlex, { type HideableProps } from '../TransitionFlex';

const useStyles = makeStyles({
  root: {
    pointerEvents: 'none',
    touchAction: 'none',
    userSelect: 'none',

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      overflow: 'clip', // https://github.com/WICG/view-transitions/blob/main/debugging_overflow_on_images.md
      borderRadius: 'inherit',

      pointerEvents: 'none',
      touchAction: 'none',
      userSelect: 'none',
    },
  },
});

export interface PictureSources {
  /** Fallback or default src */
  readonly src: string;
  readonly srcset?:
    | {
        readonly src: string;
        readonly type?: string | undefined;
        readonly media?: string | undefined;
      }[]
    | undefined;
}

export interface PictureProps
  extends FlexComponentProps,
    Pick<
      HideableProps,
      'hidden' | 'disposable' | 'onShown' | 'onHidden' | 'transitionDuration' | 'transitionProps'
    >,
    Pick<React.ImgHTMLAttributes<unknown>, 'crossOrigin' | 'loading'> {
  readonly src: string | PictureSources;
  readonly timeout?: number | undefined;
  readonly onLoadTimeout?: VoidFunction | undefined;
  readonly onLoadCompleted?: VoidFunction | undefined;
  readonly onError?: ((error: unknown) => void) | undefined;
}

export default function Picture({
  hidden,
  src: srcProp,
  crossOrigin,
  loading,
  timeout,
  transitionProps,
  onLoadTimeout,
  onLoadCompleted,
  onError,
  className,
  ...rest
}: PictureProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef(0);

  const [sources, variants] = useMemoDestructor(() => {
    const normalizedSrc = typeof srcProp === 'string' ? { src: srcProp } : srcProp;

    timerRef.current =
      (timeout ?? 0) > 0 && onLoadTimeout ? window.setTimeout(onLoadTimeout, timeout) : 0;

    return [
      [
        normalizedSrc,
        <>
          {normalizedSrc.srcset?.map(({ src, ...srcRest }) => (
            <source key={src} srcSet={src} {...srcRest} />
          ))}
          <img ref={imgRef} crossOrigin={crossOrigin} alt="" loading={loading} />
        </>,
      ],

      () => {
        clearTimeout(timerRef.current);
      },
    ];
  }, [crossOrigin, loading, onLoadTimeout, srcProp, timeout]);

  // The trick to workaround the WebKit bug (https://bugs.webkit.org/show_bug.cgi?id=190031)
  // to do not load img together with selected source.
  // Se also https://habr.com/ru/post/682014/
  useLayoutEffect(() => {
    const { current: img } = imgRef;
    if (!img) return;
    img.src = sources.src;
  }, [sources]);

  const loadHandler = useCallback(() => {
    clearTimeout(timerRef.current);
    setLoaded(true);
    onLoadCompleted && onLoadCompleted();
  }, [onLoadCompleted]);

  const errorHandler = useCallback(
    (ev: unknown) => {
      clearTimeout(timerRef.current);
      if (onError) onError(ev);
      else console.error(ev);
      onLoadCompleted && onLoadCompleted();
    },
    [onError, onLoadCompleted]
  );

  return (
    <TransitionFlex
      hidden={hidden ?? !loaded}
      transitionDuration={250}
      transitionProps={{ easing: { enter: 'ease-in', exit: 'ease-out' }, ...transitionProps }}
      component="picture"
      flex={false}
      onLoad={loadHandler}
      onError={errorHandler}
      className={css.root}
      {...rest}
    >
      {variants}
    </TransitionFlex>
  );
}
