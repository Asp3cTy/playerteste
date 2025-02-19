const { createApp } = Vue;

createApp({
    data() {
        return {
            videos: [],
            currentVideo: null,
        };
    },
    methods: {
        async fetchVideos() {
            try {
                const response = await fetch('/videos');
                const data = await response.json();
                this.videos = data;
            } catch (error) {
                console.error("Erro ao carregar os vídeos:", error);
            }
        },
        playVideo(video) {
            console.log("Tentando abrir vídeo:", video.filename);
        
            if (!video.filename) {
                console.error("Erro: Nenhum arquivo encontrado para o vídeo.");
                return;
            }
        
            this.currentVideo = video.filename;
        
            setTimeout(() => {
                const player = document.getElementById("videoPlayer");
        
                if (!player) {
                    console.error("❌ Elemento de vídeo ainda não foi encontrado no DOM!");
                    return;
                }
        
                player.src = `/video/${video.filename}`;
        
                player.play()
                    .then(() => {
                        // Entrar em fullscreen automaticamente
                        if (player.requestFullscreen) {
                            player.requestFullscreen();
                        } else if (player.mozRequestFullScreen) { // Firefox
                            player.mozRequestFullScreen();
                        } else if (player.webkitRequestFullscreen) { // Chrome, Safari e Opera
                            player.webkitRequestFullscreen();
                        } else if (player.msRequestFullscreen) { // Internet Explorer
                            player.msRequestFullscreen();
                        }
                    })
                    .catch(err => console.error("Erro ao reproduzir vídeo:", err));
            }, 100); // Pequeno delay para garantir que o Vue aplicou a mudança
        }
        
        ,
        closePlayer() {
            this.currentVideo = null;
            const player = document.getElementById("videoPlayer");
            if (player) {
                player.pause();
                player.src = "";
            }
        }
    },
    mounted() {
        this.fetchVideos();
    }
}).mount('#app');
