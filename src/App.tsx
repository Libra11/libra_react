/**
 * Author: Libra
 * Date: 2023-12-05 11:11:14
 * LastEditors: Libra
 * Description:
 */
import Router from "./router";
import { Card, ConfigProvider, Layout, theme } from "antd";
import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsDark } from "./store/system";
import { store } from "./store";
import SvgIcon from "./components/Svg";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./style/transition.css";

function App() {
  return (
    <div className=" w-screen h-screen bg-[var(--bg-color)] font-['montserrat']">
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    </div>
  );
}
function MyComponent() {
  const location = useLocation();
  const [myTheme, setMyTheme] = useState({
    algorithm: theme.defaultAlgorithm,
  });
  const dispatch = useDispatch();
  const isDark = store.getState().system.isDark;
  const changeTheme = () => {
    const isDarkTheme = myTheme.algorithm === theme.darkAlgorithm;

    dispatch(setIsDark(isDarkTheme ? "false" : "true"));
    isDarkTheme ? switchLightColor() : switchDarkColor();
    setMyTheme({
      algorithm: isDarkTheme ? theme.defaultAlgorithm : theme.darkAlgorithm,
    });
  };

  useEffect(() => {
    console.log("App");
    if (isDark) {
      switchDarkColor();
      setMyTheme({ algorithm: theme.darkAlgorithm });
    } else {
      switchLightColor();
      setMyTheme({ algorithm: theme.defaultAlgorithm });
    }
  }, []);
  const dark = useSelector((state: any) => state.system.isDark);
  const switchDarkColor = () => {
    const el = document.documentElement;
    el.style.setProperty("--primary-color", "#896ef2");
    el.style.setProperty("--primary-color-20", "rgba(137,110,242,0.2)");
    el.style.setProperty("--main-color", "#fff");
    el.style.setProperty("--main-color-10", "rgba(255,255,255,0.1)");
    el.style.setProperty("--bg-color", "#1D1B22");
    el.style.setProperty("--text-color1", "#bebebe");
    el.style.setProperty("--text-color2", "#969696");
    el.style.setProperty("--card-border", "#2c2c2c");
  };

  const switchLightColor = () => {
    const el = document.documentElement;
    el.style.setProperty("--primary-color", "#896ef2");
    el.style.setProperty("--primary-color-20", "rgba(137,110,242,0.2)");
    el.style.setProperty("--main-color", "#000");
    el.style.setProperty("--main-color-10", "rgba(0,0,0,0.1)");
    el.style.setProperty("--bg-color", "#fff");
    el.style.setProperty("--text-color1", "#3a3a3a");
    el.style.setProperty("--text-color2", "#666666");
    el.style.setProperty("--card-border", "#e0e0e0");
  };

  const fallbackRender = ({ error }: FallbackProps) => {
    return (
      <Layout
        role="alert"
        className="w-screen h-screen flex items-center justify-center"
      >
        <Card
          title="Something went wrong:"
          bordered={false}
          style={{ width: 300 }}
        >
          <p style={{ color: "red" }}>{error.toString()}</p>
        </Card>
      </Layout>
    );
  };

  return (
    <ConfigProvider
      theme={{
        ...myTheme,
        token: {
          colorPrimary: "#896ef2",
        },
      }}
    >
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <ErrorBoundary fallbackRender={fallbackRender} onReset={() => {}}>
            <div className=" w-screen  font-['montserrat']">
              <Router />
            </div>
          </ErrorBoundary>
        </CSSTransition>
      </TransitionGroup>
      <div
        onClick={changeTheme}
        className="fixed right-12 bottom-8 w-12 h-12 flex justify-center items-center rounded-full bg-[var(--bg-color)] shadow-md cursor-pointer hover:shadow-xl border border-[var(--card-border)]"
      >
        <SvgIcon name={dark ? "Sun" : "moon"} size={20} />
      </div>
    </ConfigProvider>
  );
}

export default App;
