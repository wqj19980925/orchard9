<template>
  <div class="app_contain_box">
    <div class="form-show">
      <el-row class="lk-form-LandBox">
        <el-form
          ref="dataShowForm"
          :model="dataShowForm"
          label-width="80px"
          class="lk-disabl-form"
        >
          <el-col class='lk-form_col' :span='20'>
            <div class="fl">
              <el-col
                :span="7"
                class='lk-col-6'
              >
                <el-form-item
                  label="牧场名称"
                  prop="cultiv_name"
                >
                  <el-input
                    v-model="dataShowForm.cultiv_name"
                    :disabled="oldDataShow"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                class='lk-col-6'
              >
                <el-form-item
                  label="牧场面积"
                  prop="cultiv_acreage"
                >
                  <el-input
                    v-model="dataShowForm.cultiv_acreage"
                    :disabled="oldDataShow"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="7"
                class='lk-col-6'
              >
                <el-form-item
                  label="隶属地块"
                  prop="reg_name"
                >
                  <!-- <el-select
                    v-model="dataShowForm.reg_name"
                    disabled
                    placeholder="请选择"
                    @change="regChange($event)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.region_id"
                      :label="item.region_name"
                      :value="item.region_id"
                    />
                  </el-select> -->
                  <el-input
                    v-model="dataShowForm.reg_name"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                class='lk-col-6'
              >
                <el-form-item
                  label="负责人"
                  class="fl lk-time-cul"
                >
                  <el-select
                    v-model="dataShowForm.her_name"
                    disabled
                    placeholder="请选择"
                    @change="regChange($event)"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.region_id"
                      :label="item.region_name"
                      :value="item.region_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                class='lk-col-6'
              >
                <el-form-item label="联系电话">
                  <el-input
                    v-model="dataShowForm.her_tel"
                    disabled
                    placeholder
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-col>
          <el-col class='lk-col_3' :span='23'>
            <div>
              <el-button
                v-if="oldDataShow"
                type="primary"
                size="medium"
                @click="editbtn"
              >编辑</el-button>
              <el-button
                v-else
                :loading="subILoading"
                type="primary"
                size="medium"
                @click="subMitbtn('dataShowForm')"
              >保存</el-button>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <span class="backBox">
        <el-button
          type="infor"
          @click="back()"
        >返回</el-button>
      </span>
    </div>
    <!-- 主题内容 -->
    <div class="land-contain">
    <!-- 区域地图 -->
    <!-- <div class="map-land"> -->
    <!-- <el-row class="sd-module-box">
              <baidu-map :center="center" :zoom="zoom" class="Bmap" @ready="handler">
              </baidu-map>
            </el-row> -->
    <mapEdit :reg-ids="cultId" />
    <!-- </div> -->
    </div>
  </div>
