import {
  salvarListas,
  salvarVeiculos,
  obterChecklistsPendentes,
  marcarComoEnviado,
  limparBancoOffline,
} from "../services/cqeOffline";


import { useRef } from "react";
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

      await salvarListas(
        listas || []
      );

      await salvarVeiculos(
        veiculos || []
      );

      alert(
        `✅ Lista de CQE atualizada.\n\n${veiculos.length} veículos carregados para operação offline.`
      );

    } catch (erro) {

      console.error(
        erro
      );

      alert(
        "Erro ao atualizar lista."
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

        const {
          error,
        } = await supabase
          .from(
            "vpccqe_checklist"
          )
          .upsert(checklist);

        if (!error) {

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

  const estiloBotao = {
    width: "100%",
    padding: "18px",
    borderRadius: "16px",
    border: "none",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
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
          HYUNDAI
        </h1>

        <h2
          style={{
            margin: 0,
          }}
        >
          VPCCQE ADMIN
        </h2>

        <p
          style={{
            color: "#666",
            marginTop: "5px",
          }}
        >
          Gestão de Campanhas
        </p>
      </div>

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
        style={{
          ...estiloBotao,
          backgroundColor:
            "#002C5F",
          color: "#fff",
        }}
      >
        📥 IMPORTAR LISTA
      </button>

      <button
        onClick={
          baixarModeloVPCCQE
        }
        style={{
          ...estiloBotao,
          backgroundColor:
            "#1976d2",
          color: "#fff",
        }}
      >
        📄 BAIXAR MODELO
      </button>

      <button
        onClick={
          exportarVPCCQEExcel
        }
        style={{
          ...estiloBotao,
          backgroundColor:
            "#2e7d32",
          color: "#fff",
        }}
      >
        📤 EXPORTAR RESULTADO
      </button>

      <button
  onClick={
    limparBancoGeral
  }
  style={{
    ...estiloBotao,
    backgroundColor:
      "#c62828",
    color: "#fff",
  }}
>
  🗑 LIMPAR BANCO DE DADOS GERAL
</button>

<button
  onClick={
    atualizarListaCQE
  }
  style={{
    ...estiloBotao,
    backgroundColor:
      "#002C5F",
    color: "#fff",
  }}
>
  📲 ATUALIZAR EQUIPAMENTO OFFLINE
  
</button>
<button
  onClick={
    enviarInformacao
  }
  style={{
    ...estiloBotao,
    backgroundColor:
      "#2e7d32",
    color: "#fff",
  }}
>
  ☁️ ENVIAR INFORMAÇÃO
</button>

</div>
);
}