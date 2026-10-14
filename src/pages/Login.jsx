const entrar = () => {

  if (senha === "operacao2026") {

    localStorage.setItem(
      "perfil",
      "operacao"
    );

    setTela("portal");
    return;
  }

  if (senha === "admin2026") {

    localStorage.setItem(
      "perfil",
      "admin"
    );

    alert(
  localStorage.getItem(
    "perfil"
  )
);

    setTela("portal");
    return;
  }

  alert("Senha inválida");
};