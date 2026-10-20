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

  const concluidos =
    veiculos.filter(
      (v) => v.inspecionado
    ).length;

  const pendentes =
    veiculos.length -
    concluidos;

  const percentual =
    veiculos.length > 0
      ? Math.round(
          (concluidos * 100) /
            veiculos.length
        )
      : 0;

  return (
    <div
      style={{
        padding: "15px",
        fontFamily:
          "Arial, sans-serif",
        backgroundColor:
          "#f4f4f4",
        minHeight: "100vh",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() =>
          setTela("vpccqe")
        }
      >
        ← Voltar
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "#002C5F",
            marginBottom: "5px",
          }}
        >
          🚗 VEÍCULOS
        </h1>

        <p>
          Total:{" "}
          <strong>
            {veiculos.length}
          </strong>
        </p>

        <p>
          ✅ Concluídos:{" "}
          <strong>
            {concluidos}
          </strong>
        </p>

        <p>
          ⏳ Pendentes:{" "}
          <strong>
            {pendentes}
          </strong>
        </p>

        <div
          style={{
            width: "100%",
            height: "14px",
            background:
              "#ddd",
            borderRadius:
              "20px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: `${percentual}%`,
              height: "14px",
              background:
                "#002C5F",
              borderRadius:
                "20px",
            }}
          />
        </div>

        <p
          style={{
            fontWeight:
              "bold",
            marginTop: "8px",
          }}
        >
          {percentual}%
        </p>
      </div>

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
              backgroundColor:
                "#fff",
              borderRadius:
                "16px",
              padding: "18px",
              marginBottom:
                "15px",
              cursor: "pointer",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.10)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color:
                  "#002C5F",
              }}
            >
              {veiculo.inspecionado
                ? "✅ INSPECIONADO"
                : "⏳ PENDENTE"}
            </h3>

            <p>
              <strong>
                Vaga:
              </strong>{" "}
              {veiculo.vaga}
            </p>

            <p>
              <strong>
                Modelo:
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
                Aging:
              </strong>{" "}
              {veiculo.aging}
            </p>
          </div>
        )
      )}
    </div>
  );
}