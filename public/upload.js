document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("uploadButton").addEventListener("click", startUpload);
  });
  
  async function startUpload() {
    const fileInput = document.getElementById("fileInput");
    const progressBar = document.getElementById("progressBar");
  
    if (!fileInput || !progressBar) {
      console.error("Elemento de input não encontrado!");
      return;
    }
  
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Selecione um arquivo para enviar!");
      return;
    }
  
    progressBar.value = 0;
  
    // 🔹 Solicitar a URL pré-assinada ao Worker
    const formData = new FormData();
    formData.append("fileName", file.name);
  
    const response = await fetch("https://workerupload.julinhopentakill.workers.dev/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      console.error("Erro ao obter Signed URL");
      return;
    }
  
    const { url } = await response.json();
  
    // 🔹 Realizar o upload direto ao R2
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  
    if (uploadResponse.ok) {
      alert("Upload concluído!");
      progressBar.value = 100;
    } else {
      console.error("Erro no upload:", uploadResponse);
      alert("Erro ao enviar o arquivo.");
    }
  }
  
