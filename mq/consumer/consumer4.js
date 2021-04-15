const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "nouvenn-rsmq"} );

function main() {
	const queuename = "queue4";

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

function receiveMessageLoop(queuename) {
	setInterval(() => {
		rsmq.receiveMessage({ qname: queuename }, (err, resp) => {
			if (err) {
				console.error(err);
				return;
			}
			if (resp.id) {
				console.log("received message:", resp.message);
				rsmq.deleteMessage({ qname: queuename, id: resp.id }, (err) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log("deleted message with id", resp.id);
				});
			} else {
				console.log("no available message in queue..");
			}
		});
	}, 0);
}