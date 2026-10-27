export default function VPCCQEMobile({
  setTela,
}) {
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
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
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

      <button style={estiloBotao}>
        ☁️ ENVIAR INFORMAÇÃO
      </button>

      <button style={estiloBotao}>
        🔄 SINCRONIZAR DADOS
      </button>
    </div>
  );
}