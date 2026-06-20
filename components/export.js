async function exportImage(type) {
  const canvas = await html2canvas(document.querySelector("#mapWrap"), {
    scale: 2
  });

  const img = canvas.toDataURL("image/png");

  if (type === "png") {
    const a = document.createElement("a");
    a.href = img;
    a.download = "map-art.png";
    a.click();
  }

  if (type === "pdf") {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape");

    pdf.addImage(img, "PNG", 0, 0, 280, 160);
    pdf.save("map-art.pdf");
  }
}

document.getElementById("exportPNG").onclick = () => exportImage("png");
document.getElementById("exportPDF").onclick = () => exportImage("pdf");