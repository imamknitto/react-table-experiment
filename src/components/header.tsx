interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export default function Header({ children, className, ...props }: Props) {
  return (
    <div className={`flex items-center border-b border-gray-200 p-2.5 ${className}`} {...props}>
      <button className="shrink-0 me-2 cursor-pointer" onClick={() => window.history.back()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19.5 12h-15m0 0l5.625-6M4.5 12l5.625 6"
          />
        </svg>
      </button>
      {children}
    </div>
  );
}
