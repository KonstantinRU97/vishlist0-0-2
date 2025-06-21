// auth.js
function getCurrentUser() {
  // Пока тестовый пользователь
  return {
    id: 1,
    first_name: "Иван",
    username: "ivan_test",
    photo_url: null
  };
  // Позже здесь будет логика для Telegram
}

// Для использования в других скриптах
window.getCurrentUser = getCurrentUser; 