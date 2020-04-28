<template>
 <div class="echarts">
    <div :style="{height:'600px',width:'100%'}" ref="myEchart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts theme
// import { debounce } from "@/utils";

import "../../../../node_modules/echarts/map/js/china";
// import "@/assets/map/china";
import cityMap from '@/assets/map/citymap'
export default {
  name: "echarts",
  data() {
    return {
      chart: null
    };
  },
  created() {},
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      // console.log(userJson)
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      //34个省、市、自治区的名字拼音映射数组
      var provinces = {
        //23个省
        台湾: "taiwan",
        河北: "hebei",
        山西: "shanxi",
        辽宁: "liaoning",
        吉林: "jilin",
        黑龙江: "heilongjiang",
        江苏: "jiangsu",
        浙江: "zhejiang",
        安徽: "anhui",
        福建: "fujian",
        江西: "jiangxi",
        山东: "shandong",
        河南: "henan",
        湖北: "hubei",
        湖南: "hunan",
        广东: "guangdong",
        海南: "hainan",
        四川: "sichuan",
        贵州: "guizhou",
        云南: "yunnan",
        陕西: "shanxi1",
        甘肃: "gansu",
        青海: "qinghai",
        //5个自治区
        新疆: "xinjiang",
        广西: "guangxi",
        内蒙古: "neimenggu",
        宁夏: "ningxia",
        西藏: "xizang",
        //4个直辖市
        北京: "beijing",
        天津: "tianjin",
        上海: "shanghai",
        重庆: "chongqing",
        //2个特别行政区
        香港: "xianggang",
        澳门: "aomen"
      };
      //直辖市和特别行政区-只有二级地图，没有三级地图
      var special = ["北京", "天津", "上海", "重庆", "香港", "澳门"];
      var mapdata = [];
      var data = [
        {
          name: "北京",
          value: [100, 100]
        },
        {
          name: "天津",
          value: [100, 100]
        },
        {
          name: "西藏",
          value: [100, 100]
        }
      ];
      //绘制全国地图
      this.$http
        .get("static/map/china.json")
        .then(response => {
          var data = response.data;
          // console.log('绘制全国地图',data)
          let d = [];
          for (var i = 0; i < data.features.length; i++) {
            d.push({
              name: data.features[i].properties.name
            });
          }
          mapdata = d;
          console.log();
          //注册地图
          echarts.registerMap("china", data);
          //绘制地图
          this.renderMap("china", d);
        })
        .catch(err => {
          console.log("err", err);
        });
      //地图点击事件
      myChart.on("click", params => {
        if (params.name in provinces) {
          //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
          this.$http
            .get("static/map/province/" + provinces[params.name] + ".json")
            .then(response => {
              var data = response.data;
              echarts.registerMap(params.name, data);
              var d = [];
              for (var i = 0; i < data.features.length; i++) {
                d.push({
                  name: data.features[i].properties.name
                });
              }
              this.renderMap(params.name, d);
            })
            .catch(err => {
              console.log("err二级地图", err);
            });
        } else if (params.seriesName in provinces) {
          //如果是【直辖市/特别行政区】只有二级下钻
          if (special.indexOf(params.seriesName) >= 0) {
            this.renderMap("china", mapdata);
          } else {
            //显示县级地图
            // console.log('citymap',cityMap)
            if (cityMap[params.name]) {
              this.$http
                .get("static/map/city/" + cityMap[params.name] + ".json")
                .then(response => {
                  var data = response.data;
                  echarts.registerMap(params.name, data);
                  var d = [];
                  for (var i = 0; i < data.features.length; i++) {
                    d.push({
                      name: data.features[i].properties.name
                    });
                  }
                  this.renderMap(params.name, d);
                })
                .catch(err => {
                  console.log("err县级地图", err);
                });
            } else {
              this.renderMap("china", mapdata);
            }
          }
        } else {
          this.renderMap("china", mapdata);
        }
      });
    },

    renderMap(mapName, mapData) {
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      var data = [
        {
          name: "北京",
          value: [100, 100]
        },
        {
          name: "天津",
          value: [100, 100]
        },
        {
          name: "西藏",
          value: [100, 100]
        }
      ];
      myChart.setOption({
        title: {
          show: false
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: function(params) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].name == params.data.name) {
                return (
                  "<span style='color: #ffff33;border-bottom: 1px solid #ffff33;font-size:14px;display: block;'>" +
                  params.data.name +
                  "</span>发码量 : " +
                  data[i].value[0] +
                  "<br/> 扫码量 : " +
                  data[i].value[1]
                );
              }
            }
          }
        },
        animationDuration: 1000,
        animationEasing: "cubicOut",
        animationDurationUpdate: 1000,

        series: [
          {
            name: mapName,
            type: "map",
            mapType: mapName,
            roam: false,
            label: {
              normal: {
                show: true,
                align: "center",
                verticalAlign: "middle",
                textStyle: {
                  color: "#fff",
                  fontSize: 14
                }
              },
              emphasis: {
                show: true,
                align: "center",
                verticalAlign: "middle",
                textStyle: {
                  color: "#fff",
                  fontSize: 14
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#1d92c9",
                borderColor: "#d9e3e4"
              },
              emphasis: {
                areaColor: "#50bcee",
                borderColor: "#d9e3e4"
              }
            },
            data: mapData
          }
        ]
      });
    }
  }
};
</script>


