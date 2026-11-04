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

    const nomeArquivo =
      `${vin}_${tipo}.jpg`;

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