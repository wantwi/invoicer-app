(this["webpackJsonpgra-invoicer"]=this["webpackJsonpgra-invoicer"]||[]).push([[17],{671:function(e,t,a){"use strict";a.r(t);var r=a(9),c=a(5),n=a(20),o=a(26),s=a(8),l=a(2),i=a(173),p=a(114),d=a(80),u=a(172),j=a(454),h=a(147),b=a(113),m=a(246),O=a(249),R=a(146),v=(a(657),a(659),a(660),a(661),a(662),a(47)),E=a(1),_={items:~ej.ReportViewer.ToolbarItems.Parameters},x=function(e){var t=e.setInitialValue,a=e.setShowReport,r=e.reportParam,c=e.reportPath,n=Object(l.useRef)(null),o=Object(v.a)(),i=Object(l.useState)([]),p=Object(s.a)(i,2);p[0],p[1];console.log({reportParam:r});console.log({auth:o}),Object(l.useEffect)((function(){return function(){t({}),a(!1)}}),[c]);return Object(E.jsx)(BoldReportViewerComponent,{id:"reportviewer-container",reportServerUrl:"http://192.168.0.71/ReportServer_SSRS/",reportServiceUrl:"https://psl-app-vm3/EvatApi/api/v1/ReportViewer",reportPath:"".concat("/eVAT/eVAT_Report/").concat(c),onShowError:function(e){alert("Error code : "+e.errorCode+"\nError Detail : "+e.errorDetail+"\nError Message : "+e.errorMessage),e.cancel=!0},toolbarSettings:_,parameters:function(){var e=[];return Object.keys(r).forEach((function(t){var a={name:t,labels:[t],values:[r[t]],nullable:!1};e.push(a)})),e}(),ref:n,printMode:!0})},A=a(505),g=a(38),S=a(151),f=a.n(S),C=a(663),P=[{value:"JournalInvoiceReport",name:"Invoice Journal Report"},{value:"InvoicePurchaseReport",name:"Purchase Journal Report"},{value:"JournalRefundReport",name:"Refund Journal Report"},{value:"EvatDailySummaryReport",name:"EVAT Daily Summary Report"},{value:"DailySummaryReport",name:"Daily Summary Report"},{value:"JournalInvoiceByCurrencyReport",name:"Journal Invoice By Currency Report"}],T={};t.default=function(){var e=Object(g.a)(),t=Object(l.useState)(""),a=Object(s.a)(t,2),_=a[0],S=a[1],y=Object(l.useState)(!1),N=Object(s.a)(y,2),w=N[0],I=N[1],V=Object(l.useState)("auto"),L=Object(s.a)(V,2),D=L[0],U=L[1],B=Object(l.useState)(""),J=Object(s.a)(B,2),k=J[0],F=J[1],M=Object(l.useState)({}),q=Object(s.a)(M,2),H=q[0],W=q[1],Q=Object(l.useState)([]),G=Object(s.a)(Q,2),Y=G[0],z=G[1],K=Object(l.useState)({}),X=Object(s.a)(K,2),Z=(X[0],X[1]),$=Object(l.useState)(!0),ee=Object(s.a)($,2),te=ee[0],ae=ee[1],re=(Object(l.useRef)(null),Object(v.b)()),ce=re.user,ne=(re.getBranches,re.branches),oe=Object(l.useState)([]),se=Object(s.a)(oe,2),le=se[0],ie=se[1],pe=Object(l.useState)(!1),de=Object(s.a)(pe,2),ue=de[0],je=de[1];console.log({branches:ne}),console.log({selectBranches:le});var he=function(){var t=Object(o.a)(Object(n.a)().mark((function t(a){var r,c,o;return Object(n.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={},S(a),t.next=4,e.get("/api/GetReportMeta/Get".concat(a,"Meta"));case 4:c=t.sent,o=c.data,JSON.parse(sessionStorage.getItem(Object({NODE_ENV:"production",PUBLIC_URL:"/gra-invoicer",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,REACT_APP_AUTHORITY:"https://psl-app-vm3/evat-auth",REACT_APP_BASENAME:"/gra-invoicer",REACT_APP_ClientCorsOrigin:"https://psl-app-vm3",REACT_APP_CLIENT_ID:"evat-invoicing-ui",REACT_APP_CLIENT_ROOT:"https://psl-app-vm3/EvatApi/api/v1",REACT_APP_CLIENT_ROOT_V2:"https://psl-app-vm3/EvatApi/api/v2",REACT_APP_CLIENT_ROOT_V3:"https://psl-app-vm3/EvatApi/api/v3",REACT_APP_CLIENT_SECRET:"L#?+;@e&?7D40p0kYO93e>u}18qI7^",REACT_APP_DASHBOARD_URL:"https://reports.cimsgh.com/bi/site/site1/dashboards/7b5d6da7-6ff6-45c6-800c-fc893d09f5de/EVAT/Sec.%20GRA%20QA%20DASHBOARD?showmydashboards=1&isembed=true&hide_tool=dp&export=true%27",REACT_APP_DEFAULT_USER:"user",REACT_APP_REPORTSERVERPath:"/eVAT/eVAT_Report/",REACT_APP_REPORTSERVERURL:"http://192.168.0.71/ReportServer_SSRS/",REACT_APP_REPORTSERVICEURL:"https://psl-app-vm3/EvatApi/api/v1/ReportViewer",REACT_APP_SYNCFUSSION_LICENSE:"ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTfkVkWn1adHZQT2A=",REACT_APP_URL:"https://psl-app-vm3",REACT_APP_VERSION:"2.0.0"}).REACT_APP_OIDC_USER)),o&&(z(o),o.forEach((function(e){"userid"===e.paramName.toLowerCase()?r["".concat(e.paramName)]=ce.sub:r["".concat(e.paramName)]=""})),W(r),o.forEach((function(e){T["".concat(e.paramName)]="date"===e.type.toLowerCase?A.a().required("".concat(e.placeholder," is required")):"number"===e.type.toLowerCase?A.b().required("".concat(e.placeholder," is required")):A.d().required("".concat(e.placeholder," is required"))})),A.c().shape(T),console.log({datal:o}),z(o));case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),be=function(){je(!1),I(!1),U("auto"),ae(!0)},me=function(e){W((function(t){return Object(c.a)(Object(c.a)({},t),{},Object(r.a)({},e.target.name,e.target.value))}))},Oe=function(){return 0===Object.values(H).filter((function(e){return""===e})).length};return Object(l.useEffect)((function(){return be(),function(){}}),[_]),Object(E.jsxs)(E.Fragment,{children:[Object(E.jsx)(i.a,{message:"This is your report page. View all reports here",pageName:"Reports"}),Object(E.jsx)("div",{className:"mt--7",style:{width:"95%",margin:"auto"},children:Object(E.jsx)(p.a,{className:"mt-5",children:Object(E.jsx)(d.a,{className:"mb-5 mb-xl-0",lg:"12",xl:"12",children:Object(E.jsxs)(u.a,{className:"bg-white shadow",style:{height:D,overflow:"hidden"},children:[Object(E.jsx)(j.a,{className:"bg-secondary border-5",style:{height:100},children:Object(E.jsxs)(p.a,{className:"align-items-center",children:[Object(E.jsx)(d.a,{xs:"8",children:Object(E.jsx)(p.a,{children:Object(E.jsxs)(d.a,{xs:"8",children:[Object(E.jsx)("h3",{className:"mb-2",children:"Report"}),Object(E.jsx)(h.a,{children:Object(E.jsxs)("select",{className:"form-control font-sm",value:k,onChange:function(e){z([]),ie([]),F(e.target.value),he(e.target.value),e.target.value.length>0?ae(!0):ae(!1),be()},style:{height:29,padding:"0px 5px"},children:[Object(E.jsx)("option",{value:"",children:"Select report"}),P.map((function(e,t){return Object(E.jsx)("option",{value:e.value,children:e.name},t)}))]})})]})})}),Object(E.jsx)(d.a,{className:"text-right",xs:"4",children:te?Object(E.jsx)(b.a,{hidden:!(k.length>0),color:"primary",size:"sm",onClick:function(){je(!0),U("70vh"),ae(!1)},children:"Open Report"}):null})]})}),Object(E.jsx)(m.a,{className:"mt--1",children:w?Object(E.jsx)(x,{reportParam:Object(c.a)(Object(c.a)({},H),{},{BranchCode:le.map((function(e){return null===e||void 0===e?void 0:e.value})).join(",")}),reportPath:_,setInitialValue:Z,setShowReport:I}):null})]})})})}),Object(E.jsxs)(O.a,{className:"modal-dialog-centered modal-md",isOpen:ue,toggle:function(){return""},children:[Object(E.jsxs)("div",{className:"modal-header",children:[Object(E.jsx)("h1",{className:"modal-title",id:"exampleModalLabel",children:"Report Parameter"}),Object(E.jsx)("button",{"aria-label":"Close",className:"close","data-dismiss":"modal",type:"button",onClick:be,children:Object(E.jsx)("span",{"aria-hidden":!0,children:"\xd7"})})]}),Y.length>0?Object(E.jsxs)("div",{className:"modal-body",id:"report-modal",children:[Y.map((function(e,t){var a=e.type,n=(e.isRequired,e.placeholder),o=(e.value,e.paramName);return Object(E.jsx)(E.Fragment,{children:Object(E.jsxs)(h.a,{children:[Object(E.jsxs)("h3",{hidden:"userid"===o.toLowerCase(),className:"mb-0",children:[n," "]},"".concat(t,"__").concat(o,"a")),"date"===a.toLowerCase()?Object(E.jsx)(E.Fragment,{children:Object(E.jsx)(f.a,{id:o,name:o,maxDate:new Date,placeholderText:n,className:"form-control",showIcon:!0,dateFormat:"yyyy/MM/dd",selected:H[o],onChange:function(e){W((function(t){return Object(c.a)(Object(c.a)({},t),{},Object(r.a)({},o,e))}))},style:{height:29,padding:"0px 5px"}})}):Object(E.jsx)(E.Fragment,{children:Object(E.jsx)(R.a,{hidden:"userid"===o.toLowerCase(),name:o,id:o,type:"".concat(a.toLowerCase()),placeholder:n,onChange:me,value:H.paramName},"".concat(t,"_").concat(o))})]},"".concat(t,"__").concat(o,"b"))})})),Object(E.jsx)(p.a,{children:Object(E.jsxs)(d.a,{children:[Object(E.jsx)("h3",{children:"Branch"}),Object(E.jsx)(C.a,{options:ne.map((function(e){return{label:null===e||void 0===e?void 0:e.name,value:null===e||void 0===e?void 0:e.code}})),value:le,onChange:ie,labelledBy:"Select"})]})}),Object(E.jsx)("br",{}),Object(E.jsxs)(p.a,{children:[Object(E.jsx)(d.a,{xs:6,children:Object(E.jsx)(b.a,{color:"danger",size:"md",type:"submit",onClick:be,style:{width:"100%"},children:"Cancel"})}),Object(E.jsx)(d.a,{xs:6,children:Object(E.jsx)(b.a,{color:"primary",size:"md",type:"submit",onClick:function(e){Oe()&&(je(!1),I(!0))},style:{width:"100%"},children:"View Report"})})]})]}):"Loading report parameters..."]})]})}}}]);