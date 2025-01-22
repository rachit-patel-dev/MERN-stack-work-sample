import React from 'react';

import { Button } from 'antd';

import { AuthLogoComponent } from '../../Components';

import './ErrorPage.css';

export const ErrorPage = () => {
  return (
    <>
      <div className="error-page">
        <div className="error-content">
          <AuthLogoComponent />
          <div className="error-inner-card">
            <h1>404</h1>
            <h4>Page Not Found</h4>
            <p>The page you&apos;re looking for does not seem to exist</p>
            <Button href="/dashboard" className="common-btn">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
