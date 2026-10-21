const DB_NAME = "vpccqe_offline";
const DB_VERSION = 1;

function abrirBanco() {
  return new Promise((resolve, reject) => {

    const request =
      indexedDB.open(
        DB_NAME,
        DB_VERSION
      );

    request.onupgradeneeded =
      (event) => {

        const db =
          event.target.result;

        if (
          !db.objectStoreNames.contains(
            "listas"
          )
        ) {
          db.createObjectStore(
            "listas",
            {
              keyPath: "id",
            }
          );
        }

        if (
          !db.objectStoreNames.contains(
            "veiculos"
          )
        ) {
          db.createObjectStore(
            "veiculos",
            {
              keyPath: "id",
            }
          );
        }

        if (
          !db.objectStoreNames.contains(
            "checklists"
          )
        ) {
          db.createObjectStore(
            "checklists",
            {
              keyPath: "vin",
            }
          );
        }
      };

    request.onsuccess = () =>
      resolve(request.result);

    request.onerror = () =>
      reject(request.error);
  });
}

/* =======================
   LISTAS
======================= */


export async function salvarListas(
  listas
) {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "listas",
          "readwrite"
        );

      const store =
        tx.objectStore(
          "listas"
        );

      store.clear();

      listas.forEach(
        (lista) =>
          store.put(lista)
      );

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(
            tx.error
          );
    }
  );
}


export async function obterListas() {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "listas",
          "readonly"
        );

      const store =
        tx.objectStore(
          "listas"
        );

      const request =
        store.getAll();

      request.onsuccess =
        () =>
          resolve(
            request.result
          );

      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}

/* =======================
   VEÍCULOS
======================= */

export async function salvarVeiculos(
  veiculos
) {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "veiculos",
          "readwrite"
        );

      const store =
        tx.objectStore(
          "veiculos"
        );

      store.clear();

      veiculos.forEach(
        (veiculo) =>
          store.put(veiculo)
      );

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(
            tx.error
          );
    }
  );
}

export async function obterVeiculos() {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "veiculos",
          "readonly"
        );

      const store =
        tx.objectStore(
          "veiculos"
        );

      const request =
        store.getAll();

      request.onsuccess =
        () =>
          resolve(
            request.result
          );

      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}

/* =======================
   CHECKLISTS
======================= */

export async function salvarChecklist(
  checklist
) {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "checklists",
          "readwrite"
        );

      const store =
        tx.objectStore(
          "checklists"
        );

      store.put({
        ...checklist,
        enviado: false,
      });

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(
            tx.error
          );
    }
  );
}

export async function obterChecklists() {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "checklists",
          "readonly"
        );

      const store =
        tx.objectStore(
          "checklists"
        );

      const request =
        store.getAll();

      request.onsuccess =
        () =>
          resolve(
            request.result
          );

      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}

export async function obterChecklistsPendentes() {

  const todos =
    await obterChecklists();

  return todos.filter(
    (item) =>
      item.enviado ===
      false
  );
}

export async function marcarComoEnviado(
  vin
) {



  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "checklists",
          "readwrite"
        );

      const store =
        tx.objectStore(
          "checklists"
        );

      const request =
        store.get(vin);

      request.onsuccess =
        () => {

          const registro =
            request.result;

          if (
            !registro
          ) {
            resolve();
            return;
          }

          registro.enviado =
  true;

const updateRequest =
  store.put(
    registro
  );

updateRequest.onsuccess =
  () => resolve();

updateRequest.onerror =
  () =>
    reject(
      updateRequest.error
    );

        };

      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}

export async function marcarVeiculoInspecionado(
  vin
) {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          "veiculos",
          "readwrite"
        );

      const store =
        tx.objectStore(
          "veiculos"
        );

      const request =
        store.getAll();

      request.onsuccess =
        () => {

          const veiculo =
            request.result.find(
              (v) =>
                v.vin === vin
            );

          if (!veiculo) {
            resolve();
            return;
          }

          veiculo.inspecionado =
            true;

          const updateRequest =
  store.put(
    veiculo
  );

updateRequest.onsuccess =
  () => resolve();

updateRequest.onerror =
  () =>
    reject(
      updateRequest.error
    );
        };

      request.onerror =
        () =>
          reject(
            request.error
          );
    }
  );
}
export async function limparBancoOffline() {

  const db =
    await abrirBanco();

  return new Promise(
    (resolve, reject) => {

      const tx =
        db.transaction(
          [
            "listas",
            "veiculos",
            "checklists",
          ],
          "readwrite"
        );

      tx.objectStore(
        "listas"
      ).clear();

      tx.objectStore(
        "veiculos"
      ).clear();

      tx.objectStore(
        "checklists"
      ).clear();

      tx.oncomplete =
        () => resolve();

      tx.onerror =
        () =>
          reject(
            tx.error
          );
    }
  );
}