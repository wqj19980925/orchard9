<template>
  <div class="app-digtalMap">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header mar-bot-10">
        <div class="sd-module-title">数字地图</div>
      </div>
      <baidu-map :center="center" :zoom="zoom" class="Bmap" @ready="handler">
        <div class="">
          <ul class="map-header">
            <li class="farm-li" @click="show()" v-if="addfarmland">
              <p id="farmland" class="farm-imgcenter">
                <span class="farm-img farm-oneImg"/>
              </p>
              <em class="farm-top" :style="cor1">新建农田</em>
            </li>
            <li id="occupation" class="farm-li" @click="show1" v-if="addregion">
              <p class="farm-imgcenter">
                <span class="farm-img occupation-oneImg"/>
              </p>
              <em class="farm-top" :style="cor2">占地区域</em>
            </li>
            <li class="farm-li" @click="show2" v-if="addmassif">
              <p class="farm-imgcenter">
                <span class="farm-img massif-oneImg"/>
              </p>
              <em class="farm-top" :style="cor3">地块规划</em>
            </li>
            <li class="farm-li">
              <p class="land-imgcenter">
                <span class="farm-img land-oneImg" @click="show3" v-if="addcultiv"/>
                <span class="farm-img land-twoImg massif-margin" @click="show4" v-if="addware"/>
              </p>
              <div class="farm-tops">
                <em v-if="addcultiv" :style="cor4">耕种土地</em>
                <em v-if="addware" :style="cor5">农田仓库</em>
              </div>
            </li>
            <li class="farm-li">
              <p class="land-imgcenter">
                <span class="farm-img imgcenter-oneImg" @click="es_clk" v-if="addenviron"/>
                <span class="farm-img imgcenter-twoImg massif-marginTwo" @click="Camera" v-if="addcamera"/>
              </p>
              <div class="farm-tops">
                <em v-if="addenviron" :style="cor6">环境监控</em>
                <em v-if="addcamera" :style="cor7">摄像头</em>
              </div>
            </li>
          </ul>
        </div>
        <!-- //==============新建农田 -->
        <div :style="styleObject[0]" class="left_ale">
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
              <el-col :span="8"><span>农田地址</span></el-col>
              <el-col :span="16"><el-input v-model="address" placeholder="请输入内容"/></el-col>
            </el-row>
            <span>上传图片</span>
            <img :src="img_base64" style="width:100px;">
            <input type="file" @change="massif_image"><br>
            <p style="color:red; font-size:14px; margin-top:50px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="establish" v-if =" addfarmland ">保存</a><a href="#" @click="hide">取消</a><a class="col" href="#" @click="remove_farmland" v-if="delfarmlands">删除</a>
          </div>
        </div>
        <!-- //============占地区域 -->
        <div :style="styleObject[1]" class="left_ale">
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
            <img :src="img_base64" style="margin-top:15px; width:100px;" >
            <input type="file" @change="massif_image">
            <br/>
            <p style="color:red; font-size:14px; margin-top:55px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="overs_an_area" v-if="addregion">保存</a>
            <a href="#" @click="hide" style="margin-left:-5px;">取消</a>
            <a class="col" href="#" @click="remove_area" v-if="delregion" style="margin-left:-5px;">删除</a>
          </div>
        </div>
        <!-- //============地块规划 -->
        <div :style="styleObject[2]" class="left_ale">
          <div class="left_title">编辑地块规划信息</div>
          <div class="left_form" style="top:10px;">
            <el-row>
              <el-col :span="8"><span>地块名称</span></el-col>
              <el-col :span="16"><el-input v-model="region_names" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>地块面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" placeholder="请输入内容"/></el-col>
            </el-row>
            <div class="left_form"/>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px; width:100px;" >
            <input type="file" @change="massif_image"><br>
            <p style="color:red; font-size:14px; margin-top:55px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="dk_project" v-if="addmassif">保存</a>
            <a href="#" @click="hide" style="margin-left:-5px;">取消</a>
            <a class="col" href="#" @click="remove_plot" v-if="delmassif" style="margin-left:-5px;">删除</a>
          </div>
        </div>
        <!-- //============耕种土地 -->
        <div :style="styleObject[3]" class="left_ale">
          <div class="left_title">编辑土地区域信息</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>土地名称</span></el-col>
              <el-col :span="16"><el-input v-model="cultiv_name" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" placeholder="请输入内容"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px; width:100px;" >
            <input type="file" @change="massif_image"><br>
            <p style="color:red; font-size:14px; margin-top:55px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="add_l" v-if="addcultiv">保存</a>
            <a href="#" @click="hide" style="margin-left:-5px;">取消</a><a class="col" href="#" @click="remove_land" v-if="delcultiv" style="margin-left:-5px;">删除</a>
          </div>
        </div>
        <!-- //=======农田仓库 -->
        <div :style="styleObject[6]" class="left_ale">
          <div class="left_title">编辑仓库区域信息</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>仓库名称</span></el-col>
              <el-col :span="16"><el-input v-model="cultiv_name1" placeholder="请输入内容"/></el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="8"><span>仓库容量</span></el-col>
              <el-col :span="16"><el-input v-model="cul_capacity" placeholder="请输入内容"/></el-col>
            </el-row> -->
            <el-row>
              <el-col :span="8"><span>区域面积</span></el-col>
              <el-col :span="16"><el-input v-model="mz" placeholder="请输入内容"/></el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="8"><span>仓库类型</span></el-col>
              <el-col :span="16">
                <el-select v-model="value" placeholder="请选择" @change="ware_type_fun">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :value="item.value"/>
                </el-select>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="8"><span>标记颜色</span></el-col>
              <el-col :span="1"><el-color-picker v-model="color1" style="width:0; padding:0;"/></el-col>
            </el-row>
            <span style="margin-top:10px;">上传图片</span>
            <img :src="img_base64" style="margin-top:15px; width:100px;" >
            <input type="file" @change="massif_image"><br>
            <p style="color:red; font-size:14px; margin-top:55px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="add_w" v-if="addware">保存</a><a href="#" @click="hide" style="margin-left:-5px;">取消</a><a class="col" href="#" @click="remove_ware" v-if="delware" style="margin-left:-5px;">删除</a>
          </div>
        </div>

        <!-- //============环境监控 -->
        <div :style="styleObject[4]" class="left_ale">
          <div class="left_title">编辑环境监控</div>
          <div class="left_form">
            <el-row>
              <el-col :span="8"><span>绑定环境</span></el-col>
              <!-- <el-col :span="16"><el-input placeholder="请输入内容" v-model="env_name"/></el-col> -->
                <el-select v-model="value8" @change="obtainID()" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options3"
                    :key="item.env_id"
                    :value="item.env_name">
                  </el-option>
                </el-select>
            </el-row>
            <!-- <el-row>
              <el-col :span="8"><span>监控区域</span></el-col>
              <el-col :span="16">
                <el-select v-model="value1" placeholder="请选择" @change="regionlistFun()">
                  <el-option
                    v-for="item in qy_list"
                    :key="item.field_id"
                    :value="item.field_name"/>
                </el-select>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="8"><span>环境编号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="env_number"/></el-col>
            </el-row>
            <div class="left_form">
              <span>备注</span><textarea v-model="env_remarks"/><br>
            </div>
            <p style="color:red; font-size:14px; margin-top:90px; padding:0px 5px 0px 30px;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="environment" v-if="addenviron">保存</a><a href="#" @click="hide" style="margin-left:-5px;">取消</a><a class="col" href="#" @click="delenviron_fun" v-if="delenviron" style="margin-left:-5px;">删除</a>
          </div>
        </div>
        <!-- //============摄像头 -->
        <div :style="styleObject[5]" class="left_ale">
          <div class="left_title">编辑摄像头</div>
          <div class="left_form" style="height:698px; overflow:hidden; overflow-y:scroll;">
            <el-row>
              <el-col :span="8"><span>设备名称</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_name"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>设备编号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_number"/></el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="8"><span>监控区域</span></el-col>
              <el-col :span="16">
                <el-select v-model="value2" placeholder="请选择" @change="regionlistFuns()">
                  <el-option
                    v-for="item in qy_list"
                    :key="item.field_id"
                    :value="item.field_name"/>
                </el-select>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="8"><span>IP/域名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_domain"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>HTTP/端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_http"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>RTSP/端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_rtsp"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>服务端口号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_webserve"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>用户名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_username"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>密码</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_password"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>通道号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_channel"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>获取通道号</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_get_channel"/></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><span>IP/域名</span></el-col>
              <el-col :span="16"><el-input placeholder="请输入内容" v-model="equip_channel_domain"/></el-col>
            </el-row>
            <p style="color:red;">{{ arr }}</p>
          </div>
          <div class="footer">
            <a href="#" @click="camera_fun" v-if="addcamera">保存</a><a href="#" @click="hide" style="margin-left:-5px;">取消</a><a class="col" href="#" v-if="delcamera" style="margin-left:-5px;" @click=" delcamera_fun ">删除</a>
          </div>
        </div>
      </baidu-map>
    </el-row>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/Map/Map.vue'
