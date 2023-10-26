### Link to [all notes](/notes.md)

# Web Services

## Uniform Resource Locator (URL)

### Parts of URL

```
https://byu.edu:443/cs/260/student?filter=accepted#summary
```

```
<scheme>://<domain name>:<port>/<path>?<parameters>#<anchor>
```

| Part         | Example                   | Meaning                                                                      |
|--------------|---------------------------|------------------------------------------------------------------------------|
| Scheme       | https                     | The protocol required to ask for the resource. For web applications, this is usually HTTPS. But it could be any internet protocol such as FTP or MAILTO. |
| Domain name  | byu.edu                   | The domain name that owns the resource represented by the URL.               |
| Port         | 3000                      | The port specifies the numbered network port used to connect to the domain server. Lower number ports are reserved for common internet protocols, higher number ports can be used for any purpose. The default port is 80 if the scheme is HTTP, or 443 if the scheme is HTTPS. |
| Path         | /school/byu/user/8014      | The path to the resource on the domain. The resource does not have to physically be located on the file system with this path. It can be a logical path representing endpoint parameters, a database table, or an object schema. |
| Parameters   | filter=names&highlight=intro,summary | The parameters represent a list of key-value pairs. Usually, it provides additional qualifiers on the resource represented by the path. This might be a filter on the returned resource or how to highlight the resource. The parameters are also sometimes called the query string. |
| Anchor       | summary                   | The anchor usually represents a sub-location in the resource. For HTML pages, this represents a request for the browser to automatically scroll to the element with an ID that matches the anchor. The anchor is also sometimes called the hash or fragment ID. |

### Other terms

**URN**: Uniform Resource Name; leaves out the locaion information

**URI**: Uniform Resource Identifier; general term that could mean URL or URN

## Ports

### List of Common Ports

| Port | Protocol                                             |
|------|-----------------------------------------------------|
| 20   | File Transfer Protocol (FTP) for data transfer      |
| 22   | Secure Shell (SSH) for connecting to remote devices |
| 25   | Simple Mail Transfer Protocol (SMTP) for sending email |
| 53   | Domain Name System (DNS) for looking up IP addresses |
| 80   | Hypertext Transfer Protocol (HTTP) for web requests  |
| 110  | Post Office Protocol (POP3) for retrieving email     |
| 123  | Network Time Protocol (NTP) for managing time       |
| 161  | Simple Network Management Protocol (SNMP) for managing network devices such as routers or printers |
| 194  | Internet Relay Chat (IRC) for chatting              |
| 443  | HTTP Secure (HTTPS) for secure web requests         |

### My Ports

Port 22 - reserved for SSH to open a remote console on the server

Port 443 - secure HTTP communication

Port 80 - unsecure HTTP communication

*Your web service, Caddy, is listening on ports 80 and 443. When Caddy gets a request on port 80, it automatically redirects the request to port 443 so that a secure connection is used. When Caddy gets a request on port 443 it examines the path provided in the HTTP request (as defined by the URL) and if the path matches a static file, it reads the file off disk and returns it. If the HTTP path matches one of the definitions it has for a gateway service, Caddy makes a connection on that service's port (e.g. 3000 or 4000) and passes the request to the service.*

*Internally on your web server, you can have as many web services running as you would like. However, you must make sure that each one uses a different port to communicate on. You run your Simon service on port 3000 and therefore cannot use port 3000 for your startup service. Instead you use port 4000 for your startup service. It does not matter what high range port you use. It only matters that you are consistent and that they are only used by one service.*

## HTTP

*How the web talks...*

Web clients and web servers exchange information using HTTP requests and responses.

### Requests

Typical syntax:

```
<verb> <url path, parameters, anchor> <version>
[<header key: value>]*
[

  <body>
]
```

Example:

```
GET /hypertext/WWW/Helping.html HTTP/1.1
Host: info.cern.ch
Accept: text/html
```

### Responses

Typical syntax:

```
<version> <status code> <status string>
[<header key: value>]*
[

  <body>
]
```

Example:

```
HTTP/1.1 200 OK
Date: Tue, 06 Dec 2022 21:54:42 GMT
Server: Apache
Last-Modified: Thu, 29 Oct 1992 11:15:20 GMT
ETag: "5f0-28f29422b8200"
Accept-Ranges: bytes
Content-Length: 1520
Connection: close
Content-Type: text/html

<TITLE>Helping -- /WWW</TITLE>
<NEXTID 7>
<H1>How can I help?</H1>There are lots of ways you can help if you are interested in seeing
the <A NAME=4 HREF=TheProject.html>web</A> grow and be even more useful...
```

### Most Common Verbs (What kind of information is requested?)

