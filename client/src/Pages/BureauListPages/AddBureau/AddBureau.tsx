import React from 'react';

import { Layout } from 'antd';

// Components
import {
  Sidebar,
  HeaderBar,
  PageContentHeader,
  BureauFormComponent,
} from '../../../Components';

// CSS
import '../Bureau.css';

const { Content } = Layout;

function AddBureau() {
  return (
    <Layout className="layout_wrapper">
      <HeaderBar activePopupLink="" />
      <Layout>
        <Sidebar currentVal="bureaus" />
        <Content>
          <PageContentHeader
            headerTitle="Add Bureau"
            showSearchBar={false}
            showStatus={false}
            MapSelect={false}
          />
          <div className="Main-content-box">
            <BureauFormComponent formTitle="bureau/create" />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AddBureau;
