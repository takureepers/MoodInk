<template>
    <div class="w-screen h-screen flex flex-col transition-colors duration-500 ease-in-out" :class="resultClass">
      <textarea 
        v-model="prompt" 
        class="flex-1 resize-none p-4 text-base bg-transparent border-none outline-none"
        placeholder=""
      ></textarea>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>  

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const prompt = ref('');
const result = ref('');
const error = ref('');
const isLoading = ref(false);
let analysisTimer = null;

// 感情ラベルの取得関数
const getEmotionLabel = (emotion) => {
  const emotions = {
    '1': '喜び',
    '2': '怒り',
    '3': '悲しみ',
    '4': '楽しみ',
    '5': '無感情'
  };
  return emotions[emotion] || '不明';
};

const resultClass = computed(() => {
  if (!result.value) return '';
  return `emotion-${result.value}`;
});

// テキストの分析を実行する関数
const analyzeText = async () => {
  if (!prompt.value.trim()) return;
  
  error.value = '';
  isLoading.value = true;
  
  try {
    const response = await $fetch('/api/gemini', {
      method: 'POST',
      body: { prompt: prompt.value }
    });
    result.value = response.text;
  } catch (err) {
    error.value = 'エラーが発生しました。もう一度お試しください。';
    console.error('エラーが発生しました:', err);
  } finally {
    isLoading.value = false;
  }
};

// テキストの変更を監視
watch(prompt, (newValue) => {
  if (newValue.trim()) {
    analyzeText();
  }
}, { debounce: 1000 }); // 1秒のデバウンス

// コンポーネントのマウント時に定期実行を開始
onMounted(() => {
  analysisTimer = setInterval(analyzeText, 60000); // 30秒ごとに実行
});

// コンポーネントのアンマウント時にタイマーをクリア
onUnmounted(() => {
  if (analysisTimer) {
    clearInterval(analysisTimer);
  }
});
</script>

<style scoped>
/* 感情に応じた背景色 */
.emotion-1 { background-color: #ffeb3b40; }
.emotion-2 { background-color: #ff525240; }
.emotion-3 { background-color: #2196f340; }
.emotion-4 { background-color: #4caf5040; }
.emotion-5 { background-color: #9e9e9e40; }

.error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.2);
  padding: 10px 20px;
  border-radius: 5px;
  color: #ff0000;
}

</style>