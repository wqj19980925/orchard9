<template>
  <div class="app-digtalMap">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">数字地图</div>
      </div>
      <baidu-map :center="center" :zoom="zoom" class="Bmap" @ready="handler">
        <div class="">
          <ul class="map-header">
            <!-- <li class="farm-li" @click="show()">
              <p id="farmland" class="farm-imgcenter">
                <span class="farm-img farm-oneImg"/>
              </p>
              <em class="farm-top">新建农田</em>
            </li>
            <li id="occupation" class="farm-li" @click="show1">
              <p class="farm-imgcenter">
                <span class="farm-img occupation-oneImg"/>
              </p>
              <em class="farm-top">占地区域</em>
            </li>
            <li class="farm-li" @click="show2">
              <p class="farm-imgcenter">
                <span class="farm-img massif-oneImg"/>
              </p>
              <em class="farm-top">地块规划</em>
            </li>
            <li class="farm-li">
              <p class="land-imgcenter">
                <span class="farm-img land-oneImg" @click="show3"/>
                <span class="farm-img land-twoImg massif-margin" @click="show4"/>
              </p>
              <div class="farm-tops">
                <em>耕种土地</em>
                <em>农田仓库</em>
              </div>
            </li> -->
            <!-- <li class="farm-li">
              <p class="land-imgcenter">
                <span class="farm-img imgcenter-oneImg" @click="es_clk"/>
                <span class="farm-img imgcenter-twoImg massif-marginTwo" @click="Camera"/>
              </p>
              <div class="farm-tops">
                <em>环境监控</em>
                <em>摄像头</em>
              </div>
            </li> -->
          </ul>
        </div>
        <!-- //==============新建农田 -->
        <!-- <div :style="styleObject[0]" class="left_ale">
          <div class="left_title">编辑农田信息</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>农田名称</span></el-col>
              <el-col :span="16"><el-input v-model="cropland" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>经度</span></el-col>
              <el-col :span="16"><el-input :value="dimension" :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>维度</span></el-col>
              <el-col :span="16"><el-input :value="long" :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>负责人</span></el-col>
              <el-col :span="16"><el-input v-model="principal" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>联系电话</span></el-col>
              <el-col :span="16"><el-input v-model="respon_tel" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域地址</span></el-col>
              <el-col :span="16"><el-input v-model="address" placeholder="请输入内容"/></el-col>
            </el-row>
            <span>上传图片</span>
            <img :src="img_base64" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="establish">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_farmland">删除</a>
          </div>
        </div> -->
        <!-- //============占地区域 -->
        <!-- <div :style="styleObject[1]" class="left_ale">
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
              <el-col :span="16"><el-input v-model=" mz " :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form"/>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="overs_an_area">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_area">删除</a>
          </div>
        </div> -->
        <!-- //============地块规划 -->
        <!-- <div :style="styleObject[2]" class="left_ale">
          <div class="left_title">编辑地块规划信息</div>
          <div class="left_form" style="top:10px;">
            <el-row>
              <el-col :span="8"><span>区域名称</span></el-col>
              <el-col :span="16"><el-input v-model="region_names" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form"/>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="dk_project">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_plot">删除</a>
          </div>
        </div> -->
        <!-- //============耕种土地 -->
        <!-- <div :style="styleObject[3]" class="left_ale">
          <div class="left_title">编辑土地区域信息</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>土地名称</span></el-col>
              <el-col :span="16"><el-input v-model="cultiv_name" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="add_l">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_land">删除</a>
          </div>
        </div> -->
        <!-- //=======农田仓库 -->
        <!-- <div :style="styleObject[6]" class="left_ale">
          <div class="left_title">编辑仓库区域信息</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>仓库名称</span></el-col>
              <el-col :span="16"><el-input v-model="cultiv_name1" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>仓库容量</span></el-col>
              <el-col :span="16"><el-input v-model="cul_capacity" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" :disabled="true" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>仓库类型</span></el-col>
              <el-col :span="16">
                <el-select v-model="value" placeholder="请选择" @change="ware_type_fun">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :value="item.value"/>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px;" >
            <input type="file" @change="massif_image">
          </div>
          <div class="footer">
            <a href="#" @click="add_w">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_ware">删除</a>
          </div>
        </div> -->

        <!-- //============环境监控 -->
        <!-- <div :style="styleObject[4]" class="left_ale">
          <div class="left_title">编辑环境监控</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>区域名称</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域类型</span></el-col>
              <el-col :span="16">
                <el-select v-model="value1" placeholder="请选择" @change="regionlistFun()">
                  <el-option
                    v-for="item in qy_list"
                    :key="item.field_id"
                    :value="item.field_name"/>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>监控区域</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form">
              <span>备注</span><textarea/><br>
            </div>
          </div>
          <div class="footer">
            <a href="#" @click="establish">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#">删除</a>
          </div>
        </div> -->
        <!-- //============摄像头 -->
        <!-- <div :style="styleObject[5]" class="left_ale">
          <div class="left_title">编辑摄像头</div>
          <div class="left_form" style="height:598px; overflow:hidden; overflow-y:scroll;">
            <el-row>
              <el-col :span="8"><span>区域名称</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>设备编号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <span>监控区域</span>
            <select>
              <option>请选择</option>
              <option>玉米种植区</option>
            </select><br>
            <el-row>
              <el-col :span="8"><span>IP/域名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>HTTP/端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>RTSP/端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>服务端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>用户名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>密码</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>通道号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>获取通道号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>IP/域名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容"/></el-col>
            </el-row>
          </div>
          <div class="footer">
            <a href="#" @click="establish">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#">删除</a>
          </div>
        </div> -->
      </baidu-map>
    </el-row>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
