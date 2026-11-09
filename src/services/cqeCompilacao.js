import {
  obterChecklists,
} from "./cqeOffline";

export async function listarImagensCompilacao() {

  const checklists =
    await obterChecklists();

  const imagens = [];

  for (const checklist of checklists) {

    if (
      checklist.foto_identificacao
    ) {
      imagens.push(
        checklist.foto_identificacao
      );
    }

    if (
      checklist.foto_geral
    ) {
      imagens.push(
        checklist.foto_geral
      );
    }

    if (
      checklist.foto_detalhe
    ) {
      imagens.push(
        checklist.foto_detalhe
      );
    }

  }

  return imagens;
}