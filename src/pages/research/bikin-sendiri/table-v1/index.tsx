import clsx from 'clsx';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';

const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => (
  <div style={style} className={clsx('border px-2', columnIndex === 0 && '!sticky top-0 !left-2')}>
    Item {rowIndex},{columnIndex}
  </div>
);

export default function TableV1() {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <>
          {/* <List height={75} itemCount={1000} itemSize={180} layout="horizontal" width={300}>
        {Column}
      </List> */}
          <Grid className="relative" width={width} height={height} columnCount={1000} rowCount={1000} columnWidth={() => 180} rowHeight={() => 42}>
            {Cell}
          </Grid>
        </>
      )}
    </AutoSizer>
  );
}
