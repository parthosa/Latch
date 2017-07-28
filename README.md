# **Latch - The Location Chat**

##  **Intro**
### With the advent of social media networks. It has become increasingly popular to connect with even those who live on the other side of the planet. But this has come with a great cost. We have started becoming more and more oblivious to even our immediate surroundings and the people around us. To us, this irony seemed needless at the least if not a threat to our relationships in a soceity as they exist. Combining the best of both worlds, we have devised a distinct platform, **Latch-The Location Chat**, which ties the user with other nearby people on the basis of common interests. 

## **2.Features**
* ## A Secure Platform for live chat (We don't read your messages! :P).  
* ## Location Based Chat: Set your location and tune in to the trending topics around you.
* ## Set Interests: Never be bothered by multiple application windows to explore.
* ## SOS: Alert your friends and family with your location immediately
* ## OTP: Verification of Mobile number for authentication
* ## End to End Encryption: We have two layer encryption(end to end)
* ## Anonymous: Go anonymous because no one knows who you are on the web 😛
* ## Real reviews: Get **'Real'** reviews from **'Real'** people near your location 
* ## Push Notifications: Push notifications on android using GCM

## **3. Tech Stack**

## Since we had to deploy realtime application working with synchronous server, we applied the strategy which is used by Pinterest and Instagram. They use Node.js Server for realtime chat processing and Django Server for the rest of their backend services. All the HTTP Requests are handled by the Django server and the requests for Chat(Requiring realtime conditions) are handled by Node Server. For handling the socket requests on client side and server side, we have used socket.io. This way the connection is opens between Client side and Server Side which was formerly prevented by WSGI server. As soon as the connection is open for the socket, the server side(node server) receives the data in the from of JSON object and makes a POST request to the django server so as to save the message and all the object and entities related to that message in the database. If everything works right on the Django server, it returns a response code 200 which indicates green signal to the node server to again emits the same message through the socket (group specific socket) on the client side. Pseudo chat rooms were built on the sockets so the messages are prevented from being pushed to every user. This is the mechanism of a single message that flows through multiple servers.To implement the client side, we have used AngularJS thats allows us to switch between different screens smoothly and also validate data. While the user chats in room his message are fetched once and stored locally as well through localStorage webAPI to enable him to view history quickly. This removes the lag while fetching data from the server. We have designed the application tweaking the Material UI, so that the user feels comfortable while using the chat application. We used HTML5 navigator to get the location of person which was then sent to the server side and hence we could detect the precise location and locality of the person and add him to the groups based on his interests. For minor optimizations we used MEMCache to make the LATCH experience fast. We have also deployed end to end encryption(two layer encryption), base64 encryption on client side and django secret key signing on the server side to fully protect the tampering of data

Technologies/Frameworks Services used:
1. Angular 2
2. Ionic
3. Django/Python
4. Node.js
5. Angular.js
6. Redis/Cache


 