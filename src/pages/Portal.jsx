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
 <h1>
  ✅ PORTAL NOVO 14/10
</h1>
<h2>
  Perfil: {perfil}
</h2>

      <p>
        Central de Aplicações VPC
      </p>

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
                width: "350px",
                height: "100px",
                fontSize: "22px",
                marginBottom:
                  "20px",
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