<script setup>
import FSGStations from "@/components/FSGStations/FSGStations.vue";
import FSGMapPopup from "@/components/FSGMapPopup/FSGMapPopup.vue";
import { useMapStore } from "@/store/mapStore";
import { useStationStore } from "@/store/stationStore";
import { getWeatherStaticInfo } from "@/api/meteo/common";
import {
  getLiveData,
  getStatisticalDataByTime,
  getDisplayDataByTime,
  getLatestDataByStation,
  getObservationAndRadiationData,
  getMonitoringStationInfoByType,
  getWindProfilerRadarInfo,
  getWindProfilerRadarData,
  getLightningData,
} from "@/api/meteo/stations.js";
import {
  getLiveFusionData,
  getDataByAirQualityParameter,
  getAirQualityDataByStationId,
} from "@/api/meteo/observe.js";
import { getCityList, getRegionGeoJson, getGeoJsonByCode } from "@/api/region/region";
import StationLayer from "./stationLayer.js";
import StationClusterLayer from "./stationClusterLayer.js";
import ObservationLayer from "./observationLayer.js";
import ObservationIconLayer from "./observationIconLayer.js";
import EcologicalStationLayer from "./ecologicalStationLayer.js";
import { filterInvalidData } from "@/utils/meteo.js";
import Threshold from "@/plugins/station/threshold";
import { drawPolygon, fitLayerView, isNoLegend } from "@/utils/ol.common.js";
import { getLegend, getLegendArr, getColorFromLegend } from "@/config/legends.js";
import {
  handleEleLegendTime,
  formatStaticInfoData,
  formatSingleStationData,
  formatAQISingleStationData,
  formatLightningSingleStationData,
} from "./util.js";
import config from "../../config.js";
import {
  CogTiffLayer,
  GridValueLayer,
  CogParticleLayer,
  GridWindLayer,
  CogUVLayer,
} from "cme-core";
import dayjs from "dayjs";
import { transform as Dr } from "CME2D/proj";


const mapStore = useMapStore();
const stationStore = useStationStore();

let MapTarget = stationStore.defaultMapTarget;

let data = [];
let displayElementsData = {};
let Map,
  pointsLayer,
  stationLayer,
  gridSpotLayer,
  gridValueLayer,
  gridWindLayer,
  cogParticleLayer,
  aqiLayer,
  ecologicalStationLayer,
  observationLayer,
  radarWindLayer,
  lightningLayer;
const layerName = "WebGLPoints";
const layerName2 = "WebGLPointsSpot";
let thresholdObj = new Threshold();
let boundary; // 区域选择动态行政数据geojson数据
let boundaryLayer;
let defaultSiteType = [];

let stationTypes = ref([]);
// 单站所有要素
let selectedPoint = ref();
const popupX = ref(0);
const popupY = ref(0);
let gridMenu = ref([]);

let activeEleInfo = ref(); // 默认、最后一次点击对象的信息，如pre、wind、temp等
let activeEleTypeInfo = ref(); // 默认、最后一次点击对象的信息等
// 区域选择
// 站点类型-观测值、站名、站号
let activeStationLabelCode = []; // eg: 'observed_value'
// 阈值
let isHighlightRed = true;
// 融合实况
let gridElements = [];
// 空气质量
let AQIElement = {};
// 生态监测站
let ecologicalElement = {};
// 观测
let observationIElement = {};
let defaultFlag = true;
// 雷达风廓线
let radarWindElement = {};
// 闪电
let lightningElement = {};

