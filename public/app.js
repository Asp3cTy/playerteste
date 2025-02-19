<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Streaming de Vídeos</title>
    
    <!-- Estilos -->
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
    <div id="app" class="container mx-auto p-6">
        <!-- Cabeçalho -->
        <header class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">🎬 MyFlix</h1>

            <!-- Botão para Upload -->
            <a href="/upload.html" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md">
                📤 Enviar Vídeo
            </a>
        </header>

        <!-- Seção de Destaque -->
        <section class="featured">
            <h2 class="text-xl font-bold flex items-center">
                <span class="mr-2">🔥 Em Alta</span>
            </h2>
            <div class="carousel flex flex-wrap gap-4 p-2">
                <div class="video-thumbnail bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition-all w-48"
                     v-for="video in videos" :key="video.id" @click="playVideo(video)">
                     
                    <!-- Nome do Arquivo no Card -->
                    <div class="text-center text-sm font-semibold p-4 bg-gray-700 rounded-lg">
                        {{ video.filename.toUpperCase() }}
                    </div>
                </div>
            </div>
        </section>

<!-- Player de Vídeo -->
<div v-show="currentVideo" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
    <div class="relative w-full max-w-6xl">
        <h2 class="text-lg font-bold text-white mb-4 text-center">Reproduzindo: {{ currentVideo }}</h2>
        
        <!-- Agora o vídeo sempre estará no DOM -->
        <video id="videoPlayer" class="w-full h-auto" controls autoplay></video>

        <!-- Botão para fechar -->
        <button class="absolute top-2 right-2 bg-red-500 text-white font-bold py-1 px-3 rounded-lg shadow-lg"
                @click="closePlayer">X</button>
    </div>
</div>



    <!-- Vue.js -->
    <script src="https://unpkg.com/vue@3"></script>
    <!-- Scripts -->
    <script src="app.js"></script>
    <script src="video-player.js"></script>
</body>
</html>
