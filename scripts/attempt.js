module.exports = {
	attempt
};

function attempt(message, attemptFunc, callback = (err) => {
	if(err) {
		console.error("\nFatal Error (No callback specified): " + err.message);
		process.exit(1);
	} else {
		console.log('\x1b[32m%s\x1b[0m', "OK\n");
	}
}) {
	try {
		process.stdout.write(message + "...");
		const ret = attemptFunc();
		callback(null);
		return ret;
	} catch(err) {
		callback(err);
	}
}
