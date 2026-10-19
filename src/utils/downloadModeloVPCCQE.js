import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function baixarModeloVPCCQE() {

  const modelo = [
    {
      LISTA: 1,
      "Model Code": "1PA",
      "Vehicle Serial":
        "9BHB651FAVP022802",
      Aging: 33,
      VAGA: "C-I-014",
      COR: "W9A",
    },
  ];

  const worksheet =
    XLSX.utils.json_to_sheet(
      modelo
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "MODELO"
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

  saveAs(
    arquivo,
    "MODELO_IMPORTACAO_VPCCQE.xlsx"
  );
}