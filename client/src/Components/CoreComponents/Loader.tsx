import React from 'react';

import images from '../../Assets/Images';

import '../../Assets/Css/Loader.css';

const Loader = () => {
  return (
    <div className="o-page-loader">
      <div className="o-page-loader--content">
        <div className="o-page-loader--spinner">
          <img src={images.AuthLogo} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