| Verb     | Meaning                                                                                                             |
|----------|---------------------------------------------------------------------------------------------------------------------|
| GET      | Get the requested resource. This can represent a request to get a single resource or a resource representing a list of resources. |
| POST     | Create a new resource. The body of the request contains the resource. The response should include a unique ID of the newly created resource. |
| PUT      | Update a resource. Either the URL path, HTTP header, or body must contain the unique ID of the resource being updated. The body of the request should contain the updated resource. The body of the response may contain the resulting updated resource. |
| DELETE   | Delete a resource. Either the URL path or HTTP header must contain the unique ID of the resource to delete.       |
| OPTIONS  | Get metadata about a resource. Usually only HTTP headers are returned. The resource itself is not returned.       |

### Status Codes (How should the response be interpretted?)

1xx - Informational.

2xx - Success.

3xx - Redirect to some other location, or that the previously cached resource is still valid.

4xx - Client errors. The request is invalid.

5xx - Server errors. The request cannot be satisfied due to an error on the server.

List of Most Common Status Codes and Descriptions:

| Code  | Text                 | Meaning                                                         |
|-------|----------------------|-----------------------------------------------------------------|
| 100   | Continue             | The service is working on the request.                         |
| 200   | Success              | The requested resource was found and returned as appropriate. |
| 201   | Created              | The request was successful, and a new resource was created.    |
| 204   | No Content           | The request was successful, but no resource is returned.       |
| 304   | Not Modified         | The cached version of the resource is still valid.             |
| 307   | Permanent redirect    | The resource is no longer at the requested location. The new location is specified in the response location header. |
| 308   | Temporary redirect    | The resource is temporarily located at a different location. The temporary location is specified in the response location header. |
| 400   | Bad request           | The request was malformed or invalid.                         |
| 401   | Unauthorized          | The request did not provide a valid authentication token.      |
| 403   | Forbidden             | The provided authentication token is not authorized for the resource. |
| 404   | Not found             | An unknown resource was requested.                              |
| 408   | Request timeout       | The request takes too long.                                   |
| 409   | Conflict              | The provided resource represents an out-of-date version of the resource. |
| 418   | I'm a teapot          | The service refuses to brew coffee in a teapot.                |
| 429   | Too many requests     | The client is making too many requests in too short of a time period. |
| 500   | Internal server error | The server failed to properly process the request.             |
| 503   | Service unavailable   | The server is temporarily down. The client should try again with an exponential back off. |


### HTTP Headers

*The metadata about a request or a response...*

| Header                      | Example                           | Meaning                                                                                   |
|-----------------------------|-----------------------------------|-------------------------------------------------------------------------------------------|
| Authorization               | Bearer bGciOiJIUzI1NiIsI           | A token that authorizes the user making the request.                                       |
| Accept                      | image/*                           | What content format the client accepts. This may include wildcards.                     |
| Content-Type                | text/html; charset=utf-8          | The format of the response content. These are described using standard MIME types.        |
| Cookie                      | SessionID=39s8cgj34; csrftoken=9dck2 | Key-value pairs that are generated by the server and stored on the client.              |
| Host                        | info.cern.ch                      | The domain name of the server. This is required in all requests.                            |
| Origin                      | cs260.click                       | Identifies the origin that caused the request. A host may only allow requests from specific origins. |
| Access-Control-Allow-Origin  | https://cs260.click                | Server response of what origins can make a request. This may include a wildcard.           |
| Content-Length              | 368                               | The number of bytes contained in the response.                                           |
| Cache-Control               | public, max-age=604800             | Tells the client how it can cache the response.                                           |
| User-Agent                  | Mozilla/5.0 (Macintosh)           | The client application making the request.                                             |


### Cookies

Key-value pairs of information generated and passed from server, then stored on the client's machine.

Example:

```
// Sent with the request
HTTP/2 200
Set-Cookie: myAppCookie=tasty; SameSite=Strict; Secure; HttpOnly
```

```
// Stored in client's cache, then returned as an HTTP header to the server on subsequent requests
HTTP/2 200
Cookie: myAppCookie=tasty
```

## SOP and CORS

### Same Origin Policy (SOP)

Browsers are allowed to request information from any site of the same domain.

However, SOP disallows a browser to request information for any site outside of the domain. This is done by the **browser**, not by any extra service done.

### Cross Origin Resourse Sharing (CORS)

CORS allows the client to specify the origin or a request and then let the server respons with that origins are allowed. The server may say that all origins are allowed (like for a general purpose image provider), or only a specific origin is allowed (like for a banks authentication service).

## Fetch

To make an HTTP request from JavaScript, use the Fetch function that is built into the browser's JavaScript runtime.

Fetch takes a URL and returns a promise. The promise `then` function takes a callback function that is asynchronously called when the requested URL content is obtained. If the returned content is type `application/json` you can use the `json` function on the response object to convert it to a JavaScript object.

Example:

```
// GET Request
fetch('https://api.quotable.io/random')
  .then((response) => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
  });
```

```
// Response
{
  content: 'Never put off till tomorrow what you can do today.',
  author: 'Thomas Jefferson',
};
```

```
// POST Request
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'test title',
    body: 'test body',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
  });
```

## Service Design

### Model and Sequence Diagrams

