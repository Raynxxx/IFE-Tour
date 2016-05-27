/* 数据格式演示 
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

var flatColors = [
  '#1abc9c', '#2ecc71', '#3498db', '#c0392b',
  '#2c3e50', '#d35400', '#f1c40f', '#9b59b6'
];

function randomColor() {
  var i = Math.floor(Math.random() * 8);
  return flatColors[i];
}

function removeAllChild(ele) {
  while (ele.hasChildNodes()) {
    ele.removeChild(ele.lastChild);
  }
}

function getWidth(gra) {
  var week = 10;
  if (gra === 'week') {
    return week * 7;
  } else if (gra === 'month') {
    return week * 20;
  }
  return week;
}

/**
 * 渲染图表
 */
function renderChart() {
  // 清空所有节点
  var aqiChartBox = document.getElementById('aqi-chart-box');
  removeAllChild(aqiChartBox);
  
  // 渲染新的数据
  var nowChartData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var maxHeight = 300;
  for (var date in nowChartData) {
    maxHeight = nowChartData[date] > maxHeight ? nowChartData[date] : maxHeight;
    var curBar = document.createElement('div');
    curBar.style.width = getWidth(pageState.nowGraTime) + 'px';
    curBar.style.height = nowChartData[date] + 'px';
    curBar.style.backgroundColor = randomColor();
    curBar.classList.add('bar');
    curBar.setAttribute('title', date);
    aqiChartBox.appendChild(curBar);
  }
  aqiChartBox.style.height = maxHeight + 100 + 'px';
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(ele) {
  var newValue = ele.value;
  // 确定是否选项发生了变化 
  if (newValue === pageState.nowGraTime) {
    return;
  }
  
  // 设置对应数据
  pageState.nowGraTime = newValue;

  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var newCity = this.value;
  // 确定是否选项发生了变化 
  if (newCity === pageState.nowSelectCity) {
    return;
  }

  // 设置对应数据
  pageState.nowSelectCity = newCity;

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radios = document.getElementsByName('gra-time');
  for (var i = 0; i < radios.length; ++i) {
    (function(ele) {
      ele.addEventListener('click', function() {
        graTimeChange(ele);
      }, false);
    })(radios[i]);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById("city-select");
  var citys = Object.keys(aqiSourceData);
  var cityOptions = citys.map(function(city) {
    return '<option>' + city + '</option>';
  });
  
  pageState.nowSelectCity = citys[1];
  citySelect.innerHTML = cityOptions.join('');
  
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.addEventListener('change', function() {
    console.log('select change');
    citySelectChange.call(citySelect);
  }, false);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  // console.log(aqiSourceData);
  var weekData = {};
  var monthData = {};
  for (var city in aqiSourceData) {
    var curAqiSourceData = aqiSourceData[city];
    var curCityWeekData = {};
    var curCityMonthData = {};
    
    // 处理周数据, 预先定义
    var curWeek = -1, curWeekItems = 0;
    
    // 处理月数据, 预先定义
    var curMonth = -1, curMonthItems = 0;
    for (var dateStr in curAqiSourceData) {
      var curDate = new Date(dateStr);
      var curAqiValue = curAqiSourceData[dateStr];
      // 处理周数据
      if (curWeek === -1) {
        curWeek = 1;
      } else if (curDate.getDay() === 0) {
        curCityWeekData[curWeek] = Math.floor(curCityWeekData[curWeek] / curWeekItems);
        curWeekItems = 0;
        curWeek++;
      }
      curWeekItems++;
      if (!curCityWeekData.hasOwnProperty(curWeek)) {
        curCityWeekData[curWeek] = curAqiValue;
      } else {
        curCityWeekData[curWeek] += curAqiValue;
      }
      
      // 处理月数据
      if (curMonth !== -1 && curDate.getMonth() + 1 !== curMonth) {
        curCityMonthData[curMonth] = Math.floor(curCityMonthData[curMonth] / curMonthItems);
        curMonthItems = 0;
      }
      curMonth = curDate.getMonth() + 1;
      curMonthItems++;
      if (!curCityMonthData.hasOwnProperty(curMonth)) {
        curCityMonthData[curMonth] = curAqiValue;
      } else {
        curCityMonthData[curMonth] += curAqiValue;
      }
    }
    if (curWeek !== -1) {
      curCityWeekData[curWeek] = Math.floor(curCityWeekData[curWeek] / curWeekItems);
    }
    if (curMonth !== -1) {
      curCityMonthData[curMonth] = Math.floor(curCityMonthData[curMonth] / curMonthItems);
    }
    weekData[city] = curCityWeekData;
    monthData[city] = curCityMonthData;
  }
  chartData.day = aqiSourceData;
  chartData.week = weekData;
  chartData.month = monthData;
  //console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}

window.onload = init;