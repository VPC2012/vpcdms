
import {
  salvarListas,
  salvarVeiculos,
  obterChecklistsPendentes,
  marcarComoEnviado,
  limparBancoOffline,
  limparChecklistsOffline,
} from "../services/cqeOffline";


import {
  useRef,
  useState,
  useEffect,
} from "react";

import * as XLSX from "xlsx";
import { supabase } from "../services/supabase";


import {
  exportarVPCCQEExcel,
} from "../utils/exportarVPCCQEExcel";

import {
  baixarModeloVPCCQE,
} from "../utils/downloadModeloVPCCQE";

export default function VPCCQEAdmin({
  setTela,
}) {
  const fileInputRef =
    useRef(null);


const [dashboard, setDashboard] =
  useState({
    total: 0,
    inspecionados: 0,
    pendentes: 0,
    defeitos: 0,
    percentual: 0,
    turno1: 0,
    turno2: 0,
    turno3: 0,
    turnoADM: 0,
  });

  useEffect(() => {
  carregarDashboard();
}, []);

  const selecionarArquivo =
    () => {
      fileInputRef.current.click();
    };

  const importarArquivo =
    async (event) => {
      const arquivo =
        event.target.files[0];

      if (!arquivo) return;

      const dados =
        await arquivo.arrayBuffer();

      const workbook =
        XLSX.read(dados);

      const aba =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const linhas =
        XLSX.utils.sheet_to_json(
          aba
        );

      if (
        !linhas ||
        linhas.length === 0
      ) {
        alert(
          "Planilha vazia."
        );
        return;
      }

      const {
        error: erroDelete,
      } = await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .delete()
        .gt("id", 0);

      if (erroDelete) {
        alert(
          "Erro ao limpar veículos."
        );
        return;
      }

      const {
        data: listas,
        error: erroListas,
      } = await supabase
        .from(
          "vpccqe_listas"
        )
        .select("*");

      if (erroListas) {
        alert(
          "Erro ao carregar listas."
        );
        return;
      }

      const veiculos =
        linhas.map(
          (linha) => {

            const numeroLista =
              String(
                linha["LISTA"]
              ).padStart(
                2,
                "0"
              );

            const nomeLista =
              `Lista ${numeroLista}`;

            const lista =
              listas.find(
                (item) =>
                  item.nome_lista ===
                  nomeLista
              );

            return {
              lista_id:
                lista?.id || null,

              modelo:
                linha[
                  "Model Code"
                ],

              vin:
                linha[
                  "Vehicle Serial"
                ],

              aging:
                Number(
                  linha["Aging"]
                ),

              vaga:
                linha["VAGA"],

              cor:
                linha["COR"],

              inspecionado:
                false,
            };
          }
        );

      const {
        error: erroInsert,
      } = await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .insert(
          veiculos
        );

      if (erroInsert) {
        alert(
          "Erro ao importar veículos."
        );
        return;
      }

      await atualizarListaCQE();
      
      alert(
        `✅ Importação concluída com ${veiculos.length} veículos`
      );
    };

  const limparBancoGeral =
    async () => {

      const continuar =
        window.confirm(
          "ATENÇÃO\n\nTodos os veículos e checklists serão removidos.\n\nCertifique-se de que o resultado já foi exportado.\n\nDeseja continuar?"
        );

      if (!continuar) return;

      const confirmar =
        window.confirm(
          "CONFIRMAÇÃO FINAL\n\nO banco será limpo.\n\nVeículos: EXCLUÍDOS\nChecklists: EXCLUÍDOS\nListas: RESETADAS\n\nDeseja continuar?"
        );

      if (!confirmar) return;

      const {
        error: erroChecklist,
      } = await supabase
        .from(
          "vpccqe_checklist"
        )
        .delete()
        .gt("id", 0);

      if (erroChecklist) {
        alert(
          "Erro ao limpar checklist."
        );
        return;
      }

      const {
        error: erroVeiculos,
      } = await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .delete()
        .gt("id", 0);

      if (erroVeiculos) {
        alert(
          "Erro ao limpar veículos."
        );
        return;
      }

      const {
        error: erroListas,
      } = await supabase
        .from(
          "vpccqe_listas"
        )
        .update({
          status: "Pendente",
        })
        .gt("id", 0);

      if (erroListas) {
  alert(
    "Erro ao resetar listas."
  );
  return;
}

await limparBancoOffline();

alert(
  "✅ Banco de dados limpo com sucesso.\n\nImporte uma nova lista para iniciar uma nova campanha."
);
    };

    const atualizarListaCQE =
  async () => {

const pendentes =
  await obterChecklistsPendentes();

if (pendentes.length > 0) {
  alert(
    `⚠️ Existem ${pendentes.length} checklists pendentes de envio.\n\nEnvie as informações antes de sincronizar os dados.`
  );
  return;
}

    try {

      const {
        data: listas,
        error: erroListas,
      } = await supabase
        .from("vpccqe_listas")
        .select("*");

      if (erroListas) {
        alert(
          "Erro ao carregar listas."
        );
        return;
      }

      const {
        data: veiculos,
        error: erroVeiculos,
      } = await supabase
        .from("vpccqe_lista_veiculos")
        .select("*");

      if (erroVeiculos) {
        alert(
          "Erro ao carregar veículos."
        );
        return;
      }

      const {
  data: checklists,
  error: erroChecklists,
} = await supabase
  .from("vpccqe_checklist")
  .select("*");

if (erroChecklists) {
  alert(
    "Erro ao carregar checklists."
  );
  return;
}

if (
  (checklists || []).length === 0
) {
  await limparChecklistsOffline();
}
      await salvarListas(
        listas || []
      );

      const veiculosAtualizados =
  (veiculos || []).map(
    (veiculo) => ({
      ...veiculo,
      inspecionado:
        (checklists || []).some(
          (checklist) =>
            checklist.vin ===
            veiculo.vin
        ),
    })
  );

await salvarVeiculos(
  veiculosAtualizados
);

      alert(
  `✅ Dados sincronizados com sucesso.\n\n${veiculos.length} veículos carregados.`
);

    } catch (erro) {

      console.error(
        erro
      );

     alert(
  "Erro ao sincronizar dados."
);
    }
  };

const enviarInformacao =
  async () => {


    try {

      const pendentes =
        await obterChecklistsPendentes();

      
      if (
        pendentes.length === 0
      ) {
        alert(
          "Nenhum checklist pendente para envio."
        );
        return;
      }

      let enviados = 0;

      for (const checklist of pendentes) {

        const resultado = await supabase
          .from("vpccqe_checklist")
          .upsert({

            lista_id:
              checklist.lista_id,

            vin:
              checklist.vin,

            resultado:
              checklist.resultado,

            hmc:
              checklist.hmc,

            soc:
              checklist.soc,

            data_bateria:
  checklist.data_bateria || null,

            fusivel:
              checklist.fusivel,

            pneu_di:
              checklist.pneu_de,

            pneu_dd:
              checklist.pneu_dd,

            pneu_te:
              checklist.pneu_te,

            pneu_td:
              checklist.pneu_td,

            observacao:
              checklist.observacao,

            data_inspecao:
              checklist.data_inspecao,
          });


        if (!resultado.error) {

          await marcarComoEnviado(
            checklist.vin
          );

          enviados++;
        }
      }

      alert(
        `✅ ${enviados} checklists enviados com sucesso.`
      );

    } catch (erro) {

      console.error(
        erro
      );

      alert(
        "Erro ao enviar informações."
      );
    }
  };

  const carregarDashboard =
  async () => {

    try {

      const {
        data: veiculos,
      } = await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .select("*");

      const {
        data: checklists,
      } = await supabase
        .from(
          "vpccqe_checklist"
        )
        .select("*");

      const total =
        veiculos?.length || 0;

      const inspecionados =
        new Set(
          (checklists || []).map(
            (item) => item.vin
          )
        ).size;

      const pendentes =
        total -
        inspecionados;

const percentual =
  total > 0
    ? Math.round(
        (inspecionados * 100) /
          total
      )
    : 0;

      const defeitos =
  (checklists || []).filter(
    (item) =>
      item.resultado ===
      "Não"
  ).length;

      const turno1 =
        (checklists || []).filter(
          (item) =>
            item.turno ===
            "1º Turno"
        ).length;

      const turno2 =
        (checklists || []).filter(
          (item) =>
            item.turno ===
            "2º Turno"
        ).length;

      const turno3 =
        (checklists || []).filter(
          (item) =>
            item.turno ===
            "3º Turno"
        ).length;

      const turnoADM =
        (checklists || []).filter(
          (item) =>
            item.turno ===
            "ADM"
        ).length;

      setDashboard({
        total,
        inspecionados,
        pendentes,
        defeitos,
        percentual,
        turno1,
        turno2,
        turno3,
        turnoADM,
      });

    } catch (erro) {

      console.error(
        erro
      );

    }
  };

  const estiloBotao = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #dfe6ee",
  marginBottom: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  color: "#002C5F",
  boxShadow:
    "0 2px 6px rgba(0,0,0,0.05)",
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
    setTela("portal")
  }
  style={{
    position: "absolute",
    top: "10px",
    left: "10px",
  }}
