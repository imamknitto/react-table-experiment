import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import React, { createContext, ReactNode, forwardRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

type StickyGridContextType = {
  stickyHeight: number;
  stickyWidth: number;
  columnWidth: number;
  rowHeight: number;
  headerBuilder: (
    minColumn: number,
    maxColumn: number,
    columnWidth: number,
    stickyHeight: number
  ) => HeaderColumn[];
  columnsBuilder: (
    minRow: number,
    maxRow: number,
    rowHeight: number,
    stickyWidth: number
  ) => StickyRow[];
};

type HeaderColumn = {
  height: number;
  width: number;
  left: number;
  label: string;
};

type StickyRow = {
  height: number;
  width: number;
  top: number;
  label: string;
};

const getRenderedCursor = (
  children: ReactNode[]
): [number, number, number, number] => {
  return children.filter(React.isValidElement).reduce(
    ([minRow, maxRow, minColumn, maxColumn], child) => {
      if (!React.isValidElement(child))
        return [minRow, maxRow, minColumn, maxColumn];
      const { columnIndex, rowIndex } = child.props as {
        columnIndex: number;
        rowIndex: number;
      };

      return [
        Math.min(minRow, rowIndex),
        Math.max(maxRow, rowIndex),
        Math.min(minColumn, columnIndex),
        Math.max(maxColumn, columnIndex),
      ];
    },
    [Infinity, -Infinity, Infinity, -Infinity]
  );
};

const headerBuilder = (
  minColumn: number,
  maxColumn: number,
  columnWidth: number,
  stickyHeight: number
): HeaderColumn[] => {
  return Array.from({ length: maxColumn - minColumn + 1 }, (_, i) => ({
    height: stickyHeight,
    width: columnWidth,
    left: (minColumn + i) * columnWidth,
    label: `Sticky Col ${minColumn + i}`,
  }));
};

const columnsBuilder = (
  minRow: number,
  maxRow: number,
  rowHeight: number,
  stickyWidth: number
): StickyRow[] => {
  return Array.from({ length: maxRow - minRow + 1 }, (_, i) => ({
    height: rowHeight,
    width: stickyWidth,
    top: (minRow + i) * rowHeight,
    label: `Sticky Row ${minRow + i}`,
  }));
};

const GridColumn: React.FC<GridChildComponentProps> = ({
  rowIndex,
  columnIndex,
  style,
}) => (
  <div
    className="flex flex-row items-center pl-2.5 border-r border-b border-r-gray-400 border-b-gray-400"
    style={style}
  >
    Cell {rowIndex}, {columnIndex}
  </div>
);

const StickyHeader: React.FC<{
  stickyHeight: number;
  stickyWidth: number;
  headerColumns: HeaderColumn[];
}> = ({ stickyHeight, stickyWidth, headerColumns }) => (
  <div className="sticky top-0 left-0 flex flex-row z-[3]">
    <div
      className="!z-[3] bg-gray-200 sticky left-0 flex flex-row items-center pl-2.5 border-r border-b border-r-gray-400 border-b-gray-400"
      style={{ height: stickyHeight, width: stickyWidth }}
    >
      Sticky Base
    </div>
    <div className="absolute" style={{ left: stickyWidth }}>
      {headerColumns.map(({ label, ...style }, i) => (
        <div
          className="whitespace-nowrap absolute bg-blue-200 flex flex-row items-center pl-2.5 border-r border-b border-r-gray-400 border-b-gray-400"
          style={style}
          key={i}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

const StickyColumns: React.FC<{
  rows: StickyRow[];
  stickyHeight: number;
  stickyWidth: number;
}> = ({ rows = [], stickyHeight, stickyWidth }) => {
  return (
    <div
      className="sticky left-0 z-[2] bg-blue-200"
      style={{
        top: stickyHeight,
        width: stickyWidth,
        height: `calc(100% - ${stickyHeight}px)`,
      }}
    >
      {rows.map(({ label, ...style }, i) => (
        <div
          className="absolute flex flex-row items-center pl-2.5 border-r border-b border-r-gray-400 border-b-gray-400"
          style={style}
          key={i}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

const StickyGridContext = createContext<StickyGridContextType | undefined>(
  undefined
);
StickyGridContext.displayName = 'StickyGridContext';

const InnerGridElement = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; style: React.CSSProperties }
>((props, ref) => {
  const context = React.useContext(StickyGridContext);
  if (!context) return null;
  const {
    stickyHeight,
    stickyWidth,
    headerBuilder,
    columnsBuilder,
    columnWidth,
    rowHeight,
  } = context;

  const [minRow, maxRow, minColumn, maxColumn] = getRenderedCursor(
    React.Children.toArray(props.children)
  );
  const headerColumns = headerBuilder(
    minColumn,
    maxColumn,
    columnWidth,
    stickyHeight
  );
  const leftSideRows = columnsBuilder(minRow, maxRow, rowHeight, stickyWidth);

  return (
    <div
      ref={ref}
      style={{
        ...props.style,
        width: props.style.width || 0 + stickyWidth,
        height: props.style.height || 0 + stickyHeight,
      }}
    >
      <StickyHeader
        headerColumns={headerColumns}
        stickyHeight={stickyHeight}
        stickyWidth={stickyWidth}
      />
      <StickyColumns
        rows={leftSideRows}
        stickyHeight={stickyHeight}
        stickyWidth={stickyWidth}
      />
      <div
        className="absolute"
        style={{ top: stickyHeight, left: stickyWidth }}
      >
        {props.children}
      </div>
    </div>
  );
});

const StickyGrid: React.FC<
  {
    stickyHeight: number;
    stickyWidth: number;
    columnWidth: number;
    rowHeight: number;
    children: React.FC<GridChildComponentProps>;
  } & Omit<
    React.ComponentProps<typeof Grid>,
    'columnWidth' | 'rowHeight' | 'children'
  >
> = ({
  stickyHeight,
  stickyWidth,
  columnWidth,
  rowHeight,
  children,
  ...rest
}) => {
  return (
    <StickyGridContext.Provider
      value={{
        stickyHeight,
        stickyWidth,
        columnWidth,
        rowHeight,
        headerBuilder,
        columnsBuilder,
      }}
    >
      <Grid
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        innerElementType={InnerGridElement}
        {...rest}
      >
        {children}
      </Grid>
    </StickyGridContext.Provider>
  );
};

function TesTable() {
  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <StickyGrid
            height={height}
            width={width}
            columnCount={1000}
            rowCount={1000}
            rowHeight={36}
            columnWidth={150}
            stickyHeight={36}
            stickyWidth={150}
          >
            {GridColumn}
          </StickyGrid>
        );
      }}
    </AutoSizer>
  );
}

export default TesTable;
