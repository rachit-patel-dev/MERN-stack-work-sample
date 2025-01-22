import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Select, Input } from 'antd';

import { employerStatus, filterUserStatus } from '../../Static';

import { IEventTarget } from '../../types';

import images from '../../Assets/Images';

const { Search } = Input;

interface PageContentHeaderProps {
  headerTitle: string;
  showSearchBar: boolean;
  showStatus: boolean;
  MapSelect: boolean;
  onSearchfunction?: (value: string) => void;
  onStatusChangefunction?: (target: IEventTarget) => void;
  searchText?: string;
  providerData?: [];
  onProviderSelect?: (target: IEventTarget) => void;
  statusvalue?: string;
  fileTypeOptions?: [];
  onFileTypeSelect?: (target: IEventTarget) => void;
}

const PageContentHeader: React.FC<PageContentHeaderProps> = ({
  headerTitle,
  showSearchBar,
  showStatus,
  MapSelect,
  onSearchfunction,
  onStatusChangefunction,
  searchText,
  providerData,
  onProviderSelect,
  statusvalue,
  fileTypeOptions,
  onFileTypeSelect,
}) => {
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);

  /**
   * Toggles the visibility state of the search box.
   */
  const searchBoxOpen = () => {
    setSearchBoxVisible(!searchBoxVisible);
  };

  return (
    <div
      className={`page-content-header ${
        showSearchBar ? 'searchbox-header' : ''
      } ${MapSelect ? 'searchbox-header map-page-header' : ''} `}>
      <h3>{headerTitle}</h3>
      {showSearchBar || MapSelect ? (
        <div
          className={`pagecontent-header-rightbox ${
            showStatus ? 'employer-header-content' : ''
          }`}>
          {MapSelect && (
            <>
              <Select
                showSearch={false}
                className="vendor-select"
                placeholder="Choose Provider"
                style={{ width: 280 }}
                optionFilterProp="children"
                onSelect={(event) =>
                  onProviderSelect &&
                  onProviderSelect({
                    name: 'Provider',
                    value: event,
                  })
                }
                popupClassName="status-popup"
                options={providerData}
              />
              <Select
                showSearch={false}
                className="vendor-select"
                placeholder="Choose File Type"
                style={{ width: 280 }}
                optionFilterProp="children"
                onSelect={(event) =>
                  onFileTypeSelect &&
                  onFileTypeSelect({
                    name: 'FileType',
                    value: event,
                  })
                }
                popupClassName="status-popup"
                options={fileTypeOptions}
              />
            </>
          )}
          {showStatus && (
            <>
              <Select
                id="employer-status-filter"
                showSearch={false}
                placeholder="Employer Status"
                optionFilterProp="children"
                onChange={(event) => {
                  onStatusChangefunction &&
                    onStatusChangefunction({ name: 'user', value: event });
                }}
                popupClassName="status-popup"
                options={filterUserStatus}
              />
              <div>
                <Select
                  showSearch={false}
                  className="status-select"
                  placeholder="Status"
                  optionFilterProp="children"
                  onChange={(event) => {
                    onStatusChangefunction &&
                      onStatusChangefunction({
                        name: 'employer',
                        value: event,
                      });
                  }}
                  popupClassName="status-popup"
                  options={employerStatus}
                  value={statusvalue ? statusvalue : null}
                />
              </div>
            </>
          )}
          {showSearchBar ? (
            <div className="search-box">
              <Search
                className={`searchinput ${
                  searchBoxVisible ? 'searchboxopen' : 'searchboxclose'
                }`}
                placeholder={`Search ${searchText}`}
                allowClear
                enterButton={false}
                onSearch={onSearchfunction}
              />
              <img src={images.Search} alt="search" onClick={searchBoxOpen} />
            </div>
          ) : null}

          {showStatus && showSearchBar ? (
            <Link to="/employer/create" className="common-btn">
              Add employer
            </Link>
          ) : null}
          {showSearchBar && !showStatus ? (
            <Link to="/bureau/create" className="common-btn">
              Add bureau
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PageContentHeader;
