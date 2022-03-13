import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import CommonsEditPage from "main/pages/CommonsEditPage";
import CommonsTableListPage from "main/pages/CommonsTableListPage"
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import PlayPage from "main/pages/PlayPage"; 


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/users" element={<AdminUsersPage />} />
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/createcommons" element={<AdminCreateCommonsPage />} />
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/edit/:id" element={<CommonsEditPage />} />
          }
          {
            hasRole(currentUser, "ROLE_ADMIN") && <Route path="/admin/listcommons" element={<CommonsTableListPage />} />
          }
          <Route path="/play/:commonsId" element={<PlayPage />} /> 
        </Routes>
      </BrowserRouter>
  );
}

export default App;
