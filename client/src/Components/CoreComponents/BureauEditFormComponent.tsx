import React, { FC, useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Row, Col, Select, Upload } from 'antd';
import type { UploadProps } from 'antd';
import {
  UploadOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from '@ant-design/icons';

// Components
import {
  FormItemInputComponent,
  FormNumberItemInputComponent,
  Loader,
} from '../index';

// Networking
import api from '../../Network/interceptor';
import { apiRoutes } from '../../Network/apiRoutes';

import {
  states,
  bureauStatus,
  defaultCountries,
  payrollSoftwares,
  mobileNoRegEx,
  phoneNoRegEx,
} from '../../Static';

import { ICustomEvent } from '../../types';

// Images
import images from '../../Assets/Images';

const validateMessages = {
  required: '${label} is required!',
};

interface IBureauEditFormProps {
  formTitle: string;
}

const BureauEditFormComponent: FC<IBureauEditFormProps> = ({ formTitle }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changeData, setChangeData] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  /**
   * Handles change events for input elements and selects, updating the corresponding state.
   * @param {React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | ICustomEvent} event The event object containing information about the change.
   */
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
      | ICustomEvent,
  ) => {
    const { name, value } = event.target;
    setChangeData({
      ...changeData,
      [name]: value,
    });
  };

  /**
   * Fetches bureau data from the API and updates the form fields with the retrieved data.
   * @returns {Promise<void>} A Promise that resolves once the data is fetched and form fields are updated.
   */
  const getBureauData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(apiRoutes.bureau + `/${id}`);
      if (response.status === 200) {
        const {
          Email,
          LegalName,
          PrimaryContact,
          PrimaryContactPhoneNumber,
          PrimaryContactMobile,
          Address,
          City,
          State,
          Country,
          Zip,
          Status,
          PayrollSoftware,
        } = response.data.data;
        const bureauDataResponse = {
          Email,
          LegalName,
          PrimaryContact,
          PrimaryContactPhoneNumber,
          PrimaryContactMobile,
          Address,
          City,
          State,
          Country,
          Zip,
          Status,
          PayrollSoftware,
        };
        form.setFieldsValue(bureauDataResponse);
      }
    } catch (error: any) {
      console.error('Error while fetching bureau data ::', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form submission by preventing the default behavior, validating form fields, and submitting updated bureau data to the Edit Bureau API.
   * @param {React.FormEvent<HTMLFormElement>} event The form submission event.
   */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedFields = await form.validateFields();
    if (validatedFields) {
      try {
        await form.validateFields();

        const response = await api.put(
          apiRoutes.bureau + `/${id}`,
          changeData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate('/bureaus');
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          toast.error(error.response.data.message);
        }
      }
    }
  };

  const props: UploadProps = {
    onChange(info) {
      setChangeData({
        ...changeData,
        SampleFile: info.file.originFileObj,
      });
    },
  };

  useEffect(() => {
    getBureauData();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Form
        className="common-form"
        layout="vertical"
        form={form}
        onSubmitCapture={onSubmit}
        validateMessages={validateMessages}>
        <Row gutter={{ xs: 8, sm: 16, md: 20, lg: 30 }}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="Legal Name"
              name="LegalName"
              onChangeFunction={handleChange}
              className="legal-name"
              placeholder="Enter Legal Name"
              inputType="text"
              suffix={<img src={images.LegalName} alt="name" />}
              rules={[{ required: true }]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="Primary Contact"
              name="PrimaryContact"
              onChangeFunction={handleChange}
              className=""
              placeholder="Enter Primary Contact"
              inputType="text"
              suffix={null}
              rules={[{ required: true }]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="Primary Contact Phone Number"
              name="PrimaryContactPhoneNumber"
              onChangeFunction={handleChange}
              className=""
              placeholder="Enter Primary Contact Phone Number"
              inputType="text"
              suffix={<PhoneOutlined />}
              rules={[
                { required: true },
                {
                  pattern: phoneNoRegEx,
                  message: 'Please enter a valid Phone number',
                },
              ]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="Primary Contact Mobile"
              name="PrimaryContactMobile"
              onChangeFunction={handleChange}
              className=""
              placeholder="Enter Primary Contact Mobile"
              inputType="text"
              suffix={<PhoneOutlined />}
              rules={[
                { required: true },
                {
                  pattern: mobileNoRegEx,
                  message: 'Please enter a valid mobile number',
                },
              ]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="Primary Contact Email"
              name="Email"
              disabled={true}
              className=""
              inputType="text"
              suffix={<MailOutlined />}
              rules={[{ required: true }]}
            />
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 20, lg: 30 }}>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 16 }}>
            <FormItemInputComponent
              label="Address"
              name="Address"
              onChangeFunction={handleChange}
              className=""
              placeholder="Enter Address"
              inputType="text"
              suffix={<EnvironmentOutlined />}
              rules={[{ required: true }]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <FormItemInputComponent
              label="City"
              name="City"
              onChangeFunction={handleChange}
              className=""
              placeholder="Enter City"
              inputType="text"
              suffix={<EnvironmentOutlined />}
              rules={[{ required: true }]}
            />
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item label="State" name="State" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Choose State"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                style={{ width: '100%' }}
                onSelect={(event) =>
                  handleChange({ target: { name: 'State', value: event } })
                }
                options={states}
              />
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item
              label="Country"
              name="Country"
              rules={[{ required: true }]}>
              <Select
                disabled={true}
                placeholder="Choose Country"
                optionFilterProp="children"
                style={{ width: '100%' }}
                onSelect={(event) =>
                  handleChange({ target: { name: 'Country', value: event } })
                }
                options={defaultCountries}
              />
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <FormNumberItemInputComponent
              label="Zip"
              name="Zip"
              onChange={handleChange}
              className="remove-control"
              placeholder="Enter Zipcode"
              rules={[
                {
                  max: 5,
                  message: 'Zip code is only 5 digit long',
                },
                { required: true },
              ]}
              max={5}
            />
          </Col>

          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item label="Bureau Status" name="Status">
              <Select
                showSearch
                placeholder="Choose Bureau Status"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '')
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? '').toLowerCase())
                }
                style={{ width: '100%' }}
                onSelect={(event) =>
                  handleChange({ target: { name: 'Status', value: event } })
                }
                options={bureauStatus}
              />
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item
              label="Payroll Software"
              name="PayrollSoftware"
              rules={[{ required: true }]}>
              <Select
                placeholder="Software you use to process payroll"
                optionFilterProp="children"
                style={{ width: '100%' }}
                options={payrollSoftwares}
                onSelect={(event) =>
                  handleChange({
                    target: { name: 'PayrollSoftware', value: event },
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}>
            <Form.Item label="Sample File" name="SampleFile">
              <Upload accept=".csv" {...props} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload File here</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className="bottom-btn-section">
            <Button
              onClick={() => {
                navigate('/bureaus');
              }}
              className="btn-link">
              Cancel
            </Button>
            <Button htmlType="submit" className="common-btn">
              {formTitle === 'bureau/create' ? 'Send invite' : 'Save'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default BureauEditFormComponent;
