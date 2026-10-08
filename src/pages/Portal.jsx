export default function Portal({ setTela }) {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "80px",
        fontFamily: "Arial",
      }}
    >
      <h1>🌐 VPC PORTAL</h1>

      <p>Central de Aplicações VPC</p>

      <br />

      <div>
        <button
          onClick={() => setTela("admin")}
          style={{
            width: "350px",
            height: "100px",
            fontSize: "22px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          🚗 VPCDMS
        </button>
      </div>

      <div>
        <button
          onClick={() => setTela("vpccqe")}
          style={{
            width: "350px",
            height: "100px",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          📋 VPCCQE
        </button>
      </div>
    </div>
  );
}
``