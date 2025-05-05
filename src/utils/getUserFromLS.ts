export const getUserFromLS = () => {
    const tgParams = JSON.parse(localStorage.getItem('tgParams') || '{}');
    return {
      id: tgParams.id,
      nickname: tgParams.nickname,
      chatID: tgParams.chatID,
    };
  };