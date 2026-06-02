'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type LogoItem =
  | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string }
  | { src: string; alt?: string; href?: string; title?: string; srcSet?: string; sizes?: string; width?: number; height?: number };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
const toCssLength = (v?: number | string) => typeof v === 'number' ? `${v}px` : (v ?? undefined);

export const LogoLoop = React.memo<LogoLoopProps>(({
  logos, speed = 80, direction = 'left', width = '100%', logoHeight = 40, gap = 24,
  pauseOnHover, hoverSpeed, fadeOut = true, fadeOutColor, scaleOnHover = true,
  renderItem, ariaLabel = 'Technology logos', className, style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const seqRef       = useRef<HTMLUListElement>(null);
  const [seqWidth, setSeqWidth]     = useState(0);
  const [copyCount, setCopyCount]   = useState(2);
  const [isHovered, setIsHovered]   = useState(false);
  const rafRef       = useRef<number | null>(null);
  const offsetRef    = useRef(0);
  const velRef       = useRef(0);
  const lastTsRef    = useRef<number | null>(null);

  const isVertical = direction === 'up' || direction === 'down';
  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    return pauseOnHover ? 0 : undefined;
  }, [hoverSpeed, pauseOnHover]);

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed);
    const dir = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1);
    return mag * dir * (speed < 0 ? -1 : 1);
  }, [speed, direction, isVertical]);

  const updateDims = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopyCount(Math.max(2, Math.ceil(cw / sw) + 2));
    }
  }, []);

  useEffect(() => {
    updateDims();
    const ro = new ResizeObserver(updateDims);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [logos, gap, logoHeight, updateDims]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.max(0, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity;
      velRef.current += (target - velRef.current) * (1 - Math.exp(-dt / 0.25));
      let next = offsetRef.current + velRef.current * dt;
      next = ((next % seqWidth) + seqWidth) % seqWidth;
      offsetRef.current = next;
      track.style.transform = `translate3d(${-next}px, 0, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, effectiveHoverSpeed]);

  const cssVars = useMemo(() => ({
    '--ll-gap': `${gap}px`,
    '--ll-h': `${logoHeight}px`,
    ...(fadeOutColor ? { '--ll-fade': fadeOutColor } : {}),
  }) as React.CSSProperties, [gap, logoHeight, fadeOutColor]);

  const renderLogo = useCallback((item: LogoItem, key: React.Key) => {
    const isNode = 'node' in item;
    const content = isNode
      ? <span className={cx('inline-flex items-center', scaleOnHover && 'transition-transform duration-300 group-hover/item:scale-110')}>{(item as any).node}</span>
      : <img className={cx('h-[var(--ll-h)] w-auto block object-contain pointer-events-none', scaleOnHover && 'transition-transform duration-300 group-hover/item:scale-110')} src={(item as any).src} alt={(item as any).alt ?? ''} loading="lazy" decoding="async" draggable={false} />;
    if (renderItem) return <li className={cx('flex-none mr-[var(--ll-gap)]', scaleOnHover && 'overflow-visible group/item')} key={key} role="listitem">{renderItem(item, key)}</li>;
    return (
      <li className={cx('flex-none mr-[var(--ll-gap)]', scaleOnHover && 'overflow-visible group/item')} key={key} role="listitem">
        {(item as any).href
          ? <a className="inline-flex items-center no-underline rounded hover:opacity-80 focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2" href={(item as any).href} aria-label={(item as any).ariaLabel || (item as any).alt || 'logo'} target="_blank" rel="noreferrer noopener">{content}</a>
          : content}
      </li>
    );
  }, [scaleOnHover, renderItem]);

  const lists = useMemo(() => Array.from({ length: copyCount }, (_, ci) => (
    <ul className="flex items-center" key={`copy-${ci}`} role="list" aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
      {logos.map((item, ii) => renderLogo(item, `${ci}-${ii}`))}
    </ul>
  )), [copyCount, logos, renderLogo]);

  return (
    <div
      ref={containerRef}
      className={cx('relative overflow-x-hidden group', scaleOnHover && 'py-[calc(var(--ll-h)*0.1)]', className)}
      style={{ width: toCssLength(width) ?? '100%', ...cssVars, ...style }}
      role="region"
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,8%,80px)] bg-[linear-gradient(to_right,var(--ll-fade,#fdf0f4)_0%,rgba(0,0,0,0)_100%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,8%,80px)] bg-[linear-gradient(to_left,var(--ll-fade,#fdf0f4)_0%,rgba(0,0,0,0)_100%)]" />
        </>
      )}
      <div
        ref={trackRef}
        className="flex flex-row w-max will-change-transform select-none relative z-0"
        onMouseEnter={() => effectiveHoverSpeed !== undefined && setIsHovered(true)}
        onMouseLeave={() => effectiveHoverSpeed !== undefined && setIsHovered(false)}
      >
        {lists}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
