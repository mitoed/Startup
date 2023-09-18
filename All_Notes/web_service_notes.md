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

# Setting up webpage

## Web Address information

Elastic IP Address (click to go to page)
> [3.209.236.159](http://3.209.236.159)

PEM file location:
> C:\Users\masau\keys\Startup-Production.pem

CS 260 class AMI (Community AMI)
> ami-0b009f6c56cdd83ed

## Console Commands

Remote shell into server command:
> ssh -i /keys/Startup-Production.pem ubuntu@3.209.236.159

# Domain Names

## Basic Structure (with example)

| Part of Domain Name | Subdomain | Secondary | Top |
| ------------- | -- | -- | -- |
| Entire Domain | react.simon | cs260 | .click |
| Root | | cs260 | .click |

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
