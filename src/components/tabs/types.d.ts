export interface TabItems {
  key: string;
  label: string;
  children: React.ReactNode | string;
}

export interface TabNavigationProps {
  activeKey: string;
  setActiveKey: (key: string) => void;
  panels: Omit<TabItems, 'children'>[];
}

export interface TabsProps {
  items: TabItems[];
  activeKey: string;
  onChange?: (activeKey: string) => void;
  unMountEverySwitchTab?: boolean;
}
