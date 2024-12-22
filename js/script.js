// 在文件开头添加格式化时间的函数
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 获取HTML元素
const playlistSongs = document.getElementById("playlist-songs"); // 获取播放列表的容器
const playButton = document.getElementById("play"); // 获取播放按钮
const pauseButton = document.getElementById("pause"); // 获取暂停按钮
const nextButton = document.getElementById("next"); // 获取下一首按钮
const previousButton = document.getElementById("previous"); // 获取上一首按钮
const shuffleButton = document.getElementById("shuffle"); // 获取随机播放按钮

// 定义歌曲列表
const allSongs = [
  {
      id: 0,
      title: "Scratching The Surface",
      artist: "Quincy Larson",
      duration: "4:25",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
    },
    {
      id: 1,
      title: "Can't Stay Down",
      artist: "Quincy Larson",
      duration: "4:15",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
    },
    {
      id: 2,
      title: "Still Learning",
      artist: "Quincy Larson",
      duration: "3:51",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
    },
    {
      id: 3,
      title: "Cruising for a Musing",
      artist: "Quincy Larson",
      duration: "3:34",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
    },
    {
      id: 4,
      title: "Never Not Favored",
      artist: "Quincy Larson",
      duration: "3:35",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
    },
    {
      id: 5,
      title: "From the Ground Up",
      artist: "Quincy Larson",
      duration: "3:12",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
    },
    {
      id: 6,
      title: "Walking on Air",
      artist: "Quincy Larson",
      duration: "3:25",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
    },
    {
      id: 7,
      title: "Can't Stop Me. Can't Even Slow Me Down.",
      artist: "Quincy Larson",
      duration: "3:52",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
      id: 8,
      title: "The Surest Way Out is Through",
      artist: "Quincy Larson",
      duration: "3:10",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
    },
    {
      id: 9,
      title: "Chasing That Feeling",
      artist: "Quincy Larson",
      duration: "2:43",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
    },
];

// 创建音频对象
const audio = new Audio(); // 用于播放音频
let userData = {
songs: [...allSongs], // 用户的歌曲数据，初始化为所有歌曲
currentSong: null, // 当前播放的歌曲
songCurrentTime: 0, // 当前歌曲的播放时间
};

// 播放指定ID的歌曲
const playSong = (id) => {
const song = userData?.songs.find((song) => song.id === id); // 查找对应的歌曲
audio.src = song.src; // 设置音频源
audio.title = song.title; // 设置音频标题

// 判断是否是新歌曲，如果是则从头开始播放
if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
  audio.currentTime = 0;
} else {
  audio.currentTime = userData?.songCurrentTime; // 恢复之前播放的时间
}

userData.currentSong = song; // 更新当前播放的歌曲
playButton.classList.add("playing"); // 更新播放按钮状态

highlightCurrentSong(); // 高亮当前播放的歌曲
setPlayerDisplay(); // 更新播放器显示信息
setPlayButtonAccessibleText(); // 设置可访问性文本
audio.play(); // 播放音乐

// 重置进度条和图标位置
progressFill.style.width = '0%';
progressHandle.style.left = '0%';

const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');

if (currentTimeDisplay) {
  currentTimeDisplay.textContent = '0:00';
}

// 等待音频加载完成后更新总时长
audio.addEventListener('loadedmetadata', () => {
  if (totalTimeDisplay) {
    // 使用歌曲的实际时长
    totalTimeDisplay.textContent = song.duration;
  }
}, { once: true });
};

// 暂停当前歌曲
const pauseSong = () => {
userData.songCurrentTime = audio.currentTime; // 保存当前时间

playButton.classList.remove("playing"); // 更新播放按钮状态
audio.pause(); // 暂停音乐
};

// 播放下一首歌曲
const playNextSong = () => {
if (userData?.currentSong === null) {
  playSong(userData?.songs[0].id); // 如果没有当前歌曲，则播放第一首
} else {
  const currentSongIndex = getCurrentSongIndex(); // 获取当前曲目索引
  const nextSong = userData?.songs[currentSongIndex + 1]; // 获取下一首歌曲

  playSong(nextSong.id); // 播放下一首歌曲
}
};

// 播放上一首歌曲
const playPreviousSong = () => {
if (userData?.currentSong === null) return; // 如果没有当前歌曲则返回
const currentSongIndex = getCurrentSongIndex(); // 获取当前曲目索引
const previousSong = userData?.songs[currentSongIndex - 1]; // 获取上一首歌曲

playSong(previousSong.id); // 播放上一首歌曲
};

// 打乱播放列表
const shuffle = () => {
userData?.songs.sort(() => Math.random() - 0.5); // 打乱歌曲顺序
userData.currentSong = null; // 清空当前歌曲
userData.songCurrentTime = 0; // 重置播放时间

renderSongs(userData?.songs); // 渲染新的歌曲列表
pauseSong(); // 暂停音乐
setPlayerDisplay(); // 更新播放器显示信息
setPlayButtonAccessibleText(); // 设置可访问性文本
};

