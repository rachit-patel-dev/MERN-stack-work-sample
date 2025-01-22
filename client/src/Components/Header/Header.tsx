import React from 'react';

import { Layout, Popover, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../Store/store';
import { logout } from '../../Store/features/authSlice';

// Images
import images from '../../Assets/Images';

const { Header } = Layout;

interface HeaderBarProps {
  activePopupLink: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ activePopupLink }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);

  /**
   * Handles the logout functionality by dispatching a logout action and redirecting the user to the appropriate page based on their userType.
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate(userData?.userType === 'ADMIN' ? '/' : '/bureau-login');
  };

  const content = (
    <div className="user-popover">
      <p>
        <Link
          to="/password/change"
          className={
            activePopupLink === 'password/change' ? 'active-link' : ''
          }>
          Change Password
        </Link>
      </p>
      <p>
        <Link
          to={userData?.userType === 'ADMIN' ? '/' : '/bureau-login'}
          onClick={handleLogout}>
          Logout
        </Link>
      </p>
    </div>
  );

  return (
    <Header className="header">
      <Link to={userData?.userType === 'ADMIN' ? '/bureaus' : '/dashboard'}>
        <img src={images.AuthLogo} alt="logo" />
      </Link>

      <div className="Header-top-content">
        <Popover content={content} trigger="click">
          <Button>{userData?.id}</Button>
        </Popover>
        <p>{userData?.userType}</p>
      </div>
    </Header>
  );
};
