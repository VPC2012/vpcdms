import patio from "../assets/patio-oficial.jpg";

export default function Portal({
  setTela,
}) {

  const perfil =
    localStorage.getItem(
      "perfil"
    );

  const cardStyle = {
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
  };

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "40px",
        fontFamily: "Arial",
        backgroundColor:
          "#f4f4f4",
        minHeight: "100vh",
      }}
    >

      <button
        onClick={() => {
          localStorage.clear();
          setTela("login");
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
        }}
      >
        🚪 Sair
      </button>

      <div
        style={{
          position: "relative",
          maxWidth: "900px",
          margin: "20px auto",
          height: "150px",
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
            opacity: 0.10,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent:
              "center",
            alignItems:
              "center",
            height: "100%",
          }}
        >
          <h1
            style={{
              color:
                "#002C5F",
              fontSize:
                "38px",
              marginBottom:
                "10px",
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
              style={
                cardStyle
              }
            >
              🚗 VPCDMS

              <br />
              <br />

              <span
                style={{
                  fontSize:
                    "16px",
                  color:
                    "#666",
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
              style={
                cardStyle
              }
            >
              📋 VPCCQE

              <br />
              <br />

              <span
                style={{
                  fontSize:
                    "16px",
                  color:
                    "#666",
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
              style={
                cardStyle
              }
            >
              🚗 VPCDMS

              <br />
              <br />

              <span
                style={{
                  fontSize:
                    "16px",
                  color:
                    "#666",
                }}
              >
                Dashboard, Consulta
                <br />
                e Administração
              </span>
            </button>
          </div>

          <div>
            <button
              onClick={() =>
                setTela(
                  "vpccqe-admin"
                )
              }
              style={
                cardStyle
              }
            >
              📋 VPCCQE

              <br />
              <br />

              <span
                style={{
                  fontSize:
                    "16px",
                  color:
                    "#666",
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
    </div>
  );
}