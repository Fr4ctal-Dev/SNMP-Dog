import ipaddress

from pysnmp.hlapi import *


def get_iterator(ip, value, community_string, is_oid, table_op, mib):
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
                  UdpTransportTarget((str(ip), 161), timeout=0.1, retries=0),
                  ContextData(),
                  ObjectType(
                      ObjectIdentity(str(value)) if is_oid else ObjectIdentity(mib, str(value), table_op)))


def get_value(ip, value, community_string="public", is_oid=False, table_op=0, mib='SNMPv2-MIB'):
    iterator = get_iterator(ip, value, community_string, is_oid, table_op, mib)

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


def get_full_table(ip, value, mib):
    data = {ip: ip}
    index = 0
    iterator = nextCmd(
        SnmpEngine(),
        CommunityData('public', mpModel=0),
        UdpTransportTarget((str(ip), 161)),
        ContextData(),
        ObjectType(ObjectIdentity(mib, value)),

        lexicographicMode=False
    )

    for errorIndication, errorStatus, errorIndex, varBinds in iterator:

        if errorIndication:
            print(errorIndication)
            break

        elif errorStatus:
            print('%s at %s' % (errorStatus.prettyPrint(),
                                errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
            break

        else:
            for varBind in varBinds:
                 data[str(index)] = str(varBind).split("=")[1].replace(" ", "")
                 index += 1

    return data

def request_wrapper(request_json):
    ip = request_json["ip"]
    values = ("sysDescr", "sysUpTime", "sysLocation", "sysName")
    device_info = {"ip": ip}
    is_oid = False
    community = "public"
    table_op = 0
    mib = 'SNMPv2-MIB'
    global value
    try:
        is_oid = request_json["isOid"]
    except KeyError:
        pass
    try:
        community = request_json["community"]
    except KeyError:
        pass
    try:
        table_op = request_json["table"]
        if table_op == 'full':
            return get_full_table(ip, request_json["value"], request_json["mib"])

    except KeyError:
        pass
    try:
        mib = request_json["mib"]
    except KeyError:
        pass
    try:

        value = request_json["value"]
    except KeyError:
        for val in values:
            device_info[val] = get_value(ip, val, community, is_oid, 0, mib)

        return replace_os(device_info)

    device_info = {"ip": ip,
                   value: get_value(ip, value, community, is_oid, table_op, mib)}

    return replace_os(device_info)


def replace_os(device_info):
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
