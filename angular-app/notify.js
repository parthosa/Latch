var gcm = require('node-gcm');
var message = new gcm.Message();
 
//API Server Key
var sender = new gcm.Sender('AAAANbxRpq0:APA91bFgSsNBCJc2qubCF7--FQagNloimWcsRCMk_DezOPP88NvOO8ifcKilq_L1cmzaK9JHLXxXFV0a4nw3Lf-VHn1dxsxn5I0_6Gb7yNLtc-xRL0OUP7XrdfeEwkouS9kmfDkJCzYD');
var registrationIds = [];
 
// Value the payload data to send...
message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData('title','Latch' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
// message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
// message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 

 message.delay_while_idle = 1;
// At least one reg id required
registrationIds.push("cFQPcGzIILw:APA91bEJe8eXZ4_6STKU0wn654Y_XZPBihG2oeiUeNP6hsFdyCzt1nBVi_2jKzZslRPN3qd6fzZr1iQpvao1jQiuqPkQdgMjSoSwseDphIqUy1nO7EXJNL_mkG0ebl67RuRaZA0_5jEy");
 
/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function  (error, result) {
  // console.log(error); // probably 401
  console.log(result);
});