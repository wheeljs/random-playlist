import { HashRouter, Routes, Route } from 'react-router-dom';
import WorkspaceIndex from './containers/WorkspaceIndex';

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WorkspaceIndex />} />
      </Routes>
    </HashRouter>
  );
}
