import React, { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';
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
import { FormItemInputComponent, FormNumberItemInputComponent } from '../index';

// Networking
import api from '../../Network/interceptor';
import { apiRoutes } from '../../Network/apiRoutes';

import { RcFile } from 'antd/es/upload';

import {
  states,
  defaultCountries,
  payrollSoftwares,
  mobileNoRegEx,
  phoneNoRegEx,
} from '../../Static';

import { ICustomEvent } from '../../types';

// Images
import images from '../../Assets/Images';

interface IFormValues {
  Email: string;
  LegalName: string;
  PrimaryContact: string;
  PrimaryContactPhoneNumber: string;
  PrimaryContactMobile: string;
  PayrollSoftware: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  Zip: string;
  SampleFile: RcFile | null;
}
const validateMessages = {
  required: '${label} is required!',
};

interface IBureauFormProps {
  formTitle: string;
}

const BureauFormComponent: FC<IBureauFormProps> = ({ formTitle }) => {
  const [formData, setFormData] = useState<IFormValues>({
    Email: '',
    LegalName: '',
    PrimaryContact: '',
    PrimaryContactPhoneNumber: '',
    PrimaryContactMobile: '',
    PayrollSoftware: '',
    Address: '',
    City: '',
    State: '',
    Country: 'US',
    Zip: '',
    SampleFile: null,
  });

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
      | ICustomEvent,
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles form submission by preventing the default behavior, validating form fields, and submitting bureau data to the Add bureau API.
   * @param {React.FormEvent<HTMLFormElement>} event The form submission event.
   */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedFields = await form.validateFields();
    if (validatedFields) {
      try {
        const response = await api.post(apiRoutes.bureau, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
    accept: 'text/csv',
    onChange(info) {
      setFormData({
        ...formData,
        SampleFile: info?.file?.originFileObj || null,
      });
    },
  };

  return (
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
            onChangeFunction={handleChange}
            className=""
            placeholder="Enter Primary Contact Email"
            inputType="email"
            suffix={<MailOutlined />}
            rules={[{ type: 'email', required: true }]}
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
          <Form.Item label="Country" name="Country">
            <Select
              defaultValue="US"
              disabled={true}
              placeholder="Choose Country"
              optionFilterProp="children"
              style={{ width: '100%' }}
              options={[defaultCountries]}
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
            <Upload {...props} maxCount={1}>
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
  );
};

export default BureauFormComponent;
