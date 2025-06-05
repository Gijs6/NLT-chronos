# Chronos

Chronos is a talking clock made for visually impaired users (especially people with Cataract), built with JavaScript and [Socket.IO](https://github.com/socketio/socket.io). When you trigger it, it speaks the current time out loud.  
This project was done as a school assignment for **NLT** (nature, living, and technology) during the **technical design** lessons.  
The setup is pretty simple: there's a Socket.IO server running, and when you press the trigger on one page, it sends a message through a websocket. The server then tells the clock page to say the time using the Web Speech API. Keep in mind this website is just a prototype, not the final product.
