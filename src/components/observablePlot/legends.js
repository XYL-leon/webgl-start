
//风
export const WindLegend = {
  name: "风",
  label: "风速",
  unit: "m/s",
  colors: [
    [0, "rgb(98, 113, 184)"],
    [1.5, "rgb(61, 110, 163)"],
    [3, "rgb(74, 148, 170)"],
    [4, "rgb(74, 146, 148)"],
    [5, "rgb(77, 143, 124)"],
    [7.5, "rgb(76, 164, 76)"],
    [10, "rgb(104, 164, 55)"],
    [12.5, "rgb(160, 133, 64)"],
    [15, "rgb(163, 110, 92)"],
    [17.5, "rgb(141, 63, 92)"],
    [20, "rgb(150, 74, 144)"],
    [25, "rgb(96, 101, 159)"],
    [30, "rgb(90, 135, 160)"],
  ],
}

//温度
export const TempLegend = {
  name: "温度",
  label: "温度",
  unit: "℃",
  colors: [
    [-36, "rgb(117,26,120)"],
    [-32, "rgb(11,49,129)"],
    [-28, "rgb(44,93,161)"],
    [-24, "rgb(56,118,204)"],
    [-20, "rgb(87,160,234)"],
    [-16, "rgb(138,206,251)"],
    [-12, "rgb(175,253,244)"],
    [-8, "rgb(201,248,254)"],
    [-4, "rgb(245,255,255)"],
    [0, "rgb(229,254,220)"],
    [4, "rgb(208,253,190)"],
    [8, "rgb(201,251,146)"],
    [12, "rgb(253,253,168)"],
    [16, "rgb(253,243,201)"],
    [20, "rgb(250,221,175)"],
    [24, "rgb(244,178,127)"],
    [28, "rgb(238,141,136)"],
    [32, "rgb(220,101,100)"],
    [35, "rgb(236,72,63)"],
    [37, "rgb(185,38,26)"],
    [40, "rgb(142,58,22)"],
  ],
};

//降水
export const PreLegend = {
  name: "降水",
  label: "降水量",
  unit: "mm",
  colors: [
    [0, "rgb(255,255,255)"],
    // [1, "rgb(167,242,137)"],
    [0.1, "rgb(167,242,137)"],
    [10, "rgb(60,186,60)"],
    [25, "rgb(96,184,255)"],
    [50, "rgb(0,0,255)"],
    [100, "rgb(249,1,247)"],
    [200, "rgb(129,0,64)"],
  ],
};

//能见度
export const VisLegend = {
  name: "能见度",
  label: "能见度",
  unit: "km",
  colors: [
    [0.8, "rgb(164, 89, 164)"],
    [2.7, "rgb(168, 86, 86)"],
    [6, "rgb(89, 99, 164)"],
    [16, "rgb(70, 180, 74)"],
  ],
};
// 相对湿度
export const RhuLegend = {
  name: "相对湿度",
  label: "相对湿度",
  unit: "%",
  colors: [
    [0, "rgb(173, 85, 56)"],
    [30, "rgb(173, 110, 56)"],
    [40, "rgb(173, 146, 56)"],
    [50, "rgb(105, 173, 56)"],
    [60, "rgb(56, 173, 121)"],
    [70, "rgb(56, 174, 173)"],
    [75, "rgb(56, 160, 173)"],
    [80, "rgb(56, 157, 173)"],
    [83, "rgb(56, 148, 173)"],
    [87, "rgb(56, 135, 173)"],
    [90, "rgb(56, 132, 173)"],
    [93, "rgb(56, 123, 173)"],
    [97, "rgb(56, 98, 157)"],
    [100, "rgb(56, 70, 114)"],
  ],
};
export const PrsLegend = {
  name: "气压",
  label: "气压",
  unit: 'hPa',
  colors: [
    [990, 'rgb(0, 117, 147)'],
    [1000, 'rgb(72, 154, 152)'],
    [1010, 'rgb(178, 176, 157)'],
    [1020, 'rgb(167, 142, 99)'],
    [1030, 'rgb(160, 82, 44)'],
  ],
};

