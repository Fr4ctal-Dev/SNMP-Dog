async function checkDisk(d) {
    //Checks if the Device has a C Drive
    let ip = d[1]
    let request =
        {
            ip: ip,
            "value": "hrStorageDescr",
            "table": "1",
            "mib": "HOST-RESOURCES-MIB"
        }

    return fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(result => {
            let driveLetter = result.hrStorageDescr[0]
            return driveLetter === "C"

        })

}

async function getDiskTotal(d){
    let ip = d[1]
    let sizeRequest =
        {
            "ip": ip,
            "value": "hrStorageSize",
            "table": "1",
            "mib": "HOST-RESOURCES-MIB"
        }
    return fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(sizeRequest)
    })
        .then(response => response.json())
        .then(result => {
            return result
        })
}
async function getDiskUsed(d){
    let ip = d[1]
    let usedRequest =
        {
            "ip": ip,
            "value": "hrStorageUsed",
            "table": "1",
            "mib": "HOST-RESOURCES-MIB"
        }
    return fetch ('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(usedRequest)
    })
        .then(response => response.json())
        .then(result => {
            return result
        })

}
async function getDiskAllocation(d){
    let ip = d[1]
    let allocationRequest=
        {
            "ip": ip,
            "value": "hrStorageAllocationUnits",
            "table": "1",
            "mib": "HOST-RESOURCES-MIB"
        }
    return fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(allocationRequest)
    })
        .then(response => response.json())
        .then(result => {
            return result
        })
}

async function getDiskData(d) {
    const res = await Promise.all([getDiskAllocation(d), getDiskTotal(d), getDiskUsed(d)])
    const {hrStorageAllocationUnits} = res[0]
    const {hrStorageSize} = res[1]
    const {hrStorageUsed} = res[2]



    return {
        percentage:  hrStorageSize/ hrStorageUsed*100,
        total:  hrStorageSize,
        used:  hrStorageUsed,
        allocation:  hrStorageAllocationUnits
    }




}


