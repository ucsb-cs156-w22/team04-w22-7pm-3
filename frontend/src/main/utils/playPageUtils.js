import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export function onDecrementSuccess(message) {
    console.log(message);
    toast(message);
}

export function onIncrementSuccess(message) {
    console.log(message);
    toast(message);
}
