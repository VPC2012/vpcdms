import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEVeiculos({
  setTela,
  listaSelecionada,
}) {
  const [veiculos, setVeiculos] =
    useState([]);

  useEffect(() => {
    carregarVeiculos();
  }, []);

  async function carregarVeiculos() {
    const { data, error } =
      await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .select("*")
        .eq(
          "lista_id",
          listaSelecionada
        )
        .order("vaga", {
          ascending: true,
        });

    if (error) {
      alert(
        "Erro ao carregar veículos"
      );
      return;
    }

    setVeiculos(data || []);
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
          setTela("vpccqe")
        }
      >
        ← Voltar
      </button>

      <h1>
        🚗 Veículos da Lista
      </h1>

      <p>
        Quantidade:
        {" "}
        {veiculos.length}
      </p>

      <hr />

      {veiculos.map(
        (veiculo) => (
          <div
            key={veiculo.id}
            style={{
              border:
                "1px solid #ccc",
              padding: "15px",
              marginBottom:
                "10px",
              borderRadius:
                "8px",
            }}
          >
            <p>
              <strong>
                VAGA:
              </strong>{" "}
              {veiculo.vaga}
            </p>

            <p>
              <strong>
                MODELO:
              </strong>{" "}
              {veiculo.modelo}
            </p>

            <p>
              <strong>
                VIN:
              </strong>{" "}
              {veiculo.vin}
            </p>

            <p>
              <strong>
                AGING:
              </strong>{" "}
              {veiculo.aging}
            </p>
          </div>
        )
      )}
    </div>
  );
}