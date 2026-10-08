import { useState } from "react";

import Login from "./pages/Login.jsx";
import Operacao from "./pages/Operacao.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import ConsultaOcorrencias from "./pages/ConsultaOcorrencias.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VPCCQEVeiculos from "./pages/VPCCQEVeiculos.jsx";

import Portal from "./pages/Portal.jsx";
import VPCCQEHome from "./pages/VPCCQEHome.jsx";

function App() {
  const [tela, setTela] =
    useState("login");

  if (tela === "operacao") {
    return <Operacao />;
  }

  if (tela === "consulta") {
    return (
      <ConsultaOcorrencias
        setTela={setTela}
      />
    );
  }

  if (tela === "dashboard") {
    return (
      <Dashboard
        setTela={setTela}
      />
    );
  }

  if (tela === "admin") {
    return (
      <AdminHome
        setTela={setTela}
      />
    );
  }

  if (tela === "portal") {
    return (
      <Portal
        setTela={setTela}
      />
    );
  }

  if (tela === "vpccqe") {
    return (
      <VPCCQEHome
        setTela={setTela}
      />
    );
  }

  if (tela === "vpccqe-veiculos") {
  return (
    <VPCCQEVeiculos
      setTela={setTela}
    />
  );
}
  return (
    <Login setTela={setTela} />
  );
}

export default App;