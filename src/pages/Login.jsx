import { useState } from "react";

export default function Login({
  setTela,
}) {
  const [senha, setSenha] =
    useState("");

  const entrar = () => {
    if (
      senha === "operacao2026"
    ) {
      setTela("operacao");
      return;
    }

    if (
      senha === "admin2026"
    ) {
      setTela("portal");
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
      <h1>VPC PORTAL</h1>

      <p>
        Sistema Integrado VPC
      </p>

      <input
        type="password"
        placeholder="Digite a senha"
        value={senha}
        onChange={(e) =>
          setSenha(
            e.target.value
          )
        }
        style={{
          padding: "10px",
          width: "250px",
        }}
      />

      <br />
      <br />

      <button
        onClick={entrar}
      >
        Entrar
      </button>
    </div>
  );
}