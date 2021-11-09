import React from "react";
import "bootswatch/dist/cyborg/bootstrap.min.css";
import { Switch, Route, Redirect } from "react-router-dom";

import Template from "./components/Template";
import PabrikSarung from "./screens/Sarung/PabrikSarung";
import PembelianSarung from "./screens/Sarung/PembelianSarung";
import PenjahitSarung from "./screens/Sarung/PenjahitSarung";
import BiayaPenjahitan from "./screens/Sarung/BiayaPenjahitan";
import PranggokSarung from "./screens/Sarung/PranggokSarung";
import BiayaPranggok from "./screens/Sarung/BiayaPranggok";
import PenjualanSarung from "./screens/Sarung/PenjualanSarung";
import DashboardSarung from "./screens/Sarung/DashboardSarung";
import User from "./screens/User";
import Login from "./screens/Login";
import { useLogin } from "./hooks/loginHooks";
import PembeliBatik from "./screens/Batik/PembeliBatik";
import PenjualanBatik from "./screens/Batik/PenjualanBatik";

const App = () => {
  const State = useLogin();

  return (
    <Switch>
      {/* {!State.isLogin && (
        <Route path="/" exact>
          <Login state={State} />
        </Route>
      )} */}

      <Template>
        <Route path="/admin/pembelian-sarung/pabrik-sarung">
          <PabrikSarung />
        </Route>
        <Route path="/admin/pembelian-sarung/pembelian">
          <PembelianSarung />
        </Route>
        <Route path="/admin/jahitan-sarung/penjahit">
          <PenjahitSarung />
        </Route>
        <Route path="/admin/jahitan-sarung/jahitan">
          <BiayaPenjahitan />
        </Route>
        <Route path="/admin/pranggok/pranggok-sarung">
          <PranggokSarung />
        </Route>
        <Route path="/admin/pranggok/biaya-pranggok">
          <BiayaPranggok />
        </Route>
        <Route path="/admin/penjualan-sarung">
          <PenjualanSarung />
        </Route>
        <Route path="/admin/dashboard-sarung">
          <DashboardSarung />
        </Route>
        {/* ROUTE BATIK */}
        <Route path="/admin/penjualan-batik/pembeli">
          <PembeliBatik />
        </Route>
        <Route path="/admin/penjualan-batik/penjualan">
          <PenjualanBatik />
        </Route>
        <Route path="/admin/user">
          <User />
        </Route>
      </Template>
    </Switch>
  );
};

export default App;
