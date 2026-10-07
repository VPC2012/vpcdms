import { supabase } from "./supabase";

export async function uploadFoto(
  arquivo,
  nomeArquivo
) {
  const { error } =
    await supabase.storage
      .from("ocorrencias")
      .upload(nomeArquivo, arquivo, {
        upsert: true,
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabase.storage
      .from("ocorrencias")
      .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}