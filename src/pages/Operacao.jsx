import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Operacao() {
  const [modelo, setModelo] = useState("GHA");
  const [serial, setSerial] = useState("");

  const [peca, setPeca] = useState("Para-choque dianteiro");
  const [defeito, setDefeito] = useState("Amassado");
  const [classificacao, setClassificacao] = useState("Leve");
  const [necessitaTroca, setNecessitaTroca] =
    useState("Não");

  const [tempoReparo, setTempoReparo] =
    useState("");

  const [responsabilidade, setResponsabilidade] =
    useState("Glovis");

  const [observacao, setObservacao] =
    useState("");

  const [
    fotoIdentificacao,
    setFotoIdentificacao,
  ] = useState(null);

  const [fotoGeral, setFotoGeral] =
    useState(null);

  const [fotoDetalhe, setFotoDetalhe] =
    useState(null);

  const gerarNumeroOcorrencia = () =>
    "AV-" +
    new Date().getFullYear() +
    "-" +
    String(Date.now()).slice(-6);

  const [numeroOcorrencia] = useState(
    gerarNumeroOcorrencia()
  );

  const vin = modelo + serial;

  const agora = new Date();

  const dataAtual =
    agora.toLocaleDateString("pt-BR");

  const horaAtual =
    agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  function calcularTurno() {
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    const horario = hora * 60 + minuto;

    if (horario >= 361 && horario <= 948) {
      return "1º Turno";
    }

    if (horario >= 949 || horario <= 64) {
      return "2º Turno";
    }

    return "3º Turno";
  }

  const turno = calcularTurno();

  const salvarOcorrencia = async () => {
    if (
      !fotoIdentificacao ||
      !fotoGeral ||
      !fotoDetalhe
    ) {
      alert(
        "As 3 fotos são obrigatórias."
      );
      return;
    }

    const { error } = await supabase
      .from("ocorrencias")
      .insert([
        {
          numero_ocorrencia:
            numeroOcorrencia,

          data_ocorrencia:
            dataAtual,

          hora_ocorrencia:
            horaAtual,

          modelo,
          serial,
          vin,

          peca,
          defeito,

          classificacao,

          necessita_troca:
            necessitaTroca,

          tempo_reparo:
            Number(tempoReparo),

          responsabilidade,

          observacao,

          turno,

          status: "Aberto",
        },
      ]);

    if (error) {
      alert(
        "Erro ao salvar: " +
          error.message
      );
      return;
    }

    alert(
      "✅ Ocorrência salva com sucesso!"
    );

    window.location.reload();
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1>Nova Ocorrência</h1>

      <p>
        <strong>Ocorrência:</strong>{" "}
        {numeroOcorrencia}
      </p>

      <p>
        <strong>Data:</strong>{" "}
        {dataAtual}
      </p>

      <p>
        <strong>Hora:</strong>{" "}
        {horaAtual}
      </p>

      <p>
        <strong>Turno:</strong>{" "}
        {turno}
      </p>

      <hr />

      <h3>
        Identificação do Veículo
      </h3>

      <p>Modelo</p>

      <select
        value={modelo}
        onChange={(e) =>
          setModelo(e.target.value)
        }
      >
        <option>GHA</option>
        <option>GHF</option>
        <option>SU2</option>
        <option>1PA</option>
      </select>

      <p>Serial</p>

      <input
        type="text"
        maxLength="6"
        value={serial}
        onChange={(e) =>
          setSerial(e.target.value)
        }
      />

      <p>
        <strong>VIN:</strong> {vin}
      </p>

      <hr />

      <h3>Dados da Avaria</h3>

      <p>Peça</p>

      <select
        value={peca}
        onChange={(e) =>
          setPeca(e.target.value)
        }
      >
        <option>
          Para-choque dianteiro
        </option>
        <option>
          Para-choque traseiro
        </option>
        <option>Capô</option>
        <option>
          Porta dianteira esquerda
        </option>
        <option>
          Porta dianteira direita
        </option>
        <option>
          Porta traseira esquerda
        </option>
        <option>
          Porta traseira direita
        </option>
        <option>
          Retrovisor esquerdo
        </option>
        <option>
          Retrovisor direito
        </option>
      </select>

      <p>Defeito</p>

      <select
        value={defeito}
        onChange={(e) =>
          setDefeito(e.target.value)
        }
      >
        <option>Amassado</option>
        <option>Risco</option>
        <option>Trinca</option>
        <option>Quebra</option>
        <option>Pintura</option>
        <option>
          Desalinhamento
        </option>
      </select>

      <p>Classificação</p>

      <select
        value={classificacao}
        onChange={(e) =>
          setClassificacao(
            e.target.value
          )
        }
      >
        <option>Leve</option>
        <option>Moderada</option>
        <option>Grave</option>
      </select>

      <p>
        Necessita Troca da Peça?
      </p>

      <select
        value={necessitaTroca}
        onChange={(e) =>
          setNecessitaTroca(
            e.target.value
          )
        }
      >
        <option>Não</option>
        <option>Sim</option>
      </select>

      <p>
        Tempo de Reparo (Horas)
      </p>

      <input
        type="number"
        step="0.5"
        value={tempoReparo}
        onChange={(e) =>
          setTempoReparo(
            e.target.value
          )
        }
      />

      <p>Responsabilidade</p>

      <select
        value={responsabilidade}
        onChange={(e) =>
          setResponsabilidade(
            e.target.value
          )
        }
      >
        <option>Glovis</option>
        <option>
          Transportadora
        </option>
        <option>HMMB</option>
        <option>
          Em Análise
        </option>
      </select>

      <hr />

      <h3>
        Fotos Obrigatórias
      </h3>

      <p>
        Foto 1 - Identificação
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) =>
          setFotoIdentificacao(
            e.target.files[0]
          )
        }
      />

      {fotoIdentificacao && (
        <p>
          ✅ {fotoIdentificacao.name}
        </p>
      )}

      <br />

      <p>
        Foto 2 - Visão Geral
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) =>
          setFotoGeral(
            e.target.files[0]
          )
        }
      />

      {fotoGeral && (
        <p>
          ✅ {fotoGeral.name}
        </p>
      )}

      <br />

      <p>
        Foto 3 - Detalhe
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) =>
          setFotoDetalhe(
            e.target.files[0]
          )
        }
      />

      {fotoDetalhe && (
        <p>
          ✅ {fotoDetalhe.name}
        </p>
      )}

      <hr />

      <p>Observação</p>

      <textarea
        rows="4"
        cols="60"
        value={observacao}
        onChange={(e) =>
          setObservacao(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={salvarOcorrencia}
      >
        Salvar Ocorrência
      </button>
    </div>
  );
}