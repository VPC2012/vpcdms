import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { supabase } from "../services/supabase";

export async function exportarExcel() {
  const { data, error } = await supabase
    .from("ocorrencias")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    alert("Erro ao exportar Excel");
    return;
  }

  const planilha = data.map((item) => ({
    ID: item.id,
    "Número Ocorrência":
      item.numero_ocorrencia,

    Data: item.data_ocorrencia,

    Hora: item.hora_ocorrencia,

    Turno: item.turno,

    Modelo: item.modelo,

    Serial: item.serial,

    VIN: item.vin,

    Peça: item.peca,

    Defeito: item.defeito,

    Classificação:
      item.classificacao,

    "Necessita Troca":
      item.necessita_troca,

    "Tempo Reparo":
      item.tempo_reparo,

    Responsabilidade:
      item.responsabilidade,

    Status: item.status,

    Observação:
      item.observacao,

    "Foto Identificação":
      item.foto_identificacao,

    "Foto Geral":
      item.foto_geral,

    "Foto Detalhe":
      item.foto_detalhe,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      planilha
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Ocorrências"
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

  const hoje = new Date();

  const nomeArquivo =
    `VPCDMS_${
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