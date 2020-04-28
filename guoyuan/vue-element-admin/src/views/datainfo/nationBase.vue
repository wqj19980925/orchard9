<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <!-- 标题 -->
      <div class="sd-moudle-header">
        <div class="sd-module-title">数字地图</div>
      </div>
      <!-- 地图 -->
      <div class="map-box">
        <!-- 组件 -->
        <baidu-map
          class="Bmap"
          ak='dnT9GV3Ryp2xLpkhKrcIFBwScizyZT0k'
          :center="center"
          :zoom="zoom"
          @ready="handler"
          :style='conheight'
          :scroll-wheel-zoom="true"
          @click="getPoint"
        >
          <!-- <bm-view style="width: 100%; height:100px; flex: 1"> -->
          <!-- 地图;类型 -->
          <bm-map-type
            :map-types="['BMAP_NORMAL_MAP','BMAP_HYBRID_MAP']"
            anchor="BMAP_ANCHOR_TOP_RIGHT"
          ></bm-map-type>
          <!-- 城市 搜索 列表 -->
          <bm-city-list
            anchor="BMAP_ANCHOR_TOP_RIGHT"
            :offset="{width:100,height:10}"
          ></bm-city-list>
          <!-- 定位 -->
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <!-- 标记 点 -->
          <bm-marker
            v-for='(item,index) in budMarker'
            position=item.postionMap
            :title='item.massif_name'
            :key='index'
            @click='markerClick(item)'
          >
          </bm-marker>
          <!-- 标记 摄像头-->
          <!-- <div
              v-for='item in budCamera'
              :key='item.equip_name+item.equip_number'
            >
              <bm-marker
                :icon="{url: 'http://eeds.bluearp.com/public/icon/video.png', size: {width: 30, height: 30}}"
                :position="item.postionMap"
                :zIndex=10
                :top='true'
                :offset='{width:30,height:30}'
                :massClear='false'
                :title='item.equip_name'
                @click='cameraClick(item)'
              >
              </bm-marker>
            </div> -->
          <!-- <bm-marker :icon="{url: 'http://eeds.bluearp.com/public/icon/video.png', size: {width: 35, height: 35}}"
            :position="{lng: 116.404, lat: 39.915}"
          >
          </bm-marker> -->

          <!-- 标记 多边形 --区域 -->
          <!-- <bm-polygon
            :path="regList"
            stroke-color="blue"
            :stroke-opacity="1"
            :stroke-weight="2"
          /> -->
          <!-- 标记 多边形 --区域 -->
          <bm-polygon
            v-for='item in budRegion'
            :path="item.coordinate"
            :stroke-color="item.region_color"
            :stroke-opacity="item.region_slide"
            :stroke-weight="2"
            :fillColor='item.region_color'
            :fillOpacity='item.region_slide'
            :editing="item.edit"
            :clicking='true'
            :massClear='false'
            :key='item.region_name+item.region_id'
            @click="regionClick(item)"
            @lineupdate="updateRegionPath"
          />
          <!-- 标记 多边形 --地块 -->
          <bm-polygon
            v-for='item in budLand'
            :path="item.coordinate"
            :stroke-color="item.land_color"
            :stroke-opacity="1"
            :stroke-weight="2"
            :fillColor='item.land_color'
            :fillOpacity='item.land_slide'
            :editing="item.edit"
            :clicking='true'
            :massClear='false'
            :key='item.land_name+item.land_id'
            @click="landClick(item)"
            @lineupdate="updateRegionPath"
          />
          <!-- 标记 多边形 --牧场 -->
          <bm-polygon
            v-for='item in budGraz'
            :path="item.coordinate"
            :stroke-color="item.cultiv_color"
            :stroke-opacity="1"
            :stroke-weight="2"
            :fillColor='item.cultiv_color'
            :fillOpacity='item.cul_slide'
            :editing="item.edit"
            :clicking='true'
            :massClear='false'
            :key='item.cultiv_name+item.cultiv_id'
            @click="grazClick(item)"
            @lineupdate="updateRegionPath"
          />
          <!-- </bm-view> -->
        </baidu-map>
        <!-- 左上角 功能按钮 -->
        <ul class='left-functionBtn'>
          <li
            class='function01 function-box'
            @click='newBuild()'
            v-if='btnShow.addFarm'
          >
            <img
              src="../../assets/img/icon_03.png"
              alt=""
              class='function_icon'
            >
            <p :class="colorBtn.clor1?'function_text on':'function_text'">新建</p>
          </li>
          <li
            class='function02 function-box'
            @click='LandRegion()'
            v-if='btnShow.addReg'
          >
            <img
              src="../../assets/img/icon_05.png"
              alt=""
              class='function_icon'
            >
            <p :class="colorBtn.clor2?'function_text on':'function_text'">占地区域</p>
          </li>
          <li
            class='function03 function-box'
            @click='landPlan()'
            v-if='btnShow.addLand'
          >
            <img
              src="../../assets/img/icon_07.png"
              alt=""
              class='function_icon'
            >
            <p :class="colorBtn.clor3?'function_text on':'function_text'">地块规划</p>
          </li>
          <li
            class='function04 function-box'
            @click="cultivation()"
            v-if='btnShow.addPasture'
          >
            <img
              src="../../assets/img/icon_09.png"
              alt=""
              class='function_icon'
            >
            <p :class="colorBtn.clor4?'function_text on':'function_text'">养殖放牧</p>
          </li>
          <li
            class='function05 function-box'
            @click="camera()"
            v-if='btnShow.addCamera'
          >
            <img
              src="../../assets/img/icon_11.png"
              alt=""
              class='function_icon'
            >
            <p :class="colorBtn.clor5?'function_text on':'function_text'">摄像头</p>
          </li>
        </ul>
        <!-- 弹窗 -->
        <ul
          class='right_dialog_box'
          v-if='state.show'
          :style='conheight'
        >
          <!-- 新建果园信息 -->
          <li
            class="right_dialog"
            v-if='state.buildSta'
          >
            <p class="title">{{build.tit}}果园</p>
            <el-form
              :model="buildForm"
              ref="buildForm"
              label-width="90px"
              :rules="buildFmRules"
            >
              <el-form-item
                label="果园名称"
                prop='massif_name'
              >
                <el-input
                  v-model="buildForm.massif_name"
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item
                label="经度"
                prop='longitude'
              >
                <el-input
                  v-model="buildForm.longitude"
                  class='w200'
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item
                label="纬度"
                prop='latitude'
              >
                <el-input
                  v-model="buildForm.latitude"
                  class='w200'
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item
                label="负责人"
                prop='her_id'
              >
                <el-select
                  v-model="buildForm.her_id"
                  placeholder="请输入负责人进行搜索并选择"
                  filterable
                  remote
                  :remote-method="queryMember"
                  @change="choseMember"
                >
                  <el-option
                    v-for="item in herMember"
                    :key="item.her_id"
                    :label="item.her_name"
                    :value="item.her_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop='respon_tel'
              >
                <el-input
                  v-model="buildForm.respon_tel"
                  class='w200'
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item
                label="地址"
                prop='address'
              >
                <el-input
                  v-model="buildForm.address"
                  class='w200'
                ></el-input>
              </el-form-item>
              <div class="right-btn-box">
                <el-button
                  type="primary"
                  @click="onSubmit(1)"
                  class='btn-right'
                >保存</el-button>
                <el-button
                  class='btn-right'
                  @click='cancle(1)'
                >取消</el-button>
                <el-button
                  type='danger'
                  class='btn-right'
                  @click='delbtn(1)'
                  v-if='btnShow.delFarm'
                >删除</el-button>
              </div>
            </el-form>
          </li>
          <!-- 占地区域信息 -->
          <li
            class="right_dialog"
            v-if='state.areaSta'
          >
            <p class="title">{{build.tit}}占地区域信息</p>
            <el-form
              :model="areaForm"
              ref="areaForm"
              label-width="90px"
              :rules="areaRules"
              class='area-form'
            >
              <el-form-item
                label="区域名称"
                prop='region_name'
              >
                <el-input
                  v-model="areaForm.region_name"
                  class='w200'
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="上次区域"> -->
              <!-- <el-input
                  v-model="areaForm."
                  disabled
                ></el-input> -->
              <!-- </el-form-item> -->
              <el-form-item
                label="隶属果园"
                prop='landName'
              >
                <el-input
                  disabled
                  placeholder='隶属果园'
                  v-model='areaForm.landName'
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item
                label="区域面积"
                prop='region_acreage'
              >
                <el-input
                  v-model="areaForm.region_acreage"
                  placeholder="0.0亩"
                  style='width:100px'
                  @keyup.native='numKepup()'
                ></el-input>
              </el-form-item>
              <el-form-item label="标记颜色">
                <el-color-picker
                  v-model="areaForm.region_color"
                  @change='chgCol'
                ></el-color-picker>
              </el-form-item>
              <el-form-item label="颜色透明度">
                <el-slider
                  v-model="areaForm.region_slide"
                  style='width:150px'
                  @change='opaChg'
                  :step='0.05'
                  :max='1'
                  :min='0.1'
                  :format-tooltip="formatTooltip"
                ></el-slider>
              </el-form-item>
              <el-form-item label="上传图片">
                <img
                  :src="areaForm.region_image"
                  class="up_img"
                  @click='imgUp(1)'
                >
                <input
                  type="file"
                  @change="landImg"
                  style='display:none;'
                  id='imgUp1'
                >
              </el-form-item>
              <div class="right-btn-box">
                <el-button
                  type="primary"
                  @click="onSubmit(2)"
                  class='btn-right'
                >保存</el-button>
                <el-button
                  class='btn-right'
                  @click='cancle(2)'
                >取消</el-button>
                <el-button
                  type='danger'
                  class='btn-right'
                  @click='delbtn(2)'
                  v-if='btnShow.delReg'
                >删除</el-button>
              </div>
            </el-form>
          </li>
          <!-- 地块规划 -->
          <li
            class="right_dialog"
            v-if='state.landSta'
          >
            <p class="title">{{build.tit}}地块规划信息</p>
            <el-form
              :model="landForm"
              ref="landForm"
              :rules='landRules'
              label-width="90px"
            >
              <el-form-item
                label="地块名称"
                prop='land_name'
              >
                <el-input
                  v-model="landForm.land_name"
                  class='w200'
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="上次区域"> -->
              <!-- <el-input
                  v-model="areaForm."
                  disabled
                ></el-input> -->
              <!-- </el-form-item> -->
              <el-form-item
                label="隶属区域"
                prop='region_name'
              >
                <el-input
                  disabled
                  placeholder='隶属区域'
                  v-model='landForm.region_name'
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item
                label="区域面积"
                prop='land_acreage'
              >
                <el-input
                  v-model="landForm.land_acreage"
                  placeholder="0.0亩"
                  style='width:100px'
                  @keyup.native='numKepup()'
                  @blur='numBlur'
                ></el-input>
                <p class='tip-box'>所属区域剩余面积：{{landForm.land_surplus}}亩</p>
              </el-form-item>
              <el-form-item
                label="标记颜色"
                prop='land_color'
              >
                <el-color-picker
                  v-model="landForm.land_color"
                  @change='chgCol'
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                label="颜色透明度"
                prop='land_slide'
              >
                <el-slider
                  v-model="landForm.land_slide"
                  style='width:150px'
                  @change='opaChg'
                  :step='0.05'
                  :max='1'
                  :min='0.1'
                  :format-tooltip="formatTooltip"
                ></el-slider>
              </el-form-item>
              <el-form-item
                label="上传图片"
                prop='land_image'
              >
                <img
                  :src="landForm.land_image"
                  class="up_img"
                  @click='imgUp(1)'
                >
                <input
                  type="file"
                  @change="landImg"
                  style='display:none;'
                  id='imgUp1'
                >
              </el-form-item>
              <div class="right-btn-box">
                <el-button
                  type="primary"
                  @click="onSubmit(3)"
                  class='btn-right'
                >保存</el-button>
                <el-button
                  class='btn-right'
                  @click='cancle(3)'
                >取消</el-button>
                <el-button
                  type='danger'
                  class='btn-right'
                  @click='delbtn(3)'
                  v-if='btnShow.delLand'
                >删除</el-button>
              </div>
            </el-form>

          </li>
          <!-- 养殖放牧信息 -->
          <li
            class="right_dialog"
            v-if='state.grazSta'
          >
            <p class="title">{{build.tit}}养殖放牧信息</p>
            <el-form
              :model="grazForm"
              ref="grazForm"
              :rules='grazRules'
              label-width="90px"
              class='area-form'
            >
              <el-form-item label="负责人">
                <el-input
                  disabled
                  v-model='grazForm.her_name'
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item label="隶属地块">
                <el-input
                  disabled
                  placeholder='隶属区域'
                  v-model='grazForm.reg_name'
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item label="牧场名称">
                <el-input
                  placeholder='请输入牧场名称'
                  v-model='grazForm.cultiv_name'
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item label="牧场类型">
                <el-radio-group v-model="grazForm.landType">
                  <el-radio-button
                    label="1"
                    aria-checked
                  >养殖</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="养殖方式">
                <el-select
                  v-model="grazForm.base_type"
                  placeholder="请选择养殖方式"
                >
                  <el-option
                    v-for="item in baseType"
                    :key="item.base_type"
                    :label="item.name"
                    :value="item.base_type"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="牧场面积"
                prop='cultiv_acreage'
              >
                <el-input
                  v-model="grazForm.cultiv_acreage"
                  placeholder="0.0亩"
                  style='width:100px'
                  @keyup.native='numKepup'
                  @blur='numBlur'
                ></el-input>
                <p class='tip-box'>地块剩余面积：{{grazForm.surplus}}亩</p>
              </el-form-item>
              <el-form-item
                label="标记颜色"
                prop='cultiv_color'
              >
                <el-color-picker
                  v-model="grazForm.cultiv_color"
                  @change='chgCol'
                ></el-color-picker>
              </el-form-item>
              <el-form-item
                label="颜色透明度"
                prop='cul_slide'
              >
                <el-slider
                  v-model="grazForm.cul_slide"
                  style='width:150px'
                  @change='opaChg'
                  :step='0.05'
                  :max='1'
                  :min='0.1'
                  :format-tooltip="formatTooltip"
                ></el-slider>
              </el-form-item>
              <el-form-item
                label="上传图片"
                prop='cultiv_image'
              >
                <img
                  :src="grazForm.cultiv_image"
                  class="up_img"
                  @click='imgUp(1)'
                >
                <input
                  type="file"
                  @change="landImg"
                  style='display:none;'
                  id='imgUp1'
                >
              </el-form-item>
              <div class="right-btn-box">
                <el-button
                  type="primary"
                  @click="onSubmit(4)"
                  class='btn-right'
                >保存</el-button>
                <el-button
                  class='btn-right'
                  @click='cancle(4)'
                >取消</el-button>
                <el-button
                  type='danger'
                  class='btn-right'
                  @click='delbtn(4)'
                  v-if='btnShow.delPasture'
                >删除</el-button>
              </div>
            </el-form>

          </li>
          <!-- 摄像头 -->
          <li
            class="right_dialog"
            v-if='state.cameraSta'
          >
            <p class="title">{{build.tit}}摄像头信息</p>
            <el-form
              :model="cameraForm"
              ref="cameraForm"
              :rules='cameraRules'
              label-width="90px"
            >
              <el-form-item
                label="设备名称"
                prop='equip_name'
              >
                <el-input
                  v-model="cameraForm.equip_name"
                  placeholder="请输入设备名称"
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item
                label="设备编号"
                prop='equip_number'
              >
                <el-input
                  v-model="cameraForm.equip_number"
                  placeholder="请输入设备编号"
                  class='w200'
                ></el-input>
              </el-form-item>
              <el-form-item label="区域类型">
                <el-radio-group v-model="cameraForm.cameType">
                  <el-radio-button
                    label="1"
                    aria-checked
                  >摄像头</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="监控区域"
                prop='region_id'
              >
                <el-select
                  v-model="cameraForm.region_id"
                  placeholder="请选择监控区域"
                  @change='chgeReg'
                >
                  <el-option
                    v-for="item in regLi"
                    :key="item.region_id"
                    :label="item.region_name"
                    :value="item.region_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="监控地块"
                v-if='build.showLand'
              >
                <el-select
                  v-model="cameraForm.field_id"
                  placeholder="请选择监控地块"
                  @change="chgeLand"
                >
                  <el-option
                    v-for="item in landLi"
                    :key="item.field_id"
                    :label="item.land_name"
                    :value="item.field_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="监控牧场"
                v-if='build.showGraz'
              >
                <el-select
                  v-model="cameraForm.cultiv_id"
                  placeholder="请选择监控牧场"
                >
                  <el-option
                    v-for="item in grazLi"
                    :key="item.cultiv_id"
                    :label="item.cultiv_name"
                    :value="item.cultiv_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="URL链接"
                prop='url'
              >
                <el-input
                  v-model="cameraForm.url"
                  placeholder="请输入设备URL链接"
                  class='w200'
                ></el-input>
              </el-form-item>
              <div class="right-btn-box">
                <el-button
                  type="primary"
                  @click="onSubmit(5)"
                  class='btn-right'
                >保存</el-button>
                <el-button
                  class='btn-right'
                  @click='cancle(5)'
                >取消</el-button>
                <el-button
                  type='danger'
                  class='btn-right'
                  @click='delbtn(5)'
                  v-if='btnShow.delCamera'
                >删除</el-button>
              </div>
            </el-form>
          </li>
        </ul>
      </div>
    </el-row>
  </div>
