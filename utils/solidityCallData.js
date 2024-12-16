const { exec } = require("child_process");
const path = require("path");

async function runSnarkjs() {
  // Define la ruta al comando y los archivos de entrada
  const zkeyFilePath = path.resolve(__dirname, "./circuits/circuit_0000.zkey");
  const inputProofFilePath = path.resolve(__dirname, "./proof.json");
  const inputPublicFilePath = path.resolve(__dirname, "./public.json");

  // Comando que deseas ejecutar
  const command = `yarn run snarkjs zkey export soliditycalldata ${inputPublicFilePath} ${inputProofFilePath}`;

  // Ejecutamos el comando
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando el comando: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
}
