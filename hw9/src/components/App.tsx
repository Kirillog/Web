import AppRoutes from "./Routes";
import { ConfigProvider, theme } from "antd";

const App = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <div className="container">
      <AppRoutes />
    </div>
  </ConfigProvider>
);

export default App;