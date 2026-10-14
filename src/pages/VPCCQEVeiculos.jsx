import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEVeiculos({
  setTela,
}) {
  const [veiculos, setVeiculos] =
    useState([]);

  useEffect(() => {
    carregarVeiculos();
  }, []);

  async function carregarVeiculos() {
    const listaId =
      localStorage.getItem(
        "listaSelecionada"
      );

    const { data, error } =
      await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .select("*")
        .eq(
          "lista_id",
          listaId
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
            onClick={() => {
              localStorage.setItem(
                "vinSelecionado",
                veiculo.vin
              );

              localStorage.setItem(
                "modeloSelecionado",
                veiculo.modelo
              );

              localStorage.setItem(
                "agingSelecionado",
                veiculo.aging
              );

              localStorage.setItem(
                "vagaSelecionada",
                veiculo.vaga
              );

              setTela(
                "vpccqe-checklist"
              );
            }}
            style={{
              border:
                "1px solid #ccc",
              padding: "15px",
              marginBottom:
                "10px",
              borderRadius:
                "8px",
              cursor: "pointer",
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

            <p>
              {veiculo.inspecionado
                ? "✅ Inspecionado"
                : "⬜ Pendente"}
            </p>
          </div>
        )
      )}
    </div>
  );
}