>
  ← Voltar
</button>

      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        <h1
          style={{
            color: "#002C5F",
            marginBottom: "5px",
          }}
        >
          HYUNDAI
        </h1>

        <h2
          style={{
            margin: 0,
          }}
        >
          VPCCQE ADMIN
        </h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "8px",
    marginTop: "12px",
    marginBottom: "10px",
  }}
>

  <div
    style={{
      background: "#fff",
      padding: "8px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        fontSize: "18px",
      }}
    >
      🚗
    </div>

    <strong
      style={{
        fontSize: "18px",
      }}
    >
      {dashboard.total}
    </strong>

    <br />

    Total
  </div>

  <div
    style={{
      background: "#fff",
      padding: "8px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        fontSize: "18px",
      }}
    >
      ✅
    </div>

    <strong
      style={{
        fontSize: "18px",
      }}
    >
      {dashboard.inspecionados}
    </strong>

    <br />

    Inspecionados
  </div>

  <div
    style={{
      background: "#fff",
      padding: "8px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        fontSize: "18px",
      }}
    >
      ⏳
    </div>

    <strong
      style={{
        fontSize: "18px",
      }}
    >
      {dashboard.pendentes}
    </strong>

    <br />

    Pendentes
  </div>

  <div
    style={{
      background: "#fff",
      padding: "8px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        fontSize: "18px",
      }}
    >
      ⚠️
    </div>

    <strong
      style={{
        fontSize: "18px",
      }}
    >
      {dashboard.defeitos}
    </strong>

    <br />

    Defeitos
  </div>

