import { useRef } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../services/supabase";

import {
  exportarVPCCQEExcel
} from "../utils/exportarVPCCQEExcel";

import {
  baixarModeloVPCCQE
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

      // Limpa veículos atuais

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
        console.error(
          erroDelete
        );
        return;
      }

      // Busca listas

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
        linhas.map((linha) => {

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
        });

      const {
        error: erroInsert,
      } = await supabase
        .from(
          "vpccqe_lista_veiculos"
        )
        .insert(veiculos);

      if (erroInsert) {
        alert(
          "Erro ao importar veículos."
        );

        console.error(
          erroInsert
        );

        return;
      }

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

    alert(
      "✅ Banco de dados limpo com sucesso.\n\nImporte uma nova lista para iniciar uma nova campanha."
    );
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() =>
          setTela("portal")
        }
      >
        ← Voltar
      </button>

      <h1>
        📋 VPCCQE ADMIN
      </h1>

      <br />

<button
  onClick={
    selecionarArquivo
  }
>
  📥 Importar Lista
</button>

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

<br />
<br />

<button
  onClick={
    baixarModeloVPCCQE
  }
>
  📄 Baixar Modelo
</button>

<br />
<br />

<button
  onClick={
    exportarVPCCQEExcel
  }
>
  📤 Exportar Resultado
</button>

<br />
<br />

<button
  onClick={
    limparBancoGeral
  }
  style={{
    backgroundColor: "#c62828",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  }}
>
  🗑 Limpar Banco de Dados Geral
</button>

</div>
);

}