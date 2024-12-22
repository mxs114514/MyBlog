class MusicUploadHandler {
    constructor() {
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.supportedFormats = ['audio/mp3', 'audio/wav', 'audio/ogg'];
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('audioFileInput');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.progressBar = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 处理拖放
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // 处理文件选择
        this.fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });

        // 点击上传按钮
        document.getElementById('uploadButton').addEventListener('click', () => {
            this.fileInput.click();
        });
    }

    async handleFiles(files) {
        const validFiles = files.filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            alert('请选择有效的音频文件（MP3, WAV, OGG，小于50MB）');
            return;
        }

        this.showProgress();
        
        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            try {
                const metadata = await this.readMetadata(file);
                const fileURL = URL.createObjectURL(file);
                
                // 创建新的音乐对象
                const newSong = {
                    name: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
                    artist: metadata.artist || "未知艺术家",
                    album: metadata.album || "未知专辑",
                    src: fileURL,
                    cover: metadata.picture || "images/default-cover.jpg"
                };

                // 更新进度
                const progress = ((i + 1) / validFiles.length * 100).toFixed(0);
                this.updateProgress(progress);

                // 添加到播放列表
                musicList.push(newSong);
            } catch (error) {
                console.error(`处理文件 ${file.name} 时出错:`, error);
            }
        }

        // 完成上传
        setTimeout(() => {
            this.hideProgress();
            updatePlaylist();
            alert(`成功添加 ${validFiles.length} 首歌曲到播放列表`);
        }, 500);
    }

    validateFile(file) {
        if (file.size > this.maxFileSize) {
            return false;
        }
        return this.supportedFormats.includes(file.type);
    }

    async readMetadata(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // 这里可以使用music-metadata-browser库来读取音频元数据
                    // 为了演示，我们返回一个基本对象
                    resolve({
                        title: null,
                        artist: null,
                        album: null,
                        picture: null
                    });
                } catch (error) {
                    resolve({
                        title: null,
                        artist: null,
                        album: null,
                        picture: null
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    showProgress() {
        this.uploadProgress.style.display = 'block';
        this.updateProgress(0);
    }

    hideProgress() {
        this.uploadProgress.style.display = 'none';
    }

    updateProgress(percentage) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
    }
}