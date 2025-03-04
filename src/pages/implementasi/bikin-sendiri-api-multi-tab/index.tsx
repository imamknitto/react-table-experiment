import { useState } from 'react';
import Header from '../../../components/header';
import Tabs from '../../../components/tabs';
import { TabsProps } from '../../../components/tabs/types';
import Content1 from './tabs/content-1';
import Content2 from './tabs/content-2';
import Content3 from './tabs/content-3';
import Content4 from './tabs/content-4';
import Content5 from './tabs/content-5';

const tabItems: TabsProps['items'] = [
  {
    key: '1',
    label: 'Konten Tab 1',
    children: <Content1 />,
  },
  {
    key: '2',
    label: 'Konten Tab 2',
    children: <Content2 />,
  },
  {
    key: '3',
    label: 'Konten Tab 3',
    children: <Content3 />,
  },
  {
    key: '4',
    label: 'Konten Tab 4',
    children: <Content4 />,
  },
  {
    key: '5',
    label: 'Konten Tab 5',
    children: <Content5 />,
  },
];

export default function ImplementasiBikinSendiriApiMultiTab() {
  const [activeTab, setActiveTab] = useState<string>('1');

  return (
    <div className="p-4 flex flex-col h-screen w-full space-y-2.5">
      <Header>
        <h1>Implementasi Table Bikin Sendiri [API] - Multi Tabs</h1>
      </Header>

      <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} unMountEverySwitchTab={false} />
    </div>
  );
}
