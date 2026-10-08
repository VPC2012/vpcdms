import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEHome({
  setTela,
  setListaSelecionada,
}) {
  const [listas, setListas] = useState([]);

  useEffect(() => {
    carregarListas();
  }, []);

  async function carregarListas() {
    const { data, error } =
      await supabase
        .from("vpccqe_listas")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (error) {
      alert(
        "Erro ao carregar listas"
      );
      return;
    }

    setListas(data || []);
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() =>
          setTela("portal")
        }
      >
        ← Voltar
      </button>

      <h1>📋 VPCCQE</h1>

      <hr />

      {listas.map((lista) => (
        <div
          key={lista.id}
          onClick={() => {
            setListaSelecionada(
              lista.id
            );

            setTela(
              "vpccqe-veiculos"
            );
          }}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          <h3>
            {lista.nome_lista}
          </h3>

          <p>
            Status:
            {" "}
            {lista.status}
          </p>
        </div>
      ))}
    </div>
  );
}
``