</template>
<script>
import { validateURL } from '@/utils/validate' //验证合法url
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'; // 局部注册
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation.vue'; //定位
import BmMapType from 'vue-baidu-map/components/controls/MapType.vue'; //地图类型
import BmCityList from 'vue-baidu-map/components/controls/CityList.vue'; //城市列表
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'; //标记 点
import BmPolygon from 'vue-baidu-map/components/overlays/polygon.vue'; //标记 多边形
import { errorStatus } from "@/utils/index";
import BMapLib from 'BMapLib'
import { getList, persList, editfarmld, addfarmld, delfarmld, getfarmld, farmland, addmassif, editmassif, delmassif, addregion, editregion, delregion, regionlist, massifdata, cultivalist, addcultiv, editcultiv, delcultiv, addcamera, editcamera, delcamera } from '@/api/map';
export default {
  inject: ['reload'],
  name: 'mapDigtal',
  components: { BaiduMap, BmGeolocation, BmMapType, BmCityList, BmMarker, BmPolygon },
  data () {
    const validateurlVal = (rule, value, callback) => {
      if (!validateURL(value)) {
        callback(new Error('请输入正确的URL'))
      } else {
        callback()
      }
    }
    return {
      center: { lng: 109.78947, lat: 39.616353 },  //经纬度
      zoom: 15,　 //地图展示级别
      conheight: {
        height: ''
      },
      screenHeight: '',
      mapTypeStyle: {
      },
      map: '',
      BMap: '',
      baseUrl: '',
      state: {
        show: false,
        editShow: false,
        buildSta: false,
        areaSta: false,
        landSta: false,
        grazSta: false,
        cameraSta: false,
        cameraPot: false,
        buildPot: false,
      },
      colorBtn: {
        clor1: false,
        clor2: false,
        clor3: false,
        clor4: false,
        clor5: false
      },
      build: {
        tit: '新建',
        marker: '',
        showLand: false,// 摄像头--显示地块
        showGraz: false,// 摄像头--显示牧场
      },
      buildForm: {
        massif_name: '',
        longitude: '',
        latitude: '',
        her_id: '',
        respon_tel: '',
        address: '',

      }, // 点数据
      buildFmRules: {
        massif_name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        her_id: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        longitude: [{ required: true }],
        latitude: [{ required: true }],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }]
      },
      budMarker: [],// marker 数据
      markland: [],
      newBldList: [],
      areaForm: {
        region_name: '',
        massif_id: '',
        region_acreage: '',
        landName: '',
        coordinate: [],
        region_color: '#2f4de4',
        region_slide: 0.2,
        region_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg=='
      }, //区域数据
      regAcreage: 0.0,
      areaRules: {
        region_name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        massif_id: [{ required: true, message: '请选择该区域隶属果园', trigger: 'change' }],
        region_acreage: [{ required: true, message: '请输入区域面积', trigger: 'change' }],
      },
      herMember: [], //负责人列表
      budRegion: [],//区域数据
      budLand: [],  //地块数据
      budGraz: [],  //牧场数据
      budCamera: [], //摄像头
      regionData: [],// 
      landData: [],// 
      grazData: [], //
      regLi: [], // 区域列表
      landLi: [], //地块列表
      grazLi: [], //牧场列表
      landForm: {
        land_name: '',
        field_id: '',
        land_acreage: '',
        region_name: '',
        land_color: '#E42F2F',
        land_slide: 0.5,
        coordinate: [],
        land_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg=='
      }, //地块form
      // region_color: 'rgba(47,77,228,0.45)',
      landRules: {
        land_name: [{ required: true, message: '请输入地块名称', trigger: 'blur' }],
        land_acreage: [{ required: true, message: '请输入区域面积', trigger: 'change' }],
      },
      grazForm: {
        cultiv_name: '',
        cultiv_color: '#55FF00',
        cul_slide: 0.8,
        landType: '1',
        cultiv_acreage: '',
        cultiv_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg==',
      },
      grazRules: {
        cultiv_acreage: [{ required: true, message: '请输入区域面积', trigger: 'change' }]
      },
      baseType: [
        { base_type: 1, name: '散养' },
        { base_type: 2, name: '圈养' }
      ],
      // 摄像头
      cameraForm: {
        equip_name: '',
        equip_number: '',
        cameType: '1',
        region_id: '',
        field_id: '',
        cultiv_id: '',
        longitude: '',
        latitude: '',
        url: 'http://'
      },
      cameraRules: {
        equip_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equip_number: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        region_id: [{ required: true, message: '请输入监控区域', trigger: 'change' }],
        url: [{ required: true, trigger: 'blur', validator: validateurlVal }],
      },
      imgss: 'http://eeds.bluearp.com/public/icon/video.png',
      btnShow: {}
    }
  },
  created () {
    window.addEventListener('resize', this.setHeight);
    this.setHeight(); // 设置地图高度
    this.getInfor(); // 获取页面信息
    // this.personList();//获取负责人列表
  },
  methods: {
    // 获取页面信息
    getInfor () {
      const url = process.env.BASE_API;
      this.baseUrl = url.replace('/public', '/');
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {};
      data.pri_id = this.$route.meta.pri_id;
      getList(data).then(response => {
        loading.close();
        if (errorStatus(response.data)) {
          const arrData = response.data;
          if (arrData.constructor !== Array) {
            const massif_data = response.data.data.massif_data;//果园数据
            const region_data = response.data.data.region_data; //区域数据
            const plot_data = response.data.data.plot_data; ////地块数据
            const cultiv_data = response.data.data.cultiv_data; //养殖牧场
            const equip_data = response.data.data.equip_data; //摄像头数据
            for (let i in massif_data) {
              let key = 'postionMap'
              var position = new Object();
              position.lng = massif_data[i].longitude;
              position.lat = massif_data[i].latitude;
              massif_data[i][key] = position;
              if (Number(i) + 1 === massif_data.length) {
                // console.log("this.center--")
                this.$set(this.center, 'lng', massif_data[i].longitude);
                this.$set(this.center, 'lat', massif_data[i].latitude);
              }
            }
            // console.log("this.budMarker--", massif_data);
            this.budMarker = massif_data;
            // 区域
            for (let i in region_data) {
              region_data[i].edit = false;
            }
            this.budRegion = region_data;

            // 地块
            for (let i in plot_data) {
              plot_data[i].edit = false;
            }
            this.budLand = plot_data;
            //  console.log("this.budLand--", this.budLand)
            // console.log(" this.budGraz--", cultiv_data)
            // 牧场
            for (let i in cultiv_data) {
              cultiv_data[i].edit = false;
            }
            this.budGraz = cultiv_data
            // this.budGraz.splice(0,0,cultiv_data)
            // console.log(" this.budGraz--", this.budGraz)
            // 摄像头
            // console.log("equip_data--", equip_data)
            // ====渲染多个环境监控
            var myIcon = new BMap.Icon(this.imgss, new BMap.Size(32, 32));
            for (var s = 0; s < equip_data.length; s++) {
              // console.log("渲染多个环境监控--", equip_data[s])
              var pt = new BMap.Point(equip_data[s].longitude, equip_data[s].latitude);
              var marker2 = new BMap.Marker(pt, { icon: myIcon });
              // console.log("marker2--", marker2)
              this.map.addOverlay(marker2);
              marker2.equip_id = equip_data[s].equip_id;
              marker2.type_id = 6;
              this.budCamera.push(marker2)
            }
          }
          // 获取按钮权限;
          const btnList = response.data.button;
          console.log("获取按钮权限--", btnList);
          for (let i in btnList) {
            if (btnList[i].pri_funname === '添加果园') {
              this.$set(this.btnShow, 'addFarm', true);
            } else if (btnList[i].pri_funname == '编辑果园') {
              this.$set(this.btnShow, 'editFarm', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '删除果园') {
              this.$set(this.btnShow, 'delFarm', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '添加区域') {
              this.$set(this.btnShow, 'addReg', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '编辑区域') {
              this.$set(this.btnShow, 'editReg', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '删除区域') {
              this.$set(this.btnShow, 'delReg', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '添加地块') {
              this.$set(this.btnShow, 'addLand', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '编辑地块') {
              this.$set(this.btnShow, 'editLand', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '删除地块') {
              this.$set(this.btnShow, 'delLand', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '添加牧场') {
              this.$set(this.btnShow, 'addPasture', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '编辑牧场') {
              this.$set(this.btnShow, 'editPasture', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '删除牧场') {
              this.btnShow.delPasture = true;
            } else if (btnList[i].pri_funname == '添加摄像头') {
              this.$set(this.btnShow, 'addCamera', true);
              // this.btnShow. = true;
            } else if (btnList[i].pri_funname == '编辑摄像头') {
              this.btnShow.editCamera = true;
            } else if (btnList[i].pri_funname == '删除摄像头') {
              this.btnShow.delCamera = true;
            }
          }
          console.log("按钮----", this.btnShow);
        }
      }).catch(Error => {
        loading.close();
        this.$message.error("请求失败!")
        console.log('页面信息--', Error)
      })
    },
    // 点击地图 --建标记
    getPoint (e) {
      // console.log("111", e)
      if (this.state.buildPot && !this.state.show) {
        if (this.btnShow.addFarm) {
          this.zoom = e.target.getZoom();
          let geocoder = new BMap.Geocoder();  //创建地址解析器的实例
          geocoder.getLocation(e.point, rs => {
            // console.log("-rs---", rs);
            var marker = new BMap.Marker(new BMap.Point(rs.point.lng, rs.point.lat)); // 创建点
            // console.log("创建点---", marker)
            this.map.addOverlay(marker);
            this.build.marker = marker;
            this.state.show = true;
            this.state.buildSta = true;
            this.buildForm.longitude = rs.point.lng;
            this.buildForm.latitude = rs.point.lat;
            this.buildForm.address = rs.address;
            this.buildForm.prover = rs.addressComponents.province;
            this.buildForm.city = rs.addressComponents.city;
            this.budMarker.push(marker)
            // console.log("点集合---", this.budMarker)
          })
        }
      } else if (this.state.cameraPot && !this.state.show) {
        // if (this.) {
        // 创建摄像头
        this.build.tit = '新建'
        this.zoom = e.target.getZoom();
        let geocoder = new BMap.Geocoder();
        geocoder.getLocation(e.point, rs => {
          var myIcon = new BMap.Icon('http://eeds.bluearp.com/public/icon/video.png', new BMap.Size(30, 30));
          var pt = new BMap.Point(e.point.lng, e.point.lat);// 创建点
          var marker2 = new BMap.Marker(pt, { icon: myIcon });
          // console.log("创建摄像头---", marker2)
          this.map.addOverlay(marker2);
          this.state.show = true;
          this.state.cameraSta = true;
          this.cameraForm.longitude = e.point.lng;
          this.cameraForm.latitude = e.point.lat;
          this.budCamera.push(marker2);
          // console.log("摄像头集合---", this.budCamera)
        })
        // }
      }
      else if (this.state.show) {
        if (!this.state.editShow) {
          this.$message.error("请完成当前操作");
        }
        // console.log("点击地图")
      } else if (!this.state.show) {
        if (e.overlay.type_id === 6 && this.btnShow.editCamera) {
          // 编辑摄像头
          this.build.tit = '编辑'
          this.state.editShow = true;
          const data = {};
          data.equip_id = e.overlay.equip_id;
          data.type = 1;
          editcamera(data).then(response => {
            if (errorStatus(response.data)) {
              const item = response.data.data;
              this.cameraForm = response.data.data;
              this.$set(this.cameraForm, 'cameType', '1')
              //  请求区域 -地块-牧场 列表
              const data1 = {};
              regionlist(data1).then(response => {
                if (errorStatus(response.data)) {
                  this.regLi = response.data.data;
                  this.state.editShow = true;
                  this.state.show = true;
                  this.state.cameraSta = true;
                }
              }).catch(Error => {
                this.$message.error("请求区域列表失败")
              })
              console.log("编辑摄像头--", item);
              if (item.field_id !== 0) {
                const ladata = {};
                ladata.region_id = item.region_id;
                massifdata(ladata).then(response => {
                  if (errorStatus(response.data)) {
                    this.landLi = response.data.data;
                    this.build.showLand = true;
                  }
                }).catch(Error => {
                  this.$message.error("请求地块列表失败")
                })
                if (item.cultiv_id !== 0) {
                  const graData = {};
                  graData.field_id = item.field_id;
                  cultivalist(graData).then(response => {
                    if (errorStatus(response.data)) {
                      this.grazLi = response.data.data;
                      this.build.showGraz = true;
                    }
                  }).catch(Error => {
                    this.$message.error("请求区域列表失败")
                  })

                }
              }
            }

          })

        }
      }

    },
    setHeight () {
      this.conheight.height = window.innerHeight - 150 + 'px'; // 设置地图容器的高度 !!!
    },
    // 新建果园
    newBuild () {
      this.buildForm = {
        massif_name: '',
        longitude: '',
        latitude: '',
        her_id: '',
        respon_tel: '',
        address: '',
      }
      this.state.buildPot = true;
      this.colorBtn.clor1 = true;
      this.map.setDefaultCursor("crosshair"); // 改变鼠标样式
      //  请求负责人列表
      const data = {};
      data.type = 1;
      data.state = 0;
      persList(data).then(response => {
        if (errorStatus(response.data)) {
          this.herMember = response.data.data
        }
      }).catch(Error => {
        console.log('err--', Error);
        this.$message.error("负责人列表请求失败")
      })

      // if (!this.state.show) {
      //   var pen = this.scriber('#2f4de4', BMAP_DRAWING_MARKER);
      //   console.log("pen---", pen)
      //   // 点击地图事件
      //   this.map.addEventListener('click', (rs) => {
      //     console.log("---",rs)
      //     pen.close();
      //     this.buildForm.longitude = rs.point.lng;
      //     this.buildForm.latitude = rs.point.lat;
      //     this.buildForm.address = rs.address;
      //     this.buildForm.prover = rs.addressComponents.province;
      //     this.buildForm.city = rs.addressComponents.city;
      //     this.state.show = true;
      //     this.state.buildSta = true;
      //   });
      // }

    },
    // 新建-编辑  提交
    onSubmit (num) {
      const _this = this
      if (num === 1) {
        _this.$refs.buildForm.validate(valid => {
          if (valid) {
            const loading = _this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });

            if (!_this.state.editShow) {
              // 添加
              const data = _this.buildForm;
              data.type = 1;
              addfarmld(data).then(Response => {
                loading.close();
                if (errorStatus(Response.data)) {
                  _this.$message.success(Response.data.data);
                  // 给新建的果园 添加 id
                  const massif_id = Response.data.massif_id;
                  _this.reload();
                  _this.canState('buildForm');
                  _this.map.setDefaultCursor("hand"); // 改变鼠标样式
                }

              }).catch(Error => {
                loading.close();
                _this.$message.error("新建果园请求失败");
                console.log("新建区域-提交--Error", Error)
              })
            } else {
              // 编辑
              const data = _this.buildForm;
              data.type = 1;
              editfarmld(data).then(Response => {
                loading.close();
                if (errorStatus(Response.data)) {
                  _this.$message.success(Response.data.data);
                  _this.reload();
                  _this.canState('buildForm');
                  _this.map.setDefaultCursor("hand"); // 改变鼠标样式
                }

              }).catch(Error => {
                loading.close();
                _this.$message.error("编辑果园请求失败")
                console.log("编辑区域-提交--Error", Error)
              })
            }

          }
        })
      } else if (num == 2) {
        _this.$refs.areaForm.validate(valid => {
          if (valid) {
            const loading = _this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            const data = _this.areaForm;
            if (_this.state.editShow) {
              // console.log("data--", data)
              editregion(data).then(response => {
                loading.close()
                if (errorStatus(response.data)) {
                  _this.$message.success(response.data.data);
                  _this.canState('areaForm');
                  _this.reload()
                }
              }).catch(Error => {
                loading.close()
                console.log("Error--", Error);
                _this.$message.error("新增请求失败")
              })
            } else {
              addregion(data).then(response => {
                loading.close()
                if (errorStatus(response.data)) {
                  _this.$message.success(response.data.data);
                  _this.canState('areaForm');
                  _this.reload()
                }
              }).catch(Error => {
                loading.close()
                console.log("Error1212--", Error);
                _this.$message.error("编辑请求失败")
              })
            }
          }
        })
      } else if (num === 3) {
        // 地块
        _this.$refs.landForm.validate(valid => {
          if (valid) {
            const loading = _this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            const data = _this.landForm;
            if (!_this.state.editShow) {
              // console.log("this.budland",_this.budLand)
              // console.log("_this.budland.length",_this.budLand.length)
              _this.map.removeOverlay(_this.budLand[_this.budLand.length - 1])
              // this.budRegion[this.budRegion.length - 1];
              addmassif(data).then(response => {
                loading.close();
                if (errorStatus(response.data)) {
                  _this.$message.success(response.data.data);
                  _this.canState('landForm');
                  _this.reload();
                }
              }).catch(Error => {
                loading.close();
                _this.$message.error("添加请求失败")
              })
            } else {
              editmassif(data).then(response => {
                loading.close();
                if (errorStatus(response.data)) {
                  _this.$message.success(response.data.data);
                  _this.canState('landForm');
                  _this.reload();
                }
              }).catch(Error => {
                loading.close();
                _this.$message.error("编辑请求失败")
              })
            }

          }
        })
      } else if (num === 4) {
        this.$refs.grazForm.validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            const data = this.grazForm;

            // console.log("data---", data);
            if (!this.state.editShow) {
              data.type = 1;
              this.map.removeOverlay(this.budGraz[this.budGraz.length - 1])
              // this.budRegion[this.budRegion.length - 1];
              addcultiv(data).then(response => {
                loading.close()
                if (errorStatus(response.data)) {
                  this.$message.success(response.data.data);
                  this.canState('grazForm');
                  _this.reload();
                }
              }).catch(Error => {
                loading.close();
                this.$message.error('请求失败!')
              })
            } else {
              data.type = 2;
              editcultiv(data).then(response => {
                loading.close();
                if (errorStatus(response.data)) {
                  this.$message.success(response.data.data);
                  this.canState('grazForm');
                  _this.reload();
                }
              }).catch(Error => {
                loading.close();
                this.$message.error("编辑请求失败")
              })
            }
          }
        })
      } else if (num === 5) {
        this.$refs.cameraForm.validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: "Loading",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            const data = this.cameraForm;
            // console.log("data--", data);
            if (!this.state.editShow) {
              addcamera(data).then(response => {
                loading.close();
                if (errorStatus(response.data)) {
                  this.$message.success(response.data.data);
                  this.canState('cameraForm');
                  _this.reload()
                }
              }).catch(Error => {
                loading.close();
                this.$message.error("请求失败")
              });
            } else {
              editcamera(data).then(response => {
                loading.close();
                if (errorStatus(response.data)) {
                  this.$message.success(response.data.data);
                  this.canState('cameraForm');
                  _this.reload()
                }
              }).catch(Error => {
                loading.close();
                this.$message.error("编辑摄像头请求失败")
              });
            }
          }
        })

      }
    },
    // 占地区域
    LandRegion () {
      this.$message({
        message: "在地图上单击鼠标左键开始画线,双击鼠标左键后停止画线",
        duration: 8000
      })
      this.areaForm = {
        region_name: '',
        massif_id: '',
        region_acreage: '',
        landName: '',
        coordinate: [],
        region_color: '#2f4de4',
        region_slide: 0.2,
        region_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg=='
      }
      const _this = this;
      if (!this.state.show && !this.state.buildSta) {
        this.canState();
        this.colorBtn.clor2 = true;
        var draw = _this.scriber('#2f4de4', BMAP_DRAWING_POLYGON, 0.2); //画多边形BMAP_DRAWING_POLYGON
        // overlaycomplete  鼠标绘制完成后，派发总事件的接口
        draw.addEventListener('overlaycomplete', function (e) {
          // console.log("多边形---", e);
          const overLay = e.overlay.so;
          var pts = [];
          var idxArr = [];
          var arr = false;
          var index = null;
          // 循环 当前占地区域
          for (let q in overLay) {
            var pt1 = new BMap.Point(overLay[q].lng, overLay[q].lat);
            pts.push(pt1);
          }
          //  循环 所有marker
          // console.log("_this.budMarker--", _this.budMarker)
          for (let z in _this.budMarker) {
            var ply = new BMap.Polygon(pts);
            var mk = new BMap.Point(_this.budMarker[z].longitude, _this.budMarker[z].latitude);
            // console.log("区域--", ply)
            // console.log("点--", mk)
            if (BMapLib.GeoUtils.isPointInPolygon(mk, ply)) {
              // console.log("点在区域内--")
              idxArr.push(z)
              index = z
              arr = true;
              _this.areaForm.massif_id = _this.budMarker[index].massif_id;
            }
          }
          // console.log("arr---", arr)
          // console.log("index---", index)
          // console.log("arr---", arr)
          // 画区域 包含多个果园时
          if (idxArr.length > 1) {
            _this.map.removeOverlay(e.overlay);
            _this.$message.error("区域内存在多个果园");
            _this.colorBtn.clor2 = false;
            _this.map.setDefaultCursor("hand");
            _this.state.show = false;
            _this.state.areaSta = false;
            _this.areaForm.massif_id = '';
            _this.areaForm.coordinate = [];
            return false
          }

          if (!arr) {
            _this.map.removeOverlay(e.overlay);
            _this.$message.error("区域内无果园");
            _this.colorBtn.clor2 = false;
            _this.map.setDefaultCursor("hand");
            return false
          }
          // 请求果园列表
          const data = {};
          farmland(data).then(response => {
            if (errorStatus(response.data)) {
              const markland = response.data.data; //返回bu包含区域的 果园列表
              var farmTrue = false
              // console.log("-------", _this.areaForm.massif_id)
              for (let i in markland) {
                if (markland[i].massif_id === _this.budMarker[index].massif_id) { //果园列表中的id 是否与 新建区域内的果园id 相同 相同 可建  不相同就不可见
                  // console.log("0000000000")
                  _this.areaForm.landName = markland[i].massif_name;
                  farmTrue = true;
                }
              };
              // console.log("farmTrue--", farmTrue)
              if (!farmTrue) {
                _this.map.removeOverlay(e.overlay);
                _this.$message.error("该果园已关联区域,不可重复关联");
                _this.colorBtn.clor2 = false;
                _this.map.setDefaultCursor("hand");
                _this.state.show = false;
                _this.state.areaSta = false;
                _this.areaForm.massif_id = '';
                _this.areaForm.coordinate = [];
                return false
              } else {
                _this.areaForm.massif_id = _this.budMarker[index].massif_id;
                _this.state.show = true;
                _this.state.areaSta = true;
                _this.areaForm.coordinate = overLay;
                _this.budRegion.push(e.overlay);
                _this.map.addOverlay(e.overlay)
              }
            }
          }).catch(Error => {
            this.$message.error("请求失败")
            console.log("获取农Error田--", Error)
          })
        })
      } else {
        this.$message.error("请完成当前操作")
      }
    },
    //地块规划
    landPlan () {
      this.$message({
        message: "在地图上单击鼠标左键开始画线,双击鼠标左键后停止画线",
        duration: 8000
      })
      this.landForm = {
        land_name: '',
        field_id: '',
        land_acreage: '',
        region_name: '',
        land_color: '#E42F2F',
        land_slide: 0.5,
        coordinate: [],
        land_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg=='
      }
      const _this = this;
      if (!this.state.show && !this.state.buildSta) {
        this.canState();
        this.colorBtn.clor3 = true;
        var draw = _this.scriber('#E42F2F', BMAP_DRAWING_POLYGON, 0.5); //画多边形BMAP_DRAWING_POLYGON
        draw.addEventListener('overlaycomplete', function (e) {
          // console.log("多边形---", e);
          const overLay = e.overlay.so;
          const budRegion = _this.budRegion;
          var doitArr = [];
          var ladIndex = [];
          var index = null;
          for (let i in overLay) {
            var pd = new BMap.Point(e.overlay.so[i].lng, e.overlay.so[i].lat); //以指定的经度和纬度创建一个地理点坐标 点
            // console.log(i+'---'+pd)
            for (let j in budRegion) {
              var cd_arr = [];
              for (var g = 0; g < budRegion[j].coordinate.length; g++) {
                var d = new BMap.Point(budRegion[j].coordinate[g].lng, budRegion[j].coordinate[g].lat)
                cd_arr.push(d);
              }
              var ply = new BMap.Polygon(cd_arr, { strokeColor: budRegion[j].region_color, fillColor: budRegion[j].region_color, strokeWeight: 2, fillOpacity: 0.4 });
              // console.log("quyu ---", BMapLib.GeoUtils.isPointInPolygon(pd, ply))
              if (BMapLib.GeoUtils.isPointInPolygon(pd, ply)) {
                // console.log("点在图");
                // console.log("i", i)
                // console.log("j", budRegion[j].region_name);
                ladIndex.push(Number(j))
                index = j
                doitArr.push(i)
              }
            }
          };
          // console.log("doitArr--", doitArr);
          if (doitArr.length < overLay.length) {
            // console.log('地块必须在区域内')
            _this.map.removeOverlay(e.overlay);
            _this.$message.error("地块必须在区域内");
            _this.canState()
          } else {
            if (Math.max.apply(null, ladIndex) !== Math.min.apply(null, ladIndex)) {
              _this.map.removeOverlay(e.overlay);
              _this.$message.error("地块存在于多个区域内");
              _this.canState('landForm');
              return false
            }
            // console.log('budRegion', _this.budRegion[index])
            // 获取区域;列表
            const regData = {};
            regData.massif_id = _this.budRegion[index].massif_id;
            regionlist(regData).then(response => {
              if (errorStatus(response.data)) {
                const regionList = response.data.data;
                for (let i in regionList) {
                  if (regionList[i].region_id === _this.budRegion[index].region_id) {
                    // console.log("222222")
                    _this.landForm.region_name = regionList[i].region_name;
                    _this.landForm.land_surplus = regionList[i].surplus;
                    _this.landForm.field_id = _this.budRegion[index].region_id;
                    _this.state.show = true;
                    _this.state.landSta = true;
                    _this.landForm.coordinate = overLay;
                    _this.budLand.push(e.overlay);
                    _this.map.addOverlay(e.overlay)
                    // console.log("_this.budLand", _this.budLand)
                  }
                }
              }

            }).catch(Error => {
              console.log(Error)
              this.$message.error("请求失败")
              this.$message.error("请求区域列表失败");

            })
          }
        })
      }
    },
    // 养殖放牧
    cultivation () {
      this.$message({
        message: "在地图上单击鼠标左键开始画线,双击鼠标左键后停止画线",
        duration: 8000
      });
      this.grazForm = {
        cultiv_name: '',
        cultiv_color: '#55FF00',
        cul_slide: 0.8,
        landType: '1',
        cultiv_acreage: '',
        cultiv_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg==',
      }
      const _this = this;
      if (!this.state.show && !this.state.grazSta) {
        _this.canState();
        this.colorBtn.clor4 = true;
        var draw = _this.scriber('#55FF00', BMAP_DRAWING_POLYGON, 0.8); //画多边形BMAP_DRAWING_POLYGON
        draw.addEventListener('overlaycomplete', function (e) {
          console.log("养殖放牧多边形---", e);
          const overLay = e.overlay.so;
          const landData = _this.budLand
          var doitArr = [];
          var index = null;
          var ladIndex = [];
          for (let i in overLay) {
            // console.log("i--", i)
            var pd = new BMap.Point(overLay[i].lng, overLay[i].lat); //以指定的经度和纬度创建一个地理点坐标
            for (let j in landData) {
              var cd_arr = [];
              for (var g = 0; g < landData[j].coordinate.length; g++) {
                var d = new BMap.Point(landData[j].coordinate[g].lng, landData[j].coordinate[g].lat)
                cd_arr.push(d);
              }
              var ply = new BMap.Polygon(cd_arr, { strokeColor: landData[j].region_color, fillColor: landData[j].region_color, strokeWeight: 2, fillOpacity: 0.4 });

              if (BMapLib.GeoUtils.isPointInPolygon(pd, ply)) {
                // console.log("点在图");
                index = j
                doitArr.push(i);
                ladIndex.push(Number(j))
              }
            }
          }

          // console.log("doitArr--", doitArr);
          // console.log("overLay--", overLay);
          if (doitArr.length < overLay.length) {
            // console.log('地块必须在区域内')
            _this.map.removeOverlay(e.overlay);
            _this.$message.error("牧场必须在地块内");
            _this.canState();
          } else {
            if (Math.max.apply(null, ladIndex) !== Math.min.apply(null, ladIndex)) {
              _this.map.removeOverlay(e.overlay);
              _this.$message.error("牧场存在于多个地块内");
              _this.canState('landForm');
              return false
            }
            // console.log('_this.landData[index]--', _this.landData[index])
            _this.grazForm.region_id = _this.budLand[index].land_id;

            // 获取地块列表
            const regData = {};
            regData.region_id = _this.budLand[index].land_id;// 所属地块id
            regData.type = 2;
            addcultiv(regData).then(response => {
              if (errorStatus(response.data)) {
                // console.log("response.data--", response.data)
                _this.$set(_this.grazForm, 'her_name', response.data.data.her_name);
                _this.$set(_this.grazForm, 'reg_name', response.data.data.reg_name);
                _this.$set(_this.grazForm, 'surplus', response.data.data.surplus);
                _this.$set(_this.grazForm, 'region_id', response.data.data.region_id);
                _this.state.show = true;
                _this.state.grazSta = true;
                _this.grazForm.coordinate = overLay;
                _this.budGraz.push(e.overlay)
              }
            })

          }

        })
      }
    },
    // 摄像头
    camera () {
      this.canState();
      //  drawingManager.close();
     this.scriber('#fff', BMAP_DRAWING_POLYGON, 0.1,1)
      const _this = this;
      this.colorBtn.clor5 = true;
      this.state.cameraPot = true;
      const data = {};
      // 请求 区域列表
      regionlist(data).then(response => {
        if (errorStatus(response.data)) {
          this.regLi = response.data.data;
          this.grazLi = '';
          this.landLi = '';
        }
      })
    },
    // 画线公用函数
    scriber (col, typ, opa,num) {
      var color = col
      var styleOptions = {
        strokeColor: color, // 边线颜色。
        fillColor: color, // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: opa, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      var drawingManager = new BMapLib.DrawingManager(this.map, {
        
        isOpen: true, // 是否开启绘制模式
        // enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5) // 偏离值
        },
        circleOptions: styleOptions, // 圆的样式
        polylineOptions: styleOptions, // 线的样式
        polygonOptions: styleOptions, // 多边形的样式
        rectangleOptions: styleOptions // 矩形的样式
      })

      drawingManager.open()
      drawingManager.setDrawingMode(typ) //设置当前的绘制模式
      if(num){
        drawingManager.close()
      }

      return drawingManager
    },
    // 搜索--负责人
    queryMember (query) {
      if (query !== '') {
        const data = {};
        data.type = 1;
        data.her_where = query;
        data.state = 0;
        persList(data).then(response => {
          if (errorStatus(response.data)) {
            this.herMember = response.data.data
          }
        }).catch(Error => {
          this.$message.error("请求失败")
          console.log('err--', Error)
        })
      }
    },
    //  负责人选择后
    choseMember (val) {
      const perList = this.herMember;
      // console.log("perList0000", perList)
      for (let i in perList) {
        // console.log("perList---", perList[i])
        if (val === perList[i].her_id) {
          this.$set(this.buildForm, 'respon_tel', perList[i].her_tel);
          this.$set(this.buildForm, 'her_id', val);
        }
      }
    },
    // 上传图片
    imgUp (num) {
      document.getElementById('imgUp' + num).click()
    },
    // 获取图片 转base64
    landImg (e) {
      // console.log("e--", e)
      const _this = this;
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        // var imgcode = e.target.result
        if (_this.state.areaSta) {
          _this.$set(_this.areaForm, 'region_image', e.target.result);
        } else if (_this.state.landSta) {
          _this.$set(_this.landForm, 'land_image', e.target.result);
        } else if (_this.state.grazSta) {
          _this.$set(_this.grazForm, 'cultiv_image', e.target.result);
        }

      }
    },
    // 数字验证 
    numKepup (val) {
      // console.log("this.state.grazSta--",this.state.grazSta)
      // console.log("this.grazForm.surplus--",this.grazForm.surplus)
      const value = val.target.value;
      const value1 = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      const value2 = value1.replace(/^\./g, '') // 验证第一个字符是数字而不是.
      const val1 = value2.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.') // 只保留第一个. 清除多余的.
      const val2 = val1.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      // console.log("value--",val2)
      if (this.state.landSta) {
        this.areaForm.region_acreage = val2;
      } else if (this.state.grazSta) {
        this.grazForm.cultiv_acreage = val2;
      }

    },
    // 亩数 失去 焦点
    numBlur (e) {
      const value = e.target.value;
      // console.log("输入的亩数--", value);
      // console.log("剩余亩数--", this.grazForm.surplus); landForm
      if (this.state.landSta) {
        // 地块
        if (Number(value) > Number(this.landForm.land_surplus)) {
          this.$message.error("输入的数值大于剩余数");
          this.landForm.land_acreage = '';
          // this.submitState=false;
        }
      } else if (this.state.grazSta) {
        // 牧场
        if (Number(value) > Number(this.grazForm.surplus)) {
          this.$message.error("输入的数值大于剩余数");
          this.grazForm.cultiv_acreage = ''
          // this.submitState=false;
        }
      }
    },
    // 点击 点 marker
    markerClick (item) {
      if (this.btnShow.editFarm) {
        this.build.tit = '编辑'
        if (this.state.editShow || this.state.show) {
          this.$message.error("请完成当前操作");
          return false
        }
        // console.log('99999999', item);
        this.buildForm = item;
        this.state.editShow = true;
        //  请求负责人列表
        const data = {};
        data.type = 1;
        data.her_where = item.her_name;
        data.state = 0;
        persList(data).then(response => {
          if (errorStatus(response.data)) {
            this.herMember = response.data.data;
            // console.log('this.herMember', this.herMember);
            this.state.show = true;
            this.state.buildSta = true;
          }
        }).catch(Error => {
          this.$message.error("请求失败")
          console.log('err--', Error)
        })
      }
    },
    // 点击 点 摄像头
    cameraClick (item) {
      this.build.tit = '编辑'
      if (this.state.editShow) {
        this.$message.error("请完成当前操作");
        return false
      }
      // console.log('came---', item);
    },
    // 点击--编辑 多边形 区域
    regionClick (item) {
      if (this.btnShow.editReg) {
        this.build.tit = '编辑'
        if (this.state.cameraPot) {
          return false
        }
        if (this.state.editShow || this.state.show) {
          this.$message.error("请完成当前操作");
          return false
        }
        // console.log("item--", item);
        this.state.show = true;
        this.state.areaSta = true;
        this.state.editShow = true;
        this.areaForm = item;
        // this.$set(this.areaForm, 'region_slide', this.areaForm.region_slide * 100)

        if (this.areaForm.region_image.substr(0, 7).toLowerCase() !== "http://") {
          this.$set(this.areaForm, 'region_image', this.baseUrl + this.areaForm.region_image)
        }
        this.$set(this.areaForm, 'edit', true)
        // 请求果园列表
        const data = {};
        data.type = 2;
        farmland(data).then(response => {
          if (errorStatus(response.data)) {
            const markland = response.data.data; //返回bu包含区域的 果园列表;
            for (let i in markland) {
              if (item.massif_id === markland[i].massif_id) {
                // console.log("massif_name",markland[i].massif_name)
                this.$set(this.areaForm, 'landName', markland[i].massif_name)
              }
            }
          }
        });
      }
      // console.log("this.areaForm--", this.areaForm)
    },
    // 点击--编辑 多边形 地块
    landClick (item) {
      if (this.btnShow.editLand) {
        this.build.tit = '编辑'
        if (this.state.cameraPot) {
          return false
        }
        // console.log("点击--编辑 多边形 地块")
        if (this.state.editShow || this.state.show) {
          this.$message.error("请完成当前操作");
          return false
        }
        console.log("item地块--", item);
        this.state.show = true;
        this.state.landSta = true;
        this.state.editShow = true;
        this.landForm = item;
        if (this.landForm.land_image.substr(0, 7).toLowerCase() !== "http://") {
          this.$set(this.landForm, 'land_image', this.baseUrl + this.landForm.land_image)
        }
        // this.$set(this.areaForm, 'region_slide', this.areaForm.region_slide * 100)
        this.$set(this.landForm, 'edit', true)
      }
      console.log("this.landForm--", this.landForm)
    },
    // "点击--编辑 多边形 牧场
    grazClick (item) {
      if (this.btnShow.editPasture) {
        this.build.tit = '编辑'
        // console.log("点击--编辑 多边形 牧场")
        if (this.state.editShow || this.state.show) {
          this.$message.error("请完成当前操作");
          return false
        }
        if (this.state.cameraPot) {
          return false
        }

        const budGraz = this.budGraz;
        const data = {};
        data.cultiv_id = item.cultiv_id;
        data.type = 1;
        editcultiv(data).then(response => {
          if (errorStatus(response.data)) {
            this.grazForm = response.data.data;
            // console.log('编辑', response.data.data);
            if (response.data.data.base_type === 1) {
              this.$set(this.grazForm, 'name', '散养')
            } else {
              this.$set(this.grazForm, 'name', '圈养')
            }
            this.$set(this.grazForm, 'cultiv_image', this.baseUrl + this.grazForm.cultiv_image)
            this.state.show = true;
            this.state.grazSta = true;
            this.state.editShow = true;
            for (let i in budGraz) {
              if (budGraz[i].cultiv_id === item.cultiv_id) {
                this.$set(this.budGraz[i], 'edit', true)
              }
            }
            // console.log("this.grazForm--", this.grazForm)
          }
        }).catch(Error => {
          this.$message.error("请求编辑数据失败")
          // console.log("Error-", Error)
        })
      }
    },
    // 修改 多边形区域形状
    updateRegionPath (event) {
      // console.log("event--",event.target.getPath());
      const _this = this;
      if (this.state.areaSta) {
        this.areaForm.coordinate = event.target.getPath();
      } else if (this.state.landSta) {
        this.landForm.coordinate = event.target.getPath();
      } else if (this.state.grazSta) {
        this.grazForm.coordinate = event.target.getPath();
      }

    },
    // 刪除 
    delbtn (num) {
      if (num === 1) {
        const data = {};
        data.massif_id = this.buildForm.massif_id;
        // 删除果园
        delfarmld(data).then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.canState('buildForm');
            this.reload();
          }
        }).catch(Error => {
          this.$message.error("请求失败")
        })
      } else if (num === 2) {
        // 删除
        const data = {};
        data.region_id = this.areaForm.region_id;
        // 删除区域
        delregion(data).then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.canState('areaForm');
            this.reload();
          }
        }).catch(Error => {
          this.$message.error("请求失败")
        })
      } else if (num === 3) {
        const data = {};
        data.land_id = this.landForm.land_id;
        // 删除地块
        delmassif(data).then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.canState('landForm');
            this.reload();
          }
        }).catch(Error => {
          console.log("Error", Error)
          this.$message.error("请求失败")
        })

      } else if (num === 4) {
        const data = {};
        data.cultiv_id = this.grazForm.cultiv_id;
        delcultiv(data).then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.canState('grazForm');
            this.reload();
          }
        }).catch(Error => {
          console.log("Error", Error)
          this.$message.error("请求失败")
        })
      } else if (num === 5) {
        // 删除摄像头
        const data = {};
        data.equip_id = this.cameraForm.equip_id;
        delcamera(data).then(response => {
          if (errorStatus(response.data)) {
            this.$message.success(response.data.data);
            this.canState('cameraForm');
            this.reload();
          }
        }).catch(Error => {
          console.log("Error", Error)
          this.$message.error("删除请求失败")
        })
      }

    },
    // 改变地图中 多边形颜色
    chgCol (val) {
      // console.log("多边形颜色--", val);
      const _this = this;
      if (this.state.areaSta) {
        if (!this.state.editShow) {
          let pol_1 = _this.budRegion[_this.budRegion.length - 1];
          pol_1.setStrokeColor(val)
          pol_1.setFillColor(val)
        } else {
          for (let i in _this.budRegion) {
            if (_this.areaForm.region_id === _this.budRegion[i].region_id) {
              this.$set(_this.budRegion[i], 'region_color', val);
            }
          }
        }
      } else if (this.state.landSta) {
        if (!this.state.editShow) {
          let pol_2 = _this.budLand[_this.budLand.length - 1];
          pol_2.setStrokeColor(val)
          pol_2.setFillColor(val)
        } else {
          for (let i in _this.budLand) {
            if (_this.landForm.land_id === _this.budLand[i].land_id) {
              this.$set(_this.budLand[i], 'land_color', val);
            }
          }
        }
      } else if (this.state.grazSta) {
        if (!this.state.editShow) {
          let pol_2 = _this.budGraz[_this.budGraz.length - 1];
          pol_2.setStrokeColor(val)
          pol_2.setFillColor(val)
        } else {
          for (let i in _this.budLand) {
            if (_this.grazForm.land_id === _this.budGraz[i].land_id) {
              this.$set(_this.budLand[i], '', val);
            }
          }
        }
      }
    },
    // 改变地图中 多边形透明度
    opaChg (val) {
      const _this = this;
      // console.log("多边形透明度--", val);
      if (this.state.areaSta) {
        if (!this.state.editShow) {
          let pol_1 = _this.budRegion[_this.budRegion.length - 1];
          pol_1.setFillOpacity(val)
          pol_1.setStrokeOpacity(val)
        } else {
          for (let i in _this.budRegion) {
            if (_this.areaForm.region_id === _this.budRegion[i].region_id) {
              this.$set(_this.budRegion[i], 'region_slide', val);
            }
          }
        }
      } else if (this.state.landSta) {
        if (!this.state.editShow) {
          let pol_1 = _this.budLand[_this.budLand.length - 1];
          pol_1.setFillOpacity(val)
          pol_1.setStrokeOpacity(val)
        } else {
          for (let i in _this.budLand) {
            if (_this.landForm.land_id === _this.budLand[i].land_id) {
              this.$set(_this.budLand[i], 'land_color', val);
            }
          }
        }
      } else if (this.state.grazSta) {
        if (!this.state.editShow) {
          let pol_1 = _this.budGraz[_this.budGraz.length - 1];
          pol_1.setFillOpacity(val)
          pol_1.setStrokeOpacity(val)
        } else {
          for (let i in _this.budGraz) {
            if (_this.grazForm.cultiv_id === _this.budGraz[i].cultiv_id) {
              this.$set(_this.budGraz[i], '', val);
            }
          }
        }
      }

    },

    // 取消
    cancle (num) {
      var allOverlay = this.map.getOverlays();
      if (num === 1) {
        // 取消点
        if (!this.state.editShow) {
          const length = this.budMarker.length;
          const mak = this.budMarker[length - 1]
          // console.log("mak---", mak)
          for (let i in allOverlay) {
            if (allOverlay[i].toString() == "[object Marker]") {
              if (allOverlay[i].getPosition().lat === mak.point.lat && allOverlay[i].getPosition().lng === mak.point.lng) {
                this.map.removeOverlay(allOverlay[i]);
              }
            }
          }
          this.canState('buildForm');
        } else {
          this.canState('buildForm');
        }
      } else if (num === 2) {
        // 取消区域
        if (this.state.editShow) {
          for (let i in this.budRegion) {
            this.budRegion[i].edit = false;
          }
        }
        const length = this.budRegion.length;
        const mak = this.budRegion[length - 1];
        // console.log("取消区域mak---", mak)
        delete mak.edit;
        this.map.removeOverlay(mak)
        this.canState('areaForm');
      } else if (num === 3) {
        // 取消地块
        if (this.state.editShow) {
          for (let i in this.budLand) {
            this.budLand[i].edit = false;
          }
        }
        const length = this.budLand.length;
        const mak = this.budLand[length - 1];
        // console.log("取消区域mak---", mak)
        delete mak.edit;
        this.map.removeOverlay(mak)
        this.canState('landForm');

      } else if (num === 4) {
        // 取消牧场
        if (this.state.editShow) {
          for (let i in this.budGraz) {
            this.budGraz[i].edit = false;
          }
        }
        const length = this.budGraz.length;
        const mak = this.budGraz[length - 1];
        // console.log("取消区域mak---", mak)
        delete mak.edit;
        this.map.removeOverlay(mak)
        this.canState('grazForm');
      } else if (num === 5) {
        // 取消点
        if (!this.state.editShow) {
          const length = this.budCamera.length;
          const mak = this.budCamera[length - 1]
          // console.log("mak---", mak)
          for (let i in allOverlay) {
            if (allOverlay[i].toString() == "[object Marker]") {
              if (allOverlay[i].getPosition().lat === mak.point.lat && allOverlay[i].getPosition().lng === mak.point.lng) {
                this.map.removeOverlay(allOverlay[i]);
              }
            }
          }
          this.canState('cameraForm');
        } else {
          this.canState('cameraForm');
        }
      }
    },
    // 全部变为初始状态
    canState (formName) {
      this.state.show = false;
      this.state.buildSta = false;
      this.state.editShow = false;
      this.state.areaSta = false;
      this.state.landSta = false;
      this.state.grazSta = false;
      this.state.cameraSta = false;
      this.state.buildPot = false;
      this.state.cameraPot = false;

      this.colorBtn.clor1 = false;
      this.colorBtn.clor2 = false;
      this.colorBtn.clor3 = false;
      this.colorBtn.clor4 = false;
      this.colorBtn.clor5 = false;

      this.build.tit = '新建'
      this.map.setDefaultCursor("hand");
      // console.log("formName--", formName)
      if (formName !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.getInfor();
      this.grazForm = {
        cultiv_name: '',
        cultiv_color: '#55FF00',
        cul_slide: 0.8,
        landType: '1',
        cultiv_acreage: '',
        cultiv_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg==',
      }
      this.cameraForm = {
        equip_name: '',
        equip_number: '',
        cameType: '1',
        region_id: '',
        field_id: '',
        cultiv_id: '',
        longitude: '',
        latitude: '',
        url: 'http://'
      }
    },
    // 选中 区域列表
    chgeReg (val) {
      this.grazLi = '';
      this.cameraForm.field_id = '';
      this.cameraForm.cultiv_id = '';
      // console.log("val--", val);
      this.build.showLand = true;
      // 请求地块列表
      const data = {};
      data.region_id = val;
      massifdata(data).then(response => {
        if (errorStatus(response.data)) {
          // console.log("response.data.data", response.data.data)
          this.landLi = response.data.data;
        }
      })
    },
    //    选中地块列表
    chgeLand (val) {
      console.log("val--/.", val);
      this.build.showGraz = true;
      // 请求牧场列表
      const data = {};
      data.field_id = val;
      cultivalist(data).then(response => {
        if (errorStatus(response.data)) {
          this.grazLi = response.data.data;
        }
      })
    },
    // 修改颜色透明度数值 为0~1
    formatTooltip (num) {
      // console.log("val--", num)
      if (num !== null) {
        return num.toFixed(2)
      }
    },
    // 向子组件中传值 !!
    handler ({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      this.zoom = 13;
    },
    // 模拟F5刷新页面
    // upLoad(){
    //   location.reload()
    // }

  },
  destroyed () {
    window.removeEventListener('resize', this.setHeight)
  }

}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding-bottom: 0px;
  .sd-module-box {
    padding-bottom: 0px;
    .map-box {
      position: relative;
      .Bmap {
        width: 100%;
        // height: 551px;
        position: relative;
        .bm-map-box {
          float: right;
          width: 200px;
          .bm-map-type {
          }
        }
      }
      .left-functionBtn {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 100;
        padding-left: 10px;
        .function-box {
          width: 62px;
          height: 62px;
          background-color: #fff;
          margin-right: 10px;
          cursor: pointer;
          float: left;
          .function_icon {
            width: 41px;
            height: 33px;
            margin: 4px 10px;
          }
          .function_text {
            font-size: 12px;
            text-align: center;
            margin: 3px 0;
            // line-height: 30px;
            &.on {
              color: #409eff;
            }
          }
        }
      }
      .right_dialog_box {
        margin: 0;
        width: 350px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
        overflow: hidden;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        padding-left: 10px;
        .right_dialog {
          padding-bottom: 50px;
          .tip-box {
            font-size: 12px;
            margin: 0;
          }
          .up_img {
            max-width: 200px;
            overflow: hidden;
            max-height: 150px;
            cursor: pointer;
          }
          .title {
            margin: 0;
            padding: 20px 10px;
            font-size: 16px;
            color: #606266;
          }

          .right-btn-box {
            position: fixed;
            bottom: 0px;
            right: 0px;
            z-index: 1002;
            width: 350px;
            height: 60px;
            padding: 0px 30px;
            background-color: #fff;
            .btn-right {
              padding: 8px 25px;
            }
          }
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.app-container {
  .sd-module-box {
    .map-box {
      .Bmap {
        .anchorBL {
          display: none;
          &.BMap_noprint {
            display: block;
          }
        }
      }
      .el-input.is-disabled .el-input__inner {
        color: #666;
      }
    }
  }
}
</style>