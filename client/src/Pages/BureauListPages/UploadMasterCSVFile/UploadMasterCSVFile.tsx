import React, { useRef, useState } from 'react';

import { Layout, Button, Form, Input, Row, Col, InputRef } from 'antd';
import { toast } from 'react-toastify';

import {
  PageContentHeader,
  HeaderBar,
  Sidebar,
  Loader,
} from '../../../Components';

import api from '../../../Network/interceptor';
import { apiRoutes } from '../../../Network/apiRoutes';

import '../Bureau.css';

const { Content } = Layout;

interface FormValues {
  MasterCsv: File | null | undefined | unknown;
}

function UploadMasterCSVFile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormValues>({
    MasterCsv: undefined,
  });

  const fileInputRef = useRef<InputRef>(null);

  const [form] = Form.useForm();

  /**
   * Handles the selection of a file input by updating the state with the selected file.
   * @param {React.ChangeEvent<HTMLInputElement>} event The change event triggered by selecting a file.
   */
  const handleFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFormData({ MasterCsv: files[0] });
    }
  };

  /**
   * Handles the submission of a form for uploading a user master CSV file by sending a POST request to the upload user master-csv API.
   * @param {React.FormEvent<HTMLFormElement>} event The form submission event.
   */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post(
        apiRoutes.user_master_csv_upload,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        if (fileInputRef.current) {
          form.resetFields();
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Layout className="layout_wrapper">
        <HeaderBar activePopupLink="" />
        <Layout>
          <Sidebar currentVal="upload/master-csv" />
          <Content>
            <PageContentHeader
              headerTitle="Upload Master CSV file"
              showSearchBar={false}
              showStatus={false}
              MapSelect={false}
            />
            <div className="Main-content-box">
              <Form
                className="common-form change_pwd_form"
                layout="vertical"
                form={form}
                name="nest-messages"
                onSubmitCapture={onSubmit}>
                <Row
                  gutter={{ xs: 8, sm: 16, md: 20, lg: 30 }}
                  className="upload-data-row">
                  <Col
                    className="gutter-row"
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 14 }}
                    lg={{ span: 10 }}
                    xl={{ span: 10 }}>
                    <Form.Item
                      className="upload-file-item"
                      rules={[{ required: true }]}>
                      <Input
                        type="file"
                        accept=".csv"
                        name="MasterCSV"
                        id="IDMasterCSV"
                        onChange={handleFileSelected}
                        required={true}
                        ref={fileInputRef}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    xl={{ span: 6 }}>
                    <div className="upload-file-btn">
                      <Button
                        className="common-btn"
                        onClick={(e) => {
                          form.resetFields();
                        }}
                        htmlType="submit">
                        Upload
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
export default UploadMasterCSVFile;
