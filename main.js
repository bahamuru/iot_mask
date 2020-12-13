'use strict';

const { requestI2CAccess } = require("node-web-i2c");
const SHT30 = require("@chirimen/sht30");

function sleep(time){
	const d1 = new Date();
	while(true){
		const d2 = new Date();
		if(d2 - d1 > time){
			return;
		}
	}
}

async function measure(){
	const i2cAccess = await requestI2CAccess();
	const i2c1 = i2cAccess.ports.get(1);
	const sht30 = new SHT30(i2c1, 0x44);
	await sht30.init();
	while(true){
		const {humidity, temperature} = await sht30.readData();
//	document.getElementById("temperatureDisplay").innerHTML = `${temperature.toFixed(2)} ℃'`
//	document.getElementById("humidityDisplay").innerHTML = `${humidity.toFixed(2)} %`;
		console.log(`${temperature.toFixed(2)}`);
		await sleep(500);
	}
}



measure();
