import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VPCCQEChecklist({
  setTela,
}) {
  const vin =
    localStorage.getItem(
      "vinSelecionado"
    );

  const modelo =
    localStorage.getItem(
      "modeloSelecionado"
    );

  const aging =
    localStorage.getItem(
      "agingSelecionado"
    );

  const vaga =
    localStorage.getItem(
      "vagaSelecionada"
    );

  const dataInspecao =
    new Date().toLocaleDateString(
      "pt-BR"
    );

  const [hmc, setHmc] =
    useState("");

  const [soc, setSoc] =
    useState("");

  const [dataBateria, setDataBateria] =
    useState("");

  const [fusivel, setFusivel] =
    useState("Conectado");

  const [
    pneuDianteiroEsquerdo,
    setPneuDianteiroEsquerdo,
  ] = useState("");

  const [
    pneuDianteiroDireito,
    setPneuDianteiroDireito,
  ] = useState("");

  const [
    pneuTraseiroEsquerdo,
    setPneuTraseiroEsquerdo,
  ] = useState("");

  const [
    pneuTraseiroDireito,
    setPneuTraseiroDireito,
  ] = useState("");

  const [defeito, setDefeito] =
    useState("Não");

  const [observacao, setObservacao] =
    useState("");

  useEffect(() => {
    carregarChecklistExistente();
  }, []);

  async function carregarChecklistExistente() {

    const { data, error } =
      await supabase
        .from("vpccqe_checklist")
        .select("*")
        .eq("vin", vin)
        .order("id", {
          ascending: false,
        })
        .limit(1);

    if (error) return;

    if (!data || data.length === 0)
      return;

    const registro =
      data[0];

    setHmc(
      registro.hmc || ""
    );

    setSoc(
      registro.soc?.toString() ||
        ""
    );

    setDataBateria(
      registro.data_bateria ||
        ""
    );

    setFusivel(
      registro.fusivel ||
        "Conectado"
    );

    setPneuDianteiroEsquerdo(
      registro.pneu_di?.toString() ||
        ""
    );

    setPneuDianteiroDireito(
      registro.pneu_dd?.toString() ||
        ""
    );

    setPneuTraseiroEsquerdo(
      registro.pneu_te?.toString() ||
        ""
    );

    setPneuTraseiroDireito(
      registro.pneu_td?.toString() ||
        ""
    );

    setObservacao(
      registro.observacao ||
        ""
    );

    setDefeito(
      registro.resultado ||
        "Não"
    );
  }

  const salvarChecklist =
    async () => {

      const listaId =
        localStorage.getItem(
          "listaSelecionada"
        );

      const {
        data: checklistExistente,
      } = await supabase
        .from(
          "vpccqe_checklist"
        )
        .select("id")
        .eq("vin", vin)
        .order("id", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      let error;

      const dadosChecklist = {
        lista_id: listaId,

        vin: vin,

        resultado: defeito,

        hmc: hmc,

        soc: soc || null,

        data_bateria:
          dataBateria || null,

        fusivel: fusivel,

        pneu_di:
          pneuDianteiroEsquerdo ||
          null,

        pneu_dd:
          pneuDianteiroDireito ||
          null,

        pneu_te:
          pneuTraseiroEsquerdo ||
          null,

        pneu_td:
          pneuTraseiroDireito ||
          null,

        observacao:
          observacao,

        data_inspecao:
          new Date()
            .toISOString(),
      };

      if (
        checklistExistente
      ) {

        ({ error } =
          await supabase
            .from(
              "vpccqe_checklist"
            )
            .update(
              dadosChecklist
            )
            .eq(
              "id",
              checklistExistente.id
            ));

      } else {

        ({ error } =
          await supabase
            .from(
              "vpccqe_checklist"
            )
            .insert([
              dadosChecklist,
            ]));
      }

      if (error) {
        alert(
          "Erro ao salvar checklist"
        );
        return;
      }

      await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .update({
          inspecionado: true,
        })
        .eq("vin", vin);

      alert(
        "✅ Checklist salvo com sucesso!"
      );

      setTela(
        "vpccqe-veiculos"
      );
    };

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor:
          "#f4f4f4",
        minHeight: "100vh",
        fontFamily:
          "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() =>
          setTela(
            "vpccqe-veiculos"
          )
        }
      >
        ← Voltar
      </button>

      <h1
        style={{
          color: "#002C5F",
          textAlign: "center",
        }}
      >
        📋 CHECKLIST VPCCQE
      </h1>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.10)",
        }}
      >
        <h2>🚗 Dados do Veículo</h2>

        <p><strong>Modelo:</strong> {modelo}</p>

        <p><strong>VIN:</strong> {vin}</p>

        <p><strong>Aging:</strong> {aging}</p>

        <p><strong>Vaga:</strong> {vaga}</p>

        <p>
          <strong>
            Data da Inspeção:
          </strong>{" "}
          {dataInspecao}
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.10)",
        }}
      >
        <h2>🔋 Bateria</h2>

        <p>HMC</p>

        <input
          value={hmc}
          onChange={(e) =>
            setHmc(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>SOC (%)</p>

        <input
          value={soc}
          onChange={(e) =>
            setSoc(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>Data da Bateria</p>

        <input
          type="date"
          value={dataBateria}
          onChange={(e) =>
            setDataBateria(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>Fusível</p>

        <select
          value={fusivel}
          onChange={(e) =>
            setFusivel(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        >
          <option>
            Conectado
          </option>

          <option>
            Desconectado
          </option>

          <option>
            N/A
          </option>
        </select>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.10)",
        }}
      >
        <h2>🛞 Pressão dos Pneus</h2>

        <p>Pneu DI</p>
        <input
          value={
            pneuDianteiroEsquerdo
          }
          onChange={(e) =>
            setPneuDianteiroEsquerdo(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>Pneu DD</p>
        <input
          value={
            pneuDianteiroDireito
          }
          onChange={(e) =>
            setPneuDianteiroDireito(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>Pneu TE</p>
        <input
          value={
            pneuTraseiroEsquerdo
          }
          onChange={(e) =>
            setPneuTraseiroEsquerdo(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />

        <p>Pneu TD</p>
        <input
          value={
            pneuTraseiroDireito
          }
          onChange={(e) =>
            setPneuTraseiroDireito(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.10)",
        }}
      >
        <h2>📋 Resultado</h2>

        <p>Defeito?</p>

        <select
          value={defeito}
          onChange={(e) =>
            setDefeito(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        >
          <option>
            Não
          </option>

          <option>
            Sim
          </option>
        </select>

        <p>Observação</p>

        <textarea
          rows="5"
          value={observacao}
          onChange={(e) =>
            setObservacao(
              e.target.value
            )
          }
          style={{
            width: "100%",
          }}
        />
      </div>

      <button
        onClick={
          salvarChecklist
        }
        style={{
          width: "100%",
          background:
            "#002C5F",
          color: "#fff",
          padding: "18px",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        ✅ SALVAR CHECKLIST
      </button>
    </div>
  );
}