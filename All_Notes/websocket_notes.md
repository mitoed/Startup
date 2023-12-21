### Link to [all notes](/notes.md).

# WebSocket Notes

*Working around the client-server architecture where only the client sends message and server responds.*

Creates connection with client upon loading. Then, either the client or the server can initiate a message and either can respond.

Only works between 2 parties (3+ clients cannot directly communicate with each other). To work around, a server is setup and all clients talk with the server, then the server can pass or send information to one, many, or all connected clients. Very useful for peer-to-peer conversations and similar applications.