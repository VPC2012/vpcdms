import {
  Camera,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera";


import { useEffect, useState } from "react";
import {
  salvarChecklist as salvarChecklistOffline,
  marcarVeiculoInspecionado,
  obterChecklistPorVin,
} from "../services/cqeOffline";

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

    const [turno, setTurno] =
  useState("1º Turno");

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

    const [
  fotoIdentificacao,
  setFotoIdentificacao,
] = useState(null);

const [
  fotoGeral,
  setFotoGeral,
] = useState(null);

const [
  fotoDetalhe,
  setFotoDetalhe,
] = useState(null);

useEffect(() => {
  carregarChecklist();
}, [vin]);

async function carregarChecklist() {
  const checklist =
    await obterChecklistPorVin(vin);

  if (!checklist) return;

  setHmc(
    checklist.hmc || ""
  );

  setSoc(
    checklist.soc || ""
  );

  setDataBateria(
    checklist.data_bateria || ""
  );

  setFusivel(
    checklist.fusivel ||
      "Conectado"
  );


setTurno(
  checklist.turno ||
    "1º Turno"
);

  setPneuDianteiroEsquerdo(
    checklist.pneu_de || ""
  );

  setPneuDianteiroDireito(
    checklist.pneu_dd || ""
  );

  setPneuTraseiroEsquerdo(
    checklist.pneu_te || ""
  );

  setPneuTraseiroDireito(
    checklist.pneu_td || ""
  );

  setDefeito(
    checklist.resultado ||
      "Não"
  );

  setObservacao(
    checklist.observacao ||
      ""
  );
}

const capturarFoto =
  async (tipo) => {

    try {

      const foto =
        await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType:
            CameraResultType.DataUrl,
          source:
            CameraSource.Camera,
        });

      if (!foto?.dataUrl)
        return;

      if (
        tipo ===
        "Identificação"
      ) {
        setFotoIdentificacao(
          foto.dataUrl
        );
      }

      if (
        tipo ===
        "Foto Geral"
      ) {
        setFotoGeral(
          foto.dataUrl
        );
      }

      if (
        tipo ===
        "Foto Detalhe"
      ) {
        setFotoDetalhe(
          foto.dataUrl
        );
      }

    } catch (erro) {

      console.error(
        erro
      );

    }

  };

const salvarChecklist =
  async () => {

    try {

      if (!dataBateria) {
  alert(
    "⚠ Data da bateria é obrigatória."
  );
  return;
}

if (!hmc) {
  alert(
    "⚠ Informe o HMC."
  );
  return;
}

if (
  !/^[0-9]+$/.test(hmc)
) {
  alert(
    "⚠ HMC deve conter apenas números."
  );
  return;
}

if (soc === "") {
  alert(
    "⚠ Informe o SOC."
  );
  return;
}

if (
  isNaN(Number(soc)) ||
  Number(soc) < 0 ||
  Number(soc) > 100
) {
  alert(
    "⚠ SOC deve estar entre 0 e 100."
  );
  return;
}

if (
  pneuDianteiroEsquerdo === "" ||
  pneuDianteiroDireito === "" ||
  pneuTraseiroEsquerdo === "" ||
  pneuTraseiroDireito === ""
) {
  alert(
    "⚠ Informe a pressão de todos os pneus."
  );
  return;
}

const pneus = [
  {
    nome: "Pneu DE",
    valor:
      pneuDianteiroEsquerdo,
  },
  {
    nome: "Pneu DD",
    valor:
      pneuDianteiroDireito,
  },
  {
    nome: "Pneu TE",
    valor:
      pneuTraseiroEsquerdo,
  },
  {
    nome: "Pneu TD",
    valor:
      pneuTraseiroDireito,
  },
];

for (const pneu of pneus) {

  if (
    isNaN(
      Number(pneu.valor)
    ) ||
    Number(pneu.valor) < 0 ||
    Number(pneu.valor) > 100
  ) {

    alert(
      `⚠ ${pneu.nome} deve estar entre 0 e 100.`
    );

    return;
  }
}

      const listaId =
        Number(
          localStorage.getItem(
            "listaSelecionada"
          )
        );

      await salvarChecklistOffline({

        lista_id: listaId,

        vin,

        modelo,

        aging,

        vaga,

        resultado: defeito,

        hmc,

        soc,

        data_bateria:
          dataBateria,

        fusivel,

        turno,

        pneu_de:
          pneuDianteiroEsquerdo,

        pneu_dd:
          pneuDianteiroDireito,

        pneu_te:
          pneuTraseiroEsquerdo,

        pneu_td:
          pneuTraseiroDireito,

        observacao,

        data_inspecao:
          new Date().toISOString(),
      });

await marcarVeiculoInspecionado(
  vin
);


      alert(
        "✅ Checklist salvo offline com sucesso!"
      );

      setTela(
        "vpccqe-veiculos"
      );

    } catch (erro) {

  console.error(
    erro
  );

  alert(
    "Erro ao salvar checklist."
  );
}
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

<p>Turno</p>

<select
  value={turno}
  onChange={(e) =>
    setTurno(
      e.target.value
    )
  }
  style={{
    width: "100%",
  }}
>
  <option>
    1º Turno
  </option>

  <option>
    2º Turno
  </option>

  <option>
    3º Turno
  </option>

  <option>
    ADM
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

        <p>Pneu DE</p>
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

{/* NOVA SEÇÃO DE EVIDÊNCIAS */}

<div
  onClick={() =>
    capturarFoto(
      "Foto Geral"
    )
  }  style={{
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.10)",
  }}
>
  <h2>
    📷 Evidências Fotográficas
  </h2>

  <p>
    Registro opcional de evidências.
  </p>

  <div
  onClick={() =>
    capturarFoto(
      "Identificação"
    )
  }
  style={{
    background: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "12px",
    textAlign: "center",
    cursor: "pointer",
  }}
>
  <h3>
  📷 Identificação
</h3>

{
  fotoIdentificacao ? (
    <p
      style={{
        color: "green",
        fontWeight: "bold",
      }}
    >
      ✅ Foto registrada
    </p>
  ) : (
    <p
      style={{
        color: "#666",
      }}
    >
      Nenhuma foto registrada
    </p>
  )
}
</div>

<div
  onClick={() =>
    capturarFoto(
      "Foto Geral"
    )
  }
  style={{
    background: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "12px",
    textAlign: "center",
  }}
>
  <h3>
    📷 Foto Geral
  </h3>

  <p
    style={{
      color: "#666",
    }}
  >
    Nenhuma foto registrada
  </p>
</div>

<div
  onClick={() =>
    capturarFoto(
      "Foto Geral"
    )
  }
  style={{
    background: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    textAlign: "center",
  }}
>
  <h3>
    📷 Foto Detalhe
  </h3>

  <p
    style={{
      color: "#666",
    }}
  >
    Nenhuma foto registrada
  </p>
</div>
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