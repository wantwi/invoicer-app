(this["webpackJsonpgra-invoicer"]=this["webpackJsonpgra-invoicer"]||[]).push([[16],{664:function(e,t,a){"use strict";a.r(t);var c=a(20),n=a(26),s=a(8),r=a(2),i=a.n(r),o=a(180),l=a(56),u=a(113),d=a(245),j=a(114),b=a(80),O=a(172),f=a(454),h=a(399),v=a(147),m=a(450),p=a(451),x=a(238),g=a(146),N=a(455),S=a(456),y=a(457),w=a(458),R=a(102),P=a(224),C=a(59),T=a(174),I=a(21),k=a(83),D=a(38),F=a(175),A=a(182),L=a(47),E=a(256),H=a(257),G=a(1);t.default=function(){var e=Object(r.useState)(1),t=Object(s.a)(e,2),a=t[0],U=t[1],M=Object(r.useState)([]),z=Object(s.a)(M,2),J=z[0],V=z[1],q=Object(r.useState)(9),K=Object(s.a)(q,1)[0],W=Object(r.useState)({totalItems:10,pageNumber:1,pageSize:5,totalPages:10}),Y=Object(s.a)(W,2),Q=Y[0],X=Y[1],Z=Object(r.useState)({totalPayable:0,totalSalesVAT:0,totalNoSalesInvoices:0}),$=Object(s.a)(Z,2),_=$[0],ee=$[1],te=Object(r.useState)(1),ae=Object(s.a)(te,2),ce=ae[0],ne=ae[1],se=Object(r.useRef)(),re=Object(r.useState)(!1),ie=Object(s.a)(re,2),oe=ie[0],le=ie[1],ue=Object(r.useState)(""),de=Object(s.a)(ue,2),je=de[0],be=de[1],Oe=Object(T.a)(je,500),fe=Object(s.a)(Oe,1)[0],he=Object(r.useState)(""),ve=Object(s.a)(he,2),me=ve[0],pe=ve[1],xe=Object(r.useState)(null),ge=Object(s.a)(xe,2),Ne=ge[0],Se=ge[1],ye=Object(r.useState)({}),we=Object(s.a)(ye,2),Re=we[0],Pe=we[1],Ce=Object(D.a)(),Te=Object(r.useState)(""),Ie=Object(s.a)(Te,2),ke=Ie[0],De=Ie[1],Fe=Object(r.useState)(""),Ae=Object(s.a)(Fe,2),Le=Ae[0],Ee=Ae[1],He=Object(r.useState)(!1),Ge=Object(s.a)(He,2),Be=Ge[0],Ue=Ge[1],Me=Object(r.useState)(!1),ze=Object(s.a)(Me,2)[1],Je=Object(L.a)().selectedBranch,Ve=Object(r.useState)(!1),qe=Object(s.a)(Ve,2),Ke=(qe[0],qe[1],Object(r.useState)([])),We=Object(s.a)(Ke,2),Ye=(We[0],We[1],Object(r.useState)(!1)),Qe=Object(s.a)(Ye,2),Xe=Qe[0],Ze=Qe[1],$e=Object(r.useState)(!1),_e=Object(s.a)($e,2),et=_e[0],tt=_e[1],at=Object(r.useState)(!1),ct=Object(s.a)(at,2),nt=ct[0],st=ct[1],rt=Object(r.useState)({}),it=Object(s.a)(rt,2),ot=it[0],lt=it[1],ut=Object(r.useState)(!1),dt=Object(s.a)(ut,2),jt=(dt[0],dt[1],Object(r.useState)("")),bt=Object(s.a)(jt,2),Ot=bt[0],ft=bt[1],ht=Object(r.useState)("Partial"),vt=Object(s.a)(ht,2),mt=vt[0],pt=vt[1],xt=Object(r.useState)(""),gt=Object(s.a)(xt,2),Nt=gt[0],St=gt[1],yt=Object(r.useState)(""),wt=Object(s.a)(yt,2),Rt=wt[0],Pt=wt[1],Ct=i.a.useMemo((function(){return[{Header:"Invoice #",accessor:"invoiceNo",className:" text-left ",width:190},{Header:"Refund #",accessor:"refundNo",className:" text-left ",width:190},{Header:"Refund Date",accessor:"date",className:" text-left ",Cell:function(e){var t=e.cell.value;return Object(G.jsx)(G.Fragment,{children:new Date(t).toLocaleDateString("en-GB")})},width:140},{Header:"Customer",accessor:"customerName",className:" text-left ",width:"auto"},{Header:"Type",accessor:"refundType",className:" text-left ",width:140},{Header:"Total Refund Amount",accessor:"totalAmount",className:" text-left ",Cell:function(e){var t=e.cell.value;return Object(G.jsx)(G.Fragment,{children:Object(G.jsx)("div",{style:{textAlign:"right",width:"10%"},children:Object(l.b)(t)})})},width:140},{Header:function(){return Object(G.jsx)("div",{align:"center",children:"View"})},disableSortBy:!0,className:" text-center table-action",accessor:"action",width:140,Cell:function(e){return Object(G.jsx)(u.a,{style:{padding:"2px 8px"},className:"badge-success",onClick:function(t){var a,c;Tt(null===e||void 0===e||null===(a=e.row)||void 0===a||null===(c=a.original)||void 0===c?void 0:c.id)},title:"Preview",children:Object(G.jsx)(C.f,{})})}}]}),[]),Tt=(new AbortController,function(){var e=Object(n.a)(Object(c.a)().mark((function e(t){var a,n,s,r,i,o;return Object(c.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Ee(t),Ue(!0),a="",e.prev=3,e.next=6,Ce.post("/api/GenerateRefundReportAsync",t);case 6:(n=e.sent)&&(s=n.data,r="application/pdf",De(a="data:application/pdf;base64,"+s),le(!0),Ue(!1),i=function(e){for(var t=e.substr("data:".concat(r,";base64,").length),a=atob(t),c=a.length,n=new Uint8Array(c);c--;)n[c]=a.charCodeAt(c);return new Blob([n],{type:r})},(o=document.createElement("a")).href=URL.createObjectURL(i(a)),o.download="Invoice Report"),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(3),ze(!1),I.b.error("System failed to download invoice "),Ue(!1);case 15:case"end":return e.stop()}}),e,null,[[3,10]])})));return function(t){return e.apply(this,arguments)}}()),It=Object(P.a)(fe?"/api/GetRefundsSearch/".concat(fe):"/api/GetRefunds/".concat(ce,"/").concat(a,"/").concat(K,"/").concat(null===Je||void 0===Je?void 0:Je.code),"refunds",a,Number(ce),fe,(function(e){var t,a,c,n;if(V((null===e||void 0===e||null===(t=e.invoices)||void 0===t?void 0:t.items)||[]),X(null===(a=e.invoices)||void 0===a?void 0:a.paging),ee((null===e||void 0===e?void 0:e.summaries)||[]),0===(null===e||void 0===e||null===(c=e.invoices)||void 0===c||null===(n=c.items)||void 0===n?void 0:n.length)){var s,r,i,o=fe?"No invoice matched your search: "+fe:"No Invoice Available For "+(null===se||void 0===se||null===(s=se.current)||void 0===s||null===(r=s.options[null===se||void 0===se||null===(i=se.current)||void 0===i?void 0:i.selectedIndex])||void 0===r?void 0:r.innerText);I.b.info(o),Se(o)}else Se(null)}),(function(e){var t;I.b.error((null===e||void 0===e||null===(t=e.response)||void 0===t?void 0:t.data)||"Error loading Refunds")}),{filterUrl:"/api/GetRefundsSearch/".concat(fe),shouldTransform:!1}),kt=(It.data,It.refetch),Dt=(It.isFetching,It.isLoading),Ft=Object(k.a)("/api/GetRefundsById/".concat(me),"refund-detail",me,(function(e){pe(""),Pe(e),le(!0),"SUCCESS"===e.signatureStatus?(Pe(e),le(!0)):Pe(e)}),(function(e){I.b.error((null===e||void 0===e?void 0:e.message)||(null===e||void 0===e?void 0:e.Message)||"Could not get Refund detail"),le(!1)}),{isEnabled:!1}),At=Ft.refetch,Lt=(Ft.data,Ft.isLoading);Ft.isFetching;return Object(r.useEffect)((function(){return 0===a&&(X({totalItems:10,pageNumber:1,pageSize:10,totalPages:5}),U(1)),kt(),function(){}}),[ce,a]),Object(r.useEffect)((function(){return fe.length>1&&kt(),function(){}}),[fe]),Object(r.useEffect)((function(){return me.length>0&&At(),function(){}}),[me]),Object(G.jsxs)(G.Fragment,{children:[Object(G.jsx)(o.a,{dayOfWeekSelRef:se,summary:_,period:ce,setPeriod:ne,pageName:"Refunds"}),Object(G.jsx)(I.a,{}),Object(G.jsx)(d.a,{className:"mt--7",fluid:!0,children:Object(G.jsx)(j.a,{className:"mt-5",children:Object(G.jsx)(b.a,{className:"mb-5 mb-xl-0",xl:"12",children:Object(G.jsxs)(O.a,{className:"shadow",children:[Object(G.jsx)(f.a,{className:"border-0",children:Object(G.jsxs)(j.a,{className:"align-items-center",children:[Object(G.jsx)("div",{className:"col",children:Object(G.jsx)(h.a,{className:"navbar-search navbar-search-light form-inline ",onSubmit:function(e){},children:Object(G.jsxs)(v.a,{className:"mb-0",children:[" ",Object(G.jsxs)(m.a,{className:"input-group-alternative",children:[Object(G.jsx)(p.a,{addonType:"prepend",style:{marginTop:7},children:Object(G.jsx)(x.a,{children:Object(G.jsx)("i",{className:"fas fa-search"})})}),Object(G.jsx)(g.a,{placeholder:"Search by Invoice No, Refund No or Customer name",type:"text",value:je,onChange:function(e){if((null===je||void 0===je?void 0:je.length)>25)return be((function(e){return e.substring(0,16)})),void Se("Your search query is too long");be(e.target.value)},style:{width:400}}),Object(G.jsx)(p.a,{addonType:"append",children:Object(G.jsx)(x.a,{})})]})]})})}),Object(G.jsx)("div",{className:"col text-right mt-0",children:Object(G.jsxs)(u.a,{className:"badge-success",onClick:function(){tt((function(e){return!0}))},title:"Refund",children:[Object(G.jsx)("img",{src:R.a,alt:"refund",style:{height:20}})," ","Refund Invoice"]})})]})}),Object(G.jsx)("div",{style:B.body,children:Object(G.jsx)(F.a,{isLoading:Dt||Lt||Be,columns:Ct,data:J,sortKey:"date",setSelectedRow:function(){return null},getPrintPDF:function(){return null},pdfData:ke,message:Ne})}),Object(G.jsx)(N.a,{className:"py-1",children:!(Dt||Lt||Be)&&(null===J||void 0===J?void 0:J.length)>0&&Object(G.jsx)("nav",{"aria-label":"...",children:null!==Q&&void 0!==Q&&Q.pageNumber?Object(G.jsxs)(S.a,{className:"pagination justify-content-center mb-0",listClassName:"justify-content-center mb-0",children:[Object(G.jsx)(y.a,{children:Object(G.jsxs)(w.a,{onClick:function(e){e.preventDefault(),Q.pageNumber>1&&(a<1||U((function(e){return Number(e)-1})))},children:[Object(G.jsx)("i",{className:"fas fa-angle-left"}),Object(G.jsx)("span",{className:"sr-only",children:"Previous"})]})}),Object(G.jsx)(y.a,{children:Object(G.jsx)(w.a,{onClick:function(e){return U(1)},children:"1"})}),Object(G.jsx)(y.a,{className:"active",children:Object(G.jsx)(w.a,{onClick:function(e){return e.preventDefault()},children:Q.pageNumber})}),Object(G.jsx)(y.a,{children:Object(G.jsx)(w.a,{onClick:function(e){return U(Q.totalPages)},children:Q.totalPages})}),Object(G.jsx)(y.a,{children:Object(G.jsxs)(w.a,{onClick:function(e){Q.pageNumber<Q.totalPages&&a!==Q.totalPages&&U((function(e){return Number(e)+1}))},children:[Object(G.jsx)("i",{className:"fas fa-angle-right"}),Object(G.jsx)("span",{className:"sr-only",children:"Next"})]})})]}):null})})]})})})}),oe&&Object(G.jsx)(A.a,{setShowReport:le,formData:Re,getPrintPDF:Tt,pdfData:ke,selectedInvoiceNo:Le}),Object(G.jsx)(E.a,{refundType:mt,refundTypeForPost:Nt,message:Ot,showPrompt:nt,setshowPrompt:st,showLoader:Xe,setShowLoader:Ze,refundInvoice:ot,reset:Pt,setOpen:tt}),Object(G.jsx)(H.a,{setPromptMessage:ft,setRefundType:pt,refundType:mt,setRefundTypeForPost:St,show:et,setOpen:tt,setshowPrompt:st,setrefundInvoice:lt,reset:Pt},Rt)]})};var B={body:{marginTop:-10,overflow:"auto",cursor:"pointer"}}}}]);