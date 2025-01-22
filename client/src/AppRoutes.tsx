import React, { Suspense } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  BureauList,
  AddBureau,
  EditBureau,
  UploadMasterCSVFile,
  ErrorPage,
} from './Pages';

import PrivateRoutes from './PrivateRoutes';

import { Loader } from './Components';

export const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<PrivateRoutes />}>
              <Route path="/bureaus" element={<BureauList />} />
              <Route path="/bureau/create" element={<AddBureau />} />
              <Route path="/bureau/edit/:id" element={<EditBureau />} />
              <Route
                path="/upload/master-csv"
                element={<UploadMasterCSVFile />}
              />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};
