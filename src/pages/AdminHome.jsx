import { exportarExcel } from "../utils/exportarExcel";

export default function AdminHome({ setTela }) {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1>VPCDMS</h1>

      <h2>Painel Administrativo</h2>

      <br />

      <div>
        <button
          onClick={() =>
            setTela("dashboard")
          }
          style={{
            width: "300px",
            height: "80px",
            fontSize: "20px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          📊 Dashboard
        </button>
      </div>

      <div>
        <button
          onClick={() =>
            setTela("consulta")
          }
          style={{
            width: "300px",
            height: "80px",
            fontSize: "20px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          🔎 Consultar Ocorrências
        </button>
      </div>

      <div>
        <button
          onClick={exportarExcel}
          style={{
            width: "300px",
            height: "80px",
            fontSize: "20px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          📥 Exportar Excel
        </button>
      </div>

      <div>
        <button
          style={{
            width: "300px",
            height: "80px",
            fontSize: "20px",
          }}
        >
          ⚙ Administração
        </button>
      </div>
    </div>
  );
}