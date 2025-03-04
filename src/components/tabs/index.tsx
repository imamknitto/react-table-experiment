import clsx from 'clsx';
import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { TabNavigationProps, TabsProps } from './types';

export default function Tabs({ items, activeKey, onChange, unMountEverySwitchTab = true }: TabsProps) {
  const panels = items.map(({ key, label }) => ({ key, label }));

  const activeIndex = items.findIndex(({ key }) => key === activeKey);

  const handleSetActiveKey = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      onChange?.(key);
    },
    [activeKey, onChange]
  );

  return (
    <div className="h-full flex flex-col space-y-2.5">
      <TabNavigation
        activeKey={activeKey}
        setActiveKey={handleSetActiveKey}
        panels={panels}
        activeIndex={activeIndex}
      />

      <div className="flex-1 overflow-auto">
        {items.map(({ key, children }, index) => {
          if (unMountEverySwitchTab) {
            return <Fragment key={`${key}-${index}`}>{key === activeKey && children}</Fragment>;
          }

          return (
            <Fragment key={`${key}-${index}`}>
              <div className={clsx('h-full', key === activeKey ? 'block' : 'hidden')}>{children}</div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const TabNavigation = memo(
  ({ activeKey, setActiveKey, panels, activeIndex }: TabNavigationProps & { activeIndex: number }) => {
    const navigationRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [widthIndicator, setWidthIndicator] = useState<number>(0);
    const [indicatorPosition, setIndicatorPosition] = useState<number>(0);

    useEffect(() => {
      if (navigationRefs.current[activeIndex]) {
        const activeElement = navigationRefs.current[activeIndex];
        setWidthIndicator(activeElement?.getBoundingClientRect().width || 0);
        setIndicatorPosition(activeElement?.offsetLeft || 0);
      }
    }, [activeIndex, panels]);

    return (
      <div className="relative flex flex-row overflow-auto">
        {panels.map(({ label, key }, idx) => (
          <div
            ref={(el) => (navigationRefs.current[idx] = el)}
            key={`${key}-${idx}`}
            className={clsx(
              'p-2.5 flex justify-center items-center cursor-pointer border-b w-auto',
              'transition duration-200 ease-in-out',
              activeKey === key ? 'text-knitto-blue-100' : 'text-black-40'
            )}
            onClick={() => setActiveKey(key)}
          >
            <p className="z-20">{label}</p>
          </div>
        ))}

        <ActiveSlideIndicator widthIndicator={widthIndicator} indicatorPosition={indicatorPosition} />
      </div>
    );
  }
);

const ActiveSlideIndicator = memo(
  ({ widthIndicator, indicatorPosition }: { widthIndicator: number; indicatorPosition: number }) => {
    return (
      <div
        className="absolute inset-0 bg-[#E7ECFF] transition-transform duration-100 border-b-2 border-knitto-blue-100"
        style={{
          width: widthIndicator,
          transform: `translateX(${indicatorPosition}px)`,
        }}
      />
    );
  }
);