watch(
  () => [mapStore.rerenderMap, mapStore.regionGeojsonData],
  () => {
    mapStore.clearLayerInfo();
    if (mapStore.mapMode === "2D") {
      start();
    } else {
      // mapStore.clearLayerInfo({mapTarget:MapTarget,})
      MapTarget = mapStore.fullScreenMapInfo.target;
      Map = window.mapController.MapObjList[MapTarget];
    }
  }
);
watch(
  () => stationStore.activeTimelineInterval,
  () => {
    const { code } = stationStore.activeElementType;
    const isDisplayCode = code.split("_")[0] === "display";
    if (isDisplayCode) {
      getDisplayDataByTime({
        ...paramsForTime,
        interval: stationStore.activeTimelineInterval,
      })
        .then((res) => {
          if (res.data.data) {
            const dataObj = res.data.data;
            const timeKeys = Object.keys(dataObj);
            const _index = timeKeys.length - 1;
            const timeKey = timeKeys[_index];
            const data = dataObj[timeKey];

            stationStore.setDefaultDispalayAxisTime(timeKey);
            render(data, "value");
            stationStore.setDisplayElementsData(dataObj);
          } else {
            stationStore.setDisplayElementsData({});
            // mapStore.setTimelineData([]);
            // mapStore.setIsShowTimeline(false);
          }
        })
        .catch((err) => {
          // mapStore.setIsShowTimeline(false);
          console.log(err);
        });
    }
  }
);
watch(
  () => stationStore.activeDispalayAxisTime,
  () => {
    // stationStore.displayElementsData
    const _data = stationStore.displayElementsData[stationStore.activeDispalayAxisTime];
    data = _data;
    render(_data, "value");
  }
);
watch(
  () => stationStore.activeRegionValue,
  () => {
    if (stationStore.activeRegionValue === "1") {
      const extent = [105.0, 35.0, 140.0, 58.0]; // 东北区域（融合实况的地理范围）
      // const extent = [118.837997, 38.723612, 135.087387, 53.558498]; // 东北区域
      Map.getView().fit(extent, {
        padding: [50, 300, 50, 50],
        duration: 280,
      });
    } else {
      loadRegion(stationStore.activeRegionValue);
    }
  }
);
watch(
  () => stationStore.activeGridAxisTime,
  () => {
    let spotLayerIndex = [-1, -1];
    let valueLayerIndex = [-1, -1];
    let windLayerIndex = [-1, -1];
    let particleLayerIndex = [-1, -1];

    const _len = gridElements.length;
    for (let i = 0; i < _len; i++) {
      const _l = gridElements[i].children.length;
      for (let j = 0; j < _l; j++) {
        if (gridElements[i].children[j].checked) {
          const t = gridElements[i].children[j].code.split("_");
          const type = t[t.length - 1];
          switch (type) {
            case "color":
              spotLayerIndex = [i, j, "spot"];
              break;
            case "value":
              valueLayerIndex = [i, j, "value"];
              break;
            case "vane":
              windLayerIndex = [i, j, "vane"];
              break;
            case "particle":
              particleLayerIndex = [i, j, "particle"];
              break;
          }
        }
      }
    }

    if (spotLayerIndex[1] > -1) {
      const data = stationStore.gridSpotData;
      const _index = data.findIndex(
        (el) => el.dataTime === stationStore.activeGridAxisTime
      );
      if (_index > -1) {
        const { elementsCode, name } = gridElements[spotLayerIndex[0]];
        renderGridSpotLayer(data[_index].graphPath, elementsCode);

        mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: "gridSpotLayer" });
        const Legend = getLegend(elementsCode);
        const _time = handleEleLegendTime(data[_index]);
        let _layerInfo = `${name}(${Legend.unit}) ${_time} BJT`;
        mapStore.setLayerInfo({
          mapTarget: MapTarget,
          name: "gridSpotLayer",
          layerType: "grid",
          elementsCode: elementsCode,
          layerInfo: _layerInfo,
          legend: Legend.colors,
        });
      }
    } else {
      gridSpotLayer && Map.removeLayer(gridSpotLayer);
      gridSpotLayer = null;
    }
    if (valueLayerIndex[1] > -1) {
      const data = stationStore.gridValueData;
      const _index = data.findIndex(
        (el) => el.dataTime === stationStore.activeGridAxisTime
      );
      if (_index > -1) {
        renderGridValueLayer(data[_index].graphPath);
      }
    } else {
      gridValueLayer && Map.removeLayer(gridValueLayer);
      gridValueLayer = null;
    }
    if (windLayerIndex[1] > -1) {
      const data = stationStore.gridValueData;
      const _index = data.findIndex(
        (el) => el.dataTime === stationStore.activeGridAxisTime
      );
      if (_index > -1) {
        renderGridWindLayer(data[_index].graphPath);
      }
    } else {
      gridWindLayer && Map.removeLayer(gridWindLayer);
      gridWindLayer = null;
    }
    if (particleLayerIndex[1] > -1) {
      const data = stationStore.gridValueData;
      const _index = data.findIndex(
        (el) => el.dataTime === stationStore.activeGridAxisTime
      );
      if (_index > -1) {
        const { elementsCode } = gridElements[particleLayerIndex[0]];
        renderGridParticleLayer(data[_index].graphPath, elementsCode);
      }
    } else {
      cogParticleLayer && Map.removeLayer(cogParticleLayer);
      cogParticleLayer = null;
    }
  }
);
watch(
  () => mapStore.mapMode,
  () => {
    aqiLayer = null;
    ecologicalStationLayer = null;
    observationLayer = null;
  }
);

let params = {
  cntyCode: config.default.regionAdcode,
  siteTypeCode: config.default.siteTypeCode,
  elementsCode: "",
  code: "",
};
let paramsForTime = {
  cntyCode: config.default.regionAdcode,
  siteTypeCode: config.default.siteTypeCode,
  code: "",
  startTime: "",
  endTime: "",
};
// 站点类型
const onStationTypeItemClick = (item) => {
  // console.log('module', item);
  defaultFlag = true; // 开启默认站点展示数据
  switch (item.code) {
    case "siteType":
      switch (item.itemContent.code) {
        case "1": // 国家站
        case "2": // 区域站
        case "3": // 其他站
          let siteTypeCode = "";
          let _arr = [];
          for (let i = 0; i < item.data.length; i++) {
            if (!isNaN(item.data[i].code)) _arr.push(item.data[i].code);
          }
          siteTypeCode = _arr.join(",");
          params.siteTypeCode = siteTypeCode;
          paramsForTime.siteTypeCode = params.siteTypeCode;
          if (_arr.length === 0) return;
          load("value");
          break;
        case "observed_value":
        case "station_name":
        case "station_id_c":
          const t = item.data.filter(
            (el) =>
              el.code === "station_name" ||
              el.code === "station_id_c" ||
              el.code === "observed_value"
          );
          const c = t.map((el) => el.code);
          activeStationLabelCode = c;
          if (c && c.length > 0) {
            stationLayer.removeText();
            let _color = mapStore.mapMode === "2D" ? "#333" : "#fff";
            stationLayer.renderText(
              c,
              thresholdObj.getThresold(),
              isHighlightRed,
              _color
            );
          } else {
            stationLayer.removeText();
          }
          return; // 不触发请求
        // case "color_spot_map":
        //   break;
        // case "contour_line":
        //   break;
      }
      break;
    case "statistical_elements":
    case "display_elements":
      paramsForTime.startTime = item.startTime;
      paramsForTime.endTime = item.endTime;
      paramsForTime.code = item.itemContent.code;

      activeEleInfo.value = item;
      activeEleTypeInfo.value = item.itemContent;
      stationStore.setActiveElementType(item.itemContent);
      if (!item.itemContent.isActive) {
        mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: layerName });
        // mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: layerName2 });
        stationLayer.remove(layerName);
        stationLayer.removeText();
        if (boundaryLayer) Map.removeLayer(boundaryLayer);
        stationStore.setIsDisplayAxisShow(false);
        return;
      }
      load("value");
      break;
    default:
      // 要素
      params.elementsCode = item.code;
      params.code = item.itemContent.code;

      activeEleInfo.value = item;
      activeEleTypeInfo.value = item.itemContent;
      stationStore.setActiveElementType(item.itemContent);
      if (!item.itemContent.isActive) {
        mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: layerName });
        // mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: layerName2 });
        stationLayer.remove(layerName);
        stationLayer.removeText();
        if (boundaryLayer) Map.removeLayer(boundaryLayer);

        // isobandsLayer.remove(layerName2);
        // initIsobandsLayer();
        return;
      }
      load("value");
  }
};
const onSelectRegion = (region) => {
  params.cntyCode = region.cntyCode;
  paramsForTime.cntyCode = params.cntyCode;
  stationStore.setActiveRegionValue(region.cntyCode);
};
// 融合实况24h
const onGridMenuChange = (elements) => {
  gridElements = elements;
  renderGridLayer(elements);
};
// 空气质量参数
const onAQIItemClick = (info) => {
  AQIElement = info;
  renderAQILayer(info);
};
// 生态监测站
const onEcologicalItemClick = (info) => {
  ecologicalElement = info;
  renderEcologicalLayer(info);
};
// 高空观测
const onObservationItemClick = (info) => {
  if (info.itemContent.code === "radar_wind_profiler_radar") {
    radarWindElement = info;
    renderRadarWindLayer(info);
  } else if (info.itemContent.code === "thunder_and_lightning_24h") {
    lightningElement = info;
    renderLightningLayer(info);
  } else {
    defaultFlag = false; // 与站点互斥关闭默认选项
    observationIElement = info;
    renderObservationLayer(info);
  }
};

