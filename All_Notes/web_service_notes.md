### Link to [all notes](/notes.md).

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

