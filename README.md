# **Latch - The Location Chat**


## Use a local server like xammp or python -m SimpleHTTPServer to run the files from app.zip

##  **Intro**
### With the advent of social media networks. It has become increasingly popular to connect with even those who live on the other side of the planet. But this has come with a great cost. We have started becoming more and more oblivious to even our immediate surroundings and the people around us. To us, this irony seemed needless at the least if not a threat to our relationships in a soceity as they exist. Combining the best of both worlds, we have devised a distinct platform, **Latch-The Location Chat**, which ties the user with other nearby people on the basis of common interests. 

## **2.Features**
* ## A Secure Platform for live chat (We don't read your messages! :P).  
* ## Location Based Chat: Set your location and tune in to the trending topics around you.
* ## Set Interests: Never be bothered by multiple application windows to explore.
* ## SOS: Alert your friends and family with your location immediately
* ## Anonymous: Go anonymous because no one knows who you are on the web 😛
* ## Real reviews: Get **'Real'** reviews from **'Real'** people near your location 

## **3.

Django works on a wsgi server which rules out the asynchronous behaviour that a chat application demands. Using Channels could be a solution but again it is not a proper socket and could result in unintentional tampering of data. Hence we used a triplet server comprising of a Django server, Node Server and a Front server based on Angular framework. We tried to explain this via a FlowChart. The Front server is basically an interface server sending the requests to the backend. It filters requests in two types:
1. HTTP Request
2. Socket Request
Since we had to deploy realtime in our application working with synchronous server, we applied the strategy used by Pinterest and Instagram. They use Node.js Server for realtime and Django for the rest of their backend services.
All the HTTP Requests are handled by Django server and the requests for Chat(Requiring realtime conditions) are handled by Node Server. We used Socket.io for handling the socket requests on the Client side and server side. 
This way the connection is open between Client side and Server Side which was formerly prevented by wsgi server. 
As soon as the connection is open for the socket, the server side(node server) receives the data in the from of json object and makes a post request to the django server so as to save the message and all the object and entities related to that message in the database. If everything went write on the django server side it returns a 200 response which indicates a green signal to the node server and it again emits the same message through the socket (group specific socket) on the client side. Pseudo chat rooms were built on the sockets so as the messages do not get pushed to every user. This is the mechanism of a single message that flows through multiple servers.
We used HTML5 navigator to get the location of person which was then sent to the server side and hence we could detect the precise location and locality of the person and add him to the groups based on his interests. 
For minor optimizations we used MEMCache to make the LATCH experience fast.

Technologies/Frameworks Services used:
1. Bings API
2. Google Distance Matrix API
3. Django/Python
4. Node.js
5. Angular.js
6. Redis/Cache


 