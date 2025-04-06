import { toast } from "react-toastify"

export function makeNotification(status, message) {
    toast[status](message)
}