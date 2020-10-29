import async from "../components/Async";
// Landing
import Landing from "../pages/landing/Landing";
// Auth
import SignOut from "../pages/auth/SignOut";
import SignIn from "../pages/auth/SignIn";
import { Children } from "react";
import { map } from "leaflet";
// Icons
var BookOpenIcon = require('react-feather/dist/icons/book-open').default;
var CheckSquareIcon = require('react-feather/dist/icons/check-square').default;
var GridIcon = require('react-feather/dist/icons/grid').default;
var HeartIcon = require('react-feather/dist/icons/heart').default;
var LayoutIcon = require('react-feather/dist/icons/layout').default;
var ListIcon = require('react-feather/dist/icons/list').default;
var MapPinIcon = require('react-feather/dist/icons/map-pin').default;
var MonitorIcon = require('react-feather/dist/icons/monitor').default;
var PieChartIcon = require('react-feather/dist/icons/pie-chart').default;
var SlidersIcon = require('react-feather/dist/icons/sliders').default;
var ActivityIcon = require('react-feather/dist/icons/activity').default;
var UsersIcon = require('react-feather/dist/icons/users').default;
var CalendarIcon = require('react-feather/dist/icons/calendar').default;
var BarChart2Icon = require('react-feather/dist/icons/bar-chart-2').default;
var BarChartIcon = require('react-feather/dist/icons/bar-chart').default;
var FilterIcon = require('react-feather/dist/icons/filter').default;

// All routes
let defaultRoutes = [];

// Dashboard specific routes
let dashboard2 = [];

// Dashboards
const Default = async(() => import("../pages/dashboards/Default"));
const Analytics = async(() => import("../pages/dashboards/Analytics"));
const Ecommerce = async(() => import("../pages/dashboards/Ecommerce"));
const Crypto = async(() => import("../pages/dashboards/Crypto"));
const Social = async(() => import("../pages/dashboards/Social"));

// Forms
const Layouts = async(() => import("../pages/forms/Layouts"));
const BasicElements = async(() => import("../pages/forms/BasicElements"));
const AdvancedElements = async(() => import("../pages/forms/AdvancedElements"));
const InputGroups = async(() => import("../pages/forms/InputGroups"));
const Editors = async(() => import("../pages/forms/Editors"));
const Validation = async(() => import("../pages/forms/Validation"));
const Wizard = async(() => import("../pages/forms/Wizard"));

// 해외 질병 발생 정보
const OieHpaiOverview = async(() => import("../pages/oie/hpai/OieHpaiOverview"));
const OieHpaiDatatable = async(() =>import("../pages/oie/OieDataTable"));
const OieAsfOverview = async(() => import("../pages/oie/asf/OieAsfOverview"));

const OieAsfDatatable = async(() => import("../pages/oie/OieDataTable"));
const OieFmdOverview = async(() => import("../pages/oie/fmd/OieFmdOverview"));
const OieFmdDatatable = async(() => import("../pages/oie/OieDataTable"));
//const OieFmdDatatable = async(() => import("../pages/oie/fmd/OieFmdDatatable"));
//  각종 공통 "자세히 보기"
const BeforeYeardetailView = async(() =>import("../pages/oie/BeforeYeardetailView"));
const UnitTypeserotypeDetailView = async(() =>import("../pages/oie/UnitTypeserotypeDetailView"));
const AsiaDetailView = async(() => import("../pages/oie/AsiaDetailView"));
const ContinentMonthDetailView = async(() =>import("../pages/oie/ContinentMonthDetailView"));
const UnitTypeDetailView = async(() =>import("../pages/oie/UnitTypeDetailView"));
const SerotypeDetailView = async(() =>import("../pages/oie/SerotypeDetailView"));
const YearMonthContrastDetailView = async(() =>import("../pages/oie/YearMonthContrastDetailView"));

// ASF 전용 "자세히 보기"
const ContinentSpeciesDetailView = async(() =>import("../pages/oie/asf/ContinentSpeciesDetailView"));
const AsfContryDetailView = async(() =>import("../pages/oie/asf/AsfContryDetailView"));
const OieTypeDetailView = async(() =>import("../pages/oie/asf/OieTypeDetailView"));
const PlaceTypeDetailView = async(() =>import("../pages/oie/asf/PlaceTypeDetailView"));
// FMD 전용 "자세히 보기"
const ContinentFmdSerotypeDetailView = async(() =>import("../pages/oie/fmd/ContinentSerotypeDetailView")); 
// 대륙별 항원별 발생건수
const FmdPlaceAndAntigenDtlView = async(() =>import("../pages/oie/fmd/detail/FmdPlaceAndAntigenDtlView"));
// 장소별 항원별
const FmdAsiaDtlView = async(() =>import("../pages/oie/fmd/detail/FmdAsiaDtlView"));
// HPAI 전용 "자세히 보기"
const ContinentHpaiSerotypeDetailView = async(() =>import("../pages/oie/hpai/ContinentSerotypeDetailView"));
// 대륙별 항원별 발생건수
const HpaiPlaceAndAntigenDtlView = async(() =>import("../pages/oie/hpai/detail/HpaiPlaceAndAntigenDtlView")); 
// 장소별 항원별
const HpaiAsiaDtlView = async(() =>import("../pages/oie/hpai/detail/HpaiAsiaDtlView"));
// 아시아 국가 발생 현황
// 국내 질병 발생 정보
// AI항원 검출 현황
const K_diseaseAi = async(() => import("../pages/k_disease/Ai"));

