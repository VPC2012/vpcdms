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

    </div>
  );
}