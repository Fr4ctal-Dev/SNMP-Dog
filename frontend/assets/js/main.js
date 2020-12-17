async function getDevice(ip) {
    let request = {
        ip: ip
    };

    let response = fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(result => {
            if (result.sysName) {
                result.sysUpTime = convertTimestamp(result.sysUpTime)
                if (!table) {
                    table = $('#device-table').DataTable({
                            data: "",

                            destroy: true,
                            columns: [
                                {
                                    className: "details-control",
                                    orderable: false,
                                    data: null,
                                    defaultContent: ''
                                },
                                {title: "IPv4"},
                                {title: "Name"},
                                {title: "OS/Firmware"},
                                {title: "Location"},
                                {title: "Uptime"}
                            ]
                        }
                    )
                }
                table.row.add([
                    {},
                    result.ip,
                    result.sysName,
                    result.sysDescr,
                    result.sysLocation,
                    result.sysUpTime,
                ]).draw(true)
            }
        });


}

function convertTimestamp(timestamp) {
    var totalSeconds = timestamp / 100;
    days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = Math.floor(totalSeconds % 60);

    return days + "d " + hours + "h " + minutes + "min " + seconds + "s";


}

async function startCall(range) {
    console.log(range)
    let dataSet = []
    for (let i = 0; i < range.length; i++) {
        let deviceInfo = getDevice(range[i])

    }


}

async function format(d) {
    // `d` is the original data object for the row

    switch (d[3]){
        case "macOS":
            imgsrc = "apple"
            break
        case "Windows":
            imgsrc = "windows"
            break
        case "Linux":
            imgsrc = "linux"
            break
        case "Mikrotik RouterOS":
            imgsrc = "mikrotik"
            break
        default:
            imgsrc = "generic"
            break
    }

    let rowExtension =
        '<div class="row">' +
            '<div class="col-2">' +
                '<div class="os-img-box '+ imgsrc +'"></div>' +
            '</div>' +
            '<div class="col-10">'
    return new Promise(resolve =>  {
         checkDisk(d).then(diskAmissable => {
             if (diskAmissable) {
                 getDiskData(d).then(diskData => {

                     let diskInfoString = Math.floor(diskData.used * diskData.allocation / 1000000).toString() + "MB / " + Math.floor(diskData.total * diskData.allocation / 1000000).toString() + "MB"
                     rowExtension = rowExtension +
                         'Disk Usage: ' + diskInfoString + '<div class="progress">\n' +
                         '  <div class="progress-bar" role="progressbar" style="width: ' + diskData.percentage + '%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>\n' +
                         '</div>'

                 })
             }
             getMemoryData(d).then(memoryData => {
                 console.log(memoryData)
                 let memoryInfoString = Math.floor(memoryData.used * memoryData.allocation/ 1000000).toString() + "MB / " + Math.floor(memoryData.total / 1000).toString() + "MB"
                 rowExtension = rowExtension +
                     'Memory Usage: ' + memoryInfoString + '<div class="progress">\n' +
                     '  <div class="progress-bar" role="progressbar" style="width: ' + memoryData.percentage + '%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>\n' +
                     '</div>'
                     +
                 '</div></div>'
                 resolve(rowExtension)
             })
         })
     })

}


var table = false
$('#device-table-body').on("click", 'td.details-control', function () {
    console.log("click")
    let tr = $(this).closest('tr');
    let row = table.row(tr);
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    } else {
        // Open this row
        row.child("Loading").show();
        format(row.data()).then((extension)=>{


            tr.addClass('shown');
            row.child(extension).show()
        })









    }
});




