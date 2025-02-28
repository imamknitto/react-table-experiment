import { VariableSizeGrid as Grid, GridOnScrollProps } from 'react-window';
import { useCallback, useState } from 'react';

interface IUseGridScrolling {
  finalDataSource: Record<string, string | number>[];
  isLoading?: boolean;
  onScrollTouchBottom?: () => void;
  rowHeight: number;
  gridRef: React.RefObject<Grid | null>;
}

export default function useGridScrolling({
  rowHeight,
  isLoading = false,
  finalDataSource,
  onScrollTouchBottom,
  gridRef,
}: IUseGridScrolling) {
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

  const onScrollToTop = useCallback(() => {
    gridRef.current?.scrollTo({ scrollTop: 0 });
  }, []);

  return { handleScroll, onScrollToTop };
}
