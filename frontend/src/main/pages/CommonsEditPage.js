import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CreateCommonsForm from "main/components/Commons/CreateCommonsForm.js";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CommonsEditPage() {
  let { id } = useParams();

  const { data: common, error: error, status: status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/commons?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/commons`,
        params: {
          id
        }
      }
    );

  const objectToAxiosPutParams = (common) => ({
    url: "/api/commons",
    method: "PUT",
    params: {
      id: common.id,
    },
    data: //common, 
    {
      milkPrice: common.milkPrice,
      name: common.name,
      cowPrice: common.cowPrice,
      startingBalance: common.startingBalance,
      startDate: new Date(common.startDate)
    }
  });

  const onSuccess = (common) => {
    toast(`Common Updated - id: ${common.id} name: ${common.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/commons?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/admin/listcommons" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Common</h1>
        {common &&
          <CreateCommonsForm initialCommon={common} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}