// --- methods ---
async function start() {
  if (!mapStore.regionGeojsonData) return;
  boundary = mapStore.regionGeojsonData;
  if (stationTypes.value.length === 0) {
    const res = await getWeatherStaticInfo({ type: config.moduleCode });
    if (res.data.code === 200 && res.data.data.length > 0) {
      stationTypes.value = formatStaticInfoData(res.data.data);
      handleDefaultEle();
      handleGridMenu();
    }
  }
  if (stationTypes.value.length === 0) return;
  if (mapStore.fullScreenMapInfo.target) {
    MapTarget = mapStore.fullScreenMapInfo.target;
    Map = window.mapController.MapObjList[MapTarget];
    if (MapTarget === stationStore.defaultMapTarget) {
      init();
      load("value");

      // mapStore.setEleForTimeline("station");
    } else {
      init();
    }
  } else {
    // mapStore.setEleForTimeline("");

    MapTarget = stationStore.defaultMapTarget;
    Map = window.mapController.MapObjList[MapTarget];
    init();
    load("value");
  }

  if (
    mapStore.mapMode === "2D" &&
    boundary &&
    boundary.features &&
    boundary.features.length > 0
  ) {
    if (boundaryLayer) Map.removeLayer(boundaryLayer);
    boundaryLayer = drawPolygon(boundary);
    Map.addLayer(boundaryLayer);
    const timer = setTimeout(() => {
      fitLayerView(boundaryLayer, Map);
      clearTimeout(timer);
    }, 300);
  }

  const findAQIIndex = stationTypes.value.findIndex(
    (item) => item.code === config.default.AQIElementCode
  );
  if (findAQIIndex > -1) {
    const findAQIElIndex = stationTypes.value[findAQIIndex].children.findIndex(
      (item) => item.code === config.default.AQISecondaryElementCode
    );
    if (findAQIElIndex > -1) {
      const _ele = JSON.parse(
        JSON.stringify(stationTypes.value[findAQIIndex].children[findAQIElIndex])
      );
      _ele.isActive = true;
      const info = {
        itemContent: _ele,
        code: config.default.AQIElementCode,
        name: _ele.name,
      };
      onAQIItemClick(info);
    }
  }
  // onAQIItemClick
}
function init() {
  if (!Map) return;
  stationLayer = new StationLayer({
    map: Map,
  });
}
function load(dataKey) {
  // clear data:
  data = [];
  stationStore.setData([]);
  displayElementsData = {};
  stationStore.setDisplayElementsData({});
  // mapStore.setTimelineData([]);

  if (Map) {
    switch (activeEleInfo.value.code) {
      case "statistical_elements":
        stationStore.setIsDisplayAxisShow(false);
        // mapStore.setIsShowTimeline(false);
        getStatisticalDataByTime(paramsForTime)
          .then((res) => {
            if (res.data.data && res.data.data.length > 0) {
              data = res.data.data;
              render(data, dataKey);
              stationStore.setData(data);
            } else {
              stationStore.setData([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      case "display_elements":
        getDisplayDataByTime({
          ...paramsForTime,
          interval: stationStore.activeTimelineInterval,
        })
          .then((res) => {
            if (res.data.code === 200 && res.data.data) {
              const dataObj = res.data.data;
              const timeKeys = Object.keys(dataObj);
              const _index = timeKeys.length - 1;
              const timeKey = timeKeys[_index];
              const _data = dataObj[timeKey];
              data = _data;

              stationStore.setDefaultDispalayAxisTime(timeKey);
              render(_data, dataKey);
              stationStore.setDisplayElementsData(dataObj);
              stationStore.setIsDisplayAxisShow(true);
            } else {
              stationStore.setDisplayElementsData({});
              stationStore.setIsDisplayAxisShow(false);
            }
          })
          .catch((err) => {
            stationStore.setData([]);
            console.log(err);
          });
        break;
      default:
        stationStore.setIsDisplayAxisShow(false);
        getLiveData(params)
          .then((res) => {
            if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
              data = res.data.data;
              render(data, dataKey);
              stationStore.setData(data);
            }
          })
          .catch((err) => {
            const msg = String(err).split(" ")[1]; // Error: 查询数据错误！
            stationStore.setData([]);
            const Legend = findLegend(activeEleInfo.value, activeEleTypeInfo.value);
            let _layerInfo = "";
            if (Legend && Legend.unit) {
              _layerInfo = `${activeEleTypeInfo.value.name}(${Legend.unit}) ${msg}`;
            } else {
              _layerInfo = `${activeEleTypeInfo.value.name} ${msg}`;
            }
            mapStore.setLayerInfo({
              mapTarget: MapTarget,
              name: layerName,
              layerType:
                activeEleInfo.value.elementsCode === null
                  ? activeEleInfo.value.code
                  : "station",
              elementsCode: activeEleTypeInfo.value.elementsCode,
              layerInfo: _layerInfo,
              legend: Legend.colors,
            });
            stationLayer.remove(layerName);
            stationLayer.removeText();
          });
    }
  }
}
function render(data, dataKey = "value") {
  let _data = filterInvalidData(data, dataKey);
  if (params.elementsCode === "pre") {
    _data = _data.filter((item) => +item[dataKey] > 0);
  }

  const Legend = findLegend(activeEleInfo.value, activeEleTypeInfo.value);
  if (_data.length > 0) {
    stationLayer.setColors(Legend.colors);
    stationLayer.render(_data);

    pointsLayer = stationLayer.pointsLayer;
    Map.on("click", handlePointClick);
    Map.on("pointermove", handlePointerMove);

    if (activeStationLabelCode && activeStationLabelCode.length > 0) {
      stationLayer.removeText();
      let _color = mapStore.mapMode === "2D" ? "#333" : "#fff";
      stationLayer.renderText(
        activeStationLabelCode,
        thresholdObj.getThresold(),
        isHighlightRed,
        _color
      );
    } else {
      stationLayer.removeText();
    }

    const _time = handleEleLegendTime(data[0]);
    let _layerInfo = "";
    if (Legend && Legend.unit) {
      _layerInfo = `${activeEleTypeInfo.value.name}(${Legend.unit}) ${_time} BJT`;
    } else {
      _layerInfo = `${activeEleTypeInfo.value.name}：${_time} BJT`;
    }
    mapStore.setLayerInfo({
      mapTarget: MapTarget,
      name: layerName,
      layerType:
        activeEleInfo.value.elementsCode === null ? activeEleInfo.value.code : "station", // 按时间范围选择的要素activeEleInfo.value.elementsCode 为null
      elementsCode: activeEleTypeInfo.value.elementsCode,
      layerInfo: _layerInfo,
      legend: Legend.colors,
    });
  } else {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: layerName });

    let _layerInfo = "";
    let msg = activeEleTypeInfo.value.elementsCode === "pre" ? "无降水" : "暂无数据";
    if (Legend && Legend.unit) {
      _layerInfo = `${activeEleTypeInfo.value.name}(${Legend.unit}) ${msg}`;
    } else {
      _layerInfo = `${activeEleTypeInfo.value.name} ${msg}`;
    }
    mapStore.setLayerInfo({
      mapTarget: MapTarget,
      name: layerName,
      layerType:
        activeEleInfo.value.elementsCode === null ? activeEleInfo.value.code : "station",
      elementsCode: activeEleTypeInfo.value.elementsCode,
      layerInfo: _layerInfo,
      legend: Legend.colors,
    });
    stationLayer.remove(layerName);
    stationLayer.removeText();
  }
}

// 点击点处理函数
const handlePointClick = (event) => {
  // 在点击位置检测要素
  Map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      if (feature) {
        // 获取点信息
        // const geometry = feature.getGeometry();
        // const coordinates = geometry.getCoordinates(); // 4326坐标

        const stationIdC = feature.get("stationIdC");
        const stationName = feature.get("stationName");
        if (stationIdC) stationStore.setSearchSingleStationID(stationIdC, stationName);

        // 设置弹窗位置（偏移避免被鼠标遮挡）
        // popupX.value = event.originalEvent.clientX + 10;
        // popupY.value = event.originalEvent.clientY + 10;

        return true; // 停止检测其他要素
      }
    },
    {
      layerFilter: (layer) => layer === pointsLayer, // 只检测点图层
    }
  );
};
// 鼠标悬浮
let pointerMoveTimer;
const handlePointerMove = (event) => {
  const hasFeature = Map.hasFeatureAtPixel(event.pixel, {
    layerFilter: (layer) => layer === pointsLayer,
  });
  if (!hasFeature) {
    if (Map.getTargetElement().style.cursor === "pointer") {
      Map.getTargetElement().style.cursor = "";
    }
    selectedPoint.value = undefined; // 隐藏弹窗
    return;
  }
  // 改变鼠标样式
  Map.getTargetElement().style.cursor = hasFeature ? "pointer" : "";

  Map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      if (feature) {
        if (!selectedPoint.value || !selectedPoint.value.length === 0) {
          pointerMoveTimer && clearTimeout(pointerMoveTimer);
          pointerMoveTimer = setTimeout(() => {
            getStationData(feature.get("stationIdC"));
            clearTimeout(pointerMoveTimer);
          }, 50);
        }

        // 设置弹窗位置（偏移避免被鼠标遮挡）
        popupX.value = event.originalEvent.clientX;
        popupY.value = event.originalEvent.clientY;
        return true; // 停止检测其他要素
      }
    },
    {
      layerFilter: (layer) => layer === pointsLayer, // 只检测点图层
    }
  );
};
const onSetThreshold = (thre) => {
  if (thre && thre.length > 0) {
    let dataKey = "value";
    let arr = [];
    thresholdObj.setThresold(thre);
    let t = thresholdObj.getThresold();
    if (isHighlightRed) {
      render(data, "value");
    } else {
      arr = data.filter((item) => stationLayer.calculateWithOperator(t, item[dataKey]));
      arr = filterInvalidData(arr, dataKey);
      render(arr, "value");
    }
  } else {
    thresholdObj.setThresold([]);
    render(data, "value");
  }
};
const onHighlightRedClick = (boole) => {
  isHighlightRed = boole;
};

