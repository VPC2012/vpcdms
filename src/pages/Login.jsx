import { useState } from "react";

export default function Login({ setTela }) {
  const [senha, setSenha] = useState("");

  const entrar = () => {
    if (senha === "operacao2026") {
      setTela("operacao");
      return;
    }

    if (senha === "admin2026") {
      setTela("admin");
      return;
    }

    alert("Senha inválida");
  };

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "100px",
        fontFamily: "Arial",
      }}
    >
      <h1>VPCDMS</h1>

      <h2>VPC Damage Management System</h2>

      <p>Sistema de Gestão de Avarias VPC</p>

      <input
        type="password"
        placeholder="Digite a senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginTop: "20px",
        }}
      />

      <br />
      <br />

      <button
        onClick={entrar}
        style={{
          padding: "12px 25px",
          cursor: "pointer",
        }}
      >
        Entrar
      </button>
    </div>
  );
}