import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import type { Key } from 'rc-tree/lib/interface';

import images from '../../Assets/Images';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';

const { Sider } = Layout;

interface Option {
  key: string;
  icon: JSX.Element;
}

interface SidebarProps {
  currentVal: Key;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentVal }) => {
  const [current, setCurrent] = useState<Key>(currentVal);

  const navigate = useNavigate();
  const userType = useSelector(
    (state: RootState) => state.auth.userData?.userType,
  );

  let selectOptions: Option[] = [];
  if (userType === 'ADMIN') {
    selectOptions = [
      {
        key: 'bureaus',
        icon: <img src={images.AppAddIcon} alt="app-add" />,
      },
      {
        key: 'upload/master-csv',
        icon: <img src={images.UploadCSVIcon} alt="upload-csv" />,
      },
    ];
  } else {
    selectOptions = [
      {
        key: 'employers',
        icon: <img src={images.AppAddIcon} alt="app-add" />,
      },
      {
        key: 'employer/bulk/upload',
        icon: <img src={images.UploadCSVIcon} alt="upload-csv" />,
      },
    ];
  }

  /**
   * Handles click events on menu items by updating the current selected key and navigating to the corresponding route.
   * @param {Object} e The event object containing the clicked key.
   * @param {string} e.key The key of the clicked menu item.
   */
  const onClick = (e: { key: Key }) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  return (
    <Sider
      className="sidebar"
      breakpoint="lg"
      collapsedWidth="0"
      width={100}
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}>
      <div className="sidebar-logo">
        <img src={images.AuthLogo} alt="logo" />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[current as string]}
        mode="vertical"
        items={selectOptions.map((option) => ({
          ...option,
          children: option.icon,
        }))}
      />
    </Sider>
  );
};
