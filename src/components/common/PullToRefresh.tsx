import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { RefreshCw } from "lucide-react";
import { tapHaptic } from "../../lib/haptics";

interface Props {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

const THRESHOLD = 60;
const MAX_PULL = 80;

export function PullToRefresh({ onRefresh, children }: Props) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);
  const firedHaptic = useRef(false);

  function onTouchStart(e: TouchEvent) {
    const main = document.querySelector("main");
    if (!main || main.scrollTop > 2 || refreshing) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
    dragging.current = true;
    firedHaptic.current = false;
  }

  function onTouchMove(e: TouchEvent) {
    if (!dragging.current || startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      setPull(0);
      return;
    }
    const next = Math.min(dy / 1.6, MAX_PULL);
    setPull(next);
    if (next >= THRESHOLD && !firedHaptic.current) {
      firedHaptic.current = true;
      tapHaptic();
    }
  }

  async function onTouchEnd() {
    if (!dragging.current) return;
    dragging.current = false;
    const shouldRefresh = pull >= THRESHOLD;
    startY.current = null;
    if (shouldRefresh) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-center overflow-hidden transition-[height] duration-150" style={{ height: pull }}>
        <RefreshCw
          size={16}
          className={`text-accent-light ${refreshing ? "animate-spin" : ""}`}
          style={{
            transform: refreshing ? undefined : `rotate(${pull * 3}deg)`,
            opacity: Math.min(pull / THRESHOLD, 1),
          }}
        />
      </div>
      {children}
    </div>
  );
}
