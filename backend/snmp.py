from pysnmp.hlapi import *
import ipaddress
import json


def get_devices(ip, mask):
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
    return getCmd(SnmpEngine(),
                  CommunityData(community_string),
                  UdpTransportTarget((str(ip), 161)),
                  ContextData(),
                  ObjectType(ObjectIdentity(str(value)) if is_oid else ObjectIdentity('SNMPv2-MIB', str(value), 0)))


def get_device_value(ip, value, community_string="public"):
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


"""
network = ipaddress.ip_network(input("Input CIDR address:"))
values = ("sysDescr", "sysUpTime", "sysLocation", "sysName")

json_data = json.dumps(get_devices(network, values), indent=4)
print(json_data)


oid = ".1.3.6.1.2.1.1.1.0"

print(get_device_value_oid("10.10.30.1", oid))
"""


