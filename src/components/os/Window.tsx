import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AppId } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { Minimize2, Maximize2, Minus, X } from 'lucide-react';

type SnapZone = 'full' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
type ResizeHandle = 'left' | 'right' | 'bottom' | 'bottom-right' | null;

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

const SNAP_THRESHOLD = 40;
const TASKBAR_HEIGHT = 48;
const MIN_W = 400;
const MIN_H = 300;

const getSnapZone = (x: number, y: number, w: number, h: number): SnapZone => {
  const isTop = y < SNAP_THRESHOLD;
  const isBottom = y > h - TASKBAR_HEIGHT - SNAP_THRESHOLD;
  const isLeft = x < SNAP_THRESHOLD;
  const isRight = x > w - SNAP_THRESHOLD;

  if (isTop && isLeft) return 'top-left';
  if (isTop && isRight) return 'top-right';
  if (isBottom && isLeft) return 'bottom-left';
  if (isBottom && isRight) return 'bottom-right';
  if (isTop) return 'full';
  if (isLeft) return 'left';
  if (isRight) return 'right';
  return null;
};

const getSnapPreview = (zone: SnapZone, w: number, h: number) => {
  const bodyH = h - TASKBAR_HEIGHT;
  const halfW = w / 2;
  const halfH = bodyH / 2;
  switch (zone) {
    case 'full': return { x: 0, y: 0, width: w, height: bodyH };
    case 'left': return { x: 0, y: 0, width: halfW, height: bodyH };
    case 'right': return { x: halfW, y: 0, width: halfW, height: bodyH };
    case 'top-left': return { x: 0, y: 0, width: halfW, height: halfH };
    case 'top-right': return { x: halfW, y: 0, width: halfW, height: halfH };
    case 'bottom-left': return { x: 0, y: halfH, width: halfW, height: halfH };
    case 'bottom-right': return { x: halfW, y: halfH, width: halfW, height: halfH };
    default: return null;
  }
};

