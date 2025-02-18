import React from 'react';

export const getRenderedCursor = (children: React.ReactNode[]): [number, number, number, number] => {
  return children.filter(React.isValidElement).reduce(
    ([minRow, maxRow, minColumn, maxColumn], child) => {
      if (!React.isValidElement(child)) return [minRow, maxRow, minColumn, maxColumn];
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

export function generateTableFilterOptions<TDataSource, TDataIndex extends keyof TDataSource>(
  dataSource: TDataSource[],
  dataKey: TDataIndex
) {
  const grouping = Object.groupBy(dataSource || [], (item) => item[dataKey] as PropertyKey);
  const groupingKeys = Object.keys(grouping);

  const haveKeys = groupingKeys.join(',').length;

  return haveKeys
    ? Object.keys(grouping)
        ?.filter((item) => item !== 'null' && item !== 'undefined' && item !== '')
        ?.map((name) => name)
    : [];
}

export function getFixedCardPosition(rect: DOMRect) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  //  Tambah kondisi agar popup fixed card tidak keluar dari viewport
  let calculatedLeft = rect.left - 150;
  let calculatedTop = rect.bottom;

  if (calculatedLeft < 0) {
    calculatedLeft = 10;
  }

  if (calculatedLeft + 300 > viewportWidth) {
    calculatedLeft = viewportWidth - 220;
  }

  if (calculatedTop + 200 > viewportHeight) {
    calculatedTop = viewportHeight - 210;
  }

  return { calculatedTop, calculatedLeft };
}
