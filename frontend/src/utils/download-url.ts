export const downloadUrl = async (url: string) => {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = ""; // Let the browser use the filename from the URL or headers
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the file", error);
  }
};