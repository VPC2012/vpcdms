import { supabase } from "./supabase";

export async function uploadFoto(
  arquivo,
  nomeArquivo
) {
  try {
    const { data, error } =
      await supabase.storage
        .from("ocorrencias")
        .upload(nomeArquivo, arquivo, {
          upsert: true,
        });

    if (error) {
      alert(
        "ERRO STORAGE: " +
          error.message
      );

      throw error;
    }

    const resultado =
      supabase.storage
        .from("ocorrencias")
        .getPublicUrl(
          nomeArquivo
        );

    alert(
      "UPLOAD OK: " +
        nomeArquivo
    );

    return resultado.data.publicUrl;

  } catch (error) {

    alert(
      "ERRO UPLOAD: " +
        error.message
    );

    throw error;
  }
}