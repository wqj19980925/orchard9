import Cookies from 'js-cookie'
const TokenKey = 'api_token'
const proId = 'pro_id'//生产编号id
const newsId = 'news_info_id'//系统消息id
const TaskId = 'task_id'//农事任务id
const BaseId = 'base_id'//基地id
const PriId = 'pri_id'//权限id
const AdmName = 'admName'//用户姓名

export function getToken() {
	return Cookies.get(TokenKey)
}
export function setToken(token) {
	return Cookies.set(TokenKey, token)
}
export function removeToken() {
	return Cookies.remove(TokenKey)
}

export function getproId() {
	return Cookies.get(proId)
}
export function setproId(token) {
	return Cookies.set(proId, token)
}
export function removeproId() {
	return Cookies.remove(proId)
}

export function getnewsId() {
	return Cookies.get(newsId)
}
export function setnewsId(token) {
	return Cookies.set(newsId, token)
}
export function removenewsId() {
	return Cookies.remove(newsId)
}

export function getTaskId() {
	return Cookies.get(TaskId)
}
export function setTaskId(token) {
	return Cookies.set(TaskId, token)
}
export function removeTaskId() {
	return Cookies.remove(TaskId)
}

export function getBaseId() {
	return Cookies.get(BaseId)
}
export function setBaseId(token) {
	return Cookies.set(BaseId, token)
}
export function removeBaseId() {
	return Cookies.remove(BaseId)
}

export function getPriId() {
	return Cookies.get(PriId)
}
export function setPriId(token) {
	return Cookies.set(PriId, token)
}
export function removePriId() {
	return Cookies.remove(PriId)
}

export function getAdmName() {
	return Cookies.get(AdmName)
}
export function setAdmName(token) {
	return Cookies.set(AdmName, token)
}
export function removeAdmName() {
	return Cookies.remove(AdmName)
}