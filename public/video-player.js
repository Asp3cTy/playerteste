function loadVideo(video) {
    setTimeout(() => {
        const videoContainer = document.getElementById('videoContainer');

        // Remove o player anterior corretamente
        if (window.player) {
            window.player.dispose();
            window.player = null;
        }

        // Garante que o elemento de vídeo seja recriado corretamente
        videoContainer.innerHTML = '<video id="videoPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>';

        const videoElement = document.getElementById('videoPlayer');
        if (!videoElement) {
            console.error("O elemento #videoPlayer não foi encontrado.");
            return;
        }

        // Inicializa o Video.js no novo elemento
        window.player = videojs(videoElement, {
            controls: true,
            autoplay: true,
            preload: 'auto',
            fluid: true,
            width: "1920",
            height: "1080"
        });

        // Define a fonte do vídeo
        window.player.src({
            src: `http://localhost:3000/video/${video}`,
            type: 'video/mp4'
        });

        // Espera o player estar pronto e ativa o fullscreen corretamente
        window.player.ready(() => {
            setTimeout(() => {
                // Adiciona a classe de fullscreen para cobrir toda a tela
                document.body.classList.add("fullscreen-active");

                // Usa a API do Video.js para fullscreen real no player
                window.player.requestFullscreen();
            }, 500);
        });

        // Adiciona eventos para fechar o player ao sair do fullscreen
        document.addEventListener("fullscreenchange", exitFullscreenHandler);
        document.addEventListener("webkitfullscreenchange", exitFullscreenHandler);
        document.addEventListener("mozfullscreenchange", exitFullscreenHandler);
        document.addEventListener("MSFullscreenChange", exitFullscreenHandler);
    }, 300);
}

// Fecha o player corretamente ao sair do fullscreen
function exitFullscreenHandler() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        if (window.player) {
            window.player.dispose();
            window.player = null;
        }

        // Remove a classe de fullscreen para restaurar o layout
        document.body.classList.remove("fullscreen-active");

        // Pegando a instância Vue de forma segura
        const appElement = document.getElementById("app");
        if (appElement && appElement.__vue_app__) {
            appElement.__vue_app__.config.globalProperties.currentVideo = null;
        } else {
            console.error("Erro: Vue não encontrado corretamente.");
        }

        // Remove event listeners para evitar chamadas repetidas
        document.removeEventListener("fullscreenchange", exitFullscreenHandler);
        document.removeEventListener("webkitfullscreenchange", exitFullscreenHandler);
        document.removeEventListener("mozfullscreenchange", exitFullscreenHandler);
        document.removeEventListener("MSFullscreenChange", exitFullscreenHandler);
    }
}
