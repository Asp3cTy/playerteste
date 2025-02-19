const { createApp } = Vue;

createApp({
    data() {
        return {
            videos: [],
            currentVideo: null,
        };
    },
    methods: {
        fetchVideos() {
            fetch('http://localhost:3000/videos')
                .then(response => response.json())
                .then(data => this.videos = data)
                .catch(error => console.error("Erro ao carregar os vídeos:", error));
        },
        playVideo(video) {
            this.currentVideo = video;
            loadVideo(video);
        },
        closePlayer() {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                document.exitFullscreen();
            } else {
                if (window.player) {
                    window.player.dispose();
                    window.player = null;
                }
                this.currentVideo = null; // Reseta a variável para permitir abrir novamente
            }
        }
    },
    mounted() {
        this.fetchVideos();
    }
}).mount('#app');
