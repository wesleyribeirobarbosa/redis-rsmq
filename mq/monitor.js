const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "nouvenn-rsmq"} );

function main() {
	const queuename = "queue1";

	rsmq.createQueue({ qname: queuename }, (err) => {
		if (err) {
			if (err.name !== "queueExists") {
				console.error(err);
				return;
			} else {
				console.log("queue exists.. resuming..");
			}
		}
		receiveMessageLoop(queuename);
	});
}
main();