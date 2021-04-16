const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "nouvenn-rsmq"} );
var msgInAll = 0;
var msgOutAll = 0;
var timeInSec = 0;

function main() {
    setInterval(() => {
        rsmq.listQueues(function (err, queues) {
            if (err) {
                console.error(err);
                return;
            }
            queues.sort();
            console.clear();
            var respAll = {
                "msgsIn": 0,
                "msgsOut": 0,
                "msgQueued": 0
            }
            queues.forEach(element => {
                rsmq.getQueueAttributes({ qname: element }, function (err, resp) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(`================= Queue ${element} Stats ==================`);
                    console.log("total input messages: ", resp.totalsent);
                    console.log("total output messages: ", resp.totalrecv);
                    console.log("current n of messages waiting on the queue: ", resp.msgs);
                    console.log("\n");

                    respAll.msgsIn+=resp.totalsent;
                    respAll.msgsOut+=resp.totalrecv;
                    respAll.msgQueued+=resp.msgs;

                    var queueNumber = parseInt(element);
                    if (queueNumber == queues.length) redisServerStats(respAll);
                });
            });
        });
    },1000);
}
main();

function redisServerStats(respAll) {
    timeInSec++;
    var testTime = new Date(timeInSec * 1000).toISOString().substr(11, 8)
    console.log(`================= Redis Server Stats ==================`);
    console.log("total input messages: ", respAll.msgsIn);
    console.log("total output messages: ", respAll.msgsOut);
    console.log("input rate (msg/sec): ", respAll.msgsIn - msgInAll);
    console.log("output rate (msg/sec): ", respAll.msgsOut - msgOutAll);
    console.log("current n of messages waiting on the queue: ", respAll.msgQueued);
    console.log("test time in seconds: ", testTime);
    console.log("\n");
    msgInAll = respAll.msgsIn;
    msgOutAll = respAll.msgsOut;
}