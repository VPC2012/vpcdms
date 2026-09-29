import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function ConsultaOcorrencias({ setTela }) {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [filtroVin, setFiltroVin] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState("Todos");

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  async function carregarOcorrencias() {
    const { data, error } = await supabase
      .from("ocorrencias")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("Erro ao carregar ocorrências");
      return;
    }

    setOcorrencias(data || []);
  }

  async function alterarStatus(id, novoStatus) {
    const { error } = await supabase
      .from("ocorrencias")
      .update({
        status: novoStatus,
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar status");
      return;
    }

    carregarOcorrencias();
  }

  const ocorrenciasFiltradas =
    ocorrencias.filter((item) => {
      const filtroVinOk =
        item.vin
          ?.toLowerCase()
          .includes(
            filtroVin.toLowerCase()
          );

      const filtroStatusOk =
        filtroStatus === "Todos"
          ? true
          : item.status === filtroStatus;

      return (
        filtroVinOk && filtroStatusOk
      );
    });

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => setTela("admin")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <h1>Consulta de Ocorrências</h1>

      <hr />

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar VIN"
          value={filtroVin}
          onChange={(e) =>
            setFiltroVin(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
          }}
        />

        <select
          value={filtroStatus}
          onChange={(e) =>
            setFiltroStatus(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        >
          <option>Todos</option>
          <option>Aberto</option>
          <option>Em Análise</option>
          <option>Em Reparo</option>
          <option>Reparado</option>
          <option>Cobrado</option>
          <option>Encerrado</option>
        </select>
      </div>

      <p>
        <strong>
          Quantidade encontrada:
        </strong>{" "}
        {ocorrenciasFiltradas.length}
      </p>

      {ocorrenciasFiltradas.map(
        (item) => (
          <div
            key={item.id}
            style={{
              border:
                "1px solid #dcdcdc",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "15px",
              backgroundColor:
                "#fafafa",
              boxShadow:
                "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              {
                item.numero_ocorrencia
              }
            </h3>

            <p>
              <strong>
                VIN:
              </strong>{" "}
              {item.vin}
            </p>

            <p>
              <strong>
                Modelo:
              </strong>{" "}
              {item.modelo}
            </p>

            <p>
              <strong>
                Peça:
              </strong>{" "}
              {item.peca}
            </p>

            <p>
              <strong>
                Defeito:
              </strong>{" "}
              {item.defeito}
            </p>

            <p>
              <strong>
                Classificação:
              </strong>{" "}
              {
                item.classificacao
              }
            </p>

            <p>
              <strong>
                Responsabilidade:
              </strong>{" "}
              {
                item.responsabilidade
              }
            </p>

            <p>
              <strong>
                Status:
              </strong>
            </p>

            <select
              value={
                item.status ||
                "Aberto"
              }
              onChange={(e) =>
                alterarStatus(
                  item.id,
                  e.target.value
                )
              }
            >
              <option>
                Aberto
              </option>
              <option>
                Em Análise
              </option>
              <option>
                Em Reparo
              </option>
              <option>
                Reparado
              </option>
              <option>
                Cobrado
              </option>
              <option>
                Encerrado
              </option>
            </select>
          </div>
        )
      )}
    </div>
  );
}