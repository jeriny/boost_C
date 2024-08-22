import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App';
import Group from './pages/Group';
import MakeGroup from './pages/makeGroup';
import GroupAccess from './pages/GroupAccess';
import GroupEditModal from './pages/GroupEditModal';

function Main() {
  return (
    <BrowserRouter>
      <App>
        <Routes>
        <Route path="/" element={<Navigate replace to="/group/makegroup" />} />
          <Route path="group">
            <Route index element={<Group />} />
            <Route path="makegroup" element={<MakeGroup />} />
            <Route path="GroupAccess" element={<GroupAccess />} />
            <Route path="GroupEditModal" element={<GroupEditModal />} />
          </Route>
        </Routes>
      </App>
    </BrowserRouter>
  );
}

export default Main;
