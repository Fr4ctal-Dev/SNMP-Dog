$('#submitCustomRequest').on("click", function (e){
    let ip = $('#inputIP').val()
    let value = $('#inputValue').val()
    let mib = $('#inputMIB').val()
    let tableText = $('#inputTable').val()

    let requestBody =
        {
            ip:ip,
            value:value,
            mib:mib,
            table:tableText
        }

    fetch('http://localhost:5000/single', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            $('#requestOutput').text(JSON.stringify(result))
        })

})