import { errorStatus } from "@/utils/index"
// import GeoUtils from '../../../static/js/GeoUtils.js'
import {
  addcropland,
  area,
  nt_listss,
  log,
  defa_map,
  add_land,
  add_ware,
  delcultiv,
  delmassif,
  delregion,
  editware,
  delfarmland,
  editregion,
  editfarmland,
  editcultiv,
  regionlist,
  addenviron,
  addcamera,
  massifdata,
  cultivalist,
  delenviron,
  delcamera,
  editmassif,
  editwares,
  editenviron,
  editcamera,
} from '@/api/map'
// https://dafrok.github.io/vue-baidu-map/#/zh/start/usage  github上的vue baidumap  插件地址
import BMapLib from 'BMapLib'
export default {
  components: { BaiduMap },
  data() {
    return {
      zoom: 3,
      center: { lng: 0, lat: 0 },
      drawingManager: '',
      BMap: '',
      map: '',
      overlays: [],
      styleObject: [
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' },
        { display: 'none' }
      ],
      options: [{
        value: '成品',
        id: '1'
      }, {
        value: '半成品',
        id: '2'
      }, {
        value: '原料',
        id: '3'
      }],
      commo_lon_lat: null,
      arr: "",
      timer: null,
      land_colors: 'land_color',
      warehouse_colors: 'warehouse_color',
      long: '',
      dimension: '',
      plot: true,
      mz: '',
      compile_region_id: "",
      compile_massif_id: null,
      // 默认数据data
      response_: null,
      dk_s: [],
      dk_s1: [],
      dk_s2: [],
      dk_s3: [],
      // 新建农田
      cropland: '',
      principal: '',
      respon_tel: '',
      address: '',
      img_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg==',
      // 农田列表
      nt_list: [],
      qy_list: null,
      // 农田列表
      // p_list:[],
      // 占地区域
      region_name: '',
      region_acreage: '',
      qy_coordinate: '',
      massif_id: '',
      options3: [],
      value8: '',
      value: '',
      // 地块
      region_names: '',
      // 土地
      cultiv_name: '',
      cultiv_acreage: '',
      pitch_plot_id: '',
      coordinate: '',
      area_plot_id: '',
      // 仓库
      cultiv_name1: '',
      cul_capacity: '',
      ware_type: '',
      // 删除用户点的id
      delcultiv_id: '',
      delmassif_id: '',
      overlayObj: [],
      editor_stat: true,
      region_stat: true,
      massif_ids: '',
      color1: '#409EFF',
      overlays: [],
      value1: '',
      regionlist_fun_id: '',
      BMap: '',
      // 权限
      addfarmland: false,
      editfarmland: false,
      delfarmlands: false,
      addregion: false,
      editregion: false,
      delregion: false,
      addmassif: false,
      editmassif: false,
      delmassif: false,
      addcultiv: false,
      editcultiv: false,
      delcultiv: false,
      addware: false,
      editware: false,
      delware: false,
      addenviron: false,
      editenviron: false,
      delenviron: false,
      addcamera: false,
      delcamera: false,
      // 环境监控
      env_name: null,
      env_number: null,
      env_remarks: null,
      imgss: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFlElEQVRYR7WWf2xTVRTHv+d1pYQ4EDTgVH6oEJQRkQy29b4i4K8JEg38YQRZhBAiikIUZ0R+9L4FFNEYJRjEoDHqxKgBQVHUkQF593WwEcBYIEKEhSlk0TEcOrq275jXdqPr2q7D+P56v+45n/s9P+4hXOUl64v6IeR5lJi4X37rlxXjfvr7akzR1SzyKzGYmOpAGBZfzw0MFBu61dRbe70G2Fxf5D4X8uwDyNvVGQcKPKHJT044FO4NRK8BpKlXgTAnsfPFAG4H6Nm4EPhU+tTj/xuAYeoVTFifcFYlfWqucy+VcBS527knxot+n3o9V4icFZBKOA5qANIYfPhGT6ikQ+61tSVD2qOuIIGuA9gGMFXq1v5cIHICWFtfVBAOeX4GaBDAjXCHJ8riuvPJDiqV8EaZaojgAbjZ7QmNXTHh0LmeIHIC8Cuxm0BlYEQ0YrFat+rSGTaUWMig9xIh+k761PT/DGCY+gImbEkk3StSt1Z0GJWm/rDLFT25ylt7vPOdElsBeiz2TPYCKQIfZIPIqsAay3tT2NaOEyEf4BO49uI4WRhsTwJoBvEuqVvlne/iDeooQCOZ0erW7DtWisBvmSCyAviVqCbQvQC3uTS7KHmnjkG/qf9FcYDZyQ5koHQKbFdNIhQ/Sp96oNcAhhLlDPooIeVyKQLrUo1kAkiU5tsALYm3By43dOuTdBBpFZDBwj64cG0DCDcAfKrAExqTrsNlBXBstAwIOqEA4zwGtgxPDl8HTFoAw/IuZdbeSux+mhSB3enoswE4/xtKPMSgbxIqLDV0a0OqnW4AsmZKX+7T3ug0FWZsN3xqVqb4ZQJYc3Di0Ig73CrHH2mRph4AodRRob9m3/q8CLQl2+sGYCgxn0Hx0rHpNjnJ/LU3ANLyzoCtfQFgo/SpCsPU72fCD4kyni9168OsAH4l9hNoEoO/N3TrwWw1nKqAtLwvMNN6Aho4L1JmlBz8JZaQpn4ChNEA75e6NTkjwBolhkdAZxKxnylF4KtcAMYIa27QEpsItBBgy2NrM5ZPMi90rDUs72JmbWPsWYveIr21cR9Or0p24Le8c4i1KqflIuzOl1P3Xs4BYB8D7kSrrkLYPU9O3RtJXict7yCw9mfMIdlz/CKwNT2AqVcSYRUYQelTYzt+kqb+MojLOS/ySIeszrd4CGJd0magwtCtNzMBSyVOAzQCZFdKEfCnBZCmvgmERQDXSd0q7pTQ1Kcx8DWIL2maXbbaW3ugE8BR0RWdKb211dnUkkocBuguMN6VPvVUJoDVIBjOjCd1a0QXGQOl93HUtY2IPWCaLX1qW099oMt6Uz8Xa2zZFPArMZdAH8dyYGDLQFkYvJRspNLUC22gmomHENNKBl5KdxakKvGaqee3Ebc4wwyRvcgvApvTK1BfdD2HPE0EotQfO/OhtuRmRPKq42XlXPxZ6mGUCmCY+hNMiNV/nrt92MriurNpARJxNYmgO2EYNLhp9JJRp0KpBtfVFw24HPLsjM+B2QGYQYbSj4BwJxi10qe6TNPdO6GTcIRv45vDO9KnnkmXXM54/vvlvq1EvD2bAoYSyxj0Rrzo7W7nSvrTUIk9AN2TkHitX1iriMCpIFKJfwDsyAQglZgH4H0n9mDUSJ9K2LxiKS2AI3FbyFNDoPFxIXgPuaJLZOmBY10yOwOAVMJx5O8Y1QE+A09oopxw6I/UTWSciBJx3gHQld7NcGp9FwOmxx0+3R7JO8vATjfxsgjxKNjaFDDNjMW78+IzLs2enjpNZUzCZMLPGa5jllgPpqdB6Jut0XT7xogysGWAZj+XegQn/5vTWC6Dhdfwxf6zwDSLmMqyw3CDoxJc0Vdl6YHGnqBzAkg2suHkSE9z02CdmApYs4eSrUVBfB5MjazZR6UINPfkNPn7vzDRmj9yTgksAAAAAElFTkSuQmCC",
      env_id: null,
      // 摄像头
      equip_name: null,
      equip_number: null,
      region_id_s: null,
      field_id_s: null,
      cultiv_id_s: null,
      equip_domain: null,
      equip_http: null,
      equip_rtsp: null,
      equip_webserve: null,
      baseURL: process.env.BASE_API,
      equip_username: null,
      equip_password: null,
      equip_channel: null,
      equip_get_channel: null,
      equip_channel_domain: null,
      value2:null,
      equ_id: null,
      massif_stat: true,
      imgsx: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAClElEQVRYR+3WXchNaRQH8N9LcoEY398kucBkQkouNEoxJJ/JDe5RZMKgiHxEuZiZcEVKRnIhUtRw48KFRITko4xJvkYIoSZaeo6O/Z69zz6vC6l31e6c9nrWWv/n/6z1f3aTb2xN37i+VgDfNQOdMQTx+wH/4S7eNNJX9RjoiR8xGRMxFN3rFHiM27iDqziGW3kxtQC0wRIsxbBMYOz0H9xLu87mbYvh6Jpx3MAf2JuNywKI3R3H+JTgCs7hMuL/NbwuQXEvjMV0zEGPFHMeMxEsfbIsgNXYjktYhb9LFKu3JBidhk34CeuxJQ/Ab9iKtdhWL3OD/jUpZyGAcG7OAIhzjUYcmZ4R6FRVPI7kadXzJFEcvRJN+H9aWwrABmzEjtTFizAG7RvcbWX5O1zEIfRNGytkoAKghfVKhRUCiLP/3CB10sWsn8FDDEawVcYKAUxIY1dPoPZgOd5XVZyFo4iuz7PolxC1GMeaYxgv5ybB6JaT5TSm5gjR71iWExejPT+rink7DSX8MyfROFzI8Y1KolXLHTl3Zx15AH7G2ZwiA/AvOiZxaYfQj1fogwc5cVMQ7H1heQAiachllxrJKgAOYGHyn0rHkgcgzj5k/m1ZALFuF1YUAAgW+iX/I/QuYCCojyNoZkXd/kO69apVLxJUGDiRLpt4dxgLcgAEk3GrvmgUQKyfh78Qclyx0emy6pBkO45rHV6myya6vWLP03dE3KQ1rd68R1DMd4CoyHEI0EqcrNL5ALgYOxHMhcU3wy+4nlc83pcBEOtivI5kPlDup0+w8IcSDkqFQv8P4lcEA4VWFkAF7AzMxiT0z2S+iX3Yj7gRS1kjALIJg+qBSXqD7melKmYWfQ2AltRrFtMKoJWBj8N2gyHgbNY9AAAAAElFTkSuQmCC",
      bj_region_id: "",
      cultiv_stat: true,
      gd_bj_id: null,
      bj_massif_id: null,
      cultiv_stas: true,
      bj_env_id: null,
      env_stats: true,
      equip_stats: true,
      bj_equ_id: null,
      form_subm_sta: true,
      k: true,
      form_subm_stas: true,
      s: true,
      env_id_w: null,
      cor1:{color:"#000"},
      cor2:{color:"#000"},
      cor3:{color:"#000"},
      cor4:{color:"#000"},
      cor5:{color:"#000"},
      cor6:{color:"#000"},
      cor7:{color:"#000"},
      l:9,
    }
  },
  created() {
    // 页面加载时
    this.cropland_list()
    this.default_map()
    this.regionlist_fun()
    this.massifd_list()
    this.addev()
    // this.p_list_fun()
  },
  methods: {
    handler({ BMap, map }) {
      this.BMap = BMap
      this.map = map
      this.center.lng = 116.403694
      this.center.lat = 39.916042
      this.zoom = 13
      map.enableScrollWheelZoom()
    },
    // ==计算土地面积函数
    getArea(polygon) {
      const BMap=this.BMap;
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
    },
              

    // 渲染默认数据
    default_map() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const data = {}
      data.pri_id = this.$route.meta.pri_id
      data.massif_id = ''
      defa_map(data)
        .then(response => {
          this.response_button = response.data.button;
          // console.log("3333this._l--"+this.l)
          if(response.data.data.code === 500){
            loading.close();
          }
          for(var i=0; i<response.data.button.length; i++){

            //  判断左上角图片显示
            if(response.data.button[i].pri_funname === "新建农田" || response.data.button[i].pri_funname === "编辑农田" || response.data.button[i].pri_funname === "删除农田"){
              this.addfarmland=true;
            }else if(response.data.button[i].pri_funname === "添加区域" || response.data.button[i].pri_funname === "编辑区域" || response.data.button[i].pri_funname === "删除区域"){
              this.addregion=true;
            }else if(response.data.button[i].pri_funname === "添加地块" || response.data.button[i].pri_funname === "编辑地块" || response.data.button[i].pri_funname === "删除地块"){
              this.addmassif=true;
            }else if(response.data.button[i].pri_funname === "添加耕地" || response.data.button[i].pri_funname === "编辑耕地" || response.data.button[i].pri_funname === "删除耕地"){
              this.addcultiv=true;
            }else if(response.data.button[i].pri_funname === "添加仓库" || response.data.button[i].pri_funname === "编辑仓库" || response.data.button[i].pri_funname === "删除仓库"){
              this.addware=true;
            }else if(response.data.button[i].pri_funname === "添加环境监控" || response.data.button[i].pri_funname === "编辑环境监控" || response.data.button[i].pri_funname === "删除环境监控"){
              this.addenviron=true;
            }else if(response.data.button[i].pri_funname === "添加摄像头" || response.data.button[i].pri_funname === "编辑摄像头" || response.data.button[i].pri_funname === "删除摄像头"){
              this.addcamera=true;
            };

            // 删除按钮判断
            if(response.data.button[i].pri_funname === "删除农田"){
              this.delfarmlands=true;
            }else if(response.data.button[i].pri_funname === "删除区域"){
              this.delregion=true;
            }else if(response.data.button[i].pri_funname === "删除地块"){
              this.delmassif=true;
            }else if(response.data.button[i].pri_funname === "删除耕地"){
              this.delcultiv=true;
            }else if(response.data.button[i].pri_funname === "删除仓库"){
              this.delware=true;
            }else if(response.data.button[i].pri_funname === "删除环境监控"){
              this.delenviron=true;
            }else if(response.data.button[i].pri_funname === "删除摄像头"){
              this.delcamera=true;  
            }

            // 编辑判断
            if(response.data.button[i].pri_funname === "编辑农田"){
              this.editfarmland=true;
            }else if(response.data.button[i].pri_funname === "编辑区域"){
              this.editregion=true;
            }else if(response.data.button[i].pri_funname === "编辑地块"){
              this.editmassif=true;
            }else if(response.data.button[i].pri_funname === "编辑耕地"){
              this.editcultiv=true;
            }else if(response.data.button[i].pri_funname === "编辑仓库"){
              this.editware=true;
            }else if(response.data.button[i].pri_funname === "编辑环境监控"){
              this.editenviron=true;
            }
          }
          if(response.data.data !== ""){
            this.center.lng = response.data.data.massif_data[0].latitude
            this.center.lat = response.data.data.massif_data[0].longitude
          }
          if (errorStatus(response.data)) {
            this.response_ = response.data.data
            
            // =====渲染多个农田
            for (var i = 0; i < response.data.data.massif_data.length; i++) {
              var marker = new BMap.Marker(new BMap.Point(response.data.data.massif_data[i].latitude, response.data.data.massif_data[i].longitude))
              this.map.addOverlay(marker)
              this.dk_s3.push(marker)
              marker.type_id = 1
              marker.massif_id = response.data.data.massif_data[i].massif_id
            }
            
            // ====渲染多个环境监控
            var myIcon = new BMap.Icon( this.imgss , new BMap.Size(30,30));
            for(var s = 0; s < response.data.data.envir_data.length; s++){
              var pt = new BMap.Point(response.data.data.envir_data[s].env_latitude , response.data.data.envir_data[s].env_longitude);
              var marker2 = new BMap.Marker(pt,{icon:myIcon});
              this.map.addOverlay(marker2); 
              marker2.env_id = response.data.data.envir_data[s].env_id
              marker2.type_id = 6
            }

            // ====渲染多个摄像头
            
            var myIcon1 = new BMap.Icon( this.imgsx , new BMap.Size(30,30));
            for(var m = 0; m < response.data.data.equip_data.length; m++){
              var pt1 = new BMap.Point(response.data.data.equip_data[m].equ_latitude , response.data.data.equip_data[m].equ_longitude);
              var marker3 = new BMap.Marker( pt1 ,{ icon : myIcon1 });
              this.map.addOverlay(marker3); 
              marker3.equ_id = response.data.data.equip_data[m].equ_id
              marker3.type_id = 7
            }

            // ===渲染占地区域
            for (var j = 0; j < response.data.data.region_data.length; j++) {
              var bz = response.data.data.region_data[j].coordinate
              var bz_arr = []
              for (var g = 0; g < bz.length; g++) {
                var d = new BMap.Point(bz[g].lng, bz[g].lat)
                bz_arr.push(d)
              }
              var polygon = new BMap.Polygon(bz_arr, { strokeColor: response.data.data.region_data[j].region_color, fillColor: response.data.data.region_data[j].region_color, strokeWeight: 4, fillOpacity: 0.01 })

              polygon.add_id = response.data.data.region_data[j].massif_id
              polygon.type_id = response.data.data.region_data[j].cate_type
              polygon.area_plot_id = response.data.data.region_data[j].region_id
              this.dk_s2.push(polygon)
              this.map.addOverlay(polygon)
            }

            // ======渲染地块
            for (var s = 0; s < response.data.data.plot_data.length; s++) {
              var bz_arr1 = []
              for (var s_ = 0; s_ < response.data.data.plot_data[s].coordinate.length; s_++) {
                var d1 = new BMap.Point(response.data.data.plot_data[s].coordinate[s_].lng, response.data.data.plot_data[s].coordinate[s_].lat)
                bz_arr1.push(d1)
              }

              var polygon1 = new BMap.Polygon(bz_arr1, { strokeColor: response.data.data.plot_data[s].region_color, fillColor: response.data.data.plot_data[s].region_color, strokeWeight: 3, fillOpacity: 0.3 })
              this.map.addOverlay(polygon1)

              polygon1.add_id = response.data.data.plot_data[s].cul_id
              polygon1.type_id = response.data.data.plot_data[s].cate_type
              polygon1.area_plot_id = response.data.data.plot_data[s].region_id
              this.dk_s1.push(polygon1)
            }

            // ====渲染土地仓库
            for (var t = 0; t < response.data.data.cultiv_data.length; t++) {
              var td = response.data.data.cultiv_data[t].cul_coordinate
              var bz_arr2 = []
              for (var t_ = 0; t_ < td.length; t_++) {
                var t1 = new BMap.Point(td[t_].lng, td[t_].lat)
                bz_arr2.push(t1)
              }
              var polygon1 = new BMap.Polygon(bz_arr2, { strokeColor: response.data.data.cultiv_data[t].cul_color, fillColor: response.data.data.cultiv_data[t].cul_color, strokeWeight: 3, fillOpacity: 0.3 })

              polygon1.add_id = response.data.data.cultiv_data[t].cul_id
              polygon1.type_id = response.data.data.cultiv_data[t].cate_type
              polygon1.area_plot_id = response.data.data.cultiv_data[t].region_id
              this.dk_s.push(polygon1)
              this.map.addOverlay(polygon1)
            }
            loading.close();
            // ==========覆盖物点击事件
            var state = false
            var this_ = this
            var arrdd ; 
            var lisdd ;
            // console.log("0000this._l--"+this.l);
            this.map.addEventListener('click', function(e) {
               console.log("67this._l--"+this.l)
              for (var i = 0; i < this_.styleObject.length; i++) {
                this_.styleObject[i].display = 'none'
              }
              console.log("89this-l--",this_.l)
              if(this_.l !== 9){
                this_.styleObject[this_.l].display = "block";
              }
              console.log("e.overlay---",e.overlay)
              console.log("e.overlay.type_id---",e.overlay.type_id)
              // console.log("e.overlay---",e.overlay)
              if (e.overlay) {
                if(this_.k === 1){
                  this_.styleObject[this_.l].display = "block";
                  this_.$message.error("请完成当前操作或取消")
                }else{
                lisdd = "qrwour"
                this_.form_subm_sta = false;
                this_.overlayObj[0] = e.overlay
                // ===存储覆盖物id
                this_.delmassif_id = e.bb.area_plot_id
                this_.delcultiv_id = e.bb.add_id
                this_.cropland_id = e.bb.massif_id
                this_.equ_id = e.overlay.equ_id
                this_.env_id = e.overlay.env_id
                
                // ======控制编辑的弹框显示
                if (e.overlay.type_id === 2) {
                  // 区域
                  // ======判断是否有编辑权限   更改按钮状态
                    
                    if(this_.editregion === true){
                      e.overlay.addEventListener("lineupdate",function(e){

                          // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                          this_.commo_lon_lat = e.target.so;
                      });

                      // for (var i = 0; i < this_.styleObject.length; i++) {
                      //   this_.styleObject[i].display = 'none'
                      // }

                      this_.styleObject[1].display = 'block'
                      for (var j = 0; j < this_.response_.region_data.length; j++) {
                        if (this_.response_.region_data[j].region_id === e.bb.area_plot_id) {
                          const baseUrl = this_.baseURL
                          const str = baseUrl.replace('public', '')
                          this_.img_base64 = str + this_.response_.region_data[j].region_image
                          this_.region_name = this_.response_.region_data[j].region_name;
                          this_.compile_region_id = this_.response_.region_data[j].region_id;
                          this_.compile_massif_id = this_.response_.region_data[j].massif_id;
                          this_.commo_lon_lat = this_.response_.region_data[j].coordinate;
                          for (var i = 0; i < this_.nt_list[0].length; i++) {
                            if (this_.nt_list[0][i].massif_id === this_.response_.region_data[j].massif_id) {
                              this_.value = this_.nt_list[0][i].massif_name
                            }
                          }
                          this_.mz = this_.response_.region_data[j].region_acreage
                          this_.color1 = this_.response_.region_data[j].region_color;
                        }
                      }
                      this_.region_stat = false;

                    }else{
                      this_.$message.error("您没有编辑权限")
                    }
                } else if (e.overlay.type_id === 3) {
                  console.log("00000000000000000")
                  // -===地块
                  if(this_.editmassif === true){
                    e.overlay.addEventListener("lineupdate",function(e){
                          // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                          this_.commo_lon_lat = e.target.so;
                          // for(var l=0; l<e.target.so.length; l++){
                          //   bz_fu(e,e.target.so[l].lng,e.target.so[l].lat);
                          // }
                    });

                    // 获取地块所属区域id
                    function bz_fu(e,x,y){
                      var pt = new BMap.Point(x,y);
                      var o;
                      for(var b=0; b<this_.response_.region_data.length; b++){
                        var pts = [];
                        for(var t=0; t<this_.response_.region_data[b].coordinate.length; t++){
                          var pt1 = new BMap.Point(this_.response_.region_data[b].coordinate[t].lng, this_.response_.region_data[b].coordinate[t].lat);
                          pts.push(pt1)
                        }
                        var ply = new BMap.Polygon(pts);
                        o=b;
                      }
                      if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
                          console.log("内")
                          this_.bj_massif_id = this_.response_.region_data[o].region_id;
                          // alert(this_.bj_massif_id)
                        }
                        // else{
                        //   this_.$message.error("超出区域范围");
                        //   console.log("外")
                        //   this_.default_map();
                        //   this_.map.clearOverlays()
                        // }
                        pts = [];
                    }
                    bz_fu(e,e.overlay.so[1].lng,e.overlay.so[1].lat);
                    // for (var i = 0; i < this_.styleObject.length; i++) {
                    //   this_.styleObject[i].display = 'none'
                    // }
                    this_.styleObject[2].display = 'block'
                     this_.massif_stat = false;
                    for (var p = 0; p < this_.response_.plot_data.length; p++) {
                      if (this_.response_.plot_data[p].region_id === e.bb.area_plot_id) {
                        const baseUrl = this_.baseURL
                        const str = baseUrl.replace('public', '')
                        this_.img_base64 = str + this_.response_.plot_data[p].region_image
                        this_.region_names = this_.response_.plot_data[p].region_name;
                        this_.mz = this_.response_.plot_data[p].region_acreage
                        this_.bj_region_id = this_.response_.plot_data[p].region_id;
                        this_.color1 = this_.response_.plot_data[p].region_color;
                        this_.commo_lon_lat = this_.response_.plot_data[p].coordinate;
                      }
                    }
                   
                  }else{
                    this_.$message.error("您没有编辑权限")
                  }
                } else if (e.overlay.type_id === 4) {
                    if(this_.editcultiv === true){

                      e.overlay.addEventListener("lineupdate",function(e){
                          // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                          this_.commo_lon_lat = e.target.so;

                    });

                      // for (var i = 0; i < this_.styleObject.length; i++) {
                      //   this_.styleObject[i].display = 'none'
                      // }

                        this_.styleObject[3].display = 'block'
                        var pt = new BMap.Point(e.overlay.so[1].lng, e.overlay.so[1].lat);
                        var pts = []; 
                        // var o;
                        for(var b=0; b<this_.response_.plot_data.length; b++){
                          for(var t=0; t<this_.response_.plot_data[b].coordinate.length; t++){
                            var pt1 = new BMap.Point(this_.response_.plot_data[b].coordinate[t].lng , this_.response_.plot_data[b].coordinate[t].lat);
                            pts.push(pt1)
                          }
                          var ply = new BMap.Polygon(pts);
                          if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
                            console.log("内")
                            this_.bj_massif_id = this_.response_.plot_data[b].region_id
                            console.log(this_.response_.plot_data[b].region_id)
                          }
                        }
                          pts = [];
                      for (var c = 0; c < this_.response_.cultiv_data.length; c++) {
         
                        if (this_.response_.cultiv_data[c].cul_id === e.bb.add_id) {
                          this_.cultiv_name = this_.response_.cultiv_data[c].cul_name;
                          const baseUrl = this_.baseURL
                          const str = baseUrl.replace('public', '')
                          this_.img_base64 = str + this_.response_.cultiv_data[c].cul_image
                          this_.color1 = this_.response_.cultiv_data[c].cul_color;
                          this_.mz = this_.response_.cultiv_data[c].cul_acreage
                          this_.gd_bj_id = this_.response_.cultiv_data[c].cul_id
                          this_.commo_lon_lat = this_.response_.cultiv_data[c].cul_coordinate;
                        }
                      }
                      this_.cultiv_stat = false;

                    }else{
                      this_.$message.error("您没有编辑权限")
                    }

                } else if (e.overlay.type_id === 5) {
                  // 仓库

                  if(this_.editware === true){

                    e.overlay.addEventListener("lineupdate",function(e){
                          // this_.mz = (this_.getArea(e.target)/666.67).toFixed(2)
                          this_.commo_lon_lat = e.target.so; 
                    });
                    // for (var i = 0; i < this_.styleObject.length; i++) {
                    //   this_.styleObject[i].display = 'none'
                    // }
                    this_.styleObject[6].display = 'block'


                    var pt = new BMap.Point(e.overlay.so[1].lng, e.overlay.so[1].lat);
                      var pts = []; 
                      for(var b=0; b<this_.response_.region_data.length; b++){
                        for(var t=0; t<this_.response_.region_data[b].coordinate.length; t++){
                          var pt1 = new BMap.Point(this_.response_.region_data[b].coordinate[t].lng, this_.response_.region_data[b].coordinate[t].lat);
                          pts.push(pt1)
                        }
                        var ply = new BMap.Polygon(pts);

                        if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
                          this_.bj_massif_id = this_.response_.cultiv_data[b].reg_id
                        }
                        pts = [];
                      }

                    for(var l=0; l<this_.response_.cultiv_data.length; l++){

                      if (this_.response_.cultiv_data[l].cul_id === e.bb.add_id) {
                          this_.cultiv_name1 = this_.response_.cultiv_data[l].cul_name;
                          this_.cul_capacity = this_.response_.cultiv_data[l].capacity;
                          this_.color1 = this_.response_.cultiv_data[l].cul_color;
                          this_.mz = this_.response_.cultiv_data[l].cul_acreage
                          this_.gd_bj_id = this_.response_.cultiv_data[l].cul_id
                          this_.commo_lon_lat = this_.response_.cultiv_data[l].cul_coordinate;
                          const baseUrl = this_.baseURL
                          const str = baseUrl.replace('public', '')
                          this_.img_base64 = str + this_.response_.cultiv_data[l].cul_image
                          for(var g=0; g<this_.options.length; g++){
                            
                            if(parseInt(this_.options[g].id) === parseInt(this_.response_.cultiv_data[l].ware_type)){
                              this_.value = this_.options[g].value
                            }
                          }
                        }
                      
                    }
                    this_.cultiv_stas = false;
                  }else {
                    this_.$message.error("您没有编辑权限")
                  }
                } else if (e.overlay.type_id === 1) {
                  // =====农田
                  if(this_.editfarmland === true){
                    // for (var i = 0; i < this_.styleObject.length; i++) {
                    //   this_.styleObject[i].display = 'none'
                    // }
                    this_.styleObject[0].display = 'block'
                    this_.editor_stat = false
                  // 循环出默认数据

                    for (var p = 0; p < this_.response_.massif_data.length; p++) {

                      if (this_.response_.massif_data[p].massif_id === e.bb.massif_id) {
                        this_.cropland = this_.response_.massif_data[p].massif_name
                        this_.dimension = this_.response_.massif_data[p].latitude
                        this_.long = this_.response_.massif_data[p].longitude
                        this_.principal = this_.response_.massif_data[p].respon_name
                        this_.respon_tel = this_.response_.massif_data[p].respon_tel
                        this_.address = this_.response_.massif_data[p].address
                        this_.massif_ids = this_.response_.massif_data[p].massif_id
                        const baseUrl = this_.baseURL
                        const str = baseUrl.replace('public', '')
                        this_.img_base64 = str + this_.response_.massif_data[p].massif_image
                      }
                    }
                    // 标注可拖拽
                    e.overlay.enableDragging()
                    // 获取拖拽之后的坐标
                    e.overlay.addEventListener('dragend', function(e) {
                      var x = e.point.lng // 经度
                      var y = e.point.lat // 纬度
                      this_.long = y
                      this_.dimension = x
                    })
                  }else{
                    this_.$message.error("您没有编辑权限")
                  }
                }else if(e.overlay.type_id === 6){
                  if(this_.editenviron === true){

                    // for (var i = 0; i < this_.styleObject.length; i++) {
                    //     this_.styleObject[i].display = 'none'
                    // }
                    this_.styleObject[4].display = 'block'

                    for(var h=0; h<this_.response_.envir_data.length; h++){
                      if(this_.response_.envir_data[h].env_id === e.overlay.env_id){
                        this_.bj_env_id = this_.response_.envir_data[h].env_id
                        this_.env_name = this_.response_.envir_data[h].env_name
                        this_.env_number = this_.response_.envir_data[h].env_number
                        this_.env_remarks = this_.response_.envir_data[h].env_remarks
                        this_.regionlist_fun_id = this_.response_.envir_data[h].region_id
                        for(var k=0; k<this_.qy_list.length; k++){
                          if(this_.qy_list[k].field_id === this_.response_.envir_data[h].region_id){
                            this_.value1 = this_.qy_list[k].field_name
                          }
                        }
                        this_.value8 = this_.response_.envir_data[h].env_name
                        for(var t=0; t<this_.options3.length; t++){
                          if(this_.options3[t].env_name === this_.value8){
                            this_.env_id_w = this_.options3[t].env_id;
                          }
                        }
                      }
                    }

                    // 标注可拖拽
                    e.overlay.enableDragging()
                    // 获取拖拽之后的坐标
                    e.overlay.addEventListener('dragend', function(e) {
                      var x = e.point.lng // 经度
                      var y = e.point.lat // 纬度
                      this_.long = y
                      this_.dimension = x
                    })

                    this_.env_stats = false;
                  }else{
                    this_.$message.error("您没有编辑权限")
                  }

                }else if(e.overlay.type_id === 7){
                  // for (var i = 0; i < this_.styleObject.length; i++) {
                  //       this_.styleObject[i].display = 'none'
                  //   }
                    this_.styleObject[5].display = 'block'
                  
                  for(var u=0; u<this_.response_.equip_data.length; u++){
                    if(e.overlay.equ_id === this_.response_.equip_data[u].equ_id){
                      this_.bj_equ_id = this_.response_.equip_data[u].equ_id
                      const data = {}
                      data.equip_type = 1;
                      data.equip_id = this_.response_.equip_data[u].equ_id
                      editcamera(data)
                      .then(response => {
                        this_.equip_name = response.data.data.equ_name
                        this_.equip_number = response.data.data.equ_number
                        this_.equip_domain = response.data.data.equ_domain
                        this_.equip_http = response.data.data.equ_http
                        this_.equip_rtsp = response.data.data.equ_rtsp
                        this_.equip_webserve = response.data.data.equ_webserve
                        this_.equip_username = response.data.data.equ_username
                        this_.equip_password = response.data.data.equ_password
                        this_.equip_channel = response.data.data.equ_channel
                        this_.equip_get_channel = response.data.data.equ_get_channel
                        this_.equip_channel_domain = response.data.data.equ_channel_domain
                        this_.region_id_s = response.data.data.equ_regid
                        // for(var n=0; n<this_.qy_list.length; n++){
                        //   if(this_.qy_list[n].field_id === response.data.data.equ_regid){
                        //     this_.value2 = this_.qy_list[n].field_name
                        //   }
                        // }
                        
                      })
                      .catch(Error => {
                        loading.close();
                        this.center.lng = 116.403119
                        this.center.lat = 39.903202
                      })
                      this_.equip_stats = false;
                    }
                  }
                  // 标注可拖拽
                    e.overlay.enableDragging()
                    // 获取拖拽之后的坐标
                    e.overlay.addEventListener('dragend', function(e) {
                      var x = e.point.lng // 经度
                      var y = e.point.lat // 纬度
                      this_.long = y
                      this_.dimension = x
                    })

                }
                if (state) {
                  e.overlay.enableEditing();
                  // this_.form_subm_stas = true;
                } else {
                  if(arrdd==''||arrdd==null || arrdd ==undefined){
                    arrdd = e;
                    if( e.overlay===undefined|| e.overlay===null|| e.overlay===""){
                        e.bb.overlay.enableEditing();
                    } else{
                       e.overlay.enableEditing();
                    }     
                  }else{
                      if( arrdd.bb === e.bb|| arrdd.bb.Bc ===null|| e.overlay===""){
                        arrdd = e;
                        e.overlay.enableEditing();
                    } else{
                      arrdd.overlay.disableEditing()
                       e.overlay.enableEditing();
                       arrdd = e;                   
                    } 
                  }
 
                }
              }
              } else {
                // 未获取
                this_.l = 9
              }
              //
            })
          }
        })
        .catch(Error => {
           loading.close();
        })
    },

    // 画线公用函数
    scriber(col, typ) {
      var color = col
      var styleOptions = {
        strokeColor: color, // 边线颜色。
        fillColor: color, // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
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
      drawingManager.setDrawingMode(typ)

      return drawingManager
    },
    // 点击新建
    show() {
      if(this.form_subm_sta ===true){
        this.cor1 = {color:"#409eff"}
        this.form_subm_sta = false;
        for (var i = 0; i < this.styleObject.length; i++) {
          this.styleObject[i].display = 'none'
        }
       var dar =  this.scriber('#2f4de4', BMAP_DRAWING_MARKER);
         
        this.map.addEventListener('click', (e) => {
          console.log("111this._l--"+this.l)
          this.l = 0;
          this.form_subm_stas = false;
          dar.close()
          this.long = e.point.lat
          this.dimension = e.point.lng
          this.styleObject[0].display = 'block'
          this.plot = false 
        });

      }else{
        this.cor1 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    clearAll() {
      for (var i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i])
      }
      this.overlays.length = 0
    },
    hide() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      for (var i = 0; i < this.styleObject.length; i++) {
        this.styleObject[i].display = 'none'
      }
      this.cor1 = {color:"#000"}
      this.cor2 = {color:"#000"}
      this.cor3 = {color:"#000"}
      this.cor4 = {color:"#000"}
      this.cor5 = {color:"#000"}
      this.cor6 = {color:"#000"}
      this.cor7 = {color:"#000"}
      this.arr = ''
      this.img_base64 = this.img_fun();
      this.cropland = ''
      this.principal = ''
      this.respon_tel = ''
      this.env_name = "";
      this.env_number = "";
      this.env_remarks = "";
      this.long = "";
      this.l = 9;
      this.dimension ="";
      this.cultiv_name = ''
      this.equip_name = "";
      this.equip_number = "";
      this.cultiv_stat = true
      this.s = true;
      this.equip_domain = "";
      this.equip_http = "";
      this.equip_rtsp = "";
      this.env_stats = true;
      this.equip_webserve = "";
      this.equip_username = "";
      this.editor_stat = true;
      this.equip_password = "";
      this.equip_channel = "";
      this.equip_get_channel = "";
      this.region_stat = true
      this.equip_channel_domain	 ="";
      this.longitude = "";
      this.latitude = "";
      this.cultiv_name1 = ''
      this.cul_capacity = ''
      this.mz=""
      this.address = ''
      this.massif_stat = true
      this.cultiv_stas = true
      this.region_name = ''
      this.long = ''
      this.dimension = ''
      this.form_subm_sta = true
      this.form_subm_stas = true
      this.region_names = ''
      this.equip_stats = true;
      this.value = '请选择'
      this.plot = true
      this.k = null;
      this.form_subm_sta = true;
      this.map.clearOverlays()
      this.default_map()
      loading.close();
    },
    show1() {
      if(this.form_subm_sta === true){
         console.log("4this._l--"+this.l)
        this.cor2 = {color:"#409eff"}
        this.form_subm_sta = false;
      var this_ = this
      var drawingManagers = this.scriber('#2f4de4', BMAP_DRAWING_POLYGON)
      for (var i = 0; i < this.styleObject.length; i++) {
          this.styleObject[i].display = 'none'
      }
      drawingManagers.addEventListener('overlaycomplete', function(e) {
         console.log("5this._l--"+this.l)
        this_.k = 1;
        this_.overlays.push(e.overlay)
        this_.cropland_list()
        this_.styleObject[1].display = 'block'
        this_.l = 1;
        this_.qy_coordinate = e.overlay.so
        // this_.mz = (this_.getArea(e.overlay) / 666).toFixed(2)
        // if(this_.mz === NaN || this_.mz < 0){
        //   this_.mz = 0
        // }
        var pts = [];
        var arr = null;
        var len = null;
        for(var q=0; q<e.overlay.so.length; q++){
            var pt1 = new BMap.Point(e.overlay.so[q].lng, e.overlay.so[q].lat);
            pts.push(pt1);
        }
        for(var z=0; z<this_.dk_s3.length; z++){
          var ply = new BMap.Polygon(pts);
          var pt = new BMap.Point(this_.dk_s3[z].point.lng, this_.dk_s3[z].point.lat)
          if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
            arr = true 
            len = z;
          }
        }
        if(arr === true){
          this_.pitch_plot_id = this_.dk_s3[len].add_id
          this_.area_plot_id = this_.dk_s3[len].area_plot_id
        }else{
          this_.map.removeOverlay(e.overlay)
            for (var i = 0; i < this_.styleObject.length; i++) {
              this_.styleObject[i].display = 'none'
            }
            this_.cor2 = {color:"#000"}
            this_.$message.error("区域内无农田")
            this_.form_subm_sta = true;
        }
      })
      }else{
        this.cor2 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    show2() {
      if(this.form_subm_sta === true){
        this.cor3 = {color:"#409eff"}
        this.form_subm_sta = false;
      var this_ = this

      
      var drawingManagers = this.scriber('#2f4de4', BMAP_DRAWING_POLYGON)

      drawingManagers.addEventListener('overlaycomplete', function(e) {
        this_.k = 1;
        this_.l = 2;
        for (var i = 0; i < this_.styleObject.length; i++) {
          this_.styleObject[i].display = 'none'
        }
        this_.styleObject[2].display = 'block'
        this_.overlays.push(e.overlay)
        var bs = 0
        var idf = 0
        var len = ''
        for (var i = 0; i < e.overlay.so.length; i++) {
          var pt = new BMap.Point(e.overlay.so[i].lng, e.overlay.so[i].lat)
          if (bs > this_.dk_s2.length) {
            bs = 0
          } else {
            bs++
          }
          for (var a = 0; a < this_.dk_s2.length; a++) {
            if (BMapLib.GeoUtils.isPointInPolygon(pt, this_.dk_s2[a]) === false) {
              idf++
            } else {
              len = a
            }
          }
        }
        if (len != ''|| len ===0) {
          this_.pitch_plot_id = this_.dk_s2[len].add_id
          this_.area_plot_id = this_.dk_s2[len].area_plot_id
          this_.coordinate = e.overlay.so
          // this_.mz = (this_.getArea(e.overlay) / 666).toFixed(2)
          // if(this_.mz === NaN || this_.mz < 0){
          //   this_.mz = 0
          // }
        } else {
          this_.map.removeOverlay(e.overlay)
          for (var i = 0; i < this_.styleObject.length; i++) {
            this_.styleObject[i].display = 'none'
          }
          this_.cor3 = {color:"#000"}
          this_.$message.error("请在区域内")
          this_.form_subm_sta = true;
        }
      })
      }else{
        this.cor3 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    show3() {
      if(this.form_subm_sta === true){
        this.cor4 = {color:"#409eff"}
        this.form_subm_sta = false;
      var this_ = this
      var drawingManagers = this.scriber('#2f4de4', BMAP_DRAWING_POLYGON)
      drawingManagers.addEventListener('overlaycomplete', function(e) {
        this_.k = 1;
        this_.l = 3;
        for (var i = 0; i < this_.styleObject.length; i++) {
          this_.styleObject[i].display = 'none'
        }

        // 存储坐标
        this_.coordinate = e.overlay.so;
        // 计算面积
        // this_.mz = (this_.getArea(e.overlay) / 666).toFixed(2)
        // 显示表单
        this_.styleObject[3].display = 'block'
        // 用于取消清除画线坐标
        this_.overlays.push(e.overlay)

        // 判断土地多变形有无在地块多边形内
          var s = 0;
          var err = false;
          var len = null;
          for (var a = 0; a < this_.dk_s1.length; a++) {
            // 解决土地坐标下标小于 地块坐标下边 报错问题
            if(s > 2){
              s=0;
            }else{
              s++;
            }
            var pt = new BMap.Point(e.overlay.so[s].lng, e.overlay.so[s].lat)
            // 存储循环出的地块坐标
            var pts = [];
            // 循环单个地块下的所有坐标
            for(var t=0; t<this_.dk_s1[a].so.length; t++){
              var pt1 = new BMap.Point(this_.dk_s1[a].so[t].lng, this_.dk_s1[a].so[t].lat);
              pts.push(pt1)
            }
            // 创建标注对象
            var ply = new BMap.Polygon(pts);
            // 判断土地坐标
            if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
              err = true;
              len = a
            }
            pts = [];
          }
          // 存储地块id
          if(err === true){
            this_.pitch_plot_id = this_.dk_s1[len].area_plot_id
          }else{
            this_.map.removeOverlay(e.overlay)
            for (var i = 0; i < this_.styleObject.length; i++) {
              this_.styleObject[i].display = 'none'
            }
            this_.cor4 = {color:"#000"}
            this_.$message.error("请在地块内")
            this_.form_subm_sta = true;
          }

      })

      this.land_colors = 'land_color'
      this.warehouse_colors = 'warehouse_color'

    }else{
      this.cor4 = {color:"#000"}
      this.$message.error("请完成当前操作或取消")
    }
  },
    show4() {
      if(this.form_subm_sta === true){
        this.cor5 = {color:"#409eff"}
        this.form_subm_sta = false;
      var this_ = this
      var drawingManagers = this.scriber('#2f4de4', BMAP_DRAWING_POLYGON)

      drawingManagers.addEventListener('overlaycomplete', function(e) {
        this_.k = 1
        this_.l = 6
        for (var i = 0; i < this_.styleObject.length; i++) {
          this_.styleObject[i].display = 'none'
        }
        this_.styleObject[6].display = 'block'
        this_.coordinate = e.overlay.so
        // this_.mz = (this_.getArea(e.overlay) / 666).toFixed(2)
        this_.overlays.push(e.overlay)

        var s = 0;
        var err = false;
        var len = null;

        for (var a = 0; a < this_.dk_s1.length; a++) {
            if(s > 2){
              s=0;
            }else{
              s++;
            }
            var pt = new BMap.Point(e.overlay.so[s].lng, e.overlay.so[s].lat)
            var pts = [];
            for(var t=0; t<this_.dk_s1[a].so.length; t++){
              var pt1 = new BMap.Point(this_.dk_s1[a].so[t].lng, this_.dk_s1[a].so[t].lat);
              pts.push(pt1)
            }
            var ply = new BMap.Polygon(pts);
            if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
              err = true;
              len = a
            }
            pts = [];
          }
          if(err === true){
            this_.pitch_plot_id = this_.dk_s1[len].area_plot_id
          }else{
            this_.map.removeOverlay(e.overlay)
            for (var i = 0; i < this_.styleObject.length; i++) {
              this_.styleObject[i].display = 'none'
            }
            this_.cor5 = {color:"#000"}
            this_.$message.error("请在地块内")
            this_.form_subm_sta = true;
          }

      })

      this.land_colors = 'warehouse_color'
      this.warehouse_colors = 'land_color'
      }else{
        this.overlays = [];
        this.cor5 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    //显示监控区域表单
    es_clk() {
      this.regionlist_fun()
      if(this.form_subm_sta === true){
          this.cor6 = {color:"#409eff"}
          var t = true;
          this.form_subm_sta = false;
          var dar = this.scriber('#2f4de4', BMAP_DRAWING_MARKER)
          this.map.addEventListener('click', (e) => {
            this.l = 4
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            var pt = new BMap.Point(e.point.lng, e.point.lat)
            for (var a = 0; a < this.dk_s2.length; a++) {
              var pts = [];
              for(var i=0; i<this.dk_s2[a].so.length; i++){
                var pt1 = new BMap.Point(this.dk_s2[a].so[i].lng, this.dk_s2[a].so[i].lat);
                pts.push(pt1);
              }
              var ply = new BMap.Polygon(pts);
              
              if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
                  this.regionlist_fun_id = this.dk_s2[a].area_plot_id
                  t = false;
              }
            }
            if(t === true){
              this.map.clearOverlays()
              this.default_map()
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.$message.error("请点在区域内")
              this.form_subm_sta = true;
              this.cor6 = {color:"#000"}
            }else{

              this.form_subm_stas = false;
              this.form_subm_sta = true;
              this.overlays.push(e);
              dar.close()
              this.long = e.point.lat
              this.dimension = e.point.lng
              this.styleObject[4].display = 'block'
            }
            
          })
      }else{
        this.cor6 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    Camera() {
      if(this.form_subm_sta === true){
        this.cor7 = {color:"#409eff"}
        var t = true;
        this.form_subm_sta = false;
      var dar = this.scriber('#2f4de4', BMAP_DRAWING_MARKER)
      this.map.addEventListener('click', (e) => {
        this.l = 5
        for (var i = 0; i < this.styleObject.length; i++) {
          this.styleObject[i].display = 'none'
        }

        var pt = new BMap.Point(e.point.lng, e.point.lat)
          for (var a = 0; a < this.dk_s2.length; a++) {
            var pts = [];
            for(var i=0; i<this.dk_s2[a].so.length; i++){
              var pt1 = new BMap.Point(this.dk_s2[a].so[i].lng, this.dk_s2[a].so[i].lat);
              pts.push(pt1);
            }
            var ply = new BMap.Polygon(pts);
            
            if(BMapLib.GeoUtils.isPointInPolygon(pt, ply) === true){
                this.region_id_s = this.dk_s2[a].area_plot_id
                t = false;
            }
        }
        if(t === true){
          this.map.clearOverlays()
          this.default_map()
          for (var i = 0; i < this.styleObject.length; i++) {
            this.styleObject[i].display = 'none'
          }
          this.$message.error("请点在区域内")
          this.cor7 = {color:"#000"}
          this.form_subm_sta = true;
        }else{
          this.overlays.push(e);
          dar.close()
          this.long = e.point.lat
          this.dimension = e.point.lng
          this.styleObject[5].display = 'block'
        }
      })
      }else{
        this.cor7 = {color:"#000"}
        this.$message.error("请完成当前操作或取消")
      }
    },
    // 新建农田接口
    establish() {
       console.log("2this._l--"+this.l)
      // ======添加
      if (this.editor_stat === true) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const data = {}
        data.massif_name = this.cropland
        data.longitude = this.long
        data.latitude = this.dimension
        data.respon_name = this.principal
        data.respon_tel = this.respon_tel
        data.address = this.address
        data.massif_image = this.img_base64
        addcropland(data)
          .then(response => {
            if (response.data.code === 500) {
              loading.close();
              this.arr = response.data.data
            } else if (errorStatus(response.data)) {
              this.long = ''
              this.dimension = ''
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.img_base64 = this.img_fun()
              this.cropland_list()
              this.$message.success(response.data.data)
              this.cropland = ''
              this.principal = ''
              this.img_base64 = this.img_fun();
              this.respon_tel = ''
              this.address = ''
              this.l = 9;
              this.mz = ''
              this.form_subm_stas = true;
              this.overlays = [];
              this.arr = ''
              this.form_subm_sta = true;
              this.cor1 = {color:"#000"}
              this.cor2 = {color:"#000"}
              this.cor3 = {color:"#000"}
              this.cor4 = {color:"#000"}
              this.cor5 = {color:"#000"}
              this.cor6 = {color:"#000"}
              this.cor7 = {color:"#000"}
              this.map.clearOverlays()
              this.default_map()
              loading.close();
               console.log("3this._l--"+this.l)
            }
          })
          .catch(Error => {
             loading.close();
          })
      } else {
        // 编辑
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const data = {}
        data.massif_id = this.massif_ids
        data.massif_name = this.cropland
        data.longitude = this.long
        data.latitude = this.dimension
        data.respon_name = this.principal
        data.respon_tel = this.respon_tel
        data.address = this.address
        if(this.s === true){
          data.massif_image = ""
        }else{
          data.massif_image = this.img_base64
        }
        editfarmland(data)
          .then(response => {
            if (response.data.code === 500) {
              loading.close();
              this.$message.error(response.data.data)
            } else if (errorStatus(response.data)) {
              this.editor_stat = true
              this.long = ''
              this.dimension = ''
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.img_base64 = this.img_fun()
              this.$message.success("编辑农田成功")
              this.s = true;
              this.cropland = ''
              this.principal = ''
              this.img_base64 = this.img_fun();
              this.form_subm_stas = true;
              this.respon_tel = ''
              this.mz= ''
               this.l = 9;
              this.overlays = [];
              this.address = ''
              this.form_subm_sta = true;
              this.map.clearOverlays()
              this.default_map()
              loading.close();
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },
    massif_image(el) {
      console.info(el.value) 
      var reader = new FileReader()
      const that = this
      reader.onload = (function(file) {
        that.s = false;
        return function(result) {
          that.img_base64 = this.result
        }
      })(el.target.files[0])
      reader.readAsDataURL(el.target.files[0])
    },
    // 占地区域接口
    overs_an_area() {
      // 添加
      if (this.region_stat === true) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const data = {}
        data.region_name = this.region_name
        data.massif_id = this.massif_id
        data.region_acreage	= this.mz
        data.region_color = this.color1
        data.region_slide = 50
        data.coordinate = this.qy_coordinate
        data.region_image = this.img_base64
        area(data)
          .then(response => {
            if (response.data.code === 500) {
              loading.close();
              this.arr = response.data.data
            } else if (errorStatus(response.data)) {
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.img_base64 = this.img_fun()
              this.map.clearOverlays()
              this.default_map()
              this.$message.success(response.data.data)
              this.region_name = ''
              this.arr = ''
              this.mz = ''
               this.l = 9;
              this.k = null
              this.cor1 = {color:"#000"}
              this.cor2 = {color:"#000"}
              this.cor3 = {color:"#000"}
              this.cor4 = {color:"#000"}
              this.cor5 = {color:"#000"}
              this.cor6 = {color:"#000"}
              this.cor7 = {color:"#000"}
              this.img_base64 = this.img_fun();
              this.form_subm_stas = true;
              this.overlays = [];
              this.form_subm_sta = true;
              loading.close();
            }
          })
          .catch(Error => {
            loading.close();
          })
      } else {
        // 编辑
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        const data = {}
        data.region_id = this.compile_region_id
        data.region_name = this.region_name
        data.massif_id = this.compile_massif_id
        data.region_acreage	= this.mz
        data.region_color = this.color1
        data.region_slide = 50
        data.coordinate = this.commo_lon_lat
        if(this.s === true){
          data.region_image = ""
        }else{
          data.region_image = this.img_base64
        }
        editregion(data)
          .then(response => {
            if (response.data.code === 500) {
              loading.close();
              this.arr = response.data.data
            } else if (errorStatus(response.data)) {
              this.map.clearOverlays()
              this.default_map()
              loading.close();
              this.region_name = "";
              this.mz = '';
               this.l = 9;
              this.k = null
              this.img_base64 = this.img_fun();
              this.overlays = [];
              this.form_subm_stas = true;
              this.form_subm_sta = true;
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.$message.success("编辑区域成功")
              this.s = true;
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },
    // 地块规划 接口
    dk_project() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      // 添加
    if(this.massif_stat === true){
      if(this.region_names === ""){
        loading.close();
        this.arr = "地块名称不能为空"
      }else{
      this.s = true;
      const data = {}
      data.region_name = this.region_names
      data.field_id = this.area_plot_id
      data.region_acreage	 = this.mz
      data.region_color = this.color1
      data.region_slide = 30
      data.coordinate = this.coordinate
      data.region_image = this.img_base64
      log(data)
        .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.img_base64 = this.img_fun()
            this.$message.success(response.data.data)
            this.arr = ''
            this.region_names = ''
            this.mz= ''
             this.l = 9;
            this.k = null
            this.img_base64 = this.img_fun();
            this.form_subm_stas = true;
            this.overlays = [];
            this.cor1 = {color:"#000"}
            this.cor2 = {color:"#000"}
            this.cor3 = {color:"#000"}
            this.cor4 = {color:"#000"}
            this.cor5 = {color:"#000"}
            this.cor6 = {color:"#000"}
            this.cor7 = {color:"#000"}
            this.x = false
            this.map.clearOverlays()
            this.default_map()
            this.form_subm_sta = true;
            loading.close();
          } else {
            loading.close();
            this.arr = response.data.data
          }
        })
        .catch(Error => {
          loading.close();
        })
      }
      }else{
        
        // 编辑
      const data = {}
      data.region_name = this.region_names //区域名称
      data.field_id = this.bj_massif_id  //区域id
      data.region_id = this.bj_region_id
      data.region_acreage	 = this.mz   //面积
      data.region_color = this.color1
      data.region_slide = 30
      data.coordinate = this.commo_lon_lat
      if(this.s === true){
        data.region_image = ""
      }else{
        data.region_image = this.img_base64
      }
      editmassif(data)
        .then(response => {
          if (response.data.code === 200) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.img_base64 = this.img_fun()
            this.$message.success("编辑地块成功")
            this.s = true;
            this.region_names = ''
            this.img_base64 = this.img_fun();
            this.arr = '';
            this.mz=''
             this.l = 9;
            this.k = null
            this.overlays = [];
            this.form_subm_stas = true;
            this.map.clearOverlays()
            this.default_map()
            this.form_subm_sta = true;
            loading.close();
          } else {
            loading.close();
            this.arr = response.data.data
          }
        })
        .catch(Error => {
          loading.close();
        })
      }
    },

    // 农田列表接口
    cropland_list() {
      const data = {}
      nt_listss(data)
        .then(response => {

          this.nt_list[0] = response.data.data
        })
        .catch(Error => {
        })
    },
    // 获取农田列表选中的id
    massif_id_fun() {
      for (var i = 0; i < this.nt_list[0].length; i++) {
        if (this.nt_list[0][i].massif_name === this.value) {
          this.massif_id = this.nt_list[0][i].massif_id
        }
      }
    },
    // 获取区域列表
    regionlist_fun() {
      const data = {}
      data.massif_id = ''
      regionlist(data)
        .then(response => {
          this.qy_list = response.data.data
        })
        .catch(Error => {
        })
    },
    regionlistFun() {
      for (var i = 0; i < this.qy_list.length; i++) {
        if (this.value1 === this.qy_list[i].field_name) {
          this.regionlist_fun_id = this.qy_list[i].field_id
        }
      }
    },

    regionlistFuns() {
      for (var i = 0; i < this.qy_list.length; i++) {
        if (this.value2 === this.qy_list[i].field_name) {
          this.region_id_s = this.qy_list[i].field_id
        }
      }
    },
    // 获取地块列表
    massifd_list() {
      const data = {};
      data.region_id = "";
      massifdata(data)
        .then(response => {
          
        })
        .catch(Error => {
        })
    },
    // ======耕种土地接口
    add_l() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
    if(this.cultiv_stat === true){
      if(this.cultiv_name === ""){
        loading.close();
        this.arr = "土地名称不能为空"
      }else if(this.cultiv_name.length < 4){
        loading.close();
        this.arr = "土地名称不能小于4位"
      }else{
      const data = {}
      data.cultiv_name = this.cultiv_name 
      data.region_id = this.pitch_plot_id
      data.cultiv_acreage = this.mz
      data.cultiv_color	 = this.color1
      data.cultiv_slide = 70
      data.coordinate = this.coordinate
      data.cultiv_image = this.img_base64
      add_land(data)
        .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.img_base64 = this.img_fun()
            this.$message.success(response.data.data)
            this.cultiv_name = ''
            this.img_base64 = this.img_fun();
            this.overlays = [];
            this.mz = ''
             this.l = 9;
            this.k = null 
            this.cor1 = {color:"#000"}
            this.cor2 = {color:"#000"}
            this.cor3 = {color:"#000"}
            this.cor4 = {color:"#000"}
            this.cor5 = {color:"#000"}
            this.cor6 = {color:"#000"}
            this.cor7 = {color:"#000"}
            this.form_subm_stas = true;
            this.map.clearOverlays()
            this.default_map()
            this.form_subm_sta = true;
            this.arr = ""
            loading.close();
          }
          if(response.data.code === 500){
            loading.close();
          }
        })
        .catch(Error => {
          loading.close();
        })
      }
      }else{
        // 编辑
        const data = {}
        data.cultiv_id = this.gd_bj_id
        data.cultiv_name = this.cultiv_name
        data.region_id = this.bj_massif_id
        data.cultiv_acreage = this.mz
        data.cultiv_color	 = this.color1
        data.cultiv_slide = 70
        data.coordinate = this.commo_lon_lat
        if(this.s === true){
          data.cultiv_image = "";
        }else{
          data.cultiv_image = this.img_base64
        }
        editcultiv(data)
          .then(response => {
            if (response.data.code === 200) {
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.img_base64 = this.img_fun()
              this.$message.success("编辑耕地成功")
              this.s = true; 
              this.cultiv_name = ''
              this.mz = ''
               this.l = 9;
              this.k = null
              this.form_subm_stas = true;
              this.overlays = [];
              this.map.clearOverlays()
              this.arr = ''
              this.img_base64 = this.img_fun();
              this.default_map()
              this.form_subm_sta = true;
              loading.close();
            } else {
              loading.close();
              this.arr = response.data.data
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },

    // ======添加仓库接口
    add_w() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      if(this.cultiv_stas === true){
      if(this.cultiv_name1 === ""){
        loading.close();
        this.arr = "名称不能为空"
      }else if(this.cultiv_name1.lenght< 4){
        loading.close();
        this.arr = "名称不能小于4位"
      }else{
      const data = {}
      data.cultiv_name = this.cultiv_name1
      data.cultiv_acreage = this.mz
      data.region_id = this.pitch_plot_id
      data.cul_capacity = 500
      data.ware_type = 1
      data.cultiv_color = this.color1
      data.cultiv_slide = 50
      data.coordinate = this.coordinate
      data.cultiv_image = this.img_base64
      add_ware(data)
        .then(response => {
          if (response.data.code === 200) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.img_base64 = this.img_fun()
            this.$message.success(response.data.data)
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.mz = ''
             this.l = 9;
            this.k = null
            this.img_base64 = this.img_fun();
            this.form_subm_stas = true;
            this.overlays = [];
            this.cor1 = {color:"#000"}
            this.cor2 = {color:"#000"}
            this.cor3 = {color:"#000"}
            this.cor4 = {color:"#000"}
            this.cor5 = {color:"#000"}
            this.cor6 = {color:"#000"}
            this.cor7 = {color:"#000"}
            this.map.clearOverlays()
            this.default_map()
            this.form_subm_sta = true;
            this.arr = ""
            loading.close();
          } else {
            loading.close();
            this.arr = response.data.data
          }
        })
        .catch(Error => {
          loading.close();
        })
      }
      }else{
        // 编辑
        const data = {}
        data.cultiv_id = this.gd_bj_id
        data.cultiv_name = this.cultiv_name1
        data.cultiv_acreage = this.mz
        data.region_id = this.bj_massif_id
        data.cul_capacity = 500
        //this.cul_capacity
        data.ware_type = 1
        //this.ware_type
        data.cultiv_color = this.color1
        data.cultiv_slide = 50
        data.coordinate = this.commo_lon_lat
        if(this.s === true){
          data.cultiv_image = ""
        }else{
          data.cultiv_image = this.img_base64
        }
        editwares(data)
          .then(response => {
            if (errorStatus(response.data)) {
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }

              this.img_base64 = this.img_fun()
              this.$message.success("编辑仓库成功")
              this.s = true;
              this.cultiv_name1 = ''
              this.cul_capacity = ''
              this.mz = ''
               this.l = 9;
              this.form_subm_stas = true;
              this.arr = ''
              this.k = null
              this.img_base64 = this.img_fun();
              this.overlays = [];
              this.map.clearOverlays()
              this.default_map()
              this.form_subm_sta = true;
              loading.close();
            } else {
              loading.close();
              this.arr = response.data.data
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },
    ware_type_fun() {
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.value) {
          this.ware_type = this.options[i].id
        }
      }
    },

    // 添加监控区域
    environment() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      if(this.env_stats === true){
      const data = {};
      data.env_old_id	= this.env_id_w
      data.env_number = this.env_number
      data.env_remarks = this.env_remarks
      data.region_id = this.regionlist_fun_id
      data.longitude = this.long
      data.latitude	= this.dimension
      addenviron(data)
        .then(response => {
          if(response.data.code === 200){
            this.$message.success(response.data.data)
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }

            this.env_name = "";
            this.env_number = "";
            this.env_remarks = "";
            this.long = "";
            this.img_base64 = this.img_fun();
            this.dimension ="";
             this.l = 9;
            this.regionlist_fun_id = "";
            this.form_subm_stas = true;
            this.overlays = [];
            this.cor1 = {color:"#000"}
            this.cor2 = {color:"#000"}
            this.cor3 = {color:"#000"}
            this.cor4 = {color:"#000"}
            this.cor5 = {color:"#000"}
            this.cor6 = {color:"#000"}
            this.cor7 = {color:"#000"}
            this.arr = '' 
            this.map.clearOverlays()
            this.default_map()
            this.form_subm_sta = true;
            loading.close();
          }else{
            loading.close();
            this.arr = response.data.data
          }
        })
        .catch(Error => {
          loading.close();
        })
      }else{
        // 编辑
        const data = {};
        data.env_id = this.bj_env_id
        data.env_old_id		= this.env_id_w
        data.env_number = this.env_number
        data.env_remarks = this.env_remarks
        data.region_id = this.regionlist_fun_id
        data.longitude = this.long
        data.latitude	= this.dimension
        editenviron(data)
          .then(response => {
            if(response.data.code === 200){
              this.$message.success("编辑监控区域成功")
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.env_name = "";
              this.env_number = "";
              this.env_remarks = "";
              this.long = "";
              this.dimension ="";
              this.arr = ''
               this.l = 9;
              this.img_base64 = this.img_fun();
              this.form_subm_stas = true;
              this.overlays = [];
              this.form_subm_sta = true;
              this.map.clearOverlays()
              this.default_map()
              loading.close();
            }else{
              loading.close();
              this.arr = response.data.data
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },

    // 绑定环境列表
    addev() {
      const data = {};
      data.type = 2
      addenviron(data)
        .then(response => {
          this.options3 = response.data.data.envir;
        })
        .catch(Error => {
        })
    },
    obtainID() {
      for(var i=0; i<this.options3.length; i++){
        if(this.options3[i].env_name === this.value8){
          this.env_id_w = this.options3[i].env_id
        }
      }
    },
    // 添加摄像头
    camera_fun:function() {
      const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
      if(this.equip_stats === true){
      const data = {};
      data.equip_name = this.equip_name
      data.equip_number = this.equip_number
      data.region_id = this.region_id_s
      data.field_id = ""
      data.cultiv_id = ""
      data.equip_domain = this.equip_domain
      data.equip_http = this.equip_http
      data.equip_rtsp = this.equip_rtsp
      data.equip_webserve = this.equip_webserve
      data.equip_username = this.equip_username
      data.equip_password = this.equip_password
      data.equip_channel = this.equip_channel
      data.equip_get_channel = this.equip_get_channel
      data.equip_channel_domain = this.equip_channel_domain
      data.longitude = this.long
      data.latitude = this.dimension
      addcamera(data)
        .then(response => {
          this.$message.success(response.data.data)
          if(response.data.code === 200){
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.equip_name = "";
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
             this.l = 9;
            this.cor1 = {color:"#000"}
            this.cor2 = {color:"#000"}
            this.cor3 = {color:"#000"}
            this.cor4 = {color:"#000"}
            this.cor5 = {color:"#000"}
            this.cor6 = {color:"#000"}
            this.cor7 = {color:"#000"}
            this.img_base64 = this.img_fun();
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.overlays = [];
            this.latitude = "";
            this.form_subm_stas = true;
            this.form_subm_sta = true;
            this.arr = ''
            this.map.clearOverlays()
            this.default_map()
            loading.close();
          }else{
            loading.close();
            this.arr = response.data.data
          }
        })
        .catch(Error => {
          loading.close();
        })
      }else{
        // 编辑
        const data = {};
        data.equip_id = this.bj_equ_id
        data.equip_name = this.equip_name
        data.equip_number = this.equip_number
        data.region_id = this.region_id_s
        data.field_id = ""
        data.cultiv_id = ""
        data.equip_domain = this.equip_domain
        data.equip_http = this.equip_http
        data.equip_rtsp = this.equip_rtsp
        data.equip_webserve = this.equip_webserve
        data.equip_username = this.equip_username
        data.equip_password = this.equip_password
        data.equip_channel = this.equip_channel
        data.equip_get_channel = this.equip_get_channel
        data.equip_channel_domain = this.equip_channel_domain
        data.longitude = this.long
        data.latitude = this.dimension
        editcamera(data)
          .then(response => {
            
            if(response.data.code === 200){
              for (var i = 0; i < this.styleObject.length; i++) {
                this.styleObject[i].display = 'none'
              }
              this.$message.success("编辑摄像头成功")
              this.equip_name = "";
              this.equip_number = "";
              this.equip_domain = "";
              this.equip_http = "";
              this.equip_rtsp = "";
               this.l = 9;
              this.equip_webserve = "";
              this.img_base64 = this.img_fun();
              this.equip_username = "";
              this.equip_password = "";
              this.equip_channel = "";
              this.equip_get_channel = "";
              this.equip_channel_domain	 ="";
              this.longitude = "";
              this.latitude = "";
              this.arr = ''
              this.overlays = [];
              this.form_subm_stas = true;
              this.form_subm_sta = true;
              loading.close();
            }else{
              loading.close();
              this.arr = response.data.data
            }
          })
          .catch(Error => {
            loading.close();
          })
      }
    },
    // =========删除土地
    remove_land() {
      const data = {}
      data.cultiv_id = this.delcultiv_id
      delcultiv(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.map.removeOverlay(this.overlayObj[0])
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success(response.data.data)
            this.img_base64 = this.img_fun();
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.respon_tel = ''
            this.env_name = "";
            this.mz = ''
            this.env_number = "";
            this.env_remarks = "";
             this.l = 9;
            this.long = "";
            this.k = null 
            this.dimension ="";
            this.cultiv_name = ''
            this.equip_name = "";
            this.equip_number = "";
            this.equip_domain = "";
            this.form_subm_stas = true;
            this.overlays = [];
            this.equip_http = "";
            this.massif_stat = true;
            this.cultiv_stat = true;
            this.equip_rtsp = "";
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {

            this.$message.error(response.data.data)
          }
        })
        .catch(Error => {
        })
    },
    // ======删除仓库
    remove_ware() {
      const data = {}
      data.cultiv_id = this.delcultiv_id
      editware(data)
        .then(response => {
          if (errorStatus(response.data)) {
            this.map.removeOverlay(this.overlayObj[0])
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success(response.data.data)
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.respon_tel = ''
            this.img_base64 = this.img_fun();
            this.value = '请选择'
            this.env_name = "";
            this.env_number = "";
            this.env_remarks = "";
             this.l = 9;
            this.mz = ''
            this.cultiv_stas = true;
            this.long = "";
            this.dimension ="";
            this.k = null
            this.s = true;
            this.overlays = [];
            this.cultiv_name = ''
            this.equip_name = "";
            this.form_subm_stas = true;
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.massif_stat = true
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
        })
        .catch(Error => {
        })
    },

    // =====删除地块
    remove_plot() {
      const data = {}
      data.region_id = this.delmassif_id
      delmassif(data)
        .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success("地块删除成功")

            this.map.removeOverlay(this.overlayObj[0])
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.img_base64 = this.img_fun();
            this.respon_tel = ''
            this.env_name = "";
            this.env_number = "";
            this.overlays = [];
            this.env_remarks = "";
             this.l = 9;
            this.long = "";
            this.massif_stat = true
            this.dimension ="";
            this.mz = ''
            this.k = null
            this.cultiv_name = ''
            this.equip_name = "";
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.s = true;
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
        })
        .catch(Error => {
        })
    },
    // ====删除区域
    remove_area() {
      const data = {}
      data.region_id = this.delmassif_id
      delregion(data)
        .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success("区域删除成功")

            this.map.removeOverlay(this.overlayObj[0])

            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.img_base64 = this.img_fun();
            this.respon_tel = ''
            this.env_name = "";
            this.env_number = "";
            this.env_remarks = "";
            this.value = ''
            this.long = "";
            this.s = true;
            this.k = null
             this.l = 9;
            this.dimension ="";
            this.cultiv_name = ''
            this.mz = ''
            this.equip_name = "";
            this.region_stat = true;
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.overlays = [];
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.massif_stat = true
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
        })
        .catch(Error => {
        })
    },
    // ===删除农田
    remove_farmland() {
      const data = {}
      data.massif_id = this.cropland_id
      delfarmland(data)
        .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success("农田删除成功")

            this.map.removeOverlay(this.overlayObj[0])
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.respon_tel = ''
            this.img_base64 = this.img_fun();
            this.env_name = "";
            this.env_number = "";
            this.env_remarks = "";
            this.long = "";
            this.s = true;
             this.l = 9;
            this.mz = ''
            this.editor_stat = true;
            this.dimension ="";
            this.cultiv_name = ''
            this.overlays = [];
            this.equip_name = "";
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.massif_stat = true
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
        })
        .catch(Error => {
        })
    },
    // 删除环境
    delenviron_fun:function() {
      const data = {};
      data.env_id = this.env_id
      delenviron(data)
      .then(response => {
          if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success(response.data.data)

            this.map.removeOverlay(this.overlayObj[0])
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.respon_tel = ''
            this.img_base64 = this.img_fun();
            this.env_name = "";
            this.s = true;
            this.env_number = "";
            this.env_remarks = "";
            this.long = "";
            this.dimension ="";
            this.cultiv_name = ''
            this.equip_name = "";
            this.env_stats = true;
             this.l = 9;
            this.equip_number = "";
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.massif_stat = true
            this.overlays = [];
            this.equip_webserve = "";
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
      })
      .catch(Error => {

      })
    },
    // 删除摄像头
    delcamera_fun:function() {
      const data = {};
      data.equip_id = this.equ_id
      delcamera(data)
      .then(response => {
        if (errorStatus(response.data)) {
            for (var i = 0; i < this.styleObject.length; i++) {
              this.styleObject[i].display = 'none'
            }
            this.$message.success(response.data.data)

            this.map.removeOverlay(this.overlayObj[0])
            this.form_subm_sta = true;
            this.cropland = ''
            this.principal = ''
            this.respon_tel = ''
            this.env_name = "";
            this.env_number = "";
            this.img_base64 = this.img_fun();
            this.env_remarks = "";
            this.long = "";
            this.dimension ="";
            this.cultiv_name = ''
            this.massif_stat = true;
            this.equip_stats = true;
            this.equip_name = "";
            this.equip_number = "";
             this.l = 9;
            this.equip_domain = "";
            this.equip_http = "";
            this.equip_rtsp = "";
            this.equip_webserve = "";
            this.overlays = [];
            this.equip_username = "";
            this.equip_password = "";
            this.equip_channel = "";
            this.equip_get_channel = "";
            this.equip_channel_domain	 ="";
            this.longitude = "";
            this.latitude = "";
            this.cultiv_name1 = ''
            this.cul_capacity = ''
            this.address = ''
            this.region_name = ''
            this.long = ''
            this.dimension = ''
            this.region_names = ''
          } else {
            this.$message.error(response.data.data)
          }
      })
      .catch(Error => {

      })
    },
    img_fun() {
      var bas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA9CAYAAAAUPs+7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7ZpNSFRRFIDPzIj51xg6qC2EhAiEomAigoKCFlFQkBS0K9pFBNGiRZBR0KZ2BS36WbgIXNj/j4vaRFhZTmTYSDk6Y6bjTzM6DvPj6Ey987pmnpmx+8b3xkeeDx5z3rlvwPnm3nPuVS0dHR0/gfmDVbwyAhZCYCGEtBridDpFtDxwuVwi+g3PEAILIbAQAgshmFJIMpmEoaEh8Hg86oUx5vKB6YREIhFwu93g9/shFAqpF8aYwzGjMZWQVCoFPp8PEomEyMyBORzDZ4zEVELC4TDE43Fxlw6O4TNGYioh0WhURNmJxWIiMgZTCbHZbCLKjtVq7I9sKiFlZWUiyo7MM4tBVyHtw1FoeNoPXYHsdWAhSkpKwOFwiLt0cAyfMRLdhDzoDUHDs35o80dg90MvXPkwBjMp7b97qq2thZqaGrBYLCKjnECVGHM4ZjS6nHavdv6AS+9Hxd0c6yuL4PK21eCsKhYZeXAjNrvvKC0tlaovuaDraRdnwJk2f0YZCC6d/U98cOHdCEwltc0WFGC329XLKBmZyFlIZDoFR198h6bucZHJDEq7/ikAu+73gWvU2JapBzkJGY3NqPXi+Tf5TVLPxBTsfeSFs2+GVZlmRbOQ2Q/2cSy3b/v25yDsuNcLr5Xia0Y0CcG2ijVhIDwtMrmB7z+gtOfTr5QDXEKfUywuzVZfWJ29i0FayGPvJBxq7YdgXL9j+J0v47Dzbp+mpUdBEc1fJ2B7S69S0wZgc3MPnHs7krMYqbaLRRE7hZEcXrcKzm+phooiuY6CXavFMwHXOgPgnUw/Ha+wWeBIfQWc3FgJVcUFIpsObbsLCkH7je0j6rrPBygD9y376uwikw6KaOoOqiJkZgGKQdnHN1RCnb1QZOeQFoKd4MTLQXVd5hsUgmL+ni1aRVAKrBY4uLYcTm1yzBMjLQQ7yVLuG8oLbXBxazXsWbMSbnQF4aZy6VGAqRhpIdW33OrrUoNTXusuVwYUM3isXt+tez4wQgaC9TETpheSb1gIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEFgIgYUQWAiBhRBYCIGFEKT+HeJ/5p9/213u8JIhsBACC5kHwC+jf3bwl0AjQAAAAABJRU5ErkJggg=='
      return bas
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
        height: 790px;
        width: 100%;
        position:relative;
        .map-header{
            position: absolute;
            top: 10px;
            left: 0;
            z-index: 10;
            width: 50%;
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
        height: 790px;
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
          width:100px;
          height:80px;
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
      .BMap_CityListCtrl{
        right: 100px !important;
        left: unset !important;
        top: 9px !important;
      }
      #selCitySubmit{
        margin-top:-2px;
      }
      .city_content_top{
        height: 36px !important;
      }

    }

}
</style>