</template>
<script>
import { errorStatus } from '@/utils/index'
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import BMapLib from 'BMapLib'
import mapEdit from './mapEdit'
import { cultails } from '@/api/map'
export default {
  name: 'RegionList',
  components: { BaiduMap, mapEdit },
  props: {
    cultId: {
      type: Number,
      required: true
    },
  },

  data () {
    return {
      regIds: null,
      zoom: 3,
      center: { lng: 0, lat: 0 },
      drawingManager: '',
      BMap: '',
      map: '',
      dataShowForm: {},
      options: {},
      mapINfor: true,
      mapINfor1: false,
      oldDataShow: true,
      subILoading: false,
    }
  },
  watch: {
    cultId: {
      handler (newValue, oldValue) {
        this.pageInfor()
      },
      deep: true
    }
  },
  created () {
    this.pageInfor()
  },
  methods: {
    // 获取基本信息
    handler ({ BMap, map }) {
      // console.log('=-=-==', { BMap, map })
      this.BMap = BMap
      this.map = map
      this.center.lng = 118.1948711891
      this.center.lat = 24.4810250498
      this.zoom = 12
      map.enableScrollWheelZoom()
    },
    pageInfor () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const data = {}
      data.cultiv_id = this.cultId
      data.type = 1;
      cultails(data)
        .then(response => {
          loading.close()
          console.log('landList-', response.data)
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.dataShowForm = dataRep.data;
          }

          // var bz_arr = []

          // for (var i = 0; i < response.data.data.region_data.coordinate.length; i++) {
          //   var d = new BMap.Point(response.data.data.region_data.coordinate[i].lat, response.data.data.region_data.coordinate[i].lng)

          //   bz_arr.push(d)
          // }
          // // console.log('bz_arr', bz_arr)
          // var polygon = new BMap.Polygon(bz_arr, { strokeColor: response.data.data.region_data.color, fillColor: response.data.data.region_data.color, strokeWeight: 4, fillOpacity: 0.01 })

          // this.map.addOverlay(polygon)
        })
        .catch(Error => {
          loading.close()
        })
    },
    // landLISt (data) {
    //   landLISt(data).then(response => {
    //     const dataRep = response.data
    //     if (errorStatus(dataRep)) {
    //       this.list = dataRep.data.list_data
    //       this.currentPage = dataRep.data.page.page
    //       this.pageSize = dataRep.data.page.page_size
    //       this.totalNum = dataRep.data.page.count
    //     }
    //   })
    // },

    clickChange1 (num) {
      this.mapINfor1 = true
      this.mapINfor = false
      // console.log(this.map)
      this.regIds = this.regId
    },
    // 顶部显示信息-编辑
    editbtn () {
      this.oldDataShow = false
    },
    // 更改
    regChange (val) {
      // console.log('更改--', val)
      this.dataShowForm.region_id = val
      this.changeData = true
    },
    // 顶部 信息修改-提交
    subMitbtn () {
      this.subILoading = true
      const infor = this.dataShowForm;
      infor.cultiv_name = infor.cultiv_name;
      infor.cultiv_name = infor.cultiv_name;
      infor.cultiv_id = this.cultId
      infor.type = 3;
      // console.log('顶部 信息修改-提交', infor)
      cultails(infor)
        .then(response => {
          this.subILoading = false
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.oldDataShow = true
            this.$message.success(dataRep.data)
          }
        })
        .catch(Error => {
          this.subILoading = false;
          this.$message.error("提交失败")
          console.log('Error--', Error)
        })
    },
    // 增加
    addbtn () {
      this.elDia.title = '新增'
      this.elDia.show = true
      this.elDiaForm.add_time = ''
      this.elDiaForm.cultiv_thing = ''
      this.elDiaForm.details = ''
    },
    // 删除
    delBtn () {
      const chosed = this.chosed
      // console.log('chosed--', chosed)
      // console.log('---', chosed)
      if (chosed.length < 1) {
        this.$message.error('请选择要删除的分类!')
      } else {
        const data = {}
        data.culdet_id = []
        for (const i in chosed) {
          data.culdet_id.push(chosed[i].culdet_id)
        }
        this.$confirm('请确认,是否删除所选中的分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delChose(data)
            .then(response => {
              // console.log('delClas---', response)
              if (errorStatus(response.data)) {
                const LISTDATA = {}
                LISTDATA.cultiv_id = this.cultId
                this.landLISt(LISTDATA)
                this.$message.success('删除成功!')
              }
            })
            .catch(Error => {
              this.$message.error('请求失败')
            })
        })
      }
    },
    // 新增-提交--编辑
    creatSub (formName) {
      this.$refs.elDiaForm.validate(valid => {
        if (valid) {
          const editLandId = this.editLandId

          if (editLandId === null) {
            // 提交
            const data = this.elDiaForm
            data.cultiv_id = this.cultId
            addcult(data).then(response => {
              if (errorStatus(response.data)) {
                this.$message.success(response.data.data)
                this.elDia.show = false
                const LISTDATA = {}
                LISTDATA.cultiv_id = this.cultId
                this.landLISt(LISTDATA)
              }
            })
          } else {
            // 编辑
            const data = this.elDiaForm
            data.culdet_id = editLandId
            addcult(data).then(response => {
              if (errorStatus(response.data)) {
                this.$message.success(response.data.data)
                this.elDia.show = false
                const LISTDATA = {}
                LISTDATA.cultiv_id = this.cultId
                this.landLISt(LISTDATA)
              }
            })
          }
        } else {
          this.$message.error('登录信息错误!!')
        }
      })
    },
    // 编辑 本条数据
    editLand (row) {
      // console.log('row--', row)
      this.elDia.title = '编辑'
      this.elDia.show = true
      this.editLandId = row.culdet_id
      this.elDiaForm.add_time = row.add_time
      this.elDiaForm.cultiv_thing = row.cultiv_thing
      this.elDiaForm.details = row.details
    },
    // 删除本条信息
    delLand (row) {
      // console.log('row--', row)
      const data = {}
      data.culdet_id = row.culdet_id
      delChose(data).then(response => {
        // console.log('delClas---',/ response)
        if (errorStatus(response.data)) {
          const LISTDATA = {}
          LISTDATA.cultiv_id = this.cultId
          this.landLISt(LISTDATA)
          this.$message.success('删除成功!')
        }
      })
    },
    back () {
      this.$emit('listerToChild', 'addPage')
    },
    // 选中状态
    handleSelectionChange (val) {
      // console.log('选中--', val)
      this.chosed = val
    },
    // 页面--分页器
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      if (this.search_req) {
        this.searchList(val)
      } else {
        const LISTDATA = {}
        LISTDATA.cultiv_id = this.cultId
        this.landLISt(LISTDATA)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/common.scss";
.app_contain_box {
  min-width: 770px;
  .form-show {
    @include clearfix;
    .lk-form-LandBox {
      // width:700px;
      max-width: 89%;
      float: left;
      background-color: #fff;
      padding-top:7px;
      .lk-disabl-form {
        .lk-form_col {
          min-width: 600px;
          float: left;
          .lk-col-6 {
            min-width: 220px;
          }
        }

        .lk-col_3 {
        width: 100px;
          float: right;
        }
        .lk-time-cul {
          .lk-culChose-time {
            width: 160px;
          }
        }
        .userYear {
          width: 65px;
        }
      }
    }
    .backBox {
      width: 70px;
      display: block;
      float: right;
    }
  }
  .land-contain {
   width:100%;
  }
}
</style>
<style>
.form-show .el-input.is-disabled .el-input__inner {
  color: #333;
}
</style>

