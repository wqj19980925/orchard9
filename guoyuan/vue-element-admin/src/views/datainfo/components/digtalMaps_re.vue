<template>
  <div class="app-digtalMap">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">数字地图</div>
        <el-button plain style="float:right; margin-right:15px;" @click="back_map">返回</el-button>
      </div>
      <baidu-map :center="center" :zoom="zoom" class="Bmap" @ready="handler">
        <div class="">
          <ul class="map-header"/>
        </div>
        <!-- //============占地区域 -->
        <div v-if="form1" class="left_ale">
          <div class="left_title">编辑占地区域信息</div>
          <div class="left_form" style="top:10px;">
            <el-row>
              <el-col :span="8"><span>区域名称</span></el-col>
              <el-col :span="16"><el-input v-model="region_name" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>隶属农田</span></el-col>
              <el-col :span="16">
                <el-select v-model="value" placeholder="请选择" @change="massif_id_fun">
                  <el-option
                    v-for="item in nt_list[0]"
                    :key="item.massif_id"
                    :value="item.massif_name"/>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model=" mz " placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form"/>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px; width:130px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="dk_project">保存</a><a href="#" @click="x1">取消</a>
            <!-- <a class="col" href="#">删除</a> -->
          </div>
        </div>
        <!-- //============地块规划 -->
        <div v-if="form2" class="left_ale">
          <div class="left_title">编辑地块规划信息</div>
          <div class="left_form" style="top:10px;">
            <el-row>
              <el-col :span="8"><span>区域名称</span></el-col>
              <el-col :span="16"><el-input v-model="region_names" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form"/>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px; width:130px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="dk_projects">保存</a><a href="#" @click="x2">取消</a>
            <!-- <a class="col" href="#">删除</a> -->
          </div>
        </div>
      </baidu-map>
    </el-row>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import { landList, editcult, delChose, landLISt, addcult, getregion, nt_listss, editregion, editmassif } from '@/api/map'
