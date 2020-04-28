import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token'
const userKey = 'userid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserid() {
  return Cookies.get(userKey)
}

export function setUserid(userid) {
  return Cookies.set(userKey, userid)
}

export function removeUserid() {
  return Cookies.remove(userKey)
}
