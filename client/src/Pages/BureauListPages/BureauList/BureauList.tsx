import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Layout, Button, Table, Modal, Tooltip } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from 'antd/es/table';

// Networking
import api from '../../../Network/interceptor';
import { apiRoutes } from '../../../Network/apiRoutes';

// Components
import {
  PageContentHeader,
  HeaderBar,
  Sidebar,
  Loader,
} from '../../../Components';

import { SorterResult } from 'antd/es/table/interface';

// Images
import images from '../../../Assets/Images';

// Css
import './BureauList.css';

const { Content } = Layout;
const { confirm } = Modal;

interface BureauData {
  IsActive: boolean;
  ID: number;
  User: { LegalName: string };
  EmployerCount: number;
  Status: string;
  CreatedAt: string;
}

type ISortOrder = 'ascend' | 'descend' | undefined;

function BureauList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<ISortOrder>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isStatusChange, setIsStatusChange] = useState<boolean>(false);
  const [bureauList, setBureauList] = useState<BureauData[]>([]);

  const navigate = useNavigate();

  const PAGE_SIZE = 10;

  /**
   * Handles a change in pagination page by updating the current page number.
   * @param {number} page The new page number.
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Handles change events for table filters and sorting, updating the sorting field and order state accordingly.
   * @param {PaginationConfig} pagination The pagination configuration.
   * @param {Record<string, (Key | boolean)[] | null>} filters The filters applied to the table.
   * @param {SorterResult<BureauData> | SorterResult<BureauData>[]} sorter The sorting configuration.
   */
  const onFilterChange: TableProps<BureauData>['onChange'] = (
    pagination,
    filters,
    sorter: SorterResult<BureauData> | SorterResult<BureauData>[],
  ) => {
    let sort = sorter;
    if (sort && Array.isArray(sort)) {
      sort = sort[0];
    }
    if (sort.field === 'User') {
      setSortField('LegalName');
    } else {
      setSortField(sort.field as string);
    }
    setSortOrder(sort.order as ISortOrder);
  };

  /**
   * Handles search functionality by updating the search query and resetting the pagination to the first page.
   * @param {string} query The search query.
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handlePageChange(1);
  };

  /**
   * Handles the deletion of a bureau by sending a delete request to the delete bureau API.
   * @param {number} id The ID of the bureau to be deleted.
   */
  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(apiRoutes.bureau + `/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  /**
   * Handles the re-invitation of a bureau by sending a POST request to the bureau invite API.
   * @param {number} id The ID of the bureau to be re-invited.
   */
  const handleReInviteBureau = async (id: number) => {
    try {
      const response = await api.post(apiRoutes.bureau + `/${id}/invite`);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  /**
   * Handles the change of status for a bureau by sending a POST request to the API.
   * @param {number} id The ID of the bureau whose status is being changed.
   * @param {string} status The new status to be assigned to the bureau.
   */
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const data = {
        Status: status,
      };
      const response = await api.post(
        apiRoutes.bureau + `/${id}/status-change`,
        data,
      );
      if (response.status === 200) {
        if (isStatusChange === false) {
          setIsStatusChange(true);
        } else {
          setIsStatusChange(false);
        }
        toast.success(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  };

  /**
   * Navigates to the edit page of a specific bureau.
   * @param {number} id The ID of the bureau to be edited.
   */
  const onEditClick = (id: number) => {
    navigate(`/bureau/edit/${id}`);
  };

  /**
   * Displays a confirmation modal for deleting a bureau.
   * @param {number} id The ID of the bureau to be deleted.
   */
  const showDeleteConfirm = (id: number) => {
    const modal = confirm({
      title: 'Are you sure you want to delete the Bureau?',
      wrapClassName: 'delete-modal-wrapper',
      className: 'delete-modal',
      okText: 'Yes',
      cancelText: 'No',
      width: 592,
      centered: true,
      closable: true,
      onOk() {
        if (id !== null) {
          handleDelete(id);
          if (isDeleting === false) {
            setIsDeleting(true);
          } else if (isDeleting === true) {
            setIsDeleting(false);
          }
        }
      },
      onCancel() {
        modal.destroy();
      },
    });
  };

  /**
   * Fetches a list of bureaus from the bureaus listing API based on pagination, sorting, and search parameters.
   */
  const fetchBureauList = async () => {
    setIsLoading(true);

    try {
      let tempSortOrder = '';
      if (sortField && sortOrder) {
        tempSortOrder = `${sortOrder === 'ascend' ? 'ASC' : 'DESC'}`;
      }
      const response = await api.get(
        apiRoutes.bureau +
          `?PageNumber=${
            currentPage - 1
          }&PageSize=${PAGE_SIZE}&SortBy=${sortField}&OrderBy=${tempSortOrder}&Search=${searchQuery}`,
      );
      setBureauList(response.data.data);
      setTotalPages(response.data.Pages);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBureauList();
  }, [
    currentPage,
    sortField,
    sortOrder,
    searchQuery,
    isDeleting,
    isStatusChange,
  ]);

  const columns: ColumnsType<BureauData> = [
    {
      title: 'Name',
      dataIndex: 'User',
      key: 'User',
      render: (item) => item.LegalName,
      sorter: (a, b) => a.User.LegalName.localeCompare(b.User.LegalName),
    },
    {
      title: 'Employer Count',
      dataIndex: 'EmployerCount',
      key: 'EmployerCount',
      sorter: (a, b) => a.EmployerCount - b.EmployerCount,
      render: (EmployerCount) => {
        return (
          <p className="count">{EmployerCount === 0 ? '-' : EmployerCount}</p>
        );
      },
    },
    {
      title: 'Status',
      key: 'Status',
      dataIndex: 'Status',
      sorter: true,
      render: (Status) => {
        let classText = '';
        switch (Status) {
          case 'Pending':
            classText = 'pending';
            break;
          case 'Active':
            classText = 'active';
            break;
          case 'Blocked':
            classText = 'blocked';
            break;
        }
        return <p className={classText}>{Status}</p>;
      },
    },
    {
      title: 'Starting Date',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      sorter: true,
      render: (CreatedAt) => {
        const date = new Date(CreatedAt);
        return <p>{date.toLocaleDateString('en-US')}</p>;
      },
    },
    {
      title: '',
      key: 'action',
      render: (_, record: BureauData) => {
        return (
          <div className="action-box" key={record.ID}>
            <Tooltip title="Edit Bureau">
              <Button
                className="action-btn"
                onClick={() => onEditClick(record.ID)}>
                <img src={images.Edit} alt="edit" />
              </Button>
            </Tooltip>
            {record.IsActive ? (
              <Tooltip title="Delete Bureau">
                <Button
                  className="action-btn"
                  onClick={() => showDeleteConfirm(record.ID)}>
                  <img src={images.Delete} alt="delete" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Disabled">
                <Button className="action-btn">
                  <img src={images.Delete} alt="delete" />
                </Button>
              </Tooltip>
            )}
            {record.Status === 'Blocked' ? (
              <Tooltip title="Unblock Bureau">
                <Button
                  className="action-btn"
                  onClick={() => handleStatusChange(record.ID, 'Active')}>
                  {' '}
                  <img src={images.UnBlock} alt="block" />{' '}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Block Bureau">
                <Button
                  className="action-btn"
                  onClick={() => handleStatusChange(record.ID, 'Blocked')}>
                  {' '}
                  <img src={images.Block} alt="unblock" />{' '}
                </Button>
              </Tooltip>
            )}
            {record.Status === 'Pending' ? (
              <Tooltip title="Mail">
                <Button
                  className="action-btn"
                  onClick={() => handleReInviteBureau(record.ID)}>
                  {' '}
                  <img src={images.Mail} alt="mail" />{' '}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Mail Disabled">
                <Button className="action-btn">
                  {' '}
                  <img src={images.MailDisabled} alt="mail-disabled" />{' '}
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const pageinationConfig: TablePaginationConfig = {
    current: currentPage,
    pageSize: PAGE_SIZE,
    total: totalPages ? totalPages * PAGE_SIZE : 0,
    showSizeChanger: false,
    showQuickJumper: false,
    onChange: handlePageChange,
    position: ['bottomCenter'],
  };

  return (
    <>
      {isLoading && <Loader />}
      <Layout className="layout_wrapper">
        <HeaderBar activePopupLink="" />
        <Layout>
          <Sidebar currentVal="bureaus" />
          <Content>
            <PageContentHeader
              headerTitle="List of Bureaus"
              showSearchBar={true}
              showStatus={false}
              MapSelect={false}
              searchText="Bureau"
              onSearchfunction={handleSearch}
            />
            <div className="list-table">
              <Table
                columns={columns}
                tableLayout="auto"
                dataSource={bureauList}
                pagination={pageinationConfig}
                scroll={{ x: 'max-content' }}
                onChange={onFilterChange}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default BureauList;
