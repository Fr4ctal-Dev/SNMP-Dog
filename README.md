# snmp-tool
 A SNMP network visualiser
 

## Project Description
A Browser Application to see crucial sysadmin information at a glance, while maintaining the possibility to intuitively send requests for less relevant information in just a few clicks.
The protocol used is [SNMP](https://en.wikipedia.org/wiki/Simple_Network_Management_Protocol) which orders all available information into a easy-to-use MIB structure.
The individual SNMP requests are sent by a Python3 backend which has a simple Flask API interface, which is used by the JQuery/JavaScript & Bootstrap frontend. The program will also support sending SNMP Traps and/or Informs and Table Operation requests.
 
## Running the code
### Python
The backend is written in Python 3.7 and requires following packages:
- `pysnmp`
- `ipaddress`
- `flask`
- `request`
- `json`

Which can all be installed by typing `pip3.7 install <package>` in the project terminal.

The python script to run is `api.py` which can be runned by typing `python3.7 api.py` in the project terminal

### Frontend
The frontend should run out-of-the-box by opening `index.html` in a browser.

## Usage
### Dashboard
Simply type a CIDR network into the search bar.
### Traps/Informs
TODO

## What's planned:
- Sending *Traps* and/or *Informs*
- A custom request page
- ~~MIB Table Operations~~
- ~~a complete cleanup or rewrite of the python SNMP engine~~
- ~~Intelligent search bar that uses asynchronous API calls to scan large portions of a network. `10.10.30.0/24` in the search bar should return device info for all available devices in the specified network in roughly the time it takes to run a single request.~~ DONE

### What might be planned:
- DNS resolving
- CSV imports of IP adresses to be scanned
- Table exports
- making the search bar more intelligent


## UI
Current Bootstrap Dashboard

![Screenshot](https://github.com/Fr4ctal-Dev/snmp-tool/blob/master/frontend/Screenshot%202020-12-10%20at%2009.10.36.png?raw=true)

