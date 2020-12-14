'use strict';

const { requestI2CAccess } = require("node-web-i2c");
//const SHT30 = require("@chirimen/sht30");
const spi = require("spi-device");

function sleep(time){
	const d1 = new Date();
	while(true){
		const d2 = new Date();
		if(d2 - d1 > time){
			return;
		}
	}
}
/* 温度センサ
async function measure(){
	const i2cAccess = await requestI2CAccess();
	const i2c1 = i2cAccess.ports.get(1);
	const sht30 = new SHT30(i2c1, 0x44);
	await sht30.init();
//	while(true){
		const {humidity, temperature} = await sht30.readData();
//	document.getElementById("temperatureDisplay").innerHTML = `${temperature.toFixed(2)} ℃'`
//	document.getElementById("humidityDisplay").innerHTML = `${humidity.toFixed(2)} %`;
		console.log(`${temperature.toFixed(2)}`);
//		await sleep(500);
//	}
}
//measure();
*/

async function measureadc(){
const adc = new spi.open(0,0,async err =>{
	const message = [{
		sendBuffer:Buffer.from([0x01,0x80, 0x00]),
		receiveBuffer: Buffer.alloc(3),
		byteLength: 3,
		speedHz: 20000
	}];

	if (err) throw err;
//	console.log(adc.transferSync(message)[0]);
//	while(true){
		adc.transfer(message, async (err,message) => {
		if (err) throw err;


		const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) + message[0].receiveBuffer[2];
		const voltage = rawValue * 3.3 / 1023;
		console.log(voltage);

	});

//	await sleep(1000);
//	}
});

//await adc.close();
}

async function main(){
	setInterval(_ => {
	measure();
	measureadc();
	},1000);
}

main();
