var assert = require('assert');
var Crypto = require('../cryptojs').Crypto; 

(function test_PBKDF2() {
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 128 / 8), "cdedb5281bb2f801565a1122b2563515");
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 256 / 8), "cdedb5281bb2f801565a1122b25635150ad1f7a04bb9f3a333ecc0e2e1f70837");
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 128 / 8, { iterations : 2	}), "01dbee7f4a9e243e988b62c73cda935d");
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 256 / 8, { iterations : 2 }), "01dbee7f4a9e243e988b62c73cda935da05378b93244ec8f48a99e61ad799d86");
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 128 / 8, { iterations : 1200}), "5c08eb61fdf71e4e4ec3cf6ba1f5512b");
	assert.strictEqual(Crypto.PBKDF2("password", "ATHENA.MIT.EDUraeburn", 256 / 8, { iterations : 1200}), "5c08eb61fdf71e4e4ec3cf6ba1f5512ba7e52ddbc5e5142f708a31e2e62b1e13");
	assert.strictEqual(Crypto.PBKDF2("password", "\x12\x34\x56\x78\x78\x56\x34\x12", 128 / 8, {	iterations : 5 }), "d1daa78615f287e6a1c8b120d7062a49");
	assert.strictEqual(Crypto.PBKDF2("password", "\x12\x34\x56\x78\x78\x56\x34\x12", 256 / 8, {	iterations : 5 }), "d1daa78615f287e6a1c8b120d7062a493f98d203e6be49a6adf4fa574b6e64ee");
	assert.strictEqual(Crypto.PBKDF2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "pass phrase equals block size", 128 / 8, { iterations : 1200 }), "139c30c0966bc32ba55fdbf212530ac9");
	assert.strictEqual(Crypto.PBKDF2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "pass phrase equals block size", 256 / 8, { iterations : 1200 }), "139c30c0966bc32ba55fdbf212530ac9c5ec59f1a452f5cc9ad940fea0598ed1");
	assert.strictEqual(Crypto.PBKDF2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "pass phrase exceeds block size", 128 / 8, { iterations : 1200 }), "9ccad6d468770cd51b10e6a68721be61");
	assert.strictEqual(Crypto.PBKDF2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "pass phrase exceeds block size", 256 / 8, { iterations : 1200 }), "9ccad6d468770cd51b10e6a68721be611a8b4d282601db3b36be9246915ec82a");
	assert.strictEqual(Crypto.PBKDF2([0xf0, 0x9d, 0x84, 0x9e], "EXAMPLE.COMpianist", 128 / 8, { iterations : 50 }), "6b9cf26d45455a43a5b8bb276a403b39");
	assert.strictEqual(Crypto.PBKDF2([0xf0, 0x9d, 0x84, 0x9e], "EXAMPLE.COMpianist", 256 / 8, { iterations : 50 }), "6b9cf26d45455a43a5b8bb276a403b39e7fe37a0c41e02c281ff3069e1e94f52");
})(); 

(function test_PBKSD2Async() {
	Crypto.PBKDF2Async("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "pass phrase exceeds block size", 256 / 8, function(result) {
		assert.strictEqual(result, "9ccad6d468770cd51b10e6a68721be611a8b4d282601db3b36be9246915ec82a");
	}, { iterations : 1200 });
})();
