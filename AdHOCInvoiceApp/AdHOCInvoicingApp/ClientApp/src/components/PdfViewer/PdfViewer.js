import React from "react";
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  ThumbnailView,
  Print,
  Inject,
} from "@syncfusion/ej2-react-pdfviewer";

function PdfViewer({ pdfData, invoiceNo }) {
  let refView;
  const downloadStart = (args) => { };

  //   OpenOption
  // PageNavigationTool
  // MagnificationTool
  // PanTool
  // SelectionTool
  // SearchOption
  // PrintOption
  // DownloadOption
  // UndoRedoTool
  // AnnotationEditTool
  // FormDesignerEditTool
  // CommentTool
  // SubmitForm
  return (
    <embed
      onContextMenu={(e) => e.preventDefault()}
      title="Invoice"
      autoSave="true"
      src={`${pdfData}`}
      style={{ height: "60vh", width:"100%" }}
    ></embed>
    // <PdfViewerComponent
    //   downloadFileName={invoiceNo}
    //   toolbarSettings={{
    //     showTooltip: true,
    //     toolbarItems: [
    //       "PageNavigationTool",
    //       "MagnificationTool",
    //       "PrintOption",
    //       "DownloadOption",
    //     ],
    //   }}
    //   ref={(ref) => (refView = ref)}
    //   id="container"
    //   documentPath={pdfData}
    //   serviceUrl="https://localhost:44399/pdfviewer"
    //   // serviceUrl= {`${process.env.REACT_APP_CLIENT_ROOT}/PDFViewer`}
    //   style={{ height: "600px" }}
    // >
    //   <Inject
    //     services={[Toolbar, Magnification, Navigation, ThumbnailView, Print]}
    //   />
    // </PdfViewerComponent>
  );
}

export default PdfViewer;
