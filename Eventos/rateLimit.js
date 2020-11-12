function hora() {
	const dataUTC = new Date(new Date().toUTCString());
	const dataBR = new Date(dataUTC.getTime() - 10800000);
	
	let hora = `${dataBR.toISOString().slice(11, -1)} `;
	return hora
}

module.exports = async (client, info) => {
  console.log(hora(), 'Evento \`rateLimit\` emitido...');
  //console.log(info);
}