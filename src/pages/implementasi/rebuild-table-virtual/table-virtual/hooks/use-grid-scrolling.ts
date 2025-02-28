import { useRef, useState } from 'react';
import { VariableSizeGrid as Grid, GridOnScrollProps } from 'react-window';

interface IUseGridScrolling {
  finalDataSource: Record<string, string | number>[];
  isLoading?: boolean;
  onScrollTouchBottom?: () => void;
  rowHeight: number;
}

export default function useGridScrolling({
  rowHeight,
  isLoading = false,
  finalDataSource,
  onScrollTouchBottom,
}: IUseGridScrolling) {
  const gridRef = useRef<Grid>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const handleScroll = ({ scrollTop }: GridOnScrollProps) => {
    const visibleHeight = gridRef.current?.props.height ?? 0;
    const totalHeight = rowHeight * finalDataSource?.length || 0;

    if (scrollTop + visibleHeight >= totalHeight - rowHeight && !isLoading) {
      if (!hasReachedBottom && finalDataSource?.length > 0) {
        setHasReachedBottom(true);
        onScrollTouchBottom?.();
      }
    }

    if (scrollTop + visibleHeight < totalHeight - rowHeight && hasReachedBottom) {
      setHasReachedBottom(false);
    }
  };

  return { gridRef, handleScroll };
}
