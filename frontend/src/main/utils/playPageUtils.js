import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export function onDecrementSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDecrement(commonsId) {
    return {
        url: `/api/usercommons/forcurrentuser/decrementCows?commonsId=${commonsId}`,
        method: "PUT",
        params: {
            commonsId: commonsId
        }
    }
}