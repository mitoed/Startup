### Link to [all notes](/notes.md)

![Startup Tech Stack](/all_notes/screenshots_for_notes/Startup%20Tech%20Stack.jpg)

# The Internet

## Tracking Connections (done in console)

What is the domain's IP address?
> dig [domain]

What is the internet path that leads from my computer to domain's IP address?
> tracert [domain]

## Network Internals

TCP/IP Layers:

| Layer | Example | Purpose |
| :---- | :-----: | :------ |
| Application | HTTPS | Functionality like web browsing |
| Transport | TCP | Moving connection information packets |
| Internet | IP | Establishing connections |
| Link | Fiber, hardware | Physical connections |

## Common Ports

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


# Setting up webpage

For this class, we used an AMI (Amazon Machine Image) which is the base for our server. It came installed with Ubuntu, Node.js, NVM, Caddy Server, and PM2 (see AMI below).

We created an elastic IP address, which will allow me to continue to use the IP address even if I stopped the server (which means I'm not paying for its use).

We then allowed for SSH, HTTP, and HTTPS traffic for the website.

### Startup Web Address information

Elastic IP Address (click to go to page)
> [3.209.236.159](http://3.209.236.159)

PEM file location:
> C:\Users\masau\keys\Startup-Production.pem

CS 260 class AMI (Community AMI)
> ami-0b009f6c56cdd83ed

# Domain Names

## Basic Structure (with example)

| Part of Domain Name | Subdomain | Secondary | Top |
| ------------- | -- | -- | -- |
| Entire Domain | react.simon | cs260 | .click |
| Root | | cs260 | .click |

## Domain Name System (DNS)

We used Route 53, the AWS service that handles everything DNS-related. From there, I bought my domain name ('activityanarchy.click') and created DNS records on their DNS server. Here are two types of DNS records (I just did the first one):

An `A` record maps name to IP address

A `CNAME` record maps one domain name to another domain name

Here are a list of console commands to see the actual DNS records as hosted by Amazon:

`dig domain.com` in console to get all the IP address associated with the domain name

`whois domain.com` console to get all registration information about domain name from registry

# Console Commands

Basic Console Commands:

`echo` - Output the parameters of the command

`cd` - Change directory

`mkdir` - Make directory

`rmdir` - Remove directory

`rm` - Remove file(s)

`mv` - Move file(s)

`cp` - Copy files

`ls` - List files

`curl` - Command line client URL browser

`grep` - Regular expression search

`find` - Find files

`top` - View running processes with CPU and memory 
usage

`df` - View disk statistics

`cat` - Output the contents of a file

`less` - Interactively output the contents of a file

`wc` - Count the words in a file

`ps` - View the currently running processes

`kill` - Kill a currently running process

`sudo` - Execute a command as a super user (admin)

`ssh` - Create a secure shell on a remote computer

`scp` - Securely copy files to a remote computer

`history` - Show the history of commands

`ping` - Check if a website is up

`tracert` - Trace the connections to a website

`dig` - Show the DNS information for a domain

`man` - Look up a command in the manual

Remote shell into server command:
> ssh -i /keys/Startup-Production.pem ubuntu@3.209.236.159

# Caddy

## What is Caddy?

Caddy is a Web Service that handles incoming HTTP requests by then sending requested static files or routes the request to another webservice. Think of it as a mail center that routes letters and packages to the correct mail truck.

## Why use Caddy?

- Caddy handles all of the creation and rotation of web certificates. This allows us to easily support HTTPS.

- Caddy serves up all of your static HTML, CSS, and JavaScript files. All of your early application work will be hosted as static files.

- Caddy acts as a gateway for subdomain requests to your Simon and startup application services. For example, when a request is made to simon.yourdomain Caddy will proxy the request to the Simon application running with node.js as an internal web service.

## Important Caddy Files

- Configuration File, which defines the operations for dealing with requests.

> ~/Caddyfile

- HTML Files, which are served by Caddy when requests are made to the root or the web server.

> ~/public_html

# HTTPS, TLS, and Web Certificates

HTTPS: protected way to transfer documents without user information

TLS: the protocol that encrypts the user information. It works by negotiating a shared secret that is then used to encrypt data.

Web Certificates: proof that the the certificate owner actually owns the domain name represented by the certificate. It's generated by a 3rd party (Let's Encrypt) and gathered by Caddy.