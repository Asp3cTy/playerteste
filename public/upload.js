async function startUpload() {
    const fileInput = document.getElementById("videoFile");
    const progressBar = document.getElementById("uploadProgress");
    const progressText = document.getElementById("progressText");

    if (!fileInput.files.length) {
        alert("Selecione um arquivo para upload!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
        const request = new XMLHttpRequest();
        request.open("POST", "https://workerupload.julinhopentakill.workers.dev/upload", true);

        // Atualizar a barra de progresso
        request.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                progressBar.value = percent;
                progressText.innerText = percent + "%";
            }
        };

        request.onload = function () {
            if (request.status === 200) {
                alert("Upload concluído com sucesso!");
                fileInput.value = "";
                progressBar.value = 0;
                progressText.innerText = "0%";
            } else {
                alert("Erro no upload: " + request.responseText);
            }
        };

        request.onerror = function () {
            alert("Erro na conexão com o servidor.");
        };

        request.send(formData);
    } catch (error) {
        console.error("Erro no upload:", error);
    }
}
