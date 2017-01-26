var request =  require('request');

var data = {
	'name':'chut'
}

    var options = {
            // host: 'localhost',
            // port: 8001,
            // path: '/main/node_api/',
            // url: 'http://localhost:8001/main/node_api',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 3,
                // "X-CSRFToken": message[2],
                'Cookie': 'csrftoken=345'
            }
        };

req