import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  notMenu as notMenuRoutes,
  auth as authRoutes,
  topMenu as topMenuRoutes,
  default as mainRoutes,
  epsd as epsdRoutes , 
  topMenu2 as topMenuRoutes2,
  rndNotMenu as rndNotMenuRoutes,
  sdfMenu as sdfMenuRoutes,
  sdfNotMenu as sdfNotMenuRoutes
} from "./index";
import '../components/Global.js';
import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import TopMenuLayout from "../layouts/TopMenu";
import FullMapLayout from "../layouts/FullMap";
import Page404 from "../pages/auth/Page404";
import SignIn from "../pages/auth/SignIn";
import TopMenuMigratoryBirdLayout from "../layouts/TopMenu_MigratoryBird";
import ScrollToTop from "../components/ScrollToTop";
import AuthContext from '../components/AuthContext';
import UserContext from '../components/UserContext';
import SdfMenuLayout from "../layouts/SDF";
//SessionChk 공통인수 부분인 routes.js에서 한번만 호출
import * as SessionChk from "../pages/auth/SessionChk";

//let r_key = 0;
const childRoutes = (Layout, routes) =>{
  let reurnData =  routes.map(({ children, path, isHidden, component: Component }, index) =>
  children ? (
    // Route item with children
    children.map(({ children, path, isHidden, component: Component }, index) => (
      children ? (
        childRoutes(children[index], children)
      ) : (
          isHidden ? null : (
            <Route
              key={index}
              path={path}
              isHidden={isHidden}
              exact
              render={props => (
                <Layout>
                  <Component {...props} />
                </Layout>
              )}
            />
          )
        )
    )
    )
  ) : (
      // Route item without children
      <Route
        key={index}
        path={path}
        isHidden={isHidden}
        exact
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    )
);
    return reurnData;
};

let g_route_serial = [];  
const childRoutes_serial = (Layout, routes) =>{
    routes.map(({ children, path, isHidden, component: Component }, index) =>{
    return children ? (
      // Route item with children
      children.map(({ children: children2, path, isHidden, component: Component }, index) => (
        children2 ? (
          childRoutes_serial(children2[index], children2)
        ) : (
            g_route_serial.push(children[index])
          )
      )
      )
    ) : (
        g_route_serial.push(routes[index])
      );

    });
};

const Routes = () => {
  const authContext = useContext(AuthContext);
  const user = useContext(UserContext)
  let isSignin = localStorage.getItem('isSignin');  // localStorage 가 제대로 업데이트 안되는 듯. 운영에서 자꾸 로그아웃되어 임시로 막음. 김동석 20.05.20 11:00
  //let isSignin = true;
  //계층형구조를 router를 생성하면 react_router 4에서는 3depth의 router path를 인식하지 못하여 오류 발생하므로 
  //메뉴정보(Layout)를 1차원 배열로 생성 
  childRoutes_serial(DashboardLayout, mainRoutes);
  //1차원 배열로 생성된 Layout자료를 가지고 route 배열 생성
  let mainChildRoutes = childRoutes(DashboardLayout, g_route_serial);
  let returnData = (
    <AuthContext.Consumer>
      {authContext => (
    <Router>
      <ScrollToTop>
        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        { isSignin ? (
        <Switch>
          {/* 세션체크 함수 호출 */}
          {SessionChk.chk()}
          {childRoutes(DashboardLayout, notMenuRoutes)}
          {childRoutes((DashboardLayout,TopMenuLayout),rndNotMenuRoutes)}
          {childRoutes(FullMapLayout, epsdRoutes)}
          {childRoutes(TopMenuLayout, topMenuRoutes)}
          {childRoutes(TopMenuMigratoryBirdLayout, topMenuRoutes2)}
          {/* SDF 용 layOut */}
          {childRoutes((DashboardLayout,SdfMenuLayout),sdfNotMenuRoutes)}
          {childRoutes(SdfMenuLayout, sdfMenuRoutes)}
          {/*
          {childRoutes(DashboardLayout, mainRoutes)}
          */}
          {mainChildRoutes}
          {childRoutes(AuthLayout, authRoutes)}
          <Route
            render={() => (
              <AuthLayout>
                <Page404 />
              </AuthLayout>
            )}
          />
        </Switch>
        ) : (
          <Route
            render={() => (
              <AuthLayout>
                <SignIn authContext={authContext}/>
              </AuthLayout>
            )}
          />
        )}
      </ScrollToTop>
    </Router>
    )}
    </AuthContext.Consumer>
  );
              
  return returnData;
}

export default Routes;
