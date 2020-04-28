<template>
  <div class="mapList-container" >
    <el-row class="sd-module-box">
      <el-container>
        <el-header v-if="hed">
          <div class="sd-moudle-header mar-bot-10">
            <div class="sd-module-title">地块列表</div>
            <div class="sd-module-btn"/>
          </div>
        </el-header>
        <el-container v-if="swi">
          <!-- 左侧导航 -->
          <el-aside style="background:#fff; width:200px;">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose">
              <el-submenu v-for="item in region_data" :index="'id'+item.region_id " :key="item.region_id">
                <template slot="title">
                  <span>{{ item.region_name }}</span>
                </template>
                <el-submenu v-for="item1 in item.massif" :index="'id'+item1.region_id " :key="item1.region_id">
                  <template slot="title">{{ item1.region_name }}</template>
                  <el-menu-item-group v-for="item2 in item1.cultiv" :key="item2.cultiv_id">
                    <el-menu-item :index="'id'+item2.region_id " @click="jumps(item1.region_id,item2.cultiv_id)">{{ item2.cultiv_name }}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 右侧列表 -->
          <el-main class="right-list">
            <!-- 显示信息 -->
            <div v-if="!showRegion">
              <!-- <div class="add-btn-box">
                <el-button type="primary" class="fr" @click="addRegion">增加</el-button>
              </div> -->
              <div v-for="land in list" :key="land.region_id" class="land-list">
                <!-- <div class="land-list-title">{{ land.region_name }}</div> -->
                <div class="land-infor-box">
                  <div v-for="item in land.list" :key="item.region_id" class="land-infor" @click="jump(land.region_id,item.region_id,item.son_id)">
                    <span class="top-left-tip">{{ item.explode }}</span>
                    <div class="centert-tip" v-if="2 == item.cultiva"><span class="centert-tit">土地重新培育</span><br><span class="center-tim">{{ item.cultiva_time }}</span></div>
                    <img :src="baseUrl + item.reg_image" :class="item.son_id===3?'land-infor-img curson':'land-infor-img'" alt>
                    <div class="land-infor-text">
                      <div class="lanInfor-text">
                        <div class="landInfor-name">{{ item.region_name }}</div>
                        <div class="landInfor-num">
                          总亩数:
                          <span>{{ item.acreage }}</span>
                        </div>
                      </div>
                      <div class="del-box">
                        <i v-if="btnShow.delBtn" class="el-icon-delete" @click.stop="delList(land,item.son_id,item.region_id)"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <regionList v-if="showRegion" :cult-id="cult_Id" :reg-id="reg_id" @listerToChild="showListPages()"/>
          </el-main>
          <!-- 提示框 -->
          <el-dialog
            title="提示"
            :visible.sync="dialogVisibles"
             width="30%"
            :before-close="handleClose">
            <span>确认要删除此条数据吗！！</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="qx_dialogVisible()">取 消</el-button>
              <el-button type="primary" @click="dialogVisible()">确 定</el-button>
            </span>
          </el-dialog>
        </el-container>
          <!-- 地图组件 -->
          <div v-if="mapINfor" class="map-land" >
            <digtalMapsRe :reg-ids="cultId" @listerToChild="showListPages()"/>
          </div>
      </el-container>
    </el-row>
  </div>
</template>
<script>
import { getList, massiflist, deltlandata} from '@/api/map'
import { errorStatus } from '@/utils/index'
import regionList from './components/regionList'
import digtalMapsRe from './components/digtalMaps_re'

