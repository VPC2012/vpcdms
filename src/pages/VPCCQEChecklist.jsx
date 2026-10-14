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
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
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
  const { data } =
    await supabase
      .from("vpccqe_checklist")
      .select("*")
      .eq("vin", vin)
      .maybeSingle();

  if (!data) return;

  const texto =
    data.observacao || "";

  const hmc =
    texto.match(
      /HMC:\s*(.*)/
    )?.[1]?.trim() || "";

  const soc =
    texto.match(
      /SOC:\s*(.*)/
    )?.[1]?.trim() || "";

  const dataBat =
    texto.match(
      /Data Bateria:\s*(.*)/
    )?.[1]?.trim() || "";

  const fus =
    texto.match(
      /Fusível:\s*(.*)/
    )?.[1]?.trim() || "";

  const pneuDI =
    texto.match(
      /Pneu DI:\s*(.*)/
    )?.[1]?.trim() || "";

  const pneuDD =
    texto.match(
      /Pneu DD:\s*(.*)/
    )?.[1]?.trim() || "";

  const pneuTE =
    texto.match(
      /Pneu TE:\s*(.*)/
    )?.[1]?.trim() || "";

  const pneuTD =
    texto.match(
      /Pneu TD:\s*(.*)/
    )?.[1]?.trim() || "";

  const obs =
    texto.includes("Obs:")
      ? texto.split("Obs:")[1]
      : "";

  setHmc(hmc);

  setSoc(soc);

  setDataBateria(dataBat);

  setFusivel(
    fus || "Conectado"
  );

  setPneuDianteiroEsquerdo(
    pneuDI
  );

  setPneuDianteiroDireito(
    pneuDD
  );

  setPneuTraseiroEsquerdo(
    pneuTE
  );

  setPneuTraseiroDireito(
    pneuTD
  );

  setObservacao(
    obs?.trim() || ""
  );

  setDefeito(
    data.resultado || "Não"
  );
}

  const salvarChecklist =
    async () => {
      const listaId =
        localStorage.getItem(
          "listaSelecionada"
        );

      const { error } =
        await supabase
          .from(
            "vpccqe_checklist"
          )
          .insert([
            {
              lista_id: listaId,

              vin: vin,

              resultado: defeito,

              observacao:
                `
HMC: ${hmc}

SOC: ${soc}

Data Bateria: ${dataBateria}

Fusível: ${fusivel}

Pneu DI: ${pneuDianteiroEsquerdo}

Pneu DD: ${pneuDianteiroDireito}

Pneu TE: ${pneuTraseiroEsquerdo}

Pneu TD: ${pneuTraseiroDireito}

Obs:
${observacao}
`,
            },
          ]);

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
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        salvarChecklist();
      }
    }}
    tabIndex="0"

      style={{
        padding: "30px",
        fontFamily: "Arial",
        maxWidth: "900px",
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

      <h1>
        📋 Checklist VPCCQE
      </h1>

      <hr />

      <h3>
        Dados do Veículo
      </h3>

      <p>
        <strong>
          MODELO:
        </strong>{" "}
        {modelo}
      </p>

      <p>
        <strong>VIN:</strong>{" "}
        {vin}
      </p>

      <p>
        <strong>
          AGING:
        </strong>{" "}
        {aging}
      </p>

      <p>
        <strong>
          VAGA:
        </strong>{" "}
        {vaga}
      </p>


      <p>
  <strong>
    DATA DA INSPEÇÃO:
  </strong>{" "}
  {dataInspecao}
</p>


      <hr />

      <h3>Inspeção</h3>

      <p>HMC</p>

      <input
        value={hmc}
        onChange={(e) =>
          setHmc(
            e.target.value
          )
        }
      />

      <p>SOC (%)</p>

      <input
        value={soc}
        onChange={(e) =>
          setSoc(
            e.target.value
          )
        }
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
      />

      <p>
        Fusível Volumétrico
      </p>

      <select
        value={fusivel}
        onChange={(e) =>
          setFusivel(
            e.target.value
          )
        }
      >
        <option>
          Conectado
        </option>

        <option>
          Desconectado
        </option>
      </select>

      <h3>
        Pressão dos Pneus
      </h3>

      <p>
        Frontal Esquerdo
      </p>

      <input
        value={
          pneuDianteiroEsquerdo
        }
        onChange={(e) =>
          setPneuDianteiroEsquerdo(
            e.target.value
          )
        }
      />

      <p>
        Frontal Direito
      </p>

      <input
        value={
          pneuDianteiroDireito
        }
        onChange={(e) =>
          setPneuDianteiroDireito(
            e.target.value
          )
        }
      />

      <p>
        Traseiro Esquerdo
      </p>

      <input
        value={
          pneuTraseiroEsquerdo
        }
        onChange={(e) =>
          setPneuTraseiroEsquerdo(
            e.target.value
          )
        }
      />

      <p>
        Traseiro Direito
      </p>

      <input
        value={
          pneuTraseiroDireito
        }
        onChange={(e) =>
          setPneuTraseiroDireito(
            e.target.value
          )
        }
      />

      <p>Defeitos?</p>

      <select
        value={defeito}
        onChange={(e) =>
          setDefeito(
            e.target.value
          )
        }
      >
        <option>Não</option>
        <option>Sim</option>
      </select>

      <p>Observação</p>

      <textarea
        rows="5"
        cols="60"
        value={observacao}
        onChange={(e) =>
          setObservacao(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          salvarChecklist
        }
        style={{
          padding: "12px 20px",
          fontSize: "16px",
        }}
      >
        ✅ SALVAR CHECKLIST
      </button>
    </div>
  );
}