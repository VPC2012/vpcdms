import {
  obterChecklistsNaoCompilados,
  marcarImagensCompiladas,
} from "./cqeOffline";

import {
  lerFotoBase64,
} from "./cqeEvidencias";

import {
  Filesystem,
  Directory,
} from "@capacitor/filesystem";

import JSZip from "jszip";

export async function compilarImagens() {

  const checklists =
    await obterChecklistsNaoCompilados();

  const zip =
    new JSZip();

  const hoje =
    new Date();

  const vinsCompilados = [];

  let total = 0;

  for (const checklist of checklists) {

    const imagens = [
      checklist.foto_identificacao,
      checklist.foto_geral,
      checklist.foto_detalhe,
    ];

    for (const imagem of imagens) {

      if (!imagem)
        continue;

      const base64 =
        await lerFotoBase64(
          imagem
        );

      if (!base64)
        continue;

      zip.file(
        imagem,
        base64,
        {
          base64: true,
        }
      );

      total++;

    }

    vinsCompilados.push(
      checklist.vin
    );

  }

  const conteudoZip =
    await zip.generateAsync({
      type: "base64",
    });

  const timestamp =
    `${hoje.getFullYear()}${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}${String(
      hoje.getDate()
    ).padStart(2, "0")}_${String(
      hoje.getHours()
    ).padStart(2, "0")}${String(
      hoje.getMinutes()
    ).padStart(2, "0")}${String(
      hoje.getSeconds()
    ).padStart(2, "0")}`;

  const nomeZip =
    `VPCCQE_COMPILACAO_${timestamp}.zip`;

  await Filesystem.writeFile({
    path: nomeZip,
    data: conteudoZip,
    directory: Directory.Documents,
  });

  for (const vin of vinsCompilados) {

    await marcarImagensCompiladas(
      vin
    );

  }

  return {
    arquivo: nomeZip,
    total,
  };

}