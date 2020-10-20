const d = Date.now() - 10800000;
let hora = `${new Date(d).getHours() - 3}:${new Date(d).getMinutes()}:${new Date(d).getSeconds()} `;

module.exports = async (client, info) => {
  console.log(hora, 'Evento \`rateLimit\` emitido...');
  console.log(info);
}