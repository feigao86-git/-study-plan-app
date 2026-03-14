import * as Speech from 'expo-speech';

// Speak text
export const speak = (text, options = {}) => {
  const defaultOptions = {
    language: 'zh-CN',
    pitch: 1.0,
    rate: 0.9,
    ...options,
  };

  Speech.speak(text, defaultOptions);
};

// Stop speaking
export const stopSpeaking = () => {
  Speech.stop();
};

// Check if speaking
export const isSpeaking = async () => {
  return await Speech.isSpeakingAsync();
};

// Get available voices
export const getVoices = async () => {
  return await Speech.getAvailableVoicesAsync();
};

// Speak reward message
export const speakReward = (type, data = {}) => {
  let text = '';

  switch (type) {
    case 'complete':
      const completeMessages = [
        '太棒了！继续保持！',
        '你做到了！为你骄傲！',
        '任务完成！宠物也开心得跳起来了！',
        '真厉害！继续加油！',
        '完成一个目标！再接再厉！',
      ];
      text = completeMessages[Math.floor(Math.random() * completeMessages.length)];
      break;

    case 'streak':
      text = `连续${data.days}天完成！你是学习小达人！`;
      break;

    case 'levelUp':
      text = `恭喜升级到${data.level}级！你的宠物也变得更强大了！`;
      break;

    case 'incomplete':
      const incompleteMessages = [
        '没关系，下次一定能完成！',
        '不要灰心，调整状态再来！',
        '宠物相信你，下次加油！',
      ];
      text = incompleteMessages[Math.floor(Math.random() * incompleteMessages.length)];
      break;

    case 'encourage':
      const encourageMessages = [
        '加油！你能做到的！',
        '相信你自己，继续努力！',
        '每一份努力都会有收获！',
        '坚持就是胜利！',
      ];
      text = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
      break;

    default:
      text = '继续加油！';
  }

  speak(text);
  return text;
};
