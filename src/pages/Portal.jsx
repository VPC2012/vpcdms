
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
  Vehicle Processing Center
</h2>

 
<button
  onClick={() => {
    localStorage.clear();
    setTela("login");
  }}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "8px 15px",
  }}
>
  🚪 Sair
</button>

     <p
  style={{
    color: "#666",
    marginTop: "10px",
    marginBottom: "20px",
  }}
>
  Portal Operacional
</p>

<div
  style={{
    margin: "20px auto",
    maxWidth: "900px",
  }}
>
  <img
    src={patio}
    alt="Pátio Hyundai"
    style={{
      width: "100%",
      borderRadius: "20px",
   boxShadow:
 "0 4px 10px rgba(0,0,0,0.10)",
    }}
  />
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
  maxWidth: "600px",
  height: "120px",
  fontSize: "22px",
  marginBottom: "20px",
  borderRadius: "16px",
  border: "none",
  boxShadow:
    "0 4px 10px rgba(0,0,0,0.10)",
  backgroundColor: "#ffffff",
  cursor: "pointer",
}}
            >
              🚗 VPCDMS
              <br />
              Nova Ocorrência
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
                width: "350px",
                height: "100px",
                fontSize: "22px",
              }}
            >
              📋 VPCCQE
              <br />
              Checklist
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