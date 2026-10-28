import {
  salvarListas,
  salvarVeiculos,
  obterChecklistsPendentes,
  marcarComoEnviado,
  limparChecklistsOffline,
} from "../services/cqeOffline";

import { supabase } from "../services/supabase";

export default function VPCCQEMobile({
  setTela,
}) {

  const atualizarListaCQE =
    async () => {

      const pendentes =
        await obterChecklistsPendentes();

      if (
        pendentes.length > 0
      ) {
        alert(
          `⚠️ Existem ${pendentes.length} checklists pendentes de envio.\n\nEnvie as informações antes de sincronizar os dados.`
        );
        return;
      }

      try {

        const {
          data: listas,
          error: erroListas,
        } = await supabase
          .from("vpccqe_listas")
          .select("*");

        if (erroListas) {
          alert(
            "Erro ao carregar listas."
          );
          return;
        }

        const {
          data: veiculos,
          error: erroVeiculos,
        } = await supabase
          .from(
            "vpccqe_lista_veiculos"
          )
          .select("*");

        if (erroVeiculos) {
          alert(
            "Erro ao carregar veículos."
          );
          return;
        }

        const {
          data: checklists,
          error: erroChecklists,
        } = await supabase
          .from("vpccqe_checklist")
          .select("*");

        if (erroChecklists) {
          alert(
            "Erro ao carregar checklists."
          );
          return;
        }

        if (
          (checklists || [])
            .length === 0
        ) {
          await limparChecklistsOffline();
        }

        await salvarListas(
          listas || []
        );

        const veiculosAtualizados =
          (veiculos || []).map(
            (veiculo) => ({
              ...veiculo,
              inspecionado:
                (
                  checklists || []
                ).some(
                  (
                    checklist
                  ) =>
                    checklist.vin ===
                    veiculo.vin
                ),
            })
          );

        await salvarVeiculos(
          veiculosAtualizados
        );

        alert(
          `✅ Dados sincronizados com sucesso.\n\n${veiculos.length} veículos carregados.`
        );

      } catch (erro) {

        console.error(
          erro
        );

        alert(
          "Erro ao sincronizar dados."
        );
      }
    };

  const enviarInformacao =
    async () => {

      try {

        const pendentes =
          await obterChecklistsPendentes();

        if (
          pendentes.length === 0
        ) {
          alert(
            "Nenhum checklist pendente para envio."
          );
          return;
        }

        let enviados = 0;

        for (
          const checklist of pendentes
        ) {

          const resultado =
            await supabase
              .from(
                "vpccqe_checklist"
              )
              .upsert({
                lista_id:
                  checklist.lista_id,

                vin:
                  checklist.vin,

                resultado:
                  checklist.resultado,

                hmc:
                  checklist.hmc,

                soc:
                  checklist.soc,

                data_bateria:
                  checklist.data_bateria ||
                  null,

                fusivel:
                  checklist.fusivel,

                pneu_di:
                  checklist.pneu_de,

                pneu_dd:
                  checklist.pneu_dd,

                pneu_te:
                  checklist.pneu_te,

                pneu_td:
                  checklist.pneu_td,

                observacao:
                  checklist.observacao,

                data_inspecao:
                  checklist.data_inspecao,
              });

          if (
            !resultado.error
          ) {

            await marcarComoEnviado(
              checklist.vin
            );

            enviados++;
          }
        }

        alert(
          `✅ ${enviados} checklists enviados com sucesso.`
        );

      } catch (erro) {

        console.error(
          erro
        );

        alert(
          "Erro ao enviar informações."
        );
      }
    };

  const estiloBotao = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #dfe6ee",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    color: "#002C5F",
    boxShadow:
      "0 2px 6px rgba(0,0,0,0.05)",
  };

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor:
          "#f4f4f4",
        minHeight: "100vh",
        fontFamily:
          "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() =>
          setTela("portal")
        }
      >
        ← Voltar
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "15px",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            color: "#002C5F",
            marginBottom: "5px",
          }}
        >
          HYUNDAI
        </h1>

        <h2
          style={{
            margin: 0,
          }}
        >
          VPCCQE MOBILE
        </h2>
      </div>

      <h3
        style={{
          color: "#002C5F",
          marginBottom: "10px",
        }}
      >
        🔄 Comunicação
      </h3>

      <button
        onClick={
          enviarInformacao
        }
        style={estiloBotao}
      >
        ☁️ ENVIAR INFORMAÇÃO
      </button>

      <button
        onClick={
          atualizarListaCQE
        }
        style={estiloBotao}
      >
        🔄 SINCRONIZAR DADOS
      </button>

    </div>
  );
}