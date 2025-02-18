type TIconSort = { sort?: 'asc' | 'desc' | 'unset' };

export default function IcSort({ sort = 'unset' }: TIconSort) {
  return (
    <div className="flex flex-col">
      <SortUp sort={sort} />
      <SortDown sort={sort} />
    </div>
  );
}

function SortDown({ sort }: TIconSort) {
  return (
    <svg
      className="-mt-1"
      stroke="currentColor"
      fill={sort === 'desc' ? '#333' : '#ccc'}
      strokeWidth="0"
      version="1.2"
      baseProfile="tiny"
      viewBox="0 0 24 24"
      height="10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.8 9.7l6.2 6.3 6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3-.2.2-.3.4-.3.7s.1.5.3.7z"></path>
    </svg>
  );
}
function SortUp({ sort }: TIconSort) {
  return (
    <svg
      stroke="currentColor"
      fill={sort === 'asc' ? '#333' : '#ccc'}
      strokeWidth="0"
      version="1.2"
      baseProfile="tiny"
      viewBox="0 0 24 24"
      height="10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.2 13.3l-6.2-6.3-6.2 6.3c-.2.2-.3.5-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7z"></path>
    </svg>
  );
}
