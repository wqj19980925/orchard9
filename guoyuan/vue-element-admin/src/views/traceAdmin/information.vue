<template>
  <div class="app-container">
    <el-row class="sd-module-box">
      <div class="sd-moudle-header">
        <div class="sd-module-title">信息维护</div>
        <div class="sd-module-btn">
          <el-button
            class
            type="primary"
            @click="submit('formList')"
          >提交</el-button>
        </div>
      </div>
      <el-form
        ref="formList"
        :model="formList"
        :rules="formRules"
        class ="sd-form-box clearfix trace-form-box"
        size ="medium"                       
        label-width="100px"
      >
        <div class="left-box">
          <el-form-item
            label="商品名称:"
            class="sd-form-item"
            prop="code_good_id"
          >
            <el-select
              v-model="formList.code_good_id"
              :remote-method="querySearchAsync"
              :loading="goodSearchLoad"
              filterable
              remote
              placeholder="请输入商品名称 进行搜索"
              class="w340"
              @change="handleSelect"
            >
              <el-option
                v-for="item in goodsList"
                :key="item.goo_id"
                :label="item.goo_name"
                :value="item.goo_id"
              />
            </el-select>

            <!-- <el-autocomplete
              v-model="formList.goo_name"
              :fetch-suggestions="querySearchAsync"
              class="w340"
              placeholder="请输入商品名称/编号"
              @select="handleSelect"
            /> -->
            <el-button
              v-show="showClearBtn1"
              class="clearBtn"
              type="primary"
              @click="clearGodName(1)"
            >清空</el-button>
          </el-form-item>
          <el-form-item
            label="环境信息:"
            class="sd-form-item"
            prop="code_environment_id"
          >
            <el-select
              v-model="formList.code_environment_id"
              class="w340"
              @change="choseEnv2"
            >
              <el-option
                v-for="item in envState"
                :key="item.env_id"
                :label="item.env_name"
                :value="item.env_id"
              />
            </el-select>
            <el-button
              v-show="showClearBtn2"
              class="clearBtn"
              type="primary"
              @click="clearGodName(2)"
            >清空</el-button>
          </el-form-item>
          <el-form-item
            label="摄像头:"
            class="sd-form-item"
            prop="code_camera_id"
          >
            <el-select
              v-model="formList.code_camera_id"
              class="w340"
              @change="choseEnv3()"
            >
              <el-option
                v-for="item in cameraSta"
                :key="item.equ_id"
                :label="item.equ_name"
                :value="item.equ_id"
              />
            </el-select>
            <el-button
              v-show="showClearBtn3"
              class="clearBtn"
              type="primary"
              @click="clearGodName(3)"
            >清空</el-button>
          </el-form-item>
          <el-form-item
            label="溯源信息:"
            class="sd-form-item"
            prop="code_source_id"
          >
            <el-select
              v-model="codeSourId"
              class="w340"
              @change="traceChange"
            >
              <el-option
                v-for="item in state"
                :key="item.fom_id"
                :label="item.fom_title"
                :value="item.fom_id"
              />
            </el-select>
            <el-button
              v-if="showClearBtn4"
              class="clearBtn"
              type="primary"
              @click="clearGodName(4)"
            >清空</el-button>
          </el-form-item>
          <div
            v-if="showTraceInfo"
            class="trace-infor-box"
          >
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              closable
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="item in showTabs"
                :key="item.fom_id"
                :label="item.fom_title"
                :name="item.fom_title"
                class="trace-info-tab"
              >
                <div
                  v-for="(cont,index) in item.fom_content"
                  :key="index"
                  class="trace-infor"
                >
                  <div v-if="cont.show === 1">
                    <span class="title">{{ cont.key }}</span>
                    <span v-if="cont.type===6">
                      <img
                        :src="baseUrl+'/'+cont.value"
                        alt
                        style="width:120px;height:80px;"
                      >
                    </span>
                    <div v-if="cont.type===7">
                      <video
                        :src="baseUrl+'/'+cont.value"
                        alt
                        style="width:120px;height:80px;cursor:pointer;"
                        @click="playVideo(cont.value)"
                      />
                    </div>
                    <span
                      v-if="cont.type===1||cont.type===2||cont.type===3||cont.type===4||cont.type===5"
                      class="infor"
                    >{{ cont.value }}</span>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="right-box">
          <el-tabs
            v-model="editTabNum"
            type="border-card"
            @tab-click="handleClick($event)"
          >
            <el-tab-pane
              label="编辑录入"
              name="1"
            >
              <el-input
                v-model="code"
                :rows="12"
                type="textarea"
                class="edit_textarea"
                placeholder="输入溯源码或关联码 (一行一条,每次最多输入10000条)"
                resize="none"
                @keyup.native.enter="getCode($event)"
                @blur="getCode($event)"
              />
              <div class="tip_box">一行一条,每次最多输入10000条</div>
              <!-- :autosize="{minRows:1,maxRow:6}" -->
            </el-tab-pane>
            <el-tab-pane
              label="批次录入"
              name="2"
            >
              <!-- <el-autocomplete
                v-model="modeCode"
                :fetch-suggestions="querySearchCode"
                class="w340"
                placeholder="请输入发码批次号"
                @select="handlerCode"
              /> -->
              <el-select
                :remote-method="codeQuery"
                v-model="modeCode"
                style="width:300px"
                placeholder="请选择或搜索发码批次号"
                filterable
                remote
                @change="handCode"
              >
                <el-option
                  v-for="item in codelist"
                  :key="item.gro_number"
                  :label="item.gro_pnumber"
                  :value="item.gro_number"
                />
              </el-select>
              <!-- <el-input type="text" v-model="modeCode" placeholder @blur="editIpt(2,$event)"/> -->
            </el-tab-pane>
            <el-tab-pane
              label="区间录入"
              name="3"
            >
              <el-form-item label="起始溯源码">
                <el-input
                  v-model="startCode"
                  type="text"
                  placeholder="请输入产品码号"
                  class="w200"
                  @blur="editIpt(3,$event,0)"
                />
              </el-form-item>
              <el-form-item label="结束溯源码">
                <el-input
                  v-model="stopCode"
                  type="text"
                  placeholder="请输入产品码号"
                  class="w200"
                  @blur="editIpt(3,$event,1)"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
      <!-- 视频预览 -->
      <el-dialog
        :visible.sync="video.showImg"
        :close-on-click-modal="false"
        title="视频预览"
        width="400px"
        class="lookimg-dialog lookVideo-dialog"
        @close="video.showImg=false"
      >
        <video
          :src="baseUrl+'/'+video.imgUrl"
          class="video-lookup"
          controls="controls"
          autoplay
        />
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { errorStatus } from '@/utils/index'
import { infoMod, modify } from '@/api/trace'
import { goodscode, goodsdata } from '@/api/code'
export default {
  name: 'Information',
  data() {
    return {
      codeTrue: true,
      formList: {
        code_good_id: '',
        code_camera_id: '',
        code_environment_id: ''
      },
      codeSourId: null,
      formRules: {
        code_good_id: [],
        code_source_id: [],
        code_camera_id: [],
        code_environment_id: []
      },
      goodsChose: '',
      state: [], //
      cameraSta: [], // 摄像头
      envState: [], // 环境
      showTabs: [],
      editTab: null,
      editableTabsValue: '',
      showTraceInfo: false,
      // editTabNum: 1,
      editTabNum: '1',
      code: null,
      modeCode: '',
      stopCode: '',
      startCode: '',
      showClearBtn1: false,
      showClearBtn2: false,
      showClearBtn3: false,
      showClearBtn4: false,
      baseUrl: process.env.BASE_API,
      video: {
        showImg: false,
        imgUrl: ''
      },
      goodSearchLoad: false,
      goodsList: null,
      codelist: []
    }
  },
  created() {
    this.pageInfor()
    this.goodsdata()
    this.suymData()
  },
  methods: {
    // 页面加载
    pageInfor() {
      const data = {}
      infoMod(data)
        .then(response => {
          const dataRep = response.data
          // console.log('获取列表', dataRep)
          if (errorStatus(dataRep)) {
            this.state = dataRep.data.fom_list
            this.cameraSta = dataRep.data.camera_list
            this.envState = dataRep.data.env_list
          }
        })
        .catch(Error => {})
    },
    // 加载数据
    goodsdata() {
      const data = {}
      goodsdata(data).then(response => {
        // console.log('goods--data--', response)
        if (errorStatus(response.data)) {
          this.goodsList = response.data.data
        }
      }).catch(Error => {
        console.log('Error', Error)
      })
    },
    // 请求 下拉框数据-批次录入
    suymData() {
      const data = {}
      data.search_type = 5
      // data.type=2;
      // data.edit='';
      modify(data)
        .then(response => {
          const dataRep = response.data
          // console.log('000000000000')
          if (errorStatus(dataRep)) {
            // console.log('-批次录入--', dataRep)
            this.codelist = dataRep.data
          }
        })
    },
    //
    choseEnv2(val) {
      this.showClearBtn2 = true
    },
    // 提交
    submit() {
      if (!this.codeTrue) {
        this.$message.error('录入二维码有误!')
        return false
      }
      if (
        this.formList.code_good_id === '' &&
        this.codeSourId === '' &&
         this.formList.code_camera_id === '' &&
         this.formList.code_environment_id === ''
      ) {
        this.$message.error('请填入商品,溯源,环境,摄像头的任意一种')
        return false
      }
      // console.log('code--', this.code)
      if (this.code === '' || this.code === null) {
        if (this.startCode === '' && this.stopCode === '') {
          this.$message.error(
            "请选择'编辑录入','批次录入','区间录入'任意一种,填入内容"
          )
          return false
        } else if (this.startCode === '' || this.stopCode === '') {
          if (Number(this.editTabNum) === 3) {
            this.$message.error(
              '请完善区间录入的信息'
            )
            return false
          }
        }
      }
      // console.log('this.showTabs---', this.showTabs)
      // const code_source_id='';
      const data = this.formList
      data.search_type = 4
      data.type = Number(this.editTabNum)
      // console.log(' data.type--', data.type)
      const id_code = []
      if (data.type === 3) {
        id_code.push(this.startCode, this.stopCode)
        // console.log('--id_code--', id_code)
        data.edit = id_code
      } else {
        // console.log('批次录入--区间录入', this.code)
        data.edit = this.code
      }
      if (data.edit === null) {
        if (data.type === 1) {
          this.$message.error('请输入编辑录入')
          return false
        } else if (data.type === 2) {
          this.$message.error('请输入批次录入')
          return false
        } else if (data.type === 3) {
          this.$message.error('请输入区间录入')
          return false
        }
      }

      delete data.goo_name
      // console.log('data----', data)
      var code_source = ''
      if (this.codeSourId !== '') {
        // this.formList.code_source_id='';
        for (const i in this.showTabs) {
          // console.log('i--', typeof(this.showTabs[i].fom_id));
          code_source += ',' + this.showTabs[i].fom_id
          // console.log('code_source_id--', code_source)
        }
        // this.formList.code_source_id=code_source_id;
      }
      data.code_source_id = code_source

      modify(data)
        .then(response => {
          const dataRep = response.data
          if (errorStatus(dataRep)) {
            this.$message.success(dataRep.data)
            this.formList.code_good_id = ''
            this.codeSourId = ''
            this.formList.code_camera_id = ''
            this.formList.code_environment_id = ''
            this.startCode = ''
            this.stopCode = ''
            this.modeCode = ''
            this.code = ''
            this.showClearBtn1 = false
            this.showClearBtn2 = false
            this.showClearBtn3 = false
            this.showClearBtn4 = false
            for (const i in this.showTabs) {
              // console.log('i', i)
              this.showTabs.splice(i, this.showTabs.length)
            }
          }
        })
        .catch(Error => {})
    },
    // 批次录入--搜索
    codeQuery(query) {
      // console.log('query--', query)
      if (query !== '') {
        this.goodSearchLoad = true
        const data = {}
        data.search_type = 2
        data.type = 2
        data.code = query
        // setTimeout(() => {
        modify(data).then(response => {
          this.goodSearchLoad = false
          if (errorStatus(response.data)) {
            this.codelist = response.data.data
          } else {
            this.codelist = []
          }
        }).catch(Error => {
          console.log('err--', Error)
        })
        // }, 200);
      }
    },
    // 批次录入--选中
    handCode(value) {
      this.code = value
      this.codeTrue = true
    },
    // 商品名称-搜索
    querySearchAsync(query) {
      // console.log('query--', query)
      if (query !== '') {
        this.goodSearchLoad = true
        const data = {}
        data.search_goods = query
        // setTimeout(() => {
        goodscode(data).then(response => {
          this.goodSearchLoad = false
          if (errorStatus(response.data)) {
            this.goodsList = response.data.data
          }
        }).catch(Error => {
          console.log('err--', Error)
        })
        // }, 200);
      }
    },
    // 选择后
    handleSelect(val) {
      // console.log('val----', val)
      const that = this
      that.showClearBtn1 = true
      const goodsList = that.goodsList
      for (const i in goodsList) {
        if (goodsList[i].goo_id === val) {
          // console.log('--------', val)
          that.formList.code_good_id = val
        }
      }
      // console.log(that.formList)
    },

    handlerCode(item) {
      this.code = item.gro_number
      this.modeCode = item.gro_pnumber
    },
    // 编辑录入
    getCode(e) {
      console.log('e---', e.target.value)
      if (e.target.value === '') {
        return false
      } else {
        const data = {}
        data.search_type = 1
        data.code = e.target.value
        modify(data).then(response => {
          if (errorStatus(response.data)) {
            this.codeTrue = true
          } else {
            this.codeTrue = false
          }
        }).catch(Error => {

        })
      }
    },
    querySearchCode(queryString, cb) {
      if (queryString === undefined || queryString === '') {
        return false
      }
      const data = {}
      data.code = queryString
      data.search_type = 2
      modify(data).then(response => {
        const dataRep = response.data
        // console.log('dataRep---', dataRep)
        if (errorStatus(dataRep)) {
          const resta = dataRep.data
          if (resta.length === 0) {
            this.$message.error('没有搜索到相匹配的商品')
            cb(resta)
            return false
          }
          for (const i in resta) {
            resta[i].value = resta[i].gro_pnumber
          }
          cb(resta)
        }
      })
    },
    // 选中后--溯源信息
    traceChange(value) {
      // console.log('showTabs-------', this.showTabs)
      const showTabs = this.showTabs
      for (const i in showTabs) {
        if (value === showTabs[i].fom_id) {
          this.$message.error('不可重复选择!')
          return false
        }
      }
      for (const i in this.state) {
        // console.log('232323-------', this.state[i])
        if (this.state[i].fom_id === value) {
          // console.log("0000000000");
          const contentData = this.state[i].fom_content
          if (Array.isArray(contentData)) {
            this.$set(this.state[i], 'fom_content', contentData)
          } else {
            this.$set(this.state[i], 'fom_content', JSON.parse(contentData))
          }
          const leng = this.showTabs.length
          this.showTabs.splice(leng, 0, this.state[i])
          this.showTraceInfo = true
          this.editableTabsValue = this.state[i].fom_title
          this.showClearBtn4 = true
        } else {
          // console.log("222222222");
        }
      }
    },
    // 删除
    removeTab(targetName) {
      // console.log('value2323-------', targetName)
      const tabs = this.showTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        // console.log('333', tabs)
        tabs.forEach((tab, index) => {
          // console.log('34343--', tab)
          // console.log('34343--', index)
          if (tab.fom_title === targetName) {
            // console.log(4444)
            const nextTab = tabs[index + 1] || tabs[index - 1]
            // console.log('--nextTab--', nextTab)
            if (nextTab) {
              activeName = nextTab.fom_title
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.showTabs = tabs.filter(tab => tab.fom_title !== targetName)
    },
    // 选择
    choseEnv3() {
      this.showClearBtn3 = true
    },
    // 清空
    clearGodName(num) {
      // console.log('清空---', num)
      if (num === 1) {
        this.formList.code_good_id = ''
        this.formList.goo_name = ''
        this.showClearBtn1 = false
      } else if (num === 4) {
        this.showClearBtn4 = false
        this.codeSourId = null
        // console.log('this.showTabs', this.showTabs.length)
        for (const i in this.showTabs) {
          // console.log('i', i)
          this.showTabs.splice(i, this.showTabs.length)
        }
      } else if (num === 2) {
        this.showClearBtn2 = false
        this.formList.code_environment_id = ''
        // this.formList.goo_name = ''
      } else if (num === 3) {
        this.showClearBtn3 = false
        this.formList.code_camera_id = ''
      }
    },
    // 视频预览
    playVideo(url) {
      this.video.imgUrl = url
      this.video.showImg = true
    },
    handleClick(value) {
      // console.log('-----', value)
      // console.log('--name---', value.name)
      this.code = null
      this.editTabNum = value.name
      this.codeTrue = true
    },
    choseForm() {

    },
    // 失去焦点
    editIpt(num, e, sta) {
      const data = {}
      data.search_type = num
      data.code = e.target.value
      if (data.code === '') {
        return false
      }
      const _this = this
      // console.log('---', _this.editTabNum)
      if (num === 2) {
        // console.log("222222222222")
        modify(data)
          .then(response => {
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              // console.log('000dataRep----', dataRep.data[0].gro_number)
              _this.code = dataRep.data[0].gro_number
              //  _this.modeCode=dataRep.data[0].gro_pnumber;
            }
          })
          .catch(Error => {})
      } else if (num === 3) {
        modify(data)
          .then(response => {
            const dataRep = response.data
            if (errorStatus(dataRep)) {
              this.codeTrue = true
              if (sta === 0) {
                _this.startCode = dataRep.data[0].gro_number
              } else {
                _this.stopCode = dataRep.data[0].gro_number
              }
              // console.log('000dataRep----', dataRep.data[0].gro_number)
            } else {
              this.codeTrue = false
            }
          })
          .catch(Error => {})
      } else {
        _this.code = e.target.value
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-container {
  .sd-module-box {
    background-color: #f0f2f5;
    .sd-moudle-header {
      background-color: #fff;
      height: 60px;
      padding-top: 15px;
    }
    .sd-form-box {
      background-color: #f0f2f5;
      padding: 0 !important;
      .left-box {
        width: 600px;
        float: left;
        background-color: #fff;
        padding: 25px 0 20px 0px;
        .clearBtn {
          margin-left: 30px;
        }
        .trace-infor-box {
          padding: 0 25px 0;
          .trace-info-tab {
            .trace-infor {
              font-size: 14px;
              @include clearfix;
              .title {
                width: 110px;
                height: 40px;
                line-height: 40px;
                display: block;
                float: left;
              }
              .infor {
                padding-left: 15px;
                float: left;
                // height: 40px;
                line-height: 30px;
                width: 420px;
                padding: 5px 0 0 0;
                color: #777;
              }
            }
          }
        }
      }
      .right-box {
        width: 380px;
        float: right;
        .edit_textarea {
          height: 278px;
          overflow: hidden;
          overflow-y: auto;
        }
        .tip_box {
          font-size: 12px;
          color: red;
          padding-left: 6px;
        }
      }
    }
  }
  .lookimg-dialog {
    &.lookVideo-dialog {
      padding: 15px 20px;
    }
    .img-lookup {
      width: 240px;
      height: 150px;
      margin: auto;
      display: block;
    }
    .video-lookup {
      width: 340px;
      height: 150px;
      margin: auto;
      display: block;

    }
  }
}
</style>

