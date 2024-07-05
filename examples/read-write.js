"use strict";

// #############
// Example: Reading and writing data
// - should work well with any compatible PC/SC card reader
// - tested with MIFARE Ultralight cards but should work with many others (e.g. NTAG)
// - what is covered:
//   - example reading and writing data on from/to card
// - NOTE! for reading and writing data from/to MIFARE Classic please see examples/mifare-classic.js which explains MIFARE Classic specifics
// #############

import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from '../src/index';
import pretty from './pretty-logger';


const nfc = new NFC(); // const nfc = new NFC(pretty); // optionally you can pass logger to see internal debug logs

nfc.on('reader', async reader => {

	pretty.info(`device attached`, reader);

	// enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
	// when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
	// the response is available as card.data in the card event
	// you can set reader.aid to:
	// 1. a HEX string (which will be parsed automatically to Buffer)
	reader.aid = 'F222222222';
	// 2. an instance of Buffer containing the AID bytes
	// reader.aid = Buffer.from('F222222222', 'hex');
	// 3. a function which must return an instance of a Buffer when invoked with card object (containing standard and atr)
	//    the function may generate AIDs dynamically based on the detected card
	// reader.aid = ({ standard, atr }) => {
	//
	// 	return Buffer.from('F222222222', 'hex');
	//
	// };

	reader.on('card', async card => {

		pretty.info(`card detected`, reader, card);

		// example reading 4 bytes assuming containing 16bit integer
		// !!! note that we don't need 4 bytes - 16bit integer takes just 2 bytes !!!
		try {

			// reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
			// - blockNumber - memory block number where to start reading
			// - length - how many bytes to read
			// - blockSize - 4 for MIFARE Ultralight, 16 for MIFARE Classic
			// ! Caution! length must be divisible by blockSize (we have to read the whole block(s))

			const data = await reader.read(4, 4);

			pretty.info(`data read`, reader, data);

			const payload = data.readInt16BE(0);

			pretty.info(`data converted`, reader, payload);

		} catch (err) {
			pretty.error(`error when reading data`, reader, err);
		}


		// example write 4 bytes containing 16bit integer
		// !!! note that we don't need 16 bytes - 16bit integer takes just 2 bytes !!!
		try {

			/*
			// reader.write(blockNumber, data, blockSize = 4, packetSize = 16)
			// - blockNumber - memory block number where to start writing
			// - data - what to write
			// - blockSize - 4 for MIFARE Ultralight, 16 for MIFARE Classic
			// ! Caution! data.length must be divisible by blockSize (we have to write the whole block(s))

			// const data = Buffer.allocUnsafe(4).fill(0);
			// const randomNumber = Math.round(Math.random() * 1000);
			// data.write('https://registro.aplicacionesincontacto.com/NFC/#A67CR78UIS80S', 0);
			// let ndef = require('ndef');
			// let message = [
			// 	ndef.uriRecord('https://registro.aplicacionesincontacto.com/NFC/#A67CR78UIS80S')
			// ];
			// let byteArray = ndef.encodeMessage(message);
			// let buffer = Buffer.from(byteArray);
			var ndef = require('@taptrack/ndef');
			// creating message to be carried inside smartposter record
			var uri = ndef.Utils.createUriRecord("http://www.google.com");
			var payloadMsg = new ndef.Message([uri]);

			var chunked = false; // non-chunked record
			var tnf = new Uint8Array([0x01]); // TNF well known
			var type = new Uint8Array([0x53, 0x70]);
			var payload = payloadMsg.toByteArray();

			var spRecord = new ndef.Record(chunked, tnf, type, [85], payload);
			var spMessage = new ndef.Message([spRecord]);

			// Uint8Array for storing, writing to a tag, etc.
			var bytes = spMessage.toByteArray();
			console.log(bytes)
			// await reader.write(0, bytes, bytes.length);
			const packet = Buffer.from([
				0xFF, 0xD7, 0x00, 0x05, 0x05, 0x00, 0x00, 0x00, 0x00, 0x01
			]);
			try {

				const response = await reader.transmit(packet, 40);
				console.log(response)
			}catch(e){

			}
			*/

			// reader.write(blockNumber, data, blockSize = 4, packetSize = 16)
			// - blockNumber - memory block number where to start writing
			// - data - what to write
			// - blockSize - 4 for MIFARE Ultralight, 16 for MIFARE Classic
			// ! Caution! data.length must be divisible by blockSize (we have to write the whole block(s))

			// var ndef = require('@taptrack/ndef');
			// // creating message to be carried inside smartposter record
			// var uri = ndef.Utils.createUriRecord("http://www.google.com");
			// var payloadMsg = new ndef.Message([uri]);

			// var chunked = false; // non-chunked record
			// var tnf = new Uint8Array([0x01]); // TNF well known
			// var type = new Uint8Array([0x53, 0x70]);
			// var payload = payloadMsg.toByteArray();

			// var spRecord = new ndef.Record(chunked, tnf, type, [0], payload);
			// var spMessage = new ndef.Message([spRecord]);

			// // Uint8Array for storing, writing to a tag, etc.
			// var bytes = spMessage.toByteArray();
			// console.log(bytes)

			var ndef = require('ndef');
			let stringUrl = "https://registro.aplicacionesincontacto.com/NFC/#23u2j2i3s932"
			var message2 = [ndef.uriRecord(stringUrl)];
			let payloadBytes = new TextEncoder().encode(stringUrl).length;
			payloadBytes = parseInt(payloadBytes);
			let payloadBytesHex = payloadBytes.toString(16);
			console.log(payloadBytes + ' payloadBytes --- HEX: ' + payloadBytesHex);

			var byteArray = ndef.encodeMessage(message2);
			console.log(byteArray);
			console.log(byteArray.length);
			var buf2A = Buffer.from([0x03, '0x' + payloadBytesHex])
			var buffer = Buffer.from(byteArray);
			var buf3A = Buffer.from([0xFE]);

			console.log(buffer);
			const elementosAdicionales = (4 - (buffer.length % 4)) % 4;
			// Añadir elementos de relleno al array
			let arrayLlenar = [];
			for (let i = 0; i <= elementosAdicionales; i++) {
				arrayLlenar.push(0x00);  
			}
			var arr2 = [];
			if(arrayLlenar.length > 0){
				var bufLlenar = Buffer.from(arrayLlenar);
				arr2 = [buf2A, buffer, buf3A, bufLlenar];
			}else{
				arr2 = [buf2A, buffer, buf3A];
			}
			buffer = Buffer.concat(arr2);
			console.log(buffer);
			await reader.write(4, buffer);
			// console.log(bytes)
			// var byteSave = Buffer.from([1, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109, 0]);

			// // NDEF uri prefixes will be automatically applied
			// var uriRecord = ndef.Utils.createUriRecord("http://www.google.com");
			// var message = new ndef.Message([uriRecord]);

			// // Uint8Array for storing, writing to a tag, etc.
			// var bytesURL = message.toByteArray();
			// var arrayTwo = new Uint8Array([0]);
			// var mergedArray = new Uint8Array(bytesURL.length + 1);
			// mergedArray.set(bytesURL);
			// mergedArray.set(arrayTwo, bytesURL.length);
			// console.log(mergedArray)
			// await reader.write(4, mergedArray);

			// await reader.write(4, data);

			pretty.info(`data written`, reader, randomNumber, data);

		} catch (err) {
			pretty.error(`error when writing data`, reader, err);
		}


	});

	reader.on('error', err => {
		pretty.error(`an error occurred`, reader, err);
	});

	reader.on('end', () => {
		pretty.info(`device removed`, reader);
	});


});

nfc.on('error', err => {
	pretty.error(`an error occurred`, err);
});
