import { downloadXcelItem } from "../constants/operations";
import * as XLSX from "xlsx";

export async function downloadXcel([urlQuery, setSearchingVer, currentUser, updateCurrentUser,], fileName, sheetName, getReqHeaders) {
    setSearchingVer(true)
    downloadXcelItem(`${urlQuery}`, data => {
        console.log(data)
        if (Array.isArray(data)) {
            console.log("INSIDE IF")
            var requiredHeads = getReqHeaders(data)
            console.log("INSIDE IF1")
            const newbook = XLSX.utils.book_new()
            const temp = XLSX.utils.json_to_sheet(requiredHeads)
            XLSX.utils.book_append_sheet(newbook, temp, sheetName)
            XLSX.writeFile(newbook, fileName)
        }
        setSearchingVer(false)
    }, error => {
        console.log(error)
        console.log("ERROR")
        console.log("******************************************")
        setSearchingVer(false)
    }, currentUser, updateCurrentUser)
}

export async function downloadXcelOrg(fileName, sheetName, getReqHeaders, data) {
    var requiredHeads = getReqHeaders(data)
    const newbook = XLSX.utils.book_new()
    const temp = XLSX.utils.json_to_sheet(requiredHeads)
    XLSX.utils.book_append_sheet(newbook, temp, sheetName)
    XLSX.writeFile(newbook, fileName)
}