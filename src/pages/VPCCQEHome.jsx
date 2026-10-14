import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEHome({
  setTela,
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

    const listasComResumo =
      await Promise.all(
        (data || []).map(
          async (lista) => {
            const {
              data: veiculos,
            } = await supabase
              .from(
                "vpccqe_lista_veiculos"
              )
              .select(
                "inspecionado"
              )
              .eq(
                "lista_id",
                lista.id
              );

            const total =
              veiculos?.length || 0;

            const concluidos =
              veiculos?.filter(
                (v) =>
                  v.inspecionado ===
                  true
              ).length || 0;

            const pendentes =
              total - concluidos;

            const percentual =
              total > 0
                ? Math.round(
                    (concluidos *
                      100) /
                      total
                  )
                : 0;

            return {
              ...lista,
              total,
              concluidos,
              pendentes,
              percentual,
            };
          }
        )
      );

    setListas(listasComResumo);
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        maxWidth: "900px",
        margin: "0 auto",
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

      <h2>
        Controle de Qualidade
      </h2>

      <hr />

      {listas.map((lista) => (
        <div
          key={lista.id}
          onClick={() => {
            localStorage.setItem(
              "listaSelecionada",
              lista.id
            );

            setTela(
              "vpccqe-veiculos"
            );
          }}
          style={{
            border:
              "1px solid #ccc",
            padding: "20px",
            marginBottom:
              "15px",
            cursor: "pointer",
            borderRadius:
              "8px",
            backgroundColor:
              "#ffffff",
          }}
        >
          <h3>
            {lista.nome_lista}
          </h3>

          <p>
            <strong>
              Total:
            </strong>{" "}
            {lista.total}
          </p>

          <p>
            <strong>
              Concluídos:
            </strong>{" "}
            {lista.concluidos}
          </p>

          <p>
            <strong>
              Pendentes:
            </strong>{" "}
            {lista.pendentes}
          </p>

          <p>
            <strong>
              Progresso:
            </strong>{" "}
            {lista.percentual}%
          </p>
        </div>
      ))}
    </div>
  );
}