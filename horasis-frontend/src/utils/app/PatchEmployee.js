import { patchItem } from "../../constants/operations"

export const PatchEmployee = (api = "", updateCurrentUser, EmployeeId, currentUserData, currentUserProfile, successCallback, errorCallback) => {
    patchItem(`${"employees/"}${EmployeeId}${api}`, currentUserProfile, result => {
        successCallback(result)

    }, (err) => {
        errorCallback(err)

    }, updateCurrentUser, currentUserData)

}