// import GeoUtils from '../../../static/js/GeoUtils.js'
import { landList, editcult, delChose, landLISt, addcult } from '@/api/map'
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
      BMap: ''
    }
  },
  created() {
    // 页面加载时
    this.default_map()
  },
  methods: {
    handler({ BMap, map }) {
      // console.log({ BMap, map })
      this.BMap = BMap
      this.map = map
      this.zoom = 18
      map.enableScrollWheelZoom()
    },

    // 渲染默认数据
    default_map() {
      const data = {}
      data.cultiv_id = this.regIds
      landList(data)
        .then(response => {
          // console.log('地区数据', response.data)
          if (response.data.code === 200) {
            // ===渲染占地区域
            // console.log('response=========', response.data.data.region_data.coordinate)
            // var bz = response.data.data.region_data.coordinate

            // var bz_arr = []
            // for (var g = 0; g < bz.length; g++) {
            //   var d = new BMap.Point(bz[g].lng, bz[g].lat)
            //   bz_arr.push(d)
            // }
            // console.log('bz_arr-=-===========', bz_arr)
            // var polygon = new BMap.Polygon(bz_arr, { strokeColor: response.data.data.region_data.color, fillColor: response.data.data.region_data.color, strokeWeight: 4, fillOpacity: 0.01 })
            // console.log(polygon)
            // this.map.addOverlay(polygon)

            // var bz1 = response.data.data.plot_data.coordinate

            // var bz_arr1 = []
            // for (var z = 0; z < bz1.length; z++) {
            //   var d1 = new BMap.Point(bz1[z].lng, bz1[z].lat)
            //   bz_arr1.push(d1)
            // }
            // console.log('bz_arr-=-===========', bz_arr1)
            // var polygon1 = new BMap.Polygon(bz_arr1, { strokeColor: response.data.data.plot_data.color, fillColor: response.data.data.plot_data.color, strokeWeight: 4, fillOpacity: 0.01 })
            // console.log(polygon)
            // this.map.addOverlay(polygon1)

            var bz2 = response.data.data.cultiv_data.coordinate
            this.center.lng = bz2[0].lng
            this.center.lat = bz2[0].lat
            var bz_arr2 = []
            for (var s = 0; s < bz2.length; s++) {
              var d2 = new BMap.Point(bz2[s].lng, bz2[s].lat)
              bz_arr2.push(d2)
            }
            // console.log('bz_arr-=-===========', bz_arr1)
            var polygon1 = new BMap.Polygon(bz_arr2, { strokeColor: response.data.data.cultiv_data.color, fillColor: response.data.data.cultiv_data.color, strokeWeight: 4, fillOpacity: 0.01 })
            // console.log(polygon)
            this.map.addOverlay(polygon1)
          }
        })
        .catch(Error => {
          console.log(Error.data)
        })

      // console.log('---++', this.map)
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
        height: 700px;
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
        .farm-tops em{
            font-style: normal;
        }
        .farm-oneImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw0w8xh/8ea7e056-894c-4e82-b935-0b6fcb102322_w49_h80.jpg);
        }
        .occupation-oneImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw5l9ht/2bee8749-1901-4fb1-85d4-d5b6e1fe2c05_w42_h40.jpg);
        }
        .massif-oneImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw5n04x/87bafca7-fc49-4a31-ad85-ed1f9d11f774_w36_h37.png);
        }
        .land-oneImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw87zdd/fca773f8-0a42-49d0-a663-6c9e8bd0ba23_w38_h37.jpg);
        }
        .land-twoImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw88ola/26df5bb4-8f3b-4aeb-a149-cc391b06a3a4_w37_h37.jpg);
        }
        .imgcenter-oneImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw89n3p/8ed92440-8334-457e-82f8-b14197851c62_w37_h37.jpg);
        }
        .imgcenter-twoImg{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw8a11p/bac58f31-5765-4e7f-9810-ed4949779f99_w37_h31.jpg);
        }
        .footer-satellite{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw9d3ie/5702a98b-4c61-4656-a961-eb6a1ee16638_w49_h49.jpg);
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 50%;
            position: absolute;
            left: 10px;
            bottom: 60px;
        }
        .footer-plant{
            background-image: url(https://gw.alipayobjects.com/os/q/cms/images/jpw9do3w/82de4be5-5f8f-4a42-a17a-240e8b1ba198_w48_h50.jpg);
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 50%;
            position: absolute;
            left: 10px;
            bottom: 10px;
        }
      .left_ale{
        position: absolute;
        right: 0;
        top: 0px;
        width: 300px;
        height: 700px;
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