// ---methods---
function handleDefaultEle() {
  const findEleIndex = stationTypes.value.findIndex(
    (el) => el.code === config.default.element
  );
  if (findEleIndex > -1) {
    activeEleInfo.value = stationTypes.value[findEleIndex];
    params.elementsCode = activeEleInfo.value.code;

    const findI = stationTypes.value[findEleIndex].children.findIndex(
      (el) => el.code === config.default.secondaryElement
    );
    if (findI === -1) return;
    activeEleTypeInfo.value = stationTypes.value[findEleIndex].children[findI];
    params.code = activeEleTypeInfo.value.code;
    stationStore.setActiveElementType(activeEleTypeInfo.value);
  }

  let _defaultSiteType = config.default.siteTypeLayerCode;
  _defaultSiteType.push(config.default.siteTypeCode);
  activeStationLabelCode = config.default.siteTypeLayerCode;
  defaultSiteType = _defaultSiteType;
}
function findLegend(activeEleInfo, activeEleTypeInfo) {
  let _code;
  switch (activeEleInfo.code) {
    case "statistical_elements":
    case "display_elements":
      _code = activeEleTypeInfo.elementsCode;
      break;
    default:
      _code = activeEleInfo.code;
  }

  // 变温、变压：
  const isLegend = isNoLegend(activeEleTypeInfo.code);
  if (isLegend) return { colors: [] };

  return getLegend(_code);
}
function loadRegion(code) {
  getGeoJsonByCode({ code }).then((res) => {
    if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
      getRegionGeoJson(res.data.data[0].filePath).then((res) => {
        if (res.data && res.data.name) {
          boundary = res.data;
          load("value");
          if (
            mapStore.mapMode === "2D" &&
            boundary &&
            boundary.features &&
            boundary.features.length > 0
          ) {
            if (boundaryLayer) Map.removeLayer(boundaryLayer);
            boundaryLayer = drawPolygon(boundary);
            Map.addLayer(boundaryLayer);
            fitLayerView(boundaryLayer, Map);
          }
        }
      });
    }
  });
}
// 单站所有要素
function getStationData(id) {
  if (!id) return;
  getLatestDataByStation({ stationIdC: id }).then((res) => {
    if (res.data && res.data.code === 200) {
      const arr = formatSingleStationData(res.data.data);
      selectedPoint.value = arr;
    }
  });
}
// 融合实况24h
function handleGridMenu() {
  const findGridMenuIndex = stationTypes.value.findIndex(
    (el) => el.code === "live_fusion"
  );
  if (findGridMenuIndex > -1) {
    const _menu = JSON.parse(
      JSON.stringify(stationTypes.value[findGridMenuIndex].children)
    );
    _menu.map((item) => {
      item.checked = false;
      item.children.map((el) => (el.checked = false));
    });
    gridMenu.value = _menu;
  }
}
function renderGridLayer(elements) {
  let spotLayerIndex = [-1, -1];
  let valueLayerIndex = [-1, -1];
  let windLayerIndex = [-1, -1];
  let particleLayerIndex = [-1, -1];

  const _len = elements.length;
  for (let i = 0; i < _len; i++) {
    const _l = elements[i].children.length;
    for (let j = 0; j < _l; j++) {
      if (elements[i].children[j].checked) {
        const t = elements[i].children[j].code.split("_");
        const type = t[t.length - 1];
        switch (type) {
          case "color":
            spotLayerIndex = [i, j, "spot"];
            break;
          case "value":
            valueLayerIndex = [i, j, "value"];
            break;
          case "vane":
            windLayerIndex = [i, j, "vane"];
            break;
          case "particle":
            particleLayerIndex = [i, j, "particle"];
            break;
        }
      }
    }
  }
  if (spotLayerIndex[1] > -1) {
    stationStore.setGridValueData([]);
    const { elementsCode, name } = elements[spotLayerIndex[0]];
    loadGridLayer(elementsCode, spotLayerIndex[2], name);
    stationStore.setIsGridAxisShow(true);
  } else {
    gridSpotLayer && Map.removeLayer(gridSpotLayer);
    gridSpotLayer = null;
  }
  if (valueLayerIndex[1] > -1) {
    stationStore.setGridSpotData([]);
    const { elementsCode, name } = elements[valueLayerIndex[0]];
    loadGridLayer(elementsCode, valueLayerIndex[2], name);
    stationStore.setIsGridAxisShow(true);
  } else {
    gridValueLayer && Map.removeLayer(gridValueLayer);
    gridValueLayer = null;
  }
  if (windLayerIndex[1] > -1) {
    stationStore.setGridSpotData([]);
    const { elementsCode, name } = elements[windLayerIndex[0]];
    loadGridLayer(elementsCode, windLayerIndex[2], name);
    stationStore.setIsGridAxisShow(true);
  } else {
    gridWindLayer && Map.removeLayer(gridWindLayer);
    gridWindLayer = null;
  }
  if (particleLayerIndex[1] > -1) {
    stationStore.setGridSpotData([]);
    const { elementsCode, name } = elements[particleLayerIndex[0]];
    loadGridLayer(elementsCode, particleLayerIndex[2], name);
    stationStore.setIsGridAxisShow(true);
  } else {
    cogParticleLayer && Map.removeLayer(cogParticleLayer);
    cogParticleLayer = null;
  }

  if (spotLayerIndex[1] === -1) {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: "gridSpotLayer" });
  }
  if (
    spotLayerIndex[1] === -1 &&
    valueLayerIndex[1] === -1 &&
    windLayerIndex[1] === -1 &&
    particleLayerIndex[1] === -1
  ) {
    // 空
    stationStore.setIsGridAxisShow(false);
    stationStore.setGridSpotData([]);
    stationStore.setGridValueData([]);
  }
}
function loadGridLayer(elementName, type, elementLabel) {
  getLiveFusionData({ elementName }).then((res) => {
    const Legend = getLegend(elementName);
    if (res.data.code === 200 && res.data.data.length > 0) {
      const { data } = res.data;
      const _index = data.length - 1;
      const _time = handleEleLegendTime(data[_index]);
      const __time = data[_index].dataTime;
      stationStore.setDefaultGridAxisTime(__time);

      if (type === "spot") {
        renderGridSpotLayer(data[_index].graphPath, elementName);

        mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: "gridSpotLayer" });
        // let _layerInfo = `${elementLabel}（融合实况，色斑图，${Legend.unit}）：${_time} BJT`;
        let _layerInfo = `${elementLabel}(${Legend.unit}) ${_time} BJT`;
        mapStore.setLayerInfo({
          mapTarget: MapTarget,
          name: "gridSpotLayer",
          layerType: "grid",
          elementsCode: elementName,
          layerInfo: _layerInfo,
          legend: Legend.colors,
        });

        stationStore.setGridSpotData(data);
      } else if (type === "value") {
        renderGridValueLayer(data[_index].graphPath);
        stationStore.setGridValueData(data);
      } else if (type === "vane") {
        renderGridWindLayer(data[_index].graphPath);
        stationStore.setGridValueData(data);
      } else if (type === "particle") {
        renderGridParticleLayer(data[_index].graphPath, elementName);
        stationStore.setGridValueData(data);
      }
    } else {
      mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: "gridSpotLayer" });
      let _layerInfo = `${elementLabel}(${Legend.unit}) 暂无数据`;
      mapStore.setLayerInfo({
        mapTarget: MapTarget,
        name: "gridSpotLayer",
        layerType: "grid",
        elementsCode: elementName,
        layerInfo: _layerInfo,
        legend: Legend.colors,
      });
    }
  });
}
function renderGridSpotLayer(url, elementName) {
  const Legend = getLegendArr(elementName);
  let _c = JSON.parse(JSON.stringify(Legend.colors));
  if (elementName === "pre") {
    _c.shift();
    _c.unshift([0, [255, 255, 255, 0]]);
  }

  let params;
  if (elementName === "wind") {
    params = {
      url,
      mode: 1, // 0：区间，1：渐变, 2：栅
      opacity: 1, // 图层透明度
      zIndex: 1, // 图层的zIndex
      colorRamp: _c, // 图例列表
      colorFilter: false, // 颜色过滤
    };

    if (gridSpotLayer) {
      gridSpotLayer.setProps(params);
    } else {
      console.log(CogUVLayer.prototype.getDataValue)

      function ie(t) {
        return Array.isArray(t);
      }
      function fo(t, r) {
        return ie(t) && t.length === 2 ? Dr(t, r, "EPSG:4326") : t;
      }
      function ca(t, r) {
        const [e, a] = t;
        return e >= r[0] && e <= r[2] && a >= r[1] && a <= r[3];
      }

      CogUVLayer.prototype.getDataValue = function (r) {
        console.log(r);
        // if (!(ie(r) && r.length === 2)) return null;
        let { data: e } = this._nextProps;
        console.log(e)
        // ie(e) && (e = e[0]);
        const a = this._map.getView().getProjection().getCode();
        let [i, n] = fo(r, a);
        i = (i % 360 + 360) % 360, this.loader.coordType === 1 && i > 180 && (i -= 360);
        const { bandData: o, resolution: s, metadata: l } = e, f = o[0].findIndex((I) => ca([i, n], I.bbox));
        if (f < 0) return null;
        const c = o[0][f], { bbox: h, raster: u, width: d } = c, _ = Math.floor((i - h[0]) / s[0]), v = Math.floor((n - h[3]) / s[1]);
        if (v * _ < 0) return null;
        const g = v * d + _;
        if (g >= u.length) return null;
        const w = [u[g], o[1][f].raster[g]];
        console.log(w,l)

        // 1. 计算风速（矢量模长）
        const windSpeed = Math.sqrt(w[0] * w[0] + w[1] * w[1]);

        // 2. 计算风向（气象学标准：风吹来的方向，方位角0°-360°）
        function calculateWindDirection(u, v) {
            // 计算初始角度（弧度）
            let rad = Math.atan2(v, w[0]);
            // 转换为角度（0°-360°）
            let deg = rad * (180 / Math.PI);
            // 调整为气象学风向（以正北为0°，顺时针递增）
            deg = 270 - deg;
            // 确保结果在0°-360°范围内
            if (deg < 0) deg += 360;
            if (deg >= 360) deg -= 360;
            return deg;
        }
        console.log(windSpeed,calculateWindDirection(w[0],w[1]))
        console.log('cme:',this.loader.getRealValue(w, l))
        // return { value: this.loader.getRealValue(w, l), unit: l.unit };
      };
      gridSpotLayer = new CogUVLayer(params);
      Map.addLayer(gridSpotLayer);

      Map.on("click", function (e) {
        // console.log(gridSpotLayer.getDataValue)
        // console.log(e.coordinate);
        const v = gridSpotLayer.getDataValue(e.coordinate);
        // console.log(v);
      });
    }
  } else {
    params = {
      name: "gridSpotLayer",
      url, // tiff文件路径
      mode: 1, // 0：区间，1：渐变, 2：栅
      opacity: 0.9, // 图层透明度
      zIndex: 3, // 图层的zIndex
      colorRamp: _c, // 图例列表
      // 图例映射方法
      legendMap: (val, meta) => (meta.unit === "K" ? val + 273 : val),
      zIndex: 5,
    };

    if (gridSpotLayer) {
      gridSpotLayer.setProps(params);
    } else {
      gridSpotLayer = new CogTiffLayer(params);
      Map.addLayer(gridSpotLayer);
    }
  }
}
function renderGridValueLayer(url) {
  const params = {
    name: "gridValueLayer",
    url,
    distance: 50,
    zIndex: 7,
  };
  if (gridValueLayer) {
    gridValueLayer.setProps(params);
  } else {
    gridValueLayer = new GridValueLayer(params);
    Map.addLayer(gridValueLayer);
  }
}
function renderGridWindLayer(url) {
  const params = {
    url: url,
    distance: 50,
    zIndex: 6,
  };
  if (gridWindLayer) {
    gridWindLayer.setProps(params);
  } else {
    gridWindLayer = new GridWindLayer(params);
    Map.addLayer(gridWindLayer);
  }
}
function renderGridParticleLayer(url, elementName) {
  const Legend = getLegendArr(elementName);
  let _c = JSON.parse(JSON.stringify(Legend.colors));
  const params = {
    url: url,
    opacity: 1,
    particleCount: 6000,
    particleSize: 2, // 粒子大小
    speed: 300, // 粒子移动速率
    useColorRamp: false, // 是否使用图例
    color: "rgb(0, 224, 255)", // 粒子颜色
    colorRamp: _c,
    zIndex: 8,
  };
  if (cogParticleLayer) {
    cogParticleLayer.setProps(params);
  } else {
    cogParticleLayer = new CogParticleLayer(params);
    Map.addLayer(cogParticleLayer);
  }
}
// 空气质量参数
function renderAQILayer(element) {
  if (aqiLayer) {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: aqiLayer.layerName });
  }
  if (element.itemContent.isActive) {
    if (!aqiLayer) {
      aqiLayer = new StationClusterLayer({ map: Map, zIndex: 7, getClusterFeature });
    } else {
      aqiLayer.removeLayer();
    }

    const _d = mapStore.mapMode === "3D" ? 60 : 40;
    aqiLayer.setDistance(_d);
    aqiLayer.init();
    loadAQILayer(element);
  } else {
    // 删除 aqiLayer
    aqiLayer.removeLayer();
  }
}
function loadAQILayer(element) {
  getDataByAirQualityParameter({ airQualityParameter: element.itemContent.code }).then(
    (res) => {
      if (res.data.code === 200 && res.data.data.length > 0) {
        let _data = JSON.parse(JSON.stringify(res.data.data));
        _data = filterInvalidData(_data);
        const Legend = getLegend(element.itemContent.elementsCode);

        aqiLayer.update(
          _data,
          "value",
          Legend,
          element.itemContent.code,
          mapStore.mapMode
        );

        let _layerInfo = "";
        const _time = handleEleLegendTime(_data[0]);
        if (Legend.unit) {
          _layerInfo = `${element.itemContent.name}(${Legend.unit}) ${_time} BJT`;
        } else {
          _layerInfo = `${element.itemContent.name} ${_time} BJT`;
        }
        mapStore.setLayerInfo({
          mapTarget: MapTarget,
          name: aqiLayer.layerName, // stationClusterLayer
          layerType: "aqi",
          elementsCode: element.itemContent.code,
          layerInfo: _layerInfo,
          legend: Legend.colors,
        });
      } else {
        // 图例中展示msg
        aqiLayer.removeLayer();
      }
    }
  );
}
// 生态监测站
function renderEcologicalLayer(element) {
  if (ecologicalStationLayer) {
    mapStore.deleteLayerInfo({
      mapTarget: MapTarget,
      name: ecologicalStationLayer.layerName,
    });
  }
  if (element.itemContent.isActive) {
    if (!ecologicalStationLayer) {
      ecologicalStationLayer = new EcologicalStationLayer(Map);
    } else {
      ecologicalStationLayer.removeLayer(
        ecologicalStationLayer && ecologicalStationLayer.layerName
      );
    }

    loadEcologicalLayer(element);
  } else {
    // 删除 ecologicalStationLayer
    ecologicalStationLayer.removeLayer(
      ecologicalStationLayer && ecologicalStationLayer.layerName
    );
  }
}
function loadEcologicalLayer(element) {
  getMonitoringStationInfoByType({ stationType: element.itemContent.code }).then(
    (res) => {
      if (res.data.code === 200 && res.data.data.length > 0) {
        let _data = JSON.parse(JSON.stringify(res.data.data));
        // _data = filterInvalidData(_data);
        const Legend = getLegend(element.itemContent.elementsCode) || { colors: [] };
        ecologicalStationLayer.init({
          data: _data,
          key: "",
          legend: Legend,
          layerName: "ecologicalStationLayer",
        });

        // let _layerInfo = '';
        // const _time = handleEleLegendTime(_data[0]);
        // if (Legend.unit) {
        //   _layerInfo = `${element.itemContent.name}(${Legend.unit}) ${_time} BJT`;
        // } else {
        //   _layerInfo = `${element.itemContent.name} ${_time} BJT`;
        // }
        // mapStore.setLayerInfo({
        //   mapTarget: MapTarget,
        //   name: aqiLayer.layerName, // stationClusterLayer
        //   layerType: 'aqi',
        //   elementsCode: element.itemContent.code,
        //   layerInfo: _layerInfo,
        //   legend: Legend.colors,
        // });
      } else {
        // 图例中展示msg
        ecologicalStationLayer.removeLayer(
          ecologicalStationLayer && ecologicalStationLayer.layerName
        );
      }
    }
  );
}
// 观测
function renderObservationLayer(element) {
  if (observationLayer) {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: observationLayer.layerName });
  }
  if (element.itemContent.isActive) {
    if (!observationLayer) {
      observationLayer = new ObservationLayer(Map);
    } else {
      observationLayer.removeLayer(layerName);
    }
    stationLayer.removeText();
    loadObservationLayer(element);
  } else {
    // 删除 observationLayer
    stationLayer.removeText();
    observationLayer.removeLayer(layerName);
  }
}
function loadObservationLayer(element) {
  getObservationAndRadiationData({ fieldName: element.itemContent.code }).then((res) => {
    if (res.data.code === 200 && res.data.data.length > 0) {
      let _data = JSON.parse(JSON.stringify(res.data.data));
      _data = filterInvalidData(_data);
      const Legend = getLegend(element.itemContent.elementsCode) || { colors: [] };
      observationLayer.init({ data: _data, key: "value", legend: Legend, layerName });

      let _layerInfo = "";
      const _time = handleEleLegendTime(_data[0]);
      if (Legend.unit) {
        _layerInfo = `${element.itemContent.name}(${Legend.unit}) ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      } else {
        _layerInfo = `${element.itemContent.name} ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      }
      mapStore.setLayerInfo({
        mapTarget: MapTarget,
        name: layerName, // stationClusterLayer
        layerType: "aqi",
        elementsCode: element.itemContent.code,
        layerInfo: _layerInfo,
        legend: Legend.colors,
      });
    } else {
      // 图例中展示msg
      observationLayer.removeLayer(layerName);
    }
  });
}
// 雷达风廓线
function renderRadarWindLayer(element) {
  if (radarWindLayer) {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: radarWindLayer.layerName });
  }
  if (element.itemContent.isActive) {
    if (!radarWindLayer) {
      radarWindLayer = new ObservationIconLayer(Map);
    } else {
      radarWindLayer.removeLayer(radarWindLayer && radarWindLayer.layerName);
    }
    loadRadarWindLayer(element);
  } else {
    // 删除 radarWindLayer
    radarWindLayer.removeLayer(radarWindLayer && radarWindLayer.layerName);
  }
}
function loadRadarWindLayer(element) {
  getWindProfilerRadarInfo().then((res) => {
    if (res.data.code === 200 && res.data.data.length > 0) {
      const data = res.data.data.map((item) => {
        return {
          ...item,
          iconUrl: "/imgs/radar/radarWind.png",
        };
      });
      let _data = JSON.parse(JSON.stringify(data));
      // _data = filterInvalidData(_data);
      const Legend = getLegend(element.itemContent.elementsCode) || { colors: [] };
      radarWindLayer.init({
        data: _data,
        layerName: "radarWindLayer",
        getClickFeature: getRadarWindFeature,
      });

      let _layerInfo = "";
      const _time = handleEleLegendTime(_data[0]);
      if (Legend.unit) {
        _layerInfo = `${element.itemContent.name}(${Legend.unit}) ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      } else {
        _layerInfo = `${element.itemContent.name} ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      }
      mapStore.setLayerInfo({
        mapTarget: MapTarget,
        name: "radarWindLayer", // stationClusterLayer
        layerType: "aqi",
        elementsCode: element.itemContent.code,
        layerInfo: _layerInfo,
        legend: Legend.colors,
      });
    } else {
      // 图例中展示msg
      radarWindLayer.removeLayer(radarWindLayer && radarWindLayer.layerName);
    }
  });
}
function getRadarWindFeature(data) {
  stationStore.setRadarWindSingleData(data);
}
// 闪电
function renderLightningLayer(element) {
  if (lightningLayer) {
    mapStore.deleteLayerInfo({ mapTarget: MapTarget, name: lightningLayer.layerName });
  }
  if (element.itemContent.isActive) {
    if (!lightningLayer) {
      lightningLayer = new ObservationIconLayer(Map);
    } else {
      lightningLayer.removeLayer(lightningLayer && lightningLayer.layerName);
    }
    loadLightningLayer(element);
  } else {
    // 删除 lightningLayer
    lightningLayer.removeLayer(lightningLayer && lightningLayer.layerName);
  }
}
function loadLightningLayer(element) {
  const params = {
    // startTime: dayjs(new Date().getTime() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH') + ':00:00',
    startTime: "2025-08-30 12:00:00",
    // endTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH') + ':00:00',
    endTime: "2025-09-02 12:00:00",
  };
  getLightningData(params).then((res) => {
    if (res.data.code === 200 && res.data.data.length > 0) {
      const data = res.data.data.map((item) => {
        return {
          ...item,
          iconUrl: getIconName(item.v73001, item.litCurrent),
        };
      });
      let _data = JSON.parse(JSON.stringify(data));
      // _data = filterInvalidData(_data);
      const Legend = getLegend(element.itemContent.elementsCode) || { colors: [] };
      lightningLayer.init({
        data: _data,
        layerName: "lightningLayer",
        getMoveFeature: getLightningFeature,
      });

      let _layerInfo = "";
      const _time = handleEleLegendTime(_data[0]);
      if (Legend.unit) {
        _layerInfo = `${element.itemContent.name}(${Legend.unit}) ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      } else {
        _layerInfo = `${element.itemContent.name} ${_time} BJT (数据来源：吉林省气象探测保障中心)`;
      }
      mapStore.setLayerInfo({
        mapTarget: MapTarget,
        name: "lightningLayer", // stationClusterLayer
        layerType: "aqi",
        elementsCode: element.itemContent.code,
        layerInfo: _layerInfo,
        legend: Legend.colors,
      });
    } else {
      // 图例中展示msg
      lightningLayer.removeLayer(lightningLayer && lightningLayer.layerName);
    }
  });
}
function getIconName(val1, val2) {
  let lighting_up = "/imgs/strongWeather/lighting_up.png";
  let lighting_land_true = "/imgs/strongWeather/lighting_land_true.png";
  let lighting_land_false = "/imgs/strongWeather/lighting_land_false.png";
  let name;

  if (val1 == 0) {
    name = lighting_up;
  } else {
    if (val2 > 0) {
      name = lighting_land_true;
    } else {
      name = lighting_land_false;
    }
  }

  return name;
}
function getLightningFeature(data) {
  if (data) {
    const arr = formatLightningSingleStationData(data);
    selectedPoint.value = arr;
    popupX.value = data.popupX;
    popupY.value = data.popupY;
  } else {
    selectedPoint.value = null;
  }
}

let titleBgColor = ref();
function getClusterFeature(params) {
  if (params) {
    getAirQualityDataByStationId({ stationId: params.stationIdC }).then((res) => {
      if (res.data && res.data.code === 200 && res.data.data.length > 0) {
        const arr = formatAQISingleStationData(res.data.data[0]);
        if (res.data.data[0].aqi) {
          const Legend = getLegend(AQIElement.itemContent.elementsCode);
          const _color = getColorFromLegend(res.data.data[0].aqi, Legend.colors);
          titleBgColor.value = _color;
        }
        selectedPoint.value = arr;
        popupX.value = params.popupX;
        popupY.value = params.popupY;
      }
    });
  } else {
    selectedPoint.value = undefined;
    titleBgColor.value = undefined;
  }
}

onMounted(async () => {
  await nextTick();
  getCityList({
    provCode: config.default.regionAdcode,
    areaCode: "NEC,JLNEC",
  }).then((res) => {
    if (res.data.data && res.data.data.length > 0) {
      stationStore.setCityListData(res.data.data);
    }
  });
});
onBeforeUnmount(() => {
  // 清除store状态
  stationStore.setIsDisplayAxisShow(false);
  stationStore.setIsGridAxisShow(false);
  stationStore.setGridSpotData([]);
  stationStore.setGridValueData([]);
  mapStore.clearLayerInfo();
  defaultFlag = true;
});
</script>
<template>
  <div class="fsg_stations_comp_wrapper">
    <div class="fsg_component_wrapper">
      <FSGStations
        :stationTypes="stationTypes"
        :cityListData="stationStore.cityListData"
        :gridMenu="gridMenu"
        :activeRegionValue="stationStore.activeRegionValue"
        :defaultSiteType="defaultSiteType"
        :defaultEle="defaultFlag ? config.default.element : ''"
        :defaultEleType="defaultFlag ? config.default.secondaryElement : ''"
        :apiShow="mapStore.activeMenuIndex !== 6"
        :defaultAQIEle="config.default.AQISecondaryElementCode"
        @onStationTypeItemClick="onStationTypeItemClick"
        @onSetThreshold="onSetThreshold"
        @onSelectRegion="onSelectRegion"
        @onHighlightRedClick="onHighlightRedClick"
        @onAQIItemClick="onAQIItemClick"
        @onEcologicalItemClick="onEcologicalItemClick"
        @onObservationItemClick="onObservationItemClick"
        @onGridMenuChange="onGridMenuChange"
      />
    </div>
    <FSGMapPopup
      v-if="selectedPoint && selectedPoint.length > 0"
      :data="selectedPoint"
      :titleBgColor="titleBgColor"
      :popupX="popupX"
      :popupY="popupY"
    />
  </div>
</template>
<style lang="scss" scoped>
@use './stations.scss';
</style>
