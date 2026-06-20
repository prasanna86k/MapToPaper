//png export 
document.getElementById("exportPNG").onclick = async () => {
  const element = document.getElementById("mapWrap");

  const config = paperSizes[currentPaper];

  await map.invalidateSize();

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: config.scale,
    backgroundColor: null
  });

  const link = document.createElement("a");
  link.download = `map-${currentPaper}-${currentOrientation}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

//pdf export 
document.getElementById("exportPDF").onclick = async () => {
  const { jsPDF } = window.jspdf;

  const element = document.getElementById("mapWrap");
  const config = paperSizes[currentPaper];

  await map.invalidateSize();

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: config.scale,
    backgroundColor: null
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: currentOrientation,
    unit: "mm",
    format: currentPaper.toLowerCase()
  });

  pdf.addImage(imgData, "PNG", 0, 0, config.w, config.h);
  pdf.save(`map-${currentPaper}-${currentOrientation}.pdf`);
};