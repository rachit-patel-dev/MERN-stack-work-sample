import React from 'react';

import { Layout } from 'antd';

import {
  Sidebar,
  HeaderBar,
  PageContentHeader,
  BureauEditFormComponent,
} from '../../../Components';

import '../Bureau.css';

const { Content } = Layout;

function EditBureau() {
  return (
    <>
      <Layout className="layout_wrapper">
        <HeaderBar activePopupLink="" />
        <Layout>
          <Sidebar currentVal="bureaus" />
          <Content>
            <PageContentHeader
              headerTitle="Edit Bureau"
              showSearchBar={false}
              showStatus={false}
              MapSelect={false}
            />
            <div className="Main-content-box">
              <BureauEditFormComponent formTitle="edit-bureau" />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default EditBureau;