// 조류 정보
// 야생 조류 센서스
const BirdSensor = async(() => import("../pages/birdinfo/BirdSensor"));
// 국내 이동 정보
const InKoreaMoveInfo = async(() =>import("../pages/birdinfo/InKoreaMoveInfo"));
// 해외 이동 정보
const OutKoreaMoveInfo = async(() =>import("../pages/birdinfo/OutKoreaMoveInfo"));
const BirdinfoDetailview = async(() =>import("../pages/birdinfo/BirdinfoDetailview"));

// 축산시설
const Livestock = async(() => import("../pages/facility/Livestock"));

// 기타
// 외국인
const Foreigner = async(() => import("../pages/etc/Foreigner"));

//데이터 마트
const Management = async(() => import("../pages/dataMart/Management"));
const Enrollment = async(() => import("../pages/dataMart/Enrollment"));
const DetailedInquiry = async(() => import("../pages/dataMart/DetailedInquiry"));
const HistoryDetails  = async(() => import("../pages/dataMart/HistoryDetails"));
const PublicManagement  = async(() => import("../pages/dataMart/PublicManagement"));

// EPSD
// EpiSignal Detection
const Epsd = async(() => import("../pages/epsd/Epsd"));

//분석모델
//BRT analysis step1
const BrtAnalysis = async(() => import("../pages/brt/BrtAnalysis"));
//BRT analysisResult step2
const BrtAnalysisResult = async(() => import("../pages/brt/BrtAnalysisResult"));
//BRT areaanalysis step3
const BrtAreaAnalysis = async(() => import("../pages/brt/BrtDetailAnalysis"));

//LR 
const LrAnalysis = async(() => import("../pages/lr/LrAnalysis"));
//LR 상세보기 
const LrDetailAnalysis = async(() => import("../pages/lr/LrDetailAnalysis"));
//GWPR 
const GwprAnalysis = async(() => import("../pages/gwpr/GwprAnalysis"));
//GWPR 상세보기 
const GwprDetailAnalysis = async(() => import("../pages/gwpr/GwprDetailAnalysis"));

// Tables
const BootstrapTables = async(() => import("../pages/tables/Bootstrap"));
const AdvancedTables1 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables2 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables3 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables4 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables5 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables6 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables7 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables8 = async(() => import("../pages/tables/Advanced"));
const AdvancedTables9 = async(() => import("../pages/tables/Advanced"));
const DownloadBox = async(() => import("../pages/tables/DownloadBox"));

// Charts
const Chartjs = async(() => import("../pages/charts/Chartjs"));
const ApexCharts = async(() => import("../pages/charts/ApexCharts"));

// Icons
const FontAwesome = async(() => import("../pages/icons/FontAwesome"));
const Feather = async(() => import("../pages/icons/Feather"));

// Calendar
const Calendar = async(() => import("../pages/calendar/Calendar"));

// Maps
const VectorMaps = async(() => import("../pages/maps/VectorMaps"));
const GoogleMaps = async(() => import("../pages/maps/GoogleMaps"));

// DynamicsMaps
/* const DynamicsMaps = async(() => import("../pages/dynamicsMap/DynamicsMap")); */
// DynamicsMapContents && 철새 appbird
const DynamicsMapContents = async(() => import("../pages/dynamicsMap/DynamicsMapContents"));

//방역지대 
const EpidZone = async(() => import("../pages/dynamicsMap/EpidZone"));

// SDF
const SDF = async(() => import("../pages/sdf/sdfLayout"));

//   root경로(/) 용
let notMenuRoutes = [{
  path: "/",
  name: "Landing Page",
  component: Landing,
  children: null
}];

const authRoutes = {
  path: "/auth",
  name: "Auth",
  icon: UsersIcon,
  badgeColor: "secondary",
  //badgeText: "12/24",
  children: [
    {
      path: "/auth/sign-in",
      name: "로그인",
      component: SignIn
    },
    {
      path: "/auth/sign-out",
      name: "로그아웃",
      component: SignOut
    }
  ]
};

// 분석모델
let epsdRoutes = [];
// 역학지도
let topMenuRoutes = [];
// 철새 역학지도 (비오지노키)
let topMenuRoutes2 = [];

//rnd notMenu이고 topMenu가 다른 것.
let rndNotMenuRoutes = [];
let sdfMenuRoutes = [];
let sdfNotMenuRoutes = [];
//sdf
/* const sdfMenuRoutes = {
  path: "/sdfMenu",
  name: "역학지도",
  //header: "Main",
  icon: MapPinIcon,
  containsHome: true,
  children: [
    {
      path: "/sdfMenu/sdf",
      name: "해외질병감시 시스템",
      component: SDF
    },
  ]
}; */

