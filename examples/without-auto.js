"use strict";

// #############
// Alternative usage
// - see "Alternative usage" section in README for an explanation
// #############

import { NFC } from '../src/index';


const nfc = new NFC(); // optionally you can pass logger

nfc.on('reader', reader => {

	// disable auto processing
	reader.autoProcessing = false;
	debugger;
	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', async card => {

		// card is object containing following data
		// String standard: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
		// String type: same as standard
		// Buffer atr
		debugger;
		console.log(`${reader.reader.name}  card inserted`, card);

		// you can use reader.transmit to send commands and retrieve data FF:CA:00:00:00
		// see https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L288 
		const packet = Buffer.from([
			0xff, // Class
			0xca, // INS
			0x00, // P1
			0x00, // P2
			0x00, // Lc
		]);
		try {

			const response = await reader.transmit(packet, 40);

			if (response.length === 2 && response.readUInt16BE(0) === 0x6a82) {

				const err = new Error(`Not found response. Tag not compatible with AID ${aid.toString('hex').toUpperCase()}.`);
				this.emit('error', err);

				return;
			}
			console.log('RESPUESTA ADU....', response);

			if (response.length < 2) {

				const err = new Error(`Invalid response length ${response.length}. Expected minimal length is 2 bytes.`);
				this.emit('error', err);

				return;
			}

			// another possibility const statusCode = parseInt(response.slice(-2).toString('hex'), 16)
			const statusCode = response.slice(-2).readUInt16BE(0);

			// an error occurred
			if (statusCode !== 0x9000) {

				const err = new Error(`Response status error.`);
				this.emit('error', err);

				return;
			}

			// strip out the status code
			const data = response.slice(0, -2);

			console.log('Dataaa.... ', data)

		} catch (err) {

			console.log('errorrrrr ..... ' , err)

		}


	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});
