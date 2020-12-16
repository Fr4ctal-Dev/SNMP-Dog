import ipaddress

from pysnmp.hlapi import *


def get_device(ip):
    values = ("sysDescr", "sysUpTime", "sysLocation", "sysName")
    device_info = {}
    device_info["ip"] = ip
    for value in values:
        iterator = getCmd(SnmpEngine(),
                          CommunityData('public'),
                          UdpTransportTarget((str(ip), 161), timeout=0.1, retries=0),
                          ContextData(),
                          ObjectType(ObjectIdentity('SNMPv2-MIB', str(value), 0)))

        error_indication, error_status, error_index, var_binds = next(iterator)

        if error_indication:  # SNMP engine errors
            print(str(ip) + ">  " + str(error_indication))
        else:
            if error_status:  # SNMP agent errors
                print(
                    '%s at %s' % (
                        error_status.prettyPrint(), var_binds[int(error_index) - 1] if error_index else '?'))
            else:
                for varBind in var_binds:  # SNMP response contents
                    device_info[value] = str(varBind).split("=")[1].replace(" ", "")

    try:
        # Add more OSs here
        desc = str(device_info["sysDescr"]).lower()
        if "router" in desc:
            device_info["sysDescr"] = "Mikrotik RouterOS"
        elif "windows" in desc:
            device_info["sysDescr"] = "Windows"
        elif "mac" in desc:
            device_info["sysDescr"] = "macOS"
        elif "linux" in desc:
            device_info["sysDescr"] = "Linux"
        else:
            device_info["sysDescr"] = "Other/Unknown"
    except KeyError:
        pass

    return device_info


def get_devices(ip, mask):
    """
    Get all device info from specified network

    Args:
        ip: The networks IP address
        mask: CIDR mask

    Returns:
        A dict containing the requested information

    Raises:

    """

    addr = ip + "/" + mask
    network = ipaddress.ip_network(addr, strict=False)
    values = ("sysDescr", "sysUpTime", "sysLocation", "sysName")
    devices = {}

    for ip in network:
        device_info = {}
        for value in values:
            iterator = getCmd(SnmpEngine(),
                              CommunityData('public'),
                              UdpTransportTarget((str(ip), 161)),
                              ContextData(),
                              ObjectType(ObjectIdentity('SNMPv2-MIB', str(value), 0)))

            error_indication, error_status, error_index, var_binds = next(iterator)

            if error_indication:  # SNMP engine errors
                print(str(ip) + ">  " + str(error_indication))
            else:
                if error_status:  # SNMP agent errors
                    print(
                        '%s at %s' % (
                            error_status.prettyPrint(), var_binds[int(error_index) - 1] if error_index else '?'))
                else:
                    for varBind in var_binds:  # SNMP response contents
                        device_info[value] = str(varBind).split("=")[1].replace(" ", "")

        if device_info == {}:
            continue
        device_info["ip"] = str(ip)
        devices[str(ip)] = device_info

    return devices


def get_iterator(ip, value, community_string, is_oid=False):
    """
        Get pysnmp iterator

        Args:
            ip: The device's IP address
            value: MIB id or SNMP OID
            community_string: The community string for the network. Usually 'public' or 'private'
            is_oid: boolean if the provided value is a OID or a MIB ID

        Returns:
            The usable iterator

        Raises:

        """

    return getCmd(SnmpEngine(),
                  CommunityData(community_string),
                  UdpTransportTarget((str(ip), 161)),
                  ContextData(),
                  ObjectType(ObjectIdentity(str(value)) if is_oid else ObjectIdentity('SNMPv2-MIB', str(value), 0)))


def get_device_value(ip, value, community_string="public"):
    """
    Get value from specified device from MIB id

    Args:
        ip: The device's IP address
        value: MIB value
        community_string: The community string for the network. Usually 'public' or 'private'

    Returns:
        A dict containing the requested information

    Raises:

    """

    iterator = get_iterator(ip, value, community_string)

    error_indication, error_status, error_index, var_binds = next(iterator)

    if error_indication:  # SNMP engine errors
        print(error_indication)
    else:
        if error_status:  # SNMP agent errors
            print(
                '%s at %s' % (error_status.prettyPrint(), var_binds[int(error_index) - 1] if error_index else '?'))
        else:
            for varBind in var_binds:  # SNMP response contents
                return str(varBind).split("=")[1].replace(" ", "")


def get_device_value_oid(ip, oid, community_string="public"):
    """
        Get value from specified device with OID

        Args:
            ip: The device's IP address
            oid: SNMP OID
            community_string: The community string for the network. Usually 'public' or 'private'

        Returns:
            A dict containing the requested information

        Raises:

        """

    iterator = get_iterator(ip, oid, community_string, is_oid=True)

    error_indication, error_status, error_index, var_binds = next(iterator)

    if error_indication:  # SNMP engine errors
        print(error_indication)
    else:
        if error_status:  # SNMP agent errors
            print(
                '%s at %s' % (error_status.prettyPrint(), var_binds[int(error_index) - 1] if error_index else '?'))
        else:
            for varBind in var_binds:  # SNMP response contents
                return str(varBind).split("=")[1].replace(" ", "")
