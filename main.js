`use strict`;

const { requestI2CAccess } = require("node-web-i2c");
const SHT30 = require("@chirimen/sht30");
const adc = require("mcp-spi-adc");
const { requestGPIOAccess } = require("node-web-gpio");


function sleep(time){
	const d1 = new Date();
	while(true){
		const d2 = new Date();
		if(d2 - d1 > time){
			return;
		}
	}
}

async function measure(sht30){
//	while(true){
	const {humidity, temperature} = await sht30.readData();
	b = temperature.toFixed(2);
	c = humidity.toFixed(2);
	await sleep(50);
//	document.getElementById("temperatureDisplay").innerHTML = `${temperature.toFixed(2)} ℃'`
//	document.getElementById("humidityDisplay").innerHTML = `${humidity.toFixed(2)} %`;
//	console.log(`${temperature.toFixed(2)}`);
//		await sleep(500);
//	}
}

var a;
var b;
var c;
async function measureadc(){
	try{
	var gas = adc.openMcp3002(0, async err => {
		if (err) throw err;
		await gas.read((err, reading) => {
			if (err) throw err;
			//console.log((reading.value * 3.3));
			a = (reading.value * 5);
		});
	});
	}catch(err){
		console.log(err.message);
	}
}


async function main(){
//	const threshold = 500;
	const gpioAccess = await requestGPIOAccess();
	const port3 = gpioAccess.ports.get(19);
	const port4 = gpioAccess.ports.get(26);
	await port3.export("out");
	await port4.export("out");

	const i2cAccess = await requestI2CAccess();
	const i2c1 = i2cAccess.ports.get(1);
	const sht30 = new SHT30(i2c1, 0x44);
	await sht30.init();
	var i = 0;
	setInterval(async _ => {
//		await sleep(0.237);
		await port3.write(1);
		await sleep(0.003);
		await measureadc();
		await sleep(0.002);
		await port3.write(0);
		await port4.write(1);
		await sleep(0.008);
		await port4.write(0);
	 	console.log(a);
		if (i==3) {
			await measure(sht30);
			console.log(b);
			console.log(c);
			i = 0;
		}
		i++;
	},237);
}

main();
