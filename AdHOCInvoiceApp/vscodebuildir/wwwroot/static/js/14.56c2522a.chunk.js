(this["webpackJsonpgra-invoicer"]=this["webpackJsonpgra-invoicer"]||[]).push([[14],{475:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var r=a(5),s=a(20),c=a(26),n=a(148),i=a(38),o=(JSON.parse(sessionStorage.getItem(Object({NODE_ENV:"production",PUBLIC_URL:"/gra-invoicer",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_AUTHORITY:"https://psl-app-vm3/evat-auth",REACT_APP_BASENAME:"/gra-invoicer",REACT_APP_ClientCorsOrigin:"https://psl-app-vm3",REACT_APP_CLIENT_ID:"evat-invoicing-ui",REACT_APP_CLIENT_ROOT:"https://psl-app-vm3/EvatApi/api/v1",REACT_APP_CLIENT_ROOT_V2:"https://psl-app-vm3/EvatApi/api/v2",REACT_APP_CLIENT_ROOT_V3:"https://psl-app-vm3/EvatApi/api/v3",REACT_APP_CLIENT_SECRET:"L#?+;@e&?7D40p0kYO93e>u}18qI7^",REACT_APP_DASHBOARD_URL:"https://reports.cimsgh.com/bi/site/site1/dashboards/7b5d6da7-6ff6-45c6-800c-fc893d09f5de/EVAT/Sec.%20GRA%20QA%20DASHBOARD?showmydashboards=1&isembed=true&hide_tool=dp&export=true%27",REACT_APP_DEFAULT_USER:"user",REACT_APP_REPORTSERVERPath:"/eVAT/eVAT_Report/",REACT_APP_REPORTSERVERURL:"http://192.168.0.71/ReportServer_SSRS/",REACT_APP_REPORTSERVICEURL:"https://psl-app-vm3/EvatApi/api/v1/ReportViewer",REACT_APP_SYNCFUSSION_LICENSE:"ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTfkVkWn1adHZQT2A=",REACT_APP_URL:"https://psl-app-vm3",REACT_APP_VERSION:"2.0.0"}).REACT_APP_OIDC_USER)),function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},d=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(){},l=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{isEnabled:!0,queryTag:"/?filter="},b=Object(i.a)(),u=l.isEnabled,j=(l.queryTag,function(){var t=Object(c.a)(Object(s.a)().mark((function t(){var a;return Object(s.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b.get(e);case 2:return a=t.sent,t.abrupt("return",a.data);case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()),p=Object(n.a)({queryKey:[t,a],queryFn:j,onSuccess:function(e){return o(e)},onError:function(e){return d(e)},enabled:u});return Object(r.a)({},p)})},665:function(e,t,a){"use strict";a.r(t);var r=a(5),s=a(8),c=a(245),n=a(114),i=a(80),o=a(172),d=a(454),l=a(246),b=a(147),u=a(146),j=a(173),p=a(2),O=a(115),h=a.n(O),m=a(249),f=a(113),A=a(475),E=a(116),_=a(117),R=a(1),T=function(e){var t=e.from,a=e.to,r=e.companyId;return Object(R.jsx)(R.Fragment,{children:Object(R.jsx)(l.a,{children:Object(R.jsx)("iframe",{src:"".concat("https://reports.cimsgh.com/bi/site/site1/dashboards/7b5d6da7-6ff6-45c6-800c-fc893d09f5de/EVAT/Sec.%20GRA%20QA%20DASHBOARD?showmydashboards=1&isembed=true&hide_tool=dp&export=true%27","&CompanyId=").concat(r,"&FromDate=").concat(t,"&ToDate=").concat(a),id:"dashboard-frame",width:"100%",height:"900px",allowFullScreen:!0,frameBorder:"0"})})})},v=function(e){var t=e.setIsCustom,a=e.handleSubmit,c=Object(p.useState)({from:"",to:""}),o=Object(s.a)(c,2),d=o[0],l=o[1];return Object(R.jsxs)(m.a,{className:"modal-dialog-centered modal-md",isOpen:!0,style:{width:"fit-content"},children:[Object(R.jsxs)("div",{className:"modal-header",children:[Object(R.jsx)("h1",{className:"modal-title",id:"exampleModalLabel",children:"Dashboard Parameter"}),Object(R.jsx)("button",{"aria-label":"Close",className:"close","data-dismiss":"modal",type:"button",onClick:function(){return t(!1)},children:Object(R.jsx)("span",{"aria-hidden":!0,children:"\xd7"})})]}),Object(R.jsxs)("div",{className:"modal-body",children:[Object(R.jsxs)(b.a,{children:[Object(R.jsx)("h3",{className:"mb-0",children:"Date From"}),Object(R.jsx)(u.a,{type:"date",onChange:function(e){return l((function(t){return Object(r.a)(Object(r.a)({},t),{},{from:e.target.value})}))},value:d.from})]}),Object(R.jsxs)(b.a,{children:[Object(R.jsx)("h3",{className:"mb-0",children:"Date To"}),Object(R.jsx)(u.a,{type:"date",onChange:function(e){return l((function(t){return Object(r.a)(Object(r.a)({},t),{},{to:e.target.value})}))},value:d.to})]}),Object(R.jsxs)(n.a,{children:[Object(R.jsx)(i.a,{xs:6,children:Object(R.jsx)(f.a,{color:"danger",size:"md",type:"submit",onClick:function(){return t(!1)},style:{width:"100%"},children:"Cancel"})}),Object(R.jsx)(i.a,{xs:6,children:Object(R.jsx)(f.a,{color:"primary",size:"md",type:"submit",onClick:function(){return a(d)},style:{width:"100%"},children:"View Report"})})]})]})]})};t.default=function(){var e=Object(p.useState)("today"),t=Object(s.a)(e,2),a=t[0],r=(t[1],Object(p.useState)("")),l=Object(s.a)(r,2),b=l[0],u=l[1],O=Object(p.useState)(""),m=Object(s.a)(O,2),f=m[0],x=m[1],C=Object(p.useState)(!1),S=Object(s.a)(C,2),g=S[0],P=S[1],D=Object(A.a)("/api/GetDashboard").data,y=void 0===D?"":D;console.log({data:y});return Object(p.useEffect)((function(){var e=null;switch(a){case"all":e=new Date("2021-11-01").toLocaleDateString(),e=h()(e).format("YYYY-MM-DD"),u(e);break;case"custom":P(!0);break;default:e=new Date(h()().startOf(a)).toLocaleDateString(),e=h()(e).format("YYYY-MM-DD"),u(e),e=new Date(h()().startOf("day")).toLocaleDateString(),e=h()(e).format("YYYY-MM-DD"),x(e)}return function(){}}),[a]),Object(R.jsx)(R.Fragment,{children:Object(R.jsxs)(_.ErrorBoundary,{FallbackComponent:E.a,onError:function(e,t){console.log("Logging",e,t)},children:[Object(R.jsx)(j.a,{message:"Dashboard"}),g&&Object(R.jsx)(v,{handleSubmit:function(e){var t=e.from,a=e.to;u(t),x(a),P(!1)},setIsCustom:P}),Object(R.jsx)(c.a,{className:"mt--7",fluid:!0,children:Object(R.jsx)(n.a,{className:"mt-5",children:Object(R.jsx)(i.a,{className:"mb-5 mb-xl-0",xl:"12",children:Object(R.jsxs)(o.a,{className:"shadow",children:[Object(R.jsx)(d.a,{className:"border-0",children:Object(R.jsx)("div",{calssname:"filterCard",style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"19px",height:"43px",paddingRight:"20px"},children:Object(R.jsx)("span",{children:"Business\xa0Insights"})})}),y&&Object(R.jsx)(T,{from:b,to:f,companyId:y})]})})})})]})})}}}]);