# snmp-tool
 A SNMP network visualiser
 
## Running the code
### Python
The backend is written in Python 3.7 and requires following packages:
- `pysnmp`
- `ipaddress`
- `flask`
- `request`
- `json`

Which can all be installed by typing `pip3.7 install <package>` in the project terminal.

### Frontend
The frontend pulls data from the python flask API.
CORS might cause problems...

## What's planned:
- Sending *Traps* and/or *Informs*
- Intelligent search bar that uses asynchronous API calls to scan large portions of a network. `10.10.30.0/24` in the search bar should return device info for all available devices in the specified network in roughly the time it takes to run a single request.

## UI
Bootstrap Dashboard

![Screenshot](https://github.com/Fr4ctal-Dev/snmp-tool/blob/master/frontend/Screenshot%202020-12-03%20at%2011.18.54.png?raw=true)

