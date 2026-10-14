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

  const { data, error } =
    await supabase
      .from("vpccqe_checklist")
      .select("*")
      .eq("vin", vin)
      .order("id", {
        ascending: false,
      })
      .limit(1);

  if (error) {
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    return;
  }

  const registro = data[0];

  const texto =
    registro.observacao || "";

  const valorHmc =
    texto.match(
      /HMC:\s*(.*?)\n/
    )?.[1] || "";

  const valorSoc =
    texto.match(
      /SOC:\s*(.*?)\n/
    )?.[1] || "";

  const valorDataBateria =
    texto.match(
      /Data Bateria:\s*(.*?)\n/
    )?.[1] || "";

  const valorFusivel =
    texto.match(
      /Fusível:\s*(.*?)\n/
    )?.[1] || "Conectado";

  const valorPneuDI =
    texto.match(
      /Pneu DI:\s*(.*?)\n/
    )?.[1] || "";

  const valorPneuDD =
    texto.match(
      /Pneu DD:\s*(.*?)\n/
    )?.[1] || "";

  const valorPneuTE =
    texto.match(
      /Pneu TE:\s*(.*?)\n/
    )?.[1] || "";

  const valorPneuTD =
    texto.match(
      /Pneu TD:\s*(.*?)\n/
    )?.[1] || "";

  const valorObs =
    texto.match(
      /Obs:\s*([\s\S]*)/
    )?.[1] || "";

  setHmc(
    valorHmc.trim()
  );

  setSoc(
    valorSoc.trim()
  );

  setDataBateria(
    valorDataBateria.trim()
  );

  setFusivel(
    valorFusivel.trim()
  );

  setPneuDianteiroEsquerdo(
    valorPneuDI.trim()
  );

  setPneuDianteiroDireito(
    valorPneuDD.trim()
  );

  setPneuTraseiroEsquerdo(
    valorPneuTE.trim()
  );

  setPneuTraseiroDireito(
    valorPneuTD.trim()
  );

  setObservacao(
    valorObs.trim()
  );

  setDefeito(
    registro.resultado || "Não"
  );
}
  const salvarChecklist =
    async () => {
      const listaId =
        localStorage.getItem(
          "listaSelecionada"
        );

const {
  data: checklistExistente
} = await supabase
  .from("vpccqe_checklist")
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

  observacao: `
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
};

if (checklistExistente) {

  ({ error } =
    await supabase
      .from(
        "vpccqe_checklist"
      )
      .update(dadosChecklist)
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