// 云量
export const CloudCoverLegend = {
  name: "云量",
  label: "云量",
  unit: "%",
  colors: [
    [0, "rgb(174, 86, 58)"],
    [30, "rgb(174, 111, 59)"],
    [50, "rgb(104, 172, 61)"],
    [80, "rgb(53, 156, 172)"],
    [90, "rgb(54, 132, 172)"],
    [100, "rgb(56, 70, 113)"],
  ],
};

// 海平面气压
export const SeaLevelLegend = {
  name: "海平面气压",
  label: "海平面气压",
  unit: "hPa",
  colors: [
    [990, "rgb(0, 117, 147)"],
    [1000, "rgb(72, 154, 152)"],
    [1010, "rgb(178, 176, 157)"],
    [1020, "rgb(167, 142, 99)"],
    [1030, "rgb(160, 82, 44)"],
  ],
};

//降雪
export const SnowibilityLegend = {
  name: "降雪",
  label: "降雪",
  unit: "mm",
  colors: [
    [5, "rgb(173, 216, 230)"],
    [20, "rgb(0, 0, 255)"],
    [50, "rgb(0, 0, 139)"],
    [100, "rgb(0, 128, 0)"]
  ],
};


/**
 * 雷达
 * */
export const CrefLegend = {
  name: "雷达",
  label: "组合反射率",
  unit: "dBz",
  colors: [
    [10, "rgb(0, 161, 247)"],
    [15, "rgb(0, 236, 236)"],
    [20, "rgb(0, 216, 24)"],
    [25, "rgb(0, 144, 12)"],
    [30, "rgb(254, 254, 31)"],
    [35, "rgb(230, 192, 20)"],
    [40, "rgb(254, 144, 13)"],
    [45, "rgb(254, 3, 2)"],
    [50, "rgb(214, 2, 1)"],
    [55, "rgb(192, 1, 1)"],
    [60, "rgb(255, 16, 239)"],
    [65, "rgb(151, 8, 179)"],
    [70, "rgb(173, 145, 239)"],
  ],
  dataSource: '天擎实况：http://idata.cma/art/#/home/default',
}
export const VilLegend = {
  name: "雷达",
  label: "垂直累积液态水",
  unit: "",
  // colors: [
  //   [0, 'rgb(156, 156, 156)'],
  //   [1, 'rgb(118, 118, 118)'],
  //   [5, 'rgb(250, 170, 170)'],
  //   [10, 'rgb(238, 140, 140)'],
  //   [15, 'rgb(201, 112, 112)'],
  //   [20, 'rgb(0, 251, 144)'],
  //   [30, 'rgb(0, 187, 0)'],
  //   [40, 'rgb(255, 255, 112)'],
  //   [50, 'rgb(208, 208, 96)'],
  //   [60, 'rgb(255, 96, 96)'],
  //   [70, 'rgb(218, 0, 0)'],
  //   [80, 'rgb(174, 0, 0)'],
  //   [90, 'rgb(0, 0, 255)'],
  //   [100, 'rgb(231, 0, 255)'],
  // ],
  // dataSource: '天擎实况：http://idata.cma/art/#/home/default',
}
// 回顶波高产品
export const EtLegend = {
  name: "雷达",
  label: "回顶波高产品",
  unit: "",
  // colors: [
  //   [0, 'rgb(0, 172, 164)'],
  //   [2, 'rgb(118, 118, 118)'],
  //   [3, 'rgb(0, 224, 255)'],
  //   [5, 'rgb(0, 176, 255)'],
  //   [8, 'rgb(0, 144, 204)'],
  //   [9, 'rgb(50, 0, 150)'],
  //   [11, 'rgb(0, 251, 144)'],
  //   [12, 'rgb(0, 187, 0)'],
  //   [14, 'rgb(0, 239, 0)'],
  //   [15, 'rgb(254, 191, 0)'],
  //   [16, 'rgb(255, 255, 0)'],
  //   [17, 'rgb(174, 0, 0)'],
  //   [18, 'rgb(255, 0, 0)'],
  //   [20, 'rgb(231, 0, 255)'],
  // ],
  // dataSource: '天擎实况：http://idata.cma/art/#/home/default',
}
/**
 * 卫星
 * */
