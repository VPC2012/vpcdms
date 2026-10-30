import { useState } from "react";
import patio from "../assets/patio-oficial.jpg";

export default function Login({
  setTela,
}) {
  const [senha, setSenha] =
    useState("");

  const entrar = () => {

    if (
      senha === "op2026"
    ) {

      localStorage.setItem(
  "perfil",
  "operacao"
);

localStorage.setItem(
  "telaAtual",
  "portal"
);

setTela("portal");
return;
      return;
    }

    if (
      senha === "admin2026"
    ) {

     localStorage.setItem(
  "perfil",
  "admin"
);

localStorage.setItem(
  "telaAtual",
  "portal"
);

setTela("portal");
return;
      return;
    }

    alert(
      "Senha inválida"
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#f4f4f4",
        fontFamily:
          "Arial, sans-serif",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "150px",
            overflow: "hidden",
            borderRadius: "20px",
            backgroundColor:
              "#ffffff",
            marginBottom:
              "25px",
          }}
        >
          <img
            src={patio}
            alt="Pátio Hyundai"
            style={{
              position:
                "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit:
                "cover",
              opacity: 0.10,
            }}
          />

          <div
            style={{
              position:
                "relative",
              zIndex: 2,
              display: "flex",
              flexDirection:
                "column",
              justifyContent:
                "center",
              alignItems:
                "center",
              height: "100%",
            }}
          >
            <h1
              style={{
                color:
                  "#002C5F",
                fontSize:
                  "38px",
                marginBottom:
                  "10px",
              }}
            >
              HYUNDAI
            </h1>

            <h2
              style={{
                margin: 0,
              }}
            >
              Vehicle Processing Center
            </h2>

            <p
              style={{
                color: "#666",
                marginTop:
                  "10px",
              }}
            >
              Plataforma Operacional
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor:
              "#ffffff",
            borderRadius:
              "20px",
            padding: "30px",
            boxShadow:
              "0 6px 15px rgba(0,0,0,0.10)",
          }}
        >
          <h2
            style={{
              color:
                "#002C5F",
              marginTop: 0,
              marginBottom:
                "20px",
            }}
          >
            Acesso ao Sistema
          </h2>

          <input
  type="text"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                entrar();
              }
            }}
            style={{
              width: "100%",
              height: "50px",
              padding:
                "0 15px",
              border:
                "1px solid #ccc",
              borderRadius:
                "10px",
              fontSize:
                "16px",
              boxSizing:
                "border-box",
            }}
          />

          <button
            onClick={entrar}
            style={{
              width: "100%",
              height: "50px",
              marginTop:
                "15px",
              border: "none",
              borderRadius:
                "10px",
              backgroundColor:
                "#002C5F",
              color: "#fff",
              fontSize:
                "16px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}