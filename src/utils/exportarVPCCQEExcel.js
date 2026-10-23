import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../services/supabase";

export async function exportarVPCCQEExcel() {

  const { data: veiculos, error: erroVeiculos } =
    await supabase
      .from("vpccqe_lista_veiculos")
      .select("*")
      .order("vin");

  if (erroVeiculos) {
    alert("Erro ao carregar veículos");
    return;
  }

  const { data: checklists, error: erroChecklist } =
    await supabase
      .from("vpccqe_checklist")
      .select("*");

  if (erroChecklist) {
    alert("Erro ao carregar checklist");
    return;
  }
  const {
  data: listas,
  error: erroListas
} = await supabase
  .from("vpccqe_listas")
  .select("*");

if (erroListas) {
  alert(
    "Erro ao carregar listas"
  );
  return;
}

  const planilha = veiculos.map(
    (veiculo) => {

      const checklist =
        checklists
          .filter(
            (c) =>
              c.vin === veiculo.vin
          )
          .sort(
            (a, b) =>
              b.id - a.id
          )[0];

      return {

       LISTA:
  listas.find(
    (l) =>
      l.id ===
      veiculo.lista_id
  )?.nome_lista || "",

        MODELO:
          veiculo.modelo,

        VIN:
          veiculo.vin,

        AGING:
          veiculo.aging,

        VAGA:
          veiculo.vaga,

        COR:
          veiculo.cor,

        INSPECIONADO:
          veiculo.inspecionado
            ? "SIM"
            : "NÃO",

        HMC:
          checklist?.hmc || "",

        SOC:
          checklist?.soc || "",

        DATA_BATERIA:
          checklist?.data_bateria || "",

        FUSIVEL:
          checklist?.fusivel || "",

        PNEU_DE:
          checklist?.pneu_de || "",

        PNEU_DD:
          checklist?.pneu_dd || "",

        PNEU_TE:
          checklist?.pneu_te || "",

        PNEU_TD:
          checklist?.pneu_td || "",

        RESULTADO:
          checklist?.resultado || "",

        OBSERVACAO:
          checklist?.observacao || "",

       DATA_INSPECAO:
  checklist?.data_inspecao
    ? new Date(
        checklist.data_inspecao
      ).toLocaleDateString(
        "pt-BR"
      )
    : "",
      };
    }
  );


  planilha.sort(
  (a, b) =>
    a.LISTA.localeCompare(
      b.LISTA
    )
);

const worksheet =
  XLSX.utils.json_to_sheet(
    planilha
  );
  

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "VPCCQE"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const arquivo =
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

  const hoje =
    new Date();

  const nomeArquivo =
    `VPCCQE_${
      hoje.getFullYear()
    }${
      String(
        hoje.getMonth() + 1
      ).padStart(2, "0")
    }${
      String(
        hoje.getDate()
      ).padStart(2, "0")
    }.xlsx`;

  saveAs(
    arquivo,
    nomeArquivo
  );
}