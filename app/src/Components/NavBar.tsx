import { useState } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import AppLogo from './AppLogo';

const NavBar = ({ menu }: { menu: any }) => {
  const [visible, setVisible] = useState(false);
  const { currentTheme } = useThemeSwitcher();

  return (
    <nav className="navbar" style={{ backgroundColor: currentTheme === 'dark' ? '#1f1f1f' : 'white' }}>
      <Button className="menu" type="text" size={'large'} icon={<MenuOutlined />} onClick={() => setVisible(true)} />
      <Drawer placement="left" onClose={() => setVisible(false)} visible={visible}>
        <AppLogo />
        {menu}
      </Drawer>
    </nav>
  );
};
export default NavBar;
