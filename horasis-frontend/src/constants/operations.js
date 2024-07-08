import axios from "axios"
import { CURRENTUSERDATA, _retrieveData } from "../utils/LocalStorage"

// export const DEBUG_API = "https://vitaldebug.ibisapp.in/"

export const DEBUG_API = "https://debugapi.vitaljobs.in/"
export const DEBUG_API_debug = "https://debugapi.vitaljobs.in/"
export const PRODUCTION_API = "https://api.vitaljobs.in/"

var retryCountForPatch = 0
var retryCountForPost = 0
var retryCountForGet = 0
var retryCountForDelete = 0
const maxRetriesForRefreshToken = 3

const refreshToken = async (updateCurrentUser, currentUserData) => {
  var tokenToBeRefreshed = _retrieveData(CURRENTUSERDATA)
    ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
    : null
  var refreshToken = _retrieveData(CURRENTUSERDATA)
    ? JSON.parse(_retrieveData(CURRENTUSERDATA)).RefreshToken
    : null

  await axios
    .post(
      PRODUCTION_API + "api/" + "RefreshToken",
      {
        Token: tokenToBeRefreshed,
        RefreshToken: refreshToken,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToBeRefreshed}`,
        },
        mode: "no-cors",
      }
    )
    .then(async (result) => {
      await updateCurrentUser({ ...currentUserData, ...result.data })
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        }
      }
    })
}

export const postItem = async (
  url,
  data,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios.post(PRODUCTION_API + "api/" + url, data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
        ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
        : null
        }`,
    },
    mode: "no-cors",
  })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      console.log("INSIDE CATCH 1")
      if (err.response) {
        console.log("INSIDE CATCH 2")
        if (err.response.status === 401) {
          console.log("INSIDE CATCH 3")
          await refreshToken(updateCurrentUser, currentUserData)
          await postItem(
            url,
            data,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else {
          console.log("INSIDE CATCH 4")
          errorCallback(err.response.data)
        }
      } else {
        console.log("INSIDE CATCH 5")
        errorCallback("Something happened!")
      }
      // console.log("INSIDE CATCH 6")
      // errorCallback(err)
    })
}

export const postItemDebug = async (
  url,
  data,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .post(DEBUG_API_debug + "api/" + url, data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      console.log("INSIDE CATCH 1")
      if (err.response) {
        console.log("INSIDE CATCH 2")
        if (err.response.status === 401) {
          console.log("INSIDE CATCH 3")
          await refreshToken(updateCurrentUser, currentUserData)
          await postItem(
            url,
            data,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else {
          console.log("INSIDE CATCH 4")
          errorCallback(err.response.data)
        }
      } else {
        console.log("INSIDE CATCH 5")
        errorCallback("Something happened!")
      }
      // console.log("INSIDE CATCH 6")
      // errorCallback(err)
    })
}

export const patchItemDebug = async (
  url,
  data,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .patch(DEBUG_API + "api/" + url, data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await patchItem(
            url,
            data,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}

export const patchItem = async (
  url,
  data,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .patch(PRODUCTION_API + "api/" + url, data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await patchItem(
            url,
            data,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}

export const deleteItem = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .delete(PRODUCTION_API + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await deleteItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}

export const deleteUserItem = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .delete(DEBUG_API_debug + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await deleteUserItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}
export const getItem = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .get(PRODUCTION_API + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await getItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}
export const getItemDebug = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .get(DEBUG_API_debug + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await getItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}
export const getAnalyticsItem = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .get(DEBUG_API_debug + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await getItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}

export const downloadXcelItem = async (
  url,
  successCallback,
  errorCallback,
  updateCurrentUser,
  currentUserData
) => {
  axios
    .get(DEBUG_API_debug + "api/" + url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${_retrieveData(CURRENTUSERDATA)
          ? JSON.parse(_retrieveData(CURRENTUSERDATA)).Token
          : null
          }`,
      },
      mode: "no-cors",
    })
    .then((result) => {
      successCallback(result.data)
    })
    .catch(async (err) => {
      if (err.response) {
        if (err.response.status === 401) {
          await refreshToken(updateCurrentUser, currentUserData)
          await downloadXcelItem(
            url,
            successCallback,
            errorCallback,
            updateCurrentUser,
            currentUserData
          )
        } else if (err.response.status === 445) {
          localStorage.clear()
          window.location.reload()
        } else {
          errorCallback(err.response.data)
        }
      } else {
        errorCallback("Something happened!")
      }
    })
}
