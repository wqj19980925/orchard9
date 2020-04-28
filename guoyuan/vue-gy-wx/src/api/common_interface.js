import request from '@/utils/request'
//接口
export function commonInterfaceCode(data) {
    // console.log("接口--",data)
    return request({
        method: 'post',
        data
    })
}
