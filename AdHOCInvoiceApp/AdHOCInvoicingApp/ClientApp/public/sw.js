// console.log({ public: "this is my sw in the public" });

const CACHEURL = [
  "/gra-invoicer/admin/index",
  "/gra-invoicer/static/js/main.chunk.js",
  "/gra-invoicer/static/js/bundle.js",
  "/gra-invoicer/static/js/chunk.js",
  "/index.html",
  "/gra-invoicer/auth/login",
  // "/gra-invoicer/signin-callback.html",
  "/gra-invoicer/manifest.json",
  "/gra-invoicer/favicon.ico",
  "/gra-invoicer/static/js/vendors~main.chunk.js",

  //     'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-base.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-data.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-pdf-export.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-svg-base.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-lineargauge.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-circulargauge.min.js',
  // 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-maps.min.js',
  // 'https://static.zdassets.com/ekr/snippet.js?key=fee879cc-baaa-45ef-af28-9b38cedda218',
  // 'https://static.zdassets.com/web_widget/latest/web-widget-framework-4156df7a230d696d9dfa.js',
  // 'https://static.zdassets.com/web_widget/classic/latest/web-widget-main-045c15a.js',
  // 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
];

// let cacheData="appv1"

// this.addEventListener('install', function(event) {
//     // Perform install steps
//     event.waitUntil(
//       caches.open(cacheData)
//         .then(function(cache) {
//           console.log('Opened cache');
//           // Magic is here. Look the  mode: 'no-cors' part.
//           cache.addAll(CACHEURL.map(function(urlToPrefetch) {
//              return new Request(urlToPrefetch, { mode: 'no-cors' });
//           })).then(function() {
//             console.log('All resources have been fetched and cached.');
//           });
//         })
//     );
//   });

// this.addEventListener("install",(event)=>{
//     event.waitUntil(
//         caches.open(cacheData).then(res =>{
//             res.addAll([
//                 "/gra-invoicer/admin/index",
//                 '/gra-invoicer/static/js/main.chunk.js',
//                 '/gra-invoicer/static/js/bundle.js',
//                 '/gra-invoicer/static/js/chunk.js',
//                 '/index.html',

//             ])
//         })
//     )
// })

// this.addEventListener('fetch',event =>{
//     if(!navigator.onLine){
//         event.respondWith(
//             caches.match(event.request).then(resp =>{
//                 if(resp){
//                     return resp
//                 }
//             })
//         )
//     }

// })

// 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-base.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-data.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-pdf-export.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/common/ej2-svg-base.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-lineargauge.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-circulargauge.min.js',
// 'https://cdn.boldreports.com/3.3.23/scripts/data-visualization/ej2-maps.min.js',
// 'https://static.zdassets.com/ekr/snippet.js?key=fee879cc-baaa-45ef-af28-9b38cedda218',
// 'https://static.zdassets.com/web_widget/latest/web-widget-framework-4156df7a230d696d9dfa.js',
// 'https://static.zdassets.com/web_widget/classic/latest/web-widget-main-045c15a.js',
// 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
