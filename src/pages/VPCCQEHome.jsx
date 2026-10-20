import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEHome({
  setTela,
}) {
  const [listas, setListas] =
    useState([]);

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
              total -
              concluidos;

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

    setListas(
      listasComResumo
    );
  }

  return (
    <div
      style={{
        padding: "15px",
        fontFamily:
          "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor:
          "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() =>
          setTela("portal")
        }
        style={{
          marginBottom:
            "20px",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          textAlign: "center",
          marginBottom:
            "25px",
        }}
      >
        <h1
          style={{
            color: "#002C5F",
            marginBottom:
              "5px",
          }}
        >
          HYUNDAI
        </h1>

        <h2
          style={{
            margin: 0,
          }}
        >
          VPCCQE
        </h2>

        <p
          style={{
            color: "#666",
            marginTop:
              "5px",
          }}
        >
          Sistema de
          Inspeção de
          Qualidade
        </p>
      </div>

      {listas
        .filter(
          (lista) =>
            lista.total > 0
        )
        .map((lista) => (
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
              backgroundColor:
                "#fff",
              borderRadius:
                "16px",
              padding: "20px",
              marginBottom:
                "20px",
              cursor: "pointer",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.10)",
            }}
          >
            <h2
              style={{
                color:
                  "#002C5F",
                marginTop: 0,
              }}
            >
              {
                lista.nome_lista
              }
            </h2>

            <p>
              🚗 Veículos:
              {" "}
              <strong>
                {lista.total}
              </strong>
            </p>

            <p>
              ✅
              Concluídos:
              {" "}
              <strong>
                {
                  lista.concluidos
                }
              </strong>
            </p>

            <p>
              ⏳
              Pendentes:
              {" "}
              <strong>
                {
                  lista.pendentes
                }
              </strong>
            </p>

            <div
              style={{
                marginTop:
                  "15px",
              }}
            >
              <div
                style={{
                  width:
                    "100%",
                  height:
                    "14px",
                  background:
                    "#ddd",
                  borderRadius:
                    "20px",
                }}
              >
                <div
                  style={{
                    width: `${lista.percentual}%`,
                    height:
                      "14px",
                    background:
                      "#002C5F",
                    borderRadius:
                      "20px",
                  }}
                />
              </div>

              <p
                style={{
                  textAlign:
                    "center",
                  marginTop:
                    "8px",
                  fontWeight:
                    "bold",
                }}
              >
                {
                  lista.percentual
                }
                %
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}