// 删除指定ID的歌曲
const deleteSong = (id) => {
if (userData?.currentSong?.id === id) {
  userData.currentSong = null; // 如果删除的是当前播放的歌曲，则清空当前歌曲
  userData.songCurrentTime = 0; // 重置播放时间
  pauseSong(); // 暂停音乐
  setPlayerDisplay(); // 更新播放器显示信息
}

userData.songs = userData?.songs.filter((song) => song.id !== id); // 过滤掉被删除的歌曲
renderSongs(userData?.songs); // 渲染更新后的歌曲列表
highlightCurrentSong(); // 高亮当前播放的歌曲
setPlayButtonAccessibleText(); // 设置可访问性文本

// 如果歌曲列表为空，显示重置按钮
if (userData?.songs.length === 0) {
  const resetButton = document.createElement("button"); // 创建重置按钮
  const resetText = document.createTextNode("Reset Playlist"); // 按钮文本

  resetButton.id = "reset"; // 设置按钮ID
  resetButton.ariaLabel = "Reset playlist"; // 设置可访问性标签
  resetButton.appendChild(resetText); // 添加文本到按钮
  playlistSongs.appendChild(resetButton); // 将按钮添加到播放列表容器

  // 为重置按钮添加点击事件
  resetButton.addEventListener("click", () => {
    userData.songs = [...allSongs]; // 重置歌曲列表为初始状态
    
    renderSongs(sortSongs()); // 渲染初始歌曲列表
    setPlayButtonAccessibleText(); // 设置可访问性文本
    resetButton.remove(); // 移除重置按钮
  });
}
};

// 设置播放器显示信息
const setPlayerDisplay = () => {
const playingSong = document.getElementById("player-song-title"); // 获取当前播放歌曲的标题元素
const songArtist = document.getElementById("player-song-artist"); // 获取当前播放歌曲的艺术家元素
const currentTitle = userData?.currentSong?.title; // 获取当前歌曲的标题
const currentArtist = userData?.currentSong?.artist; // 获取当前歌曲的艺术家

// 设置歌曲标题和艺术家，如果不存在则显示为空
playingSong.textContent = currentTitle ? currentTitle : "";
songArtist.textContent = currentArtist ? currentArtist : "";
};

