import { useNavigate } from 'react-router';

const menu = [
  {
    section: 'Research',
    data: [
      { url: 'research/bikin-sendiri', title: 'Bikin Sendiri' },
      { url: 'research/table-data-grid', title: 'Table dengan library' },
      { url: 'research/react-virtuoso', title: 'Table dengan React Virtuoso' },
    ],
  },
  {
    section: 'Implementasi',
    data: [
      { url: 'implementasi/bikin-sendiri', title: 'Bikin Sendiri' },
      { url: 'implementasi/bikin-sendiri-api', title: 'Bikin Sendiri [API]' },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-5">
        {menu.map(({ section, data }) => (
          <div key={'section-' + section}>
            <p className="font-semibold font-mono text-lg">{section}</p>

            <div className="pl-2 flex flex-col space-y-1">
              {data.map(({ url, title }) => (
                <p className="cursor-pointer" key={url} onClick={() => navigate(`/${url}`)}>
                  {title}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
