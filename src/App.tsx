/**
 * Author: Libra
 * Date: 2023-12-05 11:11:14
 * LastEditors: Libra
 * Description:
 */
import Router from "./router";
import { ConfigProvider, FloatButton, theme } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [myTheme, setMyTheme] = useState({
    algorithm: theme.defaultAlgorithm,
  });
  const changeTheme = () => {
    myTheme.algorithm === theme.darkAlgorithm
      ? setMyTheme({
          algorithm: theme.defaultAlgorithm,
        })
      : setMyTheme({
          algorithm: theme.darkAlgorithm,
        });
  };
  return (
    <ConfigProvider theme={myTheme}>
      <div className=" w-screen h-screen">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </div>
      <FloatButton
        onClick={changeTheme}
        icon={<QuestionCircleOutlined />}
        type="default"
        style={{ right: 94 }}
      />
    </ConfigProvider>
  );
}

export default App;
