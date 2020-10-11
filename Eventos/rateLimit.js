const d = new Date();
const hora = `${d.getHours() - 3}:${d.getMinutes()}:${d.getSeconds()} `

module.exports = async (client, info) => {
  console.log(hora, 'Evento \`rateLimit\` emitido...');
  console.log(info);
}