'use strict';

let toIPFS = document.getElementById('toIPFS');
let viewFile = document.getElementById('viewFile');
let successBH = document.getElementById('successBH');
let failedBH = document.getElementById('failedBH');
let home = document.getElementById("home");
let success = document.getElementById("success");
let failed = document.getElementById("failed");

toIPFS.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    chrome.pageCapture.saveAsMHTML
    ({tabId: tab.id,}, bin => {
        const blob = new Blob([bin], {
            type: 'plain/mhtml',
            filename: tab.title,
            extension: 'mhtml'
        });
        const ipfsaddurl = "http://127.0.0.1:5001/api/v0/add";
        var ipfsadd = new XMLHttpRequest();
        ipfsadd.open("POST", ipfsaddurl, true);
        ipfsadd.onreadystatechange = function() {//Call a function when the state changes.
            if(ipfsadd.readyState == 4 && ipfsadd.status == 200) {
                // console.log(ipfsadd);
                const hash = JSON.parse(ipfsadd.responseText).Hash;
                const ipfscpurl = encodeURI("http://127.0.0.1:5001/api/v0/files/cp?arg=/ipfs/"+hash+"&arg=/"+tab.title+" - "+hash+".mhtml");
                var ipfscp = new XMLHttpRequest();
                ipfscp.open("POST", ipfscpurl, true);
                ipfscp.onreadystatechange = function() {//Call a function when the state changes.
                    if(ipfscp.readyState == 4 && ipfscp.status == 200) {
                        // console.log(ipfscp.responseText);
                        home.style.display = "none";
                        success.style.display = "block";
                        failed.style.display = "none";
                        document.getElementById("successDesc").innerText = hash;
                        new QRCode(document.getElementById("qrcode"), "/ipfs/"+hash);
                    } else {
                        home.style.display = "none";
                        success.style.display = "none";
                        failed.style.display = "block";
                        document.getElementById("failedDesc").innerText = ipfscp.responseText;
                    }
                }
                ipfscp.send();
            }
        }
        var formData = new FormData();
        formData.append("file", blob, tab.title);
        ipfsadd.send(formData);
    })
})
};

viewFile.onclick = function(element) {
    chrome.tabs.create({ url: "http://localhost:5001/webui" });
};

successBH.onclick = function(element) {
    chrome.tabs.create({ url: "http://localhost:5001/webui" });
};

failedBH.onclick = function(element) {
    home.style.display = "block";
    success.style.display = "none";
    failed.style.display = "none";
};