// 高亮当前播放的歌曲
const highlightCurrentSong = () => {
const playlistSongElements = document.querySelectorAll(".playlist-song"); // 获取所有播放列表中的歌曲元素
const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`); // 获取当前歌曲对应的元素

// 移除所有歌曲的高亮状态
playlistSongElements.forEach((songEl) => {
  songEl.removeAttribute("aria-current");
});

// 如果当前歌曲存在，设置其为高亮状态
if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

// 渲染歌曲列表
const renderSongs = (array) => {
const songsHTML = array
  .map((song) => {
    return `
    <li id="song-${song.id}" class="playlist-song">
    <button class="playlist-song-info" onclick="playSong(${song.id})">
        <span class="playlist-song-title">${song.title}</span> <!-- 歌曲标题 -->
        <span class="playlist-song-artist">${song.artist}</span> <!-- 歌曲艺术家 -->
        <span class="playlist-song-duration">${song.duration}</span> <!-- 歌曲时长 -->
    </button>
    <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}"> <!-- 删除歌曲按钮 -->
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
      </button>
    </li>
    `;
  })
  .join(""); // 将歌曲数组转换为HTML字符串

playlistSongs.innerHTML = songsHTML; // 更新播放列表的内容
};

// 设置播放按钮的可访问性文本
const setPlayButtonAccessibleText = () => {
const song = userData?.currentSong || userData?.songs[0]; // 获取当前播放的歌曲或第一首歌曲

playButton.setAttribute(
  "aria-label",
  song?.title ? `Play ${song.title}` : "Play" // 设置按钮描述
);
};

// 获取当前歌曲的索引
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong); // 返回当前歌曲在用户歌曲列表中的索引

// 为播放按钮添加点击事件
playButton.addEventListener("click", () => {
if (userData?.currentSong === null) {
  playSong(userData?.songs[0].id); // 如果没有当前歌曲则播放第一首
} else {
  playSong(userData?.currentSong.id); // 播放当前歌曲
}
});

// 为暂停按钮添加点击事件
pauseButton.addEventListener("click", pauseSong); // 暂停音乐

// 为下一首按钮添加点击事件
nextButton.addEventListener("click", playNextSong); // 播放下一首歌曲

// 为上一首按钮添加点击事件
previousButton.addEventListener("click", playPreviousSong); // 播放上一首歌曲

// 为随机播放按钮添加点击事件
shuffleButton.addEventListener("click", shuffle); // 打乱播放列表

// 音频播放结束时自动播放下一首
audio.addEventListener("ended", () => {
const currentSongIndex = getCurrentSongIndex(); // 获取当前曲目索引
const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined; // 检查下一首歌是否存在

if (nextSongExists) {
  playNextSong(); // 播放下一首歌曲
} else {
  userData.currentSong = null; // 没有下一首歌曲，清空当前歌曲
  userData.songCurrentTime = 0; // 重置播放时间  
  pauseSong(); // 暂停音乐
  setPlayerDisplay(); // 更新播放器显示信息
  highlightCurrentSong(); // 高亮当前播放的歌曲
  setPlayButtonAccessibleText(); // 设置可访问性文本
}
});

// 对歌曲进行排序
const sortSongs = () => {
userData?.songs.sort((a, b) => {
  if (a.title < b.title) {
    return -1; // 根据标题升序排列
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0; // 相等时不做排序
});

return userData?.songs; // 返回排序后的歌曲列表
};

// 渲染已排序的歌曲列表
renderSongs(sortSongs()); // 初始化渲染
setPlayButtonAccessibleText(); // 设置可访问性文本


  // 添加上传相关的代码
  const audioFileInput = document.getElementById('audioFileInput');
  const uploadButton = document.getElementById('uploadButton');

  uploadButton.addEventListener('click', () => {
      audioFileInput.click();
  });

  audioFileInput.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files);
      for (const file of files) {
          if (file.type.startsWith('audio/')) {
              const fileURL = URL.createObjectURL(file);
              
              // 创建临时audio元素来获取音频时长
              const audioElement = new Audio(fileURL);
              await new Promise((resolve) => {
                  audioElement.addEventListener('loadedmetadata', () => {
                      // 获取音频时长并转换为分:秒格式
                      const duration = audioElement.duration;
                      const minutes = Math.floor(duration / 60);
                      const seconds = Math.floor(duration % 60);
                      const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                      
                      // 创建新的歌曲对象，保持与现有歌曲列表格式一致
                      const newSong = {
                          id: userData.songs.length,
                          title: file.name.replace(/\.[^/.]+$/, ""),
                          artist: "本地音乐",
                          duration: durationStr,
                          src: fileURL
                      };
                      
                      // 添加到播放列表
                      userData.songs.push(newSong);
                      
                      // 更新播放列表显示
                      renderSongs(userData.songs);
                      resolve();
                  });
              });
          }
      }
  });

// 修改更新进度的函数
function updateProgress() {
  if (!audio.duration) return;
  
  const percent = (audio.currentTime / audio.duration) * 100;
  
  // 更新进度条填充
  progressFill.style.width = `${percent}%`;
  
  // 更新音符图标位置
  progressHandle.style.left = `${percent}%`;
  
  // 更新时间显示
  const currentTimeDisplay = document.querySelector('.current-time');
  const totalTimeDisplay = document.querySelector('.total-time');
  
  if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
  }
  if (totalTimeDisplay && userData.currentSong) {
      // 使用歌曲对象中存储的时长
      totalTimeDisplay.textContent = userData.currentSong.duration;
  }
}

// 修改进度条点击处理函数
function handleProgressClick(e) {
  const rect = progressBar.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
  
  // 更新音频时间
  audio.currentTime = percent * audio.duration;
  
  // 更新进度条显示
  progressFill.style.width = `${percent * 100}%`;
  progressHandle.style.left = `${percent * 100}%`;
  
  // 立即更新时间显示
  updateProgress();
}

// 获取进度条相关元素
const progressContainer = document.querySelector('.progress-container');
const progressBar = progressContainer.querySelector('.progress-bar');
const progressFill = progressBar.querySelector('.progress-fill');
const progressHandle = progressBar.querySelector('.progress-handle');

// 添加拖动相关变量
let isDragging = false;

// 添加拖动事件监听器
progressHandle.addEventListener('mousedown', (e) => {
  isDragging = true;
  // 防止拖动时选中文本
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const rect = progressBar.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  // 限制百分比在0-1之间
  percent = Math.min(Math.max(percent, 0), 1);
  
  // 更新进度条和音符位置
  progressFill.style.width = `${percent * 100}%`;
  progressHandle.style.left = `${percent * 100}%`;
  
  // 更新音频播放位置和时间显示
  audio.currentTime = percent * audio.duration;
  updateProgress();
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
  }
});

// 点击进度条任意位置也能跳转
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  
  // 更新音频播放位置
  audio.currentTime = percent * audio.duration;
  
  // 更新进度条和音符位置
  progressFill.style.width = `${percent * 100}%`;
  progressHandle.style.left = `${percent * 100}%`;
});

// 监听音频播放进度更新
audio.addEventListener('timeupdate', () => {
  if (!isDragging) {
      updateProgress();
  }
});