// localStorage 저장된 메뉴 목록 불러오기
let menuList = JSON.parse(localStorage.getItem('menuList'));
//API는 3가지 사이트로 구성되어 있다. 초기 munuList 는 총 3개의 사이트 이며, menuList의 children은 각 사이트이고, menuList.children.children이 사이트 메뉴들임.
//var root = {"menu_nm":"VIRTUAL ROOT", "children":menuList};

function filterMenu(menu, filtered) {
  if(!menu.children) return false;

  let menuList = menu.children;
  for (let i = 0; i < menuList.length; i++) {
    // 메뉴 정보 복사
    let tempMenu = {};
    // loop돌면서 헤더세팅(앞 형제 node의 값과 다를 경우만)
    if(menuList[i].headerNm) {
      if(i == 0 || menuList[i-1].headerNm != menuList[i].headerNm) {
        tempMenu.header = menuList[i].headerNm
      }
    }
    if(menuList[i].path) tempMenu.path = menuList[i].url;
    if(menuList[i].menuNm) tempMenu.name = menuList[i].menuNm;
    if(menuList[i].iconNm) tempMenu.icon = eval(menuList[i].iconNm);
    if(menuList[i].containsHome == 'Y') tempMenu.containsHome = true;
    if(menuList[i].topMenu) tempMenu.topMenu = menuList[i].topMenu;
    if(menuList[i].isMenu) tempMenu.isMenu = menuList[i].isMenu;
    if(menuList[i].path) tempMenu.path = menuList[i].path;
    if(menuList[i].component != 'dir'){
      if(menuList[i].component) tempMenu.component = eval(menuList[i].component);    
    } else {
      if(menuList[i].component) delete menuList[i].component;    
    }
    //defaultRoutes 에 넣기 위한 filter
    filtered.children.push(tempMenu);
    
    //철새 layout(좌측 사이드바 보이지 않고, topmenu는 new layout(기존 topmenu와 다르다.))
    if(menuList[i].topMenu == 'appBird' && menuList[i].isMenu =='N'){
      topMenuRoutes2.push(tempMenu)
    }  
    
    //RND notMenu이고 TopMenu일때 
    if((menuList[i].menuNo >= '4000000' && menuList[i].menuNo <'5000000') && (menuList[i].isMenu =='N')){
      rndNotMenuRoutes.push(tempMenu)
    }
    // 메뉴가 아니라면
    //menuList[i].menuNm != '철새' --> bird, qz,cdr 일 경우에 좌측메뉴는 보이지 않아야함.
    if((menuList[i].isMenu == 'N' && menuList[i].menuNm != '철새' && menuList[i].topMenu != "sdf")   && (menuList[i].menuNo < '4000000' && menuList[i].menuNo >='5000000') ){
      notMenuRoutes.push(tempMenu)
    } 

    // topmenu 라면
    if(menuList[i].topMenu != '' && menuList[i].topMenu != null && menuList[i].topMenu != 'appBird' && menuList[i].topMenu != 'sdf'){
      topMenuRoutes.push(tempMenu)
    }
    //SDF Lay out
    if(menuList[i].topMenu == "sdf" && menuList[i].isMenu == 'N'){
      sdfNotMenuRoutes.push(tempMenu)
    }
    if(menuList[i].topMenu == "sdf" && menuList[i].isMenu != 'N'){
      sdfMenuRoutes.push(tempMenu)
    }

    //children에 값이 있으면 return 하여 자식으로 내려가 search 한다. 
    if(menuList[i].children !== null && menuList[i].children.length > 0) {
      tempMenu.children = [];
      filterMenu(menuList[i], tempMenu);   
    }//재귀 if문 종료. 재귀 if문을 타지 않으면 for문을 돈다.; 
  }//for문 종료.
  return false;
}//function 종료.

if(menuList !== null && menuList !== '') {
  var filtered = {"children" : []}
  filterMenu(menuList, filtered);
  defaultRoutes = filtered.children;
  //console.log("defaultRoutes",JSON.stringify(defaultRoutes,null,2))
  //console.log("notMenuRoutes",notMenuRoutes)  
  //console.log("topMenuRoutes",topMenuRoutes)
  //console.log("rndNotMenuRoutes",rndNotMenuRoutes)
};
// top menu 가 바뀌고,not menu 인것. app/bird 
export const topMenu2 = topMenuRoutes2;

// rnd not MenuRote & topLayout (layOut이 두개이다.)
export const rndNotMenu = rndNotMenuRoutes;

// top menu가 있는 레이아웃용 specific routes
export const topMenu = topMenuRoutes;

// Auth specific routes
export const auth = [authRoutes];

// Auth specific routes
export const epsd = epsdRoutes;

// 메뉴에는 없는 각종 링크 routes 하지만 dash board layout을 사용
export const notMenu = notMenuRoutes;

// sdf specific routes
export const sdfMenu = sdfMenuRoutes;
//sdf not Menu
export const sdfNotMenu = sdfNotMenuRoutes;

// All routes
export default defaultRoutes;