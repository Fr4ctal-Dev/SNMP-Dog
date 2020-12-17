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
async function getDiskUsed(d, table="1"){
    let ip = d[1]
    let usedRequest =
        {
            "ip": ip,
            "value": "hrStorageUsed",
            "table": table,
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
async function getDiskAllocation(d, table="1"){
    let ip = d[1]
    let allocationRequest=
        {
            "ip": ip,
            "value": "hrStorageAllocationUnits",
            "table": table,
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
        percentage:  hrStorageUsed/ hrStorageSize*100,
        total:  hrStorageSize,
        used:  hrStorageUsed,
        allocation:  hrStorageAllocationUnits
    }




}


async function getMemorySize(d){
    let ip = d[1]
    let sizeRequest =
        {
            "ip": ip,
            "value": "hrMemorySize",
            "table": "0",
            "mib": "HOST-RESOURCES-MIB"
        }
    return fetch ('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(sizeRequest)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            return result
        })
}
async function findMemoryRequest(ip){

    keywords = ["physicalmemory", "mainmemory"]

    let requestBody =
        {
            ip:ip,
            value: "hrStorageDescr",
            "table": "full",
            "mib": "HOST-RESOURCES-MIB"
        }
    return fetch ('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(result => {
            return result
        })




}
async function findMemory(d){
    let ip = d[1]
    let keywords = ["physicalmemory", "mainmemory"]
    return await findMemoryRequest(ip).then(descriptions =>{
        descriptions = Object.values(descriptions)
        for (let i = 0; i < descriptions.length; i++) {
            console.log("description " + descriptions[i])
            for (const keyword of keywords) {
                console.log("key " +keyword)
                if(descriptions[i].toLowerCase().includes(keyword)){
                    console.log(i)
                    return i

                }
            }

        }
    })



}



async function getMemoryData(d){
    let memoryIndex = await findMemory(d)
    memoryIndex = await memoryIndex.toString()
    const res = await Promise.all([getDiskAllocation(d, "full"), getDiskUsed(d, "full"),getMemorySize(d)])



    console.log(res[0][memoryIndex])
    console.log(res[1])
    console.log(res[2])

    const hrStorageAllocationUnits = res[0][memoryIndex]
    const hrStorageUsed = res[1][memoryIndex]
    const {hrMemorySize} = res[2]


    return {
        percentage:  hrStorageUsed*hrStorageAllocationUnits / (hrMemorySize*1000) *100,
        total:  hrMemorySize,
        used:  hrStorageUsed,
        allocation:  hrStorageAllocationUnits
    }






}