export const LightLegend = {
  name: "卫星云图",
  label: "可见光",
  unit: "",
  colors: [
    [3, "rgb(8,8,8)"],
    [8, "rgb(18, 18, 18)"],
    [20, "rgb(40, 40, 40)"],
    [33, "rgb(67, 67, 67)"],
    [54, "rgb(98, 98, 98)"],
    [76, "rgb(133, 133, 133)"],
    [105, "rgb(182, 182, 182)"],
    [135, "rgb(244, 244, 244)"],
  ],
};

export const InfraredLegend = {
  name: "卫星云图",
  label: "红外增强",
  unit: "",
  colors: [],
};
export const trueColorLegend = {
  name: "卫星云图",
  label: "真彩云图",
  unit: "",
  colors: [],
}
export const steamLegend = {
  name: "卫星云图",
  label: "水汽",
  unit: "",
  colors: [],
}

export const ghLegend = {
  name: '高度',
  label: '等值线',
  unit: '',
  colors: []
}

export const LEGEND = {
  wind: WindLegend,
  pre: PreLegend,
  temp: TempLegend,
  vis: VisLegend,
  prs: PrsLegend,
  rhu: RhuLegend,
  mxt: TempLegend, // 最高气温?
  mnt: TempLegend, // 最低气温?
  etc: CloudCoverLegend, // 云量?
  ssp: SeaLevelLegend,
  tosn: SnowibilityLegend,
  tpe: PreLegend,
  // 雷达
  cref: CrefLegend,
  vil: VilLegend,
  et: EtLegend,
  // 卫星
  light: LightLegend,
  infrared: InfraredLegend,
  true_color: trueColorLegend,
  steam: steamLegend,
  gh: ghLegend,
  // 空气质量
}
export function getLegend(ele) {
  let Legend;
  if (ele && LEGEND[ele]) {
    Legend = LEGEND[ele];
  }
  return Legend;
}

// 将颜色值字符串转换成数组（适配CME）eg:[3, "rgb(8,8,8,1)"] => [3,[8,8,8,1]],
export function getLegendArr(ele) {
  const Legend = getLegend(ele);
  let colorsArr = [];
  if (Legend && Legend.colors) {
    Legend.colors.map(color => {
      let a = color[1].split('(')[1].split(')')[0].split(',');
      a.map(v => +v);
      colorsArr.push([color[0], a]);
    })
  }
  return { ...Legend, colors: colorsArr, originColors: Legend.colors };
}

// 获取数值对应图例中的颜色值
export function getColorFromLegend(val, colors) {
  const invalidValue = 999999;
  if (val === invalidValue || !val)
    return {
      rgb: "rgb(169,169,169)",
      rgba: "rgba(169,169,169,.2)",
    };
  const _len = colors.length;
  let _color = undefined;
  if (val < colors[0][0]) {
    _color = colors[0][1];
  } else if (val > colors[colors.length - 1][0]) {
    _color = colors[colors.length - 1][1];
  } else {
    for (let i = 1; i < _len; i++) {
      if (val >= colors[i - 1][0] && val < colors[i][0]) {
        _color = colors[i - 1][1];
      }
    }
  }
  let rgba;
  let _arr = _color.split('(')[1].split(')')[0].split(',');
  if (_arr.length === 4) { // _color = rgba
    rgba = _color;
  } else { // _color = rgb
    rgba = _color.replace(")", ",.2)")
  }
  return {
    rgb: _color,
    rgba,
  };
}