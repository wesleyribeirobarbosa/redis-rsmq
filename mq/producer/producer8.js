const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "nouvenn-rsmq"} );
const messageText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function main() {
	const queuename = "queue8";

	rsmq.createQueue({ qname: queuename }, (err) => {
		if (err) {
			if (err.name !== "queueExists") {
				console.error(err);
				return;
			} else {
				console.log("queue exists.. resuming..");
			}
		}
		sendMessageLoop(queuename);
	});
}
main();

function sendMessageLoop(queuename) {
	setInterval(() => {
		rsmq.sendMessage({ qname: queuename, message: messageText}, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log("pushed new message into queue..");
		});
	}, 0);
}
