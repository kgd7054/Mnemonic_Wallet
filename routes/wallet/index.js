var express = require('express');
var router = express.Router();
const lightwallet = require('eth-lightwallet');
const fs = require('fs');

// TODO : lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
router.post('/newMnemonic', async (req, res) => {
	// console.log(1);
	// res.json({ result: '성공' });
	let mnemonic;
	try {
		mnemonic = lightwallet.keystore.generateRandomSeed();
		res.json({ mnemonic });
	} catch (err) {
		console.log(err);
	}
});
//"mnemonic": "surprise unfair skirt swim member debate crush dream appear embrace canyon law"
// TODO : 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
router.post('/newWallet', async (req, res) => {
	let password = req.body.password;
	let mnemonic = req.body.mnemonic;

	try {
		lightwallet.keystore.createVault(
			{
				password: password,
				seedPhrase: mnemonic,
				hdPathString: "m/0'/1'/0'", // hdPathString ㅂㅏ꾸ㅓ 가면서 해  보 기
			},
			function (err, ks) {
				ks.keyFromPassword(password, function (err, pwDerivedKey) {
					ks.generateNewAddress(pwDerivedKey, 1);

					let address = ks.getAddresses().toString();
					let keystore = ks.serialize();

					fs.writeFile('wallet.json', keystore, function (err, data) {
						if (err) {
							res.json({ code: 999, message: '실패' });
						} else {
							res.json({ code: 1, message: '성공' });
						}
					});
				});
			}
		);
	} catch (exception) {
		console.log('NewWallet ==>>>> ' + exception);
	}
	//================= fs 로 로컬에다 저장
	// let password = req.body.password;
	// let mnemonic = req.body.mnemonic;
	// try {
	// 	lightwallet.keystore.createVault(
	// 		{
	// 			password: password,
	// 			seedPhrase: mnemonic,
	// 			hdPathString: "m/0'/0'/0'",
	// 		},
	// 		function (err, ks) {
	// 			ks.keyFromPassword(password, function (err, pwDerivedKey) {
	// 				ks.generateNewAddress(pwDerivedKey, 1);

	// 				let address = ks.getAddresses().toString();
	// 				let keystore = ks.serialize();

	// 				res.json({ keystore: keystore, address: address });
	// 			});
	// 		}
	// 	);
	// } catch (exception) {
	// 	console.log('NewWallet ==>>>> ' + exception);
	// }
});

module.exports = router;
