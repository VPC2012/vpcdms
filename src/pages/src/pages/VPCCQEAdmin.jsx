export default function VPCCQEAdmin({
  setTela,
}) {
  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <button
        onClick={() =>
          setTela("portal")
        }
      >
        ← Voltar
      </button>

      <h1>
        📋 VPCCQE ADMIN
      </h1>

      <br />

      <button>
        📥 Importar Lista
      </button>

      <br />
      <br />

      <button>
        📤 Exportar Resultado
      </button>
    </div>
  );
}