import BMapLib from 'BMapLib'
export default {
  components: { BaiduMap },
  props: {
    regIds: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      zoom: 3,
      center: { lng: 0, lat: 0 },
      drawingManager: '',
      BMap: '',
      map: '',
      BMap: '',
      nt_list: [],
      massif_id: null,
      value: null,
      form1: false,
      form2: false,
      region_name: null,
      mz: null,
      color1: null,
      massif_id: null,
      img_base64: null,
      baseURL: process.env.BASE_API,
      commo_lon_lat: null,
      s: true,
      region_names: null,
      bj_massif_id: null
    }
  },
  created() {
    // 页面加载时
    this.default_map()
    this.cropland_list()
  },
  methods: {
    handler({ BMap, map }) {
      // console.log({ BMap, map })
      this.BMap = BMap
      this.map = map
      this.zoom = 13
      map.enableScrollWheelZoom()
    },
    back_map() {
      this.$emit('listerToChild', 'addPage')
    },
    x1() {
      this.form1 = false
    },
    x2() {
      this.form2 = false
    },
    // 渲染默认数据
    default_map() {
      const data = {}
      data.region_id = this.regIds
      getregion(data)
        .then(response => {
          // console.log('地区数据', response.data)
          if (response.data.code === 200) {
            // ===渲染占地区域
            if (response.data.data.region.type === 1) {
              this.region_name = response.data.data.region.region_name
              this.center.lng = response.data.data.region.coordinate[0].lng
              this.center.lat = response.data.data.region.coordinate[0].lat
              this.mz = response.data.data.region.region_acreage
              this.color1 = response.data.data.region.region_color
              // console.log(this.nt_list)
              this.value = response.data.data.massif_data[0].massif_name
              this.massif_id = response.data.data.massif_data[0].massif_id
              const baseUrl = this.baseURL
              const str = baseUrl.replace('public', '')
              this.img_base64 = str + response.data.data.region.reg_image
              this.commo_lon_lat = response.data.data.region.coordinate

              // ===渲染占地区域
              var bz_arr = []
              for (var j = 0; j < response.data.data.region.coordinate.length; j++) {
                var d = new BMap.Point(response.data.data.region.coordinate[j].lng, response.data.data.region.coordinate[j].lat)
                bz_arr.push(d)
              }
              var polygon = new BMap.Polygon(bz_arr, { strokeColor: response.data.data.region.region_color, fillColor: response.data.data.region.region_color, strokeWeight: 4, fillOpacity: 0.01 })

              this.map.addOverlay(polygon)
              // console.log(this.map)
              // polygon.overlay.enableEditing()
              var this_ = this
              this.map.addEventListener('click', function(e) {
                e.overlay.addEventListener('lineupdate', function(e) {
                  // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                  this_.commo_lon_lat = e.target.so
                })
                e.overlay.enableEditing()
                this_.form1 = true
              })
            } else if (response.data.data.region.type === 2) {
              // ===渲染地块区域

              this.center.lng = response.data.data.region.coordinate[0].lng
              this.center.lat = response.data.data.region.coordinate[0].lat
              this.region_names = response.data.data.region.region_name
              this.mz = response.data.data.region.region_acreage
              this.color1 = response.data.data.region.region_color
              this.commo_lon_lat = response.data.data.region.coordinate
              this.bj_massif_id = response.data.data.region.reg_parent_id
              const baseUrl = this.baseURL
              const str = baseUrl.replace('public', '')
              this.img_base64 = str + response.data.data.region.reg_image
              var bz_arr = []
              for (var j = 0; j < response.data.data.region.coordinate.length; j++) {
                var d = new BMap.Point(response.data.data.region.coordinate[j].lng, response.data.data.region.coordinate[j].lat)
                bz_arr.push(d)
              }
              var polygon = new BMap.Polygon(bz_arr, { strokeColor: response.data.data.region.region_color, fillColor: response.data.data.region.region_color, strokeWeight: 4, fillOpacity: 0.01 })

              this.map.addOverlay(polygon)

              var this_ = this

              this.map.addEventListener('click', function(e) {
                e.overlay.addEventListener('lineupdate', function(e) {
                  // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                  this_.commo_lon_lat = e.target.so
                })
                e.overlay.enableEditing()
                this_.form2 = true
              })
            }
          }
        })
        .catch(Error => {
          console.log(Error.data)
        })

      // console.log('---++', this.map)
    },
    cropland_list() {
      const data = {}
      nt_listss(data)
        .then(response => {
          this.nt_list[0] = response.data.data
        })
        .catch(Error => {
          console.log(Error.data)
        })
    },
    massif_id_fun() {
      for (var i = 0; i < this.nt_list[0].length; i++) {
        if (this.nt_list[0][i].massif_name === this.value) {
          this.massif_id = this.nt_list[0][i].massif_id
        }
      }
    },
    dk_project() {
      const data = {}
      data.region_id = this.regIds
      data.region_name = this.region_name
      data.massif_id = this.massif_id
      data.region_acreage	= this.mz
      data.region_color = this.color1
      data.region_slide = 50
      data.coordinate = this.commo_lon_lat
      if (this.s === true) {
        data.region_image = ''
      } else {
        data.region_image = this.img_base64
      }
      editregion(data)
        .then(response => {
          if (response.data.code === 200) {
            this.$message.success('编辑成功')
          } else {
            this.$message.success(response.data.data)
          }
        })
        .catch(Error => {
          console.log(Error.data)
          loading.close()
        })
    },
    dk_projects() {
      const data = {}
      data.region_name = this.region_names // 区域名称
      data.field_id = this.bj_massif_id // 区域id
      data.region_id = this.regIds
      data.region_acreage	 = this.mz // 面积
      data.region_color = this.color1
      data.region_slide = 30
      data.coordinate = this.commo_lon_lat
      if (this.s === true) {
        data.region_image = ''
      } else {
        data.region_image = this.img_base64
      }
      editmassif(data)
        .then(response => {
          if (response.data.code === 200) {
            this.$message.success('编辑成功')
          } else {
            this.$message.success(response.data.data)
          }
        })
        .catch(Error => {
          console.log(Error.data)
        })
    },
    massif_image(el) {
      // console.info(el.value)
      var reader = new FileReader()
      const that = this
      reader.onload = (function(file) {
        that.s = false
        return function(result) {
          that.img_base64 = this.result
        }
      })(el.target.files[0])
      reader.readAsDataURL(el.target.files[0])
    },
    // ==计算土地面积函数
    getArea(polygon) {
      const BMap = this.BMap
      // 检查类型：既不是百度类型的范围又不是数组类型的数据，直接返回0
      if (!(polygon instanceof BMap.Polygon) && !(polygon instanceof Array)) {
        return 0
      }

      // 如果是百度类型的，得到点集合，不是的话，另说。
      var pts = new Array()
      if (polygon instanceof BMap.Polygon) {
        pts = polygon.getPath()
      }

      // 判断数组的长度，如果是小于3的话，不构成面，无法计算面积
      if (pts.length < 3) {
        return 0
      }

      var totalArea = 0// 初始化总面积
      var LowX = 0.0
      var LowY = 0.0
      var MiddleX = 0.0
      var MiddleY = 0.0
      var HighX = 0.0
      var HighY = 0.0
      var AM = 0.0
      var BM = 0.0
      var CM = 0.0
      var AL = 0.0
      var BL = 0.0
      var CL = 0.0
      var AH = 0.0
      var BH = 0.0
      var CH = 0.0
      var CoefficientL = 0.0
      var CoefficientH = 0.0
      var ALtangent = 0.0
      var BLtangent = 0.0
      var CLtangent = 0.0
      var AHtangent = 0.0
      var BHtangent = 0.0
      var CHtangent = 0.0
      var ANormalLine = 0.0
      var BNormalLine = 0.0
      var CNormalLine = 0.0
      var OrientationValue = 0.0
      var AngleCos = 0.0
      var Sum1 = 0.0
      var Sum2 = 0.0
      var Count2 = 0
      var Count1 = 0
      var Sum = 0.0
      var Radius = 6378137.0// ,WGS84椭球半径
      var Count = pts.length
      for (var i = 0; i < Count; i++) {
        if (i === 0) {
          LowX = pts[Count - 1].lng * Math.PI / 180
          LowY = pts[Count - 1].lat * Math.PI / 180
          MiddleX = pts[0].lng * Math.PI / 180
          MiddleY = pts[0].lat * Math.PI / 180
          HighX = pts[1].lng * Math.PI / 180
          HighY = pts[1].lat * Math.PI / 180
        } else if (i === Count - 1) {
          LowX = pts[Count - 2].lng * Math.PI / 180
          LowY = pts[Count - 2].lat * Math.PI / 180
          MiddleX = pts[Count - 1].lng * Math.PI / 180
          MiddleY = pts[Count - 1].lat * Math.PI / 180
          HighX = pts[0].lng * Math.PI / 180
          HighY = pts[0].lat * Math.PI / 180
        } else {
          LowX = pts[i - 1].lng * Math.PI / 180
          LowY = pts[i - 1].lat * Math.PI / 180
          MiddleX = pts[i].lng * Math.PI / 180
          MiddleY = pts[i].lat * Math.PI / 180
          HighX = pts[i + 1].lng * Math.PI / 180
          HighY = pts[i + 1].lat * Math.PI / 180
        }
        AM = Math.cos(MiddleY) * Math.cos(MiddleX)
        BM = Math.cos(MiddleY) * Math.sin(MiddleX)
        CM = Math.sin(MiddleY)
        AL = Math.cos(LowY) * Math.cos(LowX)
        BL = Math.cos(LowY) * Math.sin(LowX)
        CL = Math.sin(LowY)
        AH = Math.cos(HighY) * Math.cos(HighX)
        BH = Math.cos(HighY) * Math.sin(HighX)
        CH = Math.sin(HighY)
        CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL)
        CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH)
        ALtangent = CoefficientL * AL - AM
        BLtangent = CoefficientL * BL - BM
        CLtangent = CoefficientL * CL - CM
        AHtangent = CoefficientH * AH - AM
        BHtangent = CoefficientH * BH - BM
        CHtangent = CoefficientH * CH - CM
        AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent))
        AngleCos = Math.acos(AngleCos)
        ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent
        BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent)
        CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent
        if (AM != 0) { OrientationValue = ANormalLine / AM } else if (BM != 0) { OrientationValue = BNormalLine / BM } else { OrientationValue = CNormalLine / CM }
        if (OrientationValue > 0) {
          Sum1 += AngleCos
          Count1++
        } else {
          Sum2 += AngleCos
          Count2++
        }
      }

      var tempSum1, tempSum2
      tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2)
      tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2
      if (Sum1 > Sum2) {
        if ((tempSum1 - (Count - 2) * Math.PI) < 1) { Sum = tempSum1 } else { Sum = tempSum2 }
      } else {
        if ((tempSum2 - (Count - 2) * Math.PI) < 1) { Sum = tempSum2 } else { Sum = tempSum1 }
      }
      totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius

      return totalArea // 返回总面积
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.app-digtalMap{
    padding: 20px;
    .sd-module-box{
        padding: 0;
        padding-top: 15px;
        .sd-moudle-header{
            margin: 0;
        }
    }
    .Bmap{
        height: 780px;
        width: 100%;
        position:relative;
        .map-header{
            position: absolute;
            top: 15px;
            left: 0;
            z-index: 10;
            width: 100%;
            display: flex;
            align-items: center;
            li{
                padding: 0;
                margin: 0;
                padding: 5px;
                margin-right: 10px;
                p{
                    padding: 0;
                    margin: 0;
                }
            }
        }
        .farm-li{
            background-color: #fff;
            display: inline-block;
            padding: 5px 5px;
            font-size: 8px;
            margin-left: 10px;
        }
        .farm-imgcenter{
            display: block;
            text-align: center;
        }
        .land-imgcenter{
            display: block;
            padding: 0 10px;
            font-size: 0;
            display: flex;
            justify-content: space-around;
        }
        .farm-img{
            display: inline-block;
            width: 30px;
            height: 30px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 50%;
        }
        .farm-top{
            display: block;
            padding-top:2px;
            font-style: normal;
        }
        .farm-tops{
            padding-top:5px;
        }
      .left_ale{
        position: absolute;
        right: 0;
        top: 0px;
        width: 300px;
        height: 780px;
        background: #fff;
        z-index:1000;
      }
      .left_title{
            width:300px;
            height:50px;
            background:rgba(228, 228, 228, 1);
            border:rgba(204, 204, 204, 1);
            line-height:50px;
            padding-left:20px;
            font-weight: bold;
      }
      .left_form{
        position:relative;

      }
      .left_form span{
          display: inline-block;
          width: 100px;
          font-size: 14px;
          padding: 15px;
          text-align:right;
      }
      .left_form img{
          position: absolute;
      }
      .left_form select{
          width: 179px;
          margin-left: -4px;
      }
      .left_form input[type="file"]{
          position:absolute;
          width:69px;
          height:69px;
          left:90px;
          opacity: 0;
      }
      .left_form textarea{
          position: absolute;
          top: 10px;
          height:120px;
          resize:none;
      }
      .footer{
          width:300px;
          height:53px;
          position:absolute;
          bottom:0;
      }
      .footer a{
          display:inline-block;
          width:100px;
          height:53px;
          line-height:53px;
          text-align:center;
          border:1px solid #ccc;
          background:#fff;
      }
      .mar_colo{
          width:43px;
          height:41px;
          background-color: rgba(0, 128, 0, 1);
          position: absolute;
          left:101px;
          top:10px;
          box-sizing: border-box;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(204, 204, 204, 1);
          border-radius: 3px;
      }
      .land_color{
          width: 43px;
          height: 41px;
          border-radius: 3px;
          background-color: rgba(204, 204, 204, 1);
          position: absolute;
          left: 101px;
          top: 10px;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(0, 153, 204, 1);
          font-size: 12px;
          text-align: center;
          line-height: 41px;
          color: rgba(0, 153, 204, 1);
      }
      .warehouse_color{
          width: 43px;
          height: 41px;
          border-radius: 3px;
          background-color: rgba(255, 255, 255, 1);
          position: absolute;
          left: 147px;
          top: 10px;
          border-width: 1px;
          border-style: solid;
          border-color: #0099cc;
          font-size: 12px;
          text-align: center;
          line-height: 41px;
      }
      .col{
        color:red;
      }
      .el-input--medium .el-input__inner {
        margin-top: 5px;
      }
      .el-input__suffix-inner i{
        display: none !important;
      }
      .el-color-picker__trigger{
        margin-top: 4px;
      }
      .el-color-picker__trigger span{
        width: 100%;
        padding: 0;
        text-align: center;
      }

    }

}
</style>
