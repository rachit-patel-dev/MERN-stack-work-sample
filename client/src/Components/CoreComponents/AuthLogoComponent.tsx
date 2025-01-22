import React from 'react';

import images from '../../Assets/Images';

const AuthLogoComponent = () => {
  return (
    <div className="logo-section">
      <img src={images.AuthLogo} alt="logo" className="auth-log" />
    </div>
  );
};

export default AuthLogoComponent;
