import {
  Filesystem,
  Directory,
} from "@capacitor/filesystem";

export async function salvarFoto(
  vin,
  tipo,
  dataUrl
) {
  try {

    const agora =
  new Date();

const data =
  `${agora.getFullYear()}${String(
    agora.getMonth() + 1
  ).padStart(2, "0")}${String(
    agora.getDate()
  ).padStart(2, "0")}`;

const hora =
  `${String(
    agora.getHours()
  ).padStart(2, "0")}${String(
    agora.getMinutes()
  ).padStart(2, "0")}${String(
    agora.getSeconds()
  ).padStart(2, "0")}`;

const nomeArquivo =
  `${vin}_${tipo}_${data}_${hora}.jpg`;

    const base64 =
      dataUrl.split(",")[1];

    await Filesystem.writeFile({
      path: nomeArquivo,
      data: base64,
      directory: Directory.Data,
    });

    return nomeArquivo;

  } catch (erro) {

    console.error(
      "Erro ao salvar foto:",
      erro
    );

    throw erro;
  }
}

export async function obterFoto(
  nomeArquivo
) {
  try {

    const arquivo =
      await Filesystem.readFile({
        path: nomeArquivo,
        directory: Directory.Data,
      });

    return (
      `data:image/jpeg;base64,${arquivo.data}`
    );

  } catch {

    return null;

  }
}
export async function excluirFoto(
  nomeArquivo
) {
  try {

    if (!nomeArquivo)
      return;

    await Filesystem.deleteFile({
      path: nomeArquivo,
      directory: Directory.Data,
    });

  } catch (erro) {

    console.error(
      "Erro ao excluir foto:",
      erro
    );

  }
}