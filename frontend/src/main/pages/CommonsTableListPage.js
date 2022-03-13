import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsTable from 'main/components/Commons/CommonsTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function CommonsTableListPage() {

  const currentUser = useCurrentUser();

  const { data: commons, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/commons/all"],
      { method: "GET", url: "/api/commons/all" },
      []
    )

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Commons Table</h1>
          <CommonsTable commons={commons} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}