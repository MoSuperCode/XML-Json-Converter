import React from "react";

export default function JsonPreview({ jsonData }) {
  return (
    <>
      <pre>{jsonData ? jsonData : "keine json Data"}</pre>
    </>
  );
}
