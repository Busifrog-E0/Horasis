import { redirect } from "react-router-dom";
export async function requireAuth() {
  const isLoggedIn = true;
  // auth function goes here
  if (!isLoggedIn) {
    throw redirect("/SignIn");
  }
}

// import { useContext } from "react";
// import { redirect } from "react-router-dom";
// import { _retrieveData } from "./LocalStorage";

// export async function requireAuth() {
//   let User = _retrieveData("currentUserData")
//   if (!User || !User.CurrentUser) {
//     throw redirect("/SignIn");
//   }
// }