export default {
  name: 'Land',
  components: { regionList,digtalMapsRe },
  data() {
    return {
      dialogVisibles : false,
      cultId: null,
      mapINfor: false,
      showRegion: false,
      cult_Id: null,
      hed: true,
      list: {},
      reg_id: null,
      swi: true,
      showReg_id: 13,
      baseUrl: process.env.BASE_API,
      img_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg==',
      currentDate: new Date(),
      region_data: [],
      btnShow: {},
      add_da: [],
    }
  },
  created() {
    // 页面加载时
    this.getSalesInfo()
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      const id = Number(key.slice(2))
      this.getListData(id)
      // this.cult_Id = id
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    // 加载页面
    getSalesInfo() {
      this.region_data = [];
      const data = {}
      data.pri_id = this.$route.meta.pri_id
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      massiflist(data)
        .then(response => {
          loading.close()
          console.log('获取地块列表', response.data)
          if (errorStatus(response.data)) {
            const that =this;
            for (let i in response.data.data) {
              that.region_data.push(response.data.data[i]);
              console.log(typeof(i))
              if( Number(i) === 0){
                console.log("--"+i)
                that.getListData(response.data.data[0].region_id);
                that.cult_Id=response.data.data[0].region_id
              }
            }
            // that.cult_Id = response.data.data[1].region_id
            // console.log(this.region_data)
            const btnList = response.data.button
            console.log("btnList--",btnList)
            for (const i in btnList) {
              if (btnList[i].pri_funname === '耕地详情列表') {
                this.$set(that.btnShow, 'landDet', true)
              } else if (btnList[i].pri_funname === '删除') {
                this.$set(that.btnShow, 'delBtn', true)
              }
            }
            this.btnShow=that.btnShow;
            console.log("this.btnShow--",this.btnShow)
          }
        })
        .catch(Error => {
          loading.close()
          console.log(Error.data)
        })
    },
    // 获取 地块列表
    getListData(id) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const Url = process.env.BASE_API
      const str = Url.replace('public', '')
      this.baseUrl = str
      const listData = {}
      listData.region_id = id
      getList(listData).then(Response => {
        loading.close()
        console.log('列表--', Response)
        if (errorStatus(Response.data)) {
          this.list = Response.data.data
        }
      }).catch(Error => {
        loading.close()
      })
    },
    // 删除
    delList(row,son_id,types) {
        this.$confirm('请确认,是否删除此条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const data = {}
            data.type = son_id;
            data.lan_id = types;
            deltlandata(data)
            .then(response => {
              console.log(response)
              if (errorStatus(response.data)) {
                this.dialogVisibles = false;
                this.$message.success('删除成功')
                this.getSalesInfo()
              }
            }).catch(Error => {
              console.log('Error==', Error)
            })
        })
    },
    // 添加-显示弹窗
    addRegion() {

    },
    // 跳转 进入详情
    jump(regId, id, ic) {
      console.log("regId",regId)
      console.log("id",id)
      const goDeta = this.btnShow.landDet;
      console.log("按钮权限---",this.btnShow.landDet)
      if (goDeta) {
        console.log("goDeta")
        if (ic === 3) {
        console.log(333);
          this.showRegion = true
          this.reg_id = regId
          this.cult_Id = id
        }else{
          this.swi = false;
          this.mapINfor = true;
          this.cultId = id
          this.hed = false;
        }
      }
    },
    jumps(regId, id) {
      console.log("regId",regId)
      console.log("id",id)
      const goDeta = this.btnShow.landDet
      if (goDeta) {
        this.showRegion = true
        this.reg_id = regId
        this.cult_Id = id
      }
    },
    showListPages() {
      this.showRegion = false
      this.getListData(this.reg_id)
      this.mapINfor = false
      this.swi = true;
      this.hed = true;
      this.getSalesInfo()

    },
    next_map(id) { 
      
    },
    qx_dialogVisible() {
      this.dialogVisibles = false;
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mapList-container{
  min-width:1200px;
  .sd-module-box {
    background-color:#f0f2f5;
    .sd-moudle-header{
      height:55px!important;
      padding-top:12px!important;
    }
    .right-list {
      padding-top:10px;
      .add-btn-box {
        height: 30px;
      }
      .land-list {
        .land-list-title {
          line-height:50px;
          height:50px;
          // background-color: #eee;
          padding-left:10px;
          // margin-bottom:6px;
        }
      }
      .land-infor-box {
        padding:15px 0 0 15px;
        background-color:#fff;
        .land-infor {
          display: inline-block;
          width: 170px;
          // height: 200px;
          margin: 0px 25px 6px 0;
          position: relative;
          .top-left-tip {
            position: absolute;
            display: block;
            width: 40px;
            height: 24px;
            background-color: #666;
            color: #fff;
            text-align: center;
            line-height: 24px;
            border-radius: 4px;
          }
          .centert-tip{
            position: absolute;
            background: #ffffff8a;
            top: 0;
            left: 0;
            width: 100%;
            height: 70%;
            text-align: center;
            color: red;
            padding-top: 55px;
            line-height: 20px;
            .centert-tit{
              font-size: 21px;
            }
          }
          .land-infor-img {
            width: 170px;
            height: 150px;
            &.curson{
              cursor:pointer;
            }
          }
          .land-infor-text {
            .lanInfor-text {
              padding: 10px 0px 0 10px;
              float: left;
              font-size: 16px;
              color: #5f5c63;
              width: 130px;
              .landInfor-num {
                line-height: 24px;
                font-size: 14px;
              }
            }
            .del-box {
              float: right;
              width: 30px;
              height: 60px;
              padding: 15px 0;
              .el-icon-delete {
                font-size: 26px;
                color: #918f93;
                cursor: pointer;
              }
              .el-icon-delete:focus {
                color: #5f5c63;
              }
              .map-land{
                width: 100%;
                height: 100%;
              }
            }

          }
        }
      }
    }
  }
}
</style>