</div>

<div
  style={{
    background: "#fff",
    borderRadius: "12px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.05)",
  }}
>
  <h3
    style={{
      marginTop: 0,
      color: "#002C5F",
    }}
  >
    📊 Inspecionados por Turno
  </h3>

  {dashboard.turno1 > 0 && (
    <p>
      1º Turno:
      <strong>
        {" "}
        {dashboard.turno1}
      </strong>
    </p>
  )}

  {dashboard.turno2 > 0 && (
    <p>
      2º Turno:
      <strong>
        {" "}
        {dashboard.turno2}
      </strong>
    </p>
  )}

  {dashboard.turno3 > 0 && (
    <p>
      3º Turno:
      <strong>
        {" "}
        {dashboard.turno3}
      </strong>
    </p>
  )}

  {dashboard.turnoADM > 0 && (
    <p>
      ADM:
      <strong>
        {" "}
        {dashboard.turnoADM}
      </strong>
    </p>
  )}
</div>

</div>

<div
  style={{
    background: "#fff",
    borderRadius: "12px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.05)",
  }}
>
  <h3
    style={{
      marginTop: 0,
      marginBottom: "10px",
      color: "#002C5F",
    }}
  >
    📈 Progresso da Inspeção
  </h3>

  <p
    style={{
      marginBottom: "10px",
    }}
  >
    {dashboard.inspecionados}
    {" / "}
    {dashboard.total}
    {" veículos"}
  </p>

  <div
    style={{
      width: "100%",
      height: "14px",
      background: "#ddd",
      borderRadius: "20px",
    }}
  >
    <div
      style={{
        width: `${dashboard.percentual}%`,
        height: "14px",
        background: "#002C5F",
        borderRadius: "20px",
      }}
    />
  </div>

  <p
    style={{
      marginTop: "8px",
      textAlign: "center",
      fontWeight: "bold",
    }}
  >
    {dashboard.percentual}%
  </p>
</div>

<h3

  style={{
    color: "#002C5F",
    marginBottom: "10px",
  }}
>
  📂 Arquivos
</h3>


      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={
          importarArquivo
        }
        style={{
          display: "none",
        }}
      />

      <button
        onClick={
          selecionarArquivo
        }
       style={estiloBotao}
      >
        📥 IMPORTAR LISTA
      </button>

      <button
  onClick={
    baixarModeloVPCCQE
  }
  style={estiloBotao}
>
  📄 BAIXAR MODELO
</button>

<h3
  style={{
    color: "#002C5F",
    marginTop: "20px",
    marginBottom: "10px",
  }}
>
  📊 Resultados
</h3>

    <button
  onClick={
    exportarVPCCQEExcel
  }
  style={estiloBotao}
>
  📤 EXPORTAR RESULTADO
</button> 

<h3
  style={{
    color: "#8B0000",
    marginTop: "20px",
    marginBottom: "10px",
  }}
>
💻 Administração
</h3>

  <button
  onClick={
    limparBancoGeral
  }
  style={{
    ...estiloBotao,
    backgroundColor: "#fff5f5",
    border: "1px solid #ffbdbd",
    color: "#c62828",
  }}
>
  🗑 LIMPAR BANCO DE DADOS GERAL
</button>




</div>
);
}