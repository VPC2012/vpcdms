
import patio from "../assets/patio-oficial.jpg";

export default function Portal({
  setTela,
}) {

  const perfil =
    localStorage.getItem(
      "perfil"
    );
    console.log(
  "PERFIL:",
  perfil
);

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "80px",
        fontFamily: "Arial",
      }}
    >
 

<div
  style={{
    position: "relative",
    maxWidth: "900px",
    margin: "20px auto",
    height: "260px",
    overflow: "hidden",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
  }}
>
  <img
    src={patio}
    alt="Pátio Hyundai"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.18,
    }}
  />

  <div
    style={{
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <h1
      style={{
        color: "#002C5F",
        fontSize: "52px",
        marginBottom: "10px",
      }}
    >
      HYUNDAI
    </h1>

    <h2
      style={{
        margin: 0,
      }}
    >
      Vehicle Processing Center
    </h2>

    <p
      style={{
        color: "#666",
        marginTop: "15px",
        fontSize: "18px",
      }}
    >
      Portal Operacional
    </p>
  </div>
</div>


<br />

      
      {perfil === "operacao" && (
        <>
          <div>
            <button
              onClick={() =>
                setTela(
                  "operacao"
                )
              }
    style={{
  width: "100%",
  maxWidth: "700px",
  minHeight: "130px",
  borderRadius: "20px",
  border: "none",
  backgroundColor: "#ffffff",
  boxShadow:
    "0 6px 15px rgba(0,0,0,0.10)",
  marginBottom: "20px",
  cursor: "pointer",
  padding: "20px",
}}
           >
  🚗 VPCDMS

  <br />
  <br />

  <span
    style={{
      fontSize: "16px",
      color: "#666",
    }}
  >
    Gestão de Ocorrências
  </span>
</button>

          </div>

          <div>
           <button
  onClick={() =>
    setTela(
      "vpccqe"
    )
  }
  style={{
    width: "100%",
    maxWidth: "700px",
    minHeight: "130px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 6px 15px rgba(0,0,0,0.10)",
    marginBottom: "20px",
    cursor: "pointer",
    padding: "20px",
  }}
>
  📋 VPCCQE

  <br />
  <br />

  <span
    style={{
      fontSize: "16px",
      color: "#666",
    }}
  >
    Controle de Qualidade
    <br />
    de Estoque (CQE)
  </span>
</button>
          </div>
        </>
      )}

      {perfil === "admin" && (
        <>
          <div>
            <button
              onClick={() =>
                setTela(
                  "admin"
                )
              }
              style={{
                width: "350px",
                height: "100px",
                fontSize: "22px",
                marginBottom:
                  "20px",
              }}
            >
              🚗 VPCDMS
              <br />
              Dashboard /
              Consulta /
              Administração
            </button>
          </div>

          <div>
            <button
              onClick={() =>
                setTela(
                  "vpccqe-admin"
                )
              }
              style={{
                width: "350px",
                height: "100px",
                fontSize: "22px",
              }}
            >
              📋 VPCCQE
              <br />
              Importar /
              Exportar
            </button>
          </div>
        </>
      )}
    </div>
  );
}