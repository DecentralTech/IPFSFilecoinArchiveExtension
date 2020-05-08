'use strict';
 
chrome.browserAction.onClicked.addListener(tab => chrome.pageCapture.saveAsMHTML({
  tabId: tab.id
}, bin => {
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
          console.log(ipfsadd);
          
          const ipfscpurl = encodeURI("http://127.0.0.1:5001/api/v0/files/cp?arg=/ipfs/"+JSON.parse(ipfsadd.responseText).Hash+"&arg=/"+tab.title+".mhtml");
          var ipfscp = new XMLHttpRequest();
          ipfscp.open("POST", ipfscpurl, true);
          ipfscp.onreadystatechange = function() {//Call a function when the state changes.
              if(ipfscp.readyState == 4 && ipfscp.status == 200) {
                  console.log(ipfscp.responseText);
              }
          }
          ipfscp.send();

      }
  }
  var formData = new FormData();
  formData.append("file", blob, tab.title);
  ipfsadd.send(formData);
  
}))

  // chrome.storage.local.get({
  //   'notify': true,
  //   'saveAs': false,
  //   'filename': '[title]',
  //   'extension': 'mhtml'
  // }, prefs => {
  //   const lastError = chrome.runtime.lastError;
  //   if (lastError) {
  //     return prefs.notify && chrome.notifications.create(null, {
  //       type: 'basic',
  //       iconUrl: '/data/icons/48.png',
  //       title: chrome.runtime.getManifest().name,
  //       message: lastError.message
  //     });
  //   }
  //   const url = URL.createObjectURL(blob);
  //   const filename = prefs.filename
  //     .replace(/\[title\]/g, tab.title)
  //     .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-');

  //   chrome.downloads.download({
  //     url,
  //     saveAs: prefs.saveAs,
  //     filename: filename + '.' + prefs.extension
  //   }, () => {
  //     URL.revokeObjectURL(url);
  //   });
  // });
// }));

// // FAQs and Feedback
// {
//   const {onInstalled, setUninstallURL, getManifest} = chrome.runtime;
//   const {name, version} = getManifest();
//   const page = getManifest().homepage_url;
//   onInstalled.addListener(({reason, previousVersion}) => {
//     chrome.storage.local.get({
//       'faqs': true,
//       'last-update': 0
//     }, prefs => {
//       if (reason === 'install' || (prefs.faqs && reason === 'update')) {
//         const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
//         if (doUpdate && previousVersion !== version) {
//           chrome.tabs.create({
//             url: page + '?version=' + version +
//               (previousVersion ? '&p=' + previousVersion : '') +
//               '&type=' + reason,
//             active: reason === 'install'
//           });
//           chrome.storage.local.set({'last-update': Date.now()});
//         }
//       }
//     });
//   });
//   setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
// }


// function files2streams (files) {
//   const streams = []
//   for (const file of files) {
//     if (!file.type && file.size === 0) {
//       // UX fail-safe:
//       // at the moment drag&drop of an empty file without an extension
//       // looks the same as dropping a directory
//       throw new Error(`unable to add "${file.name}", directories and empty files are not supported`)
//     }
//     const fileStream = fileReaderPullStream(file, { chunkSize: 32 * 1024 * 1024 })
//     streams.push({
//       path: file.name,
//       content: fileStream
//     })
//   }
//   return streams
// }



  // const prefs = {
  //   'enabled': false,
  //   'overwrite-origin': true,
  //   'overwrite-methods': true,
  //   'methods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH']
  // };
  
  // const cors = {};
  // cors.onHeadersReceived = ({responseHeaders}) => {
  //   if (prefs['overwrite-origin'] === true) {
  //     const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-origin');
  //     if (o) {
  //       o.value = '*';
  //     }
  //     else {
  //       responseHeaders.push({
  //         'name': 'Access-Control-Allow-Origin',
  //         'value': '*'
  //       });
  //     }
  //   }
  //   if (prefs['overwrite-methods'] === true) {
  //     const o = responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-methods');
  //     if (o) {
  //       o.value = prefs.methods.join(', ');
  //     }
  //     else {
  //       responseHeaders.push({
  //         'name': 'Access-Control-Allow-Methods',
  //         'value': prefs.methods.join(', ')
  //       });
  //     }
  //   }
  //   return {responseHeaders};
  // };
  // // cors.install = () => {
  // //   cors.remove();
  // //   const extra = ['blocking', 'responseHeaders'];
  // //   if (/Firefox/.test(navigator.userAgent) === false) {
  // //     extra.push('extraHeaders');
  // //   }
  // //   chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
  // //     urls: ['<all_urls>']
  // //   }, extra);
  // // };
  // // cors.remove = () => {
  // //   chrome.webRequest.onHeadersReceived.removeListener(cors.onHeadersReceived);
  // // };

  // const extra = ['blocking', 'responseHeaders'];
  // if (/Firefox/.test(navigator.userAgent) === false) {
  //   extra.push('extraHeaders');
  // }
  // chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
  //   urls: ['<all_urls>']
  // }, extra);