export const WindowContainer: React.FC<WindowProps> = ({ id, children }) => {
  const { windows, activeWindowId, focusWindow, closeWindow, minimizeWindow, maximizeWindow, updateWindowPos, updateWindowSize, t } =
    usePortfolio();

  const win = windows[id];
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const [resizing, setResizing] = useState<ResizeHandle>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialWinX: number; initialWinY: number; initialW: number; initialH: number }>({
    startX: 0, startY: 0, initialWinX: 0, initialWinY: 0, initialW: 0, initialH: 0
  });

  const maxW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxH = typeof window !== 'undefined' ? window.innerHeight : 800;

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const isFocused = activeWindowId === id;
  const snapPreview = snapZone && !win.isMaximized ? getSnapPreview(snapZone, maxW, maxH) : null;
  const isMaxd = win.isMaximized;

  // --- Drag ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMaxd) return;
    if ((e.target as HTMLElement).closest('button')) return;

    focusWindow(id);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX, startY: e.clientY,
      initialWinX: win.position.x, initialWinY: win.position.y,
      initialW: win.size.width, initialH: win.size.height
    };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isMaxd) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const newX = Math.max(-win.size.width + 120, Math.min(maxW - 80, dragStartRef.current.initialWinX + dx));
    const newY = Math.max(0, Math.min(maxH - TASKBAR_HEIGHT - 40, dragStartRef.current.initialWinY + dy));
    updateWindowPos(id, { x: newX, y: newY });
    setSnapZone(getSnapZone(e.clientX, e.clientY, maxW, maxH));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (snapZone) {
        const p = getSnapPreview(snapZone, maxW, maxH);
        if (p && !isMaxd) { updateWindowPos(id, { x: p.x, y: p.y }); updateWindowSize(id, { width: p.width, height: p.height }); }
      }
      setSnapZone(null);
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    }
  };

  // --- Resize ---
  const onResizeStart = (handle: ResizeHandle) => (e: React.PointerEvent) => {
    if (isMaxd) return;
    e.stopPropagation();
    focusWindow(id);
    setResizing(handle);
    dragStartRef.current = {
      startX: e.clientX, startY: e.clientY,
      initialWinX: win.position.x, initialWinY: win.position.y,
      initialW: win.size.width, initialH: win.size.height
    };
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  };

  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizing || isMaxd) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    let newW = dragStartRef.current.initialW;
    let newH = dragStartRef.current.initialH;
    let newX = win.position.x;
    if (resizing === 'right' || resizing === 'bottom-right') {
      newW = Math.max(MIN_W, Math.min(maxW - win.position.x - 20, dragStartRef.current.initialW + dx));
    }
    if (resizing === 'left') {
      const maxDx = dragStartRef.current.initialW - MIN_W;
      const clampedDx = Math.min(maxDx, Math.max(-win.position.x + 120, dx));
      newW = dragStartRef.current.initialW - clampedDx;
      newX = dragStartRef.current.initialWinX + clampedDx;
    }
    if (resizing === 'bottom' || resizing === 'bottom-right') {
      newH = Math.max(MIN_H, Math.min(maxH - TASKBAR_HEIGHT - win.position.y - 20, dragStartRef.current.initialH + dy));
    }
    updateWindowSize(id, { width: newW, height: newH });
    if (resizing === 'left') updateWindowPos(id, { x: newX, y: win.position.y });
  };

  const onResizeEnd = (e: React.PointerEvent) => {
    if (resizing) {
      setResizing(null);
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    }
  };

  const renderSnapPreview = () => {
    if (!snapPreview || isMaxd) return null;
    return <div style={{ position: 'fixed', left: snapPreview.x, top: snapPreview.y, width: snapPreview.width, height: snapPreview.height, zIndex: 75 }} className="pointer-events-none border-2 border-blue-400/60 bg-blue-500/10 rounded-lg" />;
  };

  const edgeHandle = (side: string, classes: string) => (
    <div
      onPointerDown={onResizeStart(side as ResizeHandle)}
      onPointerMove={onResizeMove}
      onPointerUp={onResizeEnd}
      className={classes}
    />
  );

  return (
    <>
      {renderSnapPreview()}
      <motion.div
        ref={windowRef}
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        onClick={() => focusWindow(id)}
        style={{
          zIndex: isMaxd ? 80 : win.zIndex,
          left: isMaxd ? 0 : win.position.x,
          top: isMaxd ? 0 : win.position.y,
          width: isMaxd ? '100vw' : Math.min(win.size.width, maxW - 20),
          height: isMaxd ? `calc(100vh - ${TASKBAR_HEIGHT}px)` : Math.min(win.size.height, maxH - TASKBAR_HEIGHT - 20)
        }}
        className={`fixed flex flex-col rounded-xl overflow-visible shadow-2xl ${
          isMaxd ? '!left-0 !top-0 !w-full !h-[calc(100vh-48px)] rounded-none border-none z-[80]' : ''
        } ${
          isFocused ? 'border border-blue-500/50 shadow-blue-500/20 ring-1 ring-blue-500/30' : 'border border-white/20 opacity-98'
        } bg-[#161618]/95 backdrop-blur-md text-white select-none`}
      >
        {/* Title Bar */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={() => maximizeWindow(id)}
          className={`h-10 px-4 flex items-center justify-between select-none ${
            isMaxd ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          } border-b transition-colors ${isFocused ? 'bg-white/12 border-white/20' : 'bg-white/5 border-white/10'}`}
        >
          <div className="flex items-center gap-3 truncate">
            <IconHelper name={win.icon} className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-100 opacity-90 truncate">{win.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:bg-white/15 hover:text-white transition text-xs" title={t('win.minimize')}><Minus className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:bg-white/15 hover:text-white transition text-xs" title={isMaxd ? t('common.restore') : t('win.maximize')}>{isMaxd ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}</button>
            <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:bg-rose-600 hover:text-white transition text-xs" title="Close"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden select-text text-slate-100 scrollbar-thin scrollbar-thumb-white/20">
          {children}
        </div>

        {/* Resize Handles (only when not maximized) */}
        {!isMaxd && (
          <>
            {/* Left edge */}
            <div
              onPointerDown={onResizeStart('left')}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              className="absolute top-0 left-0 w-1.5 h-full cursor-w-resize hover:bg-blue-400/40 transition-colors rounded-l"
            />
            {/* Right edge */}
            <div
              onPointerDown={onResizeStart('right')}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              className="absolute top-0 right-0 w-1.5 h-full cursor-e-resize hover:bg-blue-400/40 transition-colors rounded-r"
            />
            {/* Bottom edge */}
            <div
              onPointerDown={onResizeStart('bottom')}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              className="absolute bottom-0 left-0 h-1.5 w-full cursor-s-resize hover:bg-blue-400/40 transition-colors rounded-b"
            />
            {/* Bottom-right corner */}
            <div
              onPointerDown={onResizeStart('bottom-right')}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize hover:bg-blue-400/50 transition-colors rounded-br"
            />
          </>
        )}
      </motion.div>
    </>
  );
};
