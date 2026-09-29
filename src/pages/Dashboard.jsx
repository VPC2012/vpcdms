import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Dashboard({ setTela }) {
  const [total, setTotal] = useState(0);
  const [abertas, setAbertas] = useState(0);
  const [encerradas, setEncerradas] = useState(0);

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    const { data, error } = await supabase
      .from("ocorrencias")
      .select("*");

    if (error) {
      alert("Erro ao carregar dashboard");
      return;
    }

    setTotal(data.length);

    setAbertas(
      data.filter(
        (x) =>
          x.status === "Aberto" ||
          x.status === "Em Análise" ||
          x.status === "Em Reparo"
      ).length
    );

    setEncerradas(
      data.filter(
        (x) =>
          x.status === "Encerrado"
      ).length
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() => setTela("admin")}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
        }}
      >
        ← Voltar
      </button>

      <h1>Dashboard VPCDMS</h1>

      <hr />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "220px",
            padding: "20px",
            background: "#f5f5f5",
            borderRadius: "10px",
          }}
        >
          <h3>Total</h3>
          <h1>{total}</h1>
        </div>

        <div
          style={{
            width: "220px",
            padding: "20px",
            background: "#fff3cd",
            borderRadius: "10px",
          }}
        >
          <h3>Em Aberto</h3>
          <h1>{abertas}</h1>
        </div>

        <div
          style={{
            width: "220px",
            padding: "20px",
            background: "#d4edda",
            borderRadius: "10px",
          }}
        >
          <h3>Encerradas</h3>
          <h1>{encerradas}</h1>
        </div>
      </div>
    </div>
  );
}