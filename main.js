// main.js - CORRECTED

// =================================================================
// --- Глобальные утилиты и работа с данными (localStorage) ---
// =================================================================

function getGiftHistory() {
  const raw = localStorage.getItem('giftHistory');
  if (raw) try { return JSON.parse(raw); } catch { return []; }
  return [];
}

function setGiftHistory(arr) {
  localStorage.setItem('giftHistory', JSON.stringify(arr));
}

function getProfileData() {
  const data = localStorage.getItem('profile');
  if (data) return JSON.parse(data);
  // Дефолтные значения
  return { firstName: 'Иван', lastName: 'Петров', photo: '' };
}

function getLoveLanguageArray() {
  const raw = localStorage.getItem('loveLanguageArr');
  if (raw) {
    try { return JSON.parse(raw).arr || []; } catch { return []; }
  }
  return [];
}

function getLoveLanguageOther() {
  const raw = localStorage.getItem('loveLanguageArr');
  if (raw) {
    try { return JSON.parse(raw).other || ''; } catch { return ''; }
  }
  return '';
}

function setLoveLanguageArray(arr, other) {
  localStorage.setItem('loveLanguageArr', JSON.stringify({ arr, other }));
}

function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

function setTheme(val) {
  localStorage.setItem('theme', val);
}

const friendsData = [
  {
    id: 1,
    name: 'Алексей Иванов',
    photo: '', // URL to photo or empty
    birthday: '2024-11-22',
    wishes: [
      { id: 101, title: 'Фитнес-браслет', price: 10000, category: 'Вещь', status: 'Ожидает', reservedBy: null, contributors: [
          { userId: 'user3', amount: 3000 },
          { userId: 'user4', amount: 3700 }
      ] },
      { id: 102, title: 'Сертификат в SPA', price: 5000, category: 'Впечатление', status: 'Ожидает', reservedBy: null, contributors: [] },
      { id: 103, title: 'Поход в горы', price: 0, category: 'Время', status: 'Ожидает', reservedBy: 'me', contributors: [] }
    ]
  },
  {
    id: 2,
    name: 'Мария Петрова',
    photo: '', // URL to photo or empty
    birthday: '2024-12-05',
    wishes: [
      { id: 201, title: 'Новая книга Мураками', price: 1200, category: 'Вещь', status: 'Исполнено', reservedBy: 'me', contributors: [{ userId: 'me', amount: 1200 }] },
      { id: 202, title: 'Билеты на концерт', price: 4000, category: 'Впечатление', status: 'Ожидает', reservedBy: null, contributors: [] }
    ]
  }
];

const adviceList = [
  { title: 'Мастер-класс по приготовлению суши', category: 'Впечатление', price: 2500 },
  { title: 'Полет на воздушном шаре', category: 'Впечатление', price: 12000 },
  { title: 'Книга "Атомные привычки"', category: 'Вещь', price: 800 },
  { title: 'Абонемент в спортзал', category: 'Вещь', price: 3500 },
  { title: 'Пикник с друзьями', category: 'Время', price: 0 },
  { title: 'Сертификат в SPA', category: 'Впечатление', price: 5000 },
  { title: 'Настольная игра', category: 'Вещь', price: 2000 },
  { title: 'Путешествие выходного дня', category: 'Впечатление', price: 15000 },
  { title: 'Фотосессия на природе', category: 'Впечатление', price: 3000 },
  { title: 'Билеты в театр', category: 'Впечатление', price: 2500 },
  { title: 'Ужин в необычном ресторане', category: 'Впечатление', price: 4000 },
];

function getRandomAdvice() {
  const idx = Math.floor(Math.random() * adviceList.length);
  return adviceList[idx];
}

function isAdviceInWishlist(advice) {
  const wishes = getGiftHistory();
  return wishes.some(w => w.title === advice.title && w.category === advice.category);
}


// =================================================================
// --- Глобальные функции обновления UI ---
// =================================================================

let currentWishFilter = 'Все'; // Фильтр по умолчанию

function updateGiftHistoryList() {
  const wishlistScreen = document.getElementById('wishlistScreen');
  if (!wishlistScreen) return;
  let list = wishlistScreen.querySelector('#wishlistList');
  if (!list) {
    list = document.createElement('div');
    list.id = 'wishlistList';
    list.className = 'space-y-3';
    const filterBar = wishlistScreen.querySelector('.flex.space-x-2.mb-4');
    if (filterBar && filterBar.nextElementSibling) {
      wishlistScreen.replaceChild(list, filterBar.nextElementSibling);
    } else {
      wishlistScreen.appendChild(list);
    }
  }
  
  list.innerHTML = '';
  const allWishes = getGiftHistory();

  const filteredWishes = allWishes.filter(wish => {
    if (currentWishFilter === 'Все') {
      return true;
    }
    return wish.category === currentWishFilter;
  });

  if (!filteredWishes.length) {
    if (currentWishFilter === 'Все') {
      list.innerHTML = '<div class="text-gray-400 text-center py-8">Ваш вишлист пуст. Добавьте первое желание!</div>';
    } else {
      list.innerHTML = `<div class="text-gray-400 text-center py-8">Желаний в категории «${currentWishFilter}» пока нет.</div>`;
    }
    return;
  }

  filteredWishes.forEach(wish => {
    const wishDiv = document.createElement('div');
    wishDiv.className = 'bg-white rounded-xl p-3 shadow-sm relative slide-up';
    wishDiv.innerHTML = `
      <div class="flex">
        <div class="w-16 h-16 bg-gray-100 rounded-lg mr-3 flex-shrink-0"></div>
        <div class="flex-1 min-w-0">
          <p class="font-medium truncate">${wish.title}</p>
          <p class="text-sm text-gray-500 mb-1">${wish.price ? wish.price.toLocaleString('ru-RU') + ' ₽' : ''}</p>
          <div class="flex justify-between items-center">
            <div class="w-full bg-gray-200 rounded-full h-1.5 mr-2">
              <div class="bg-green-500 h-1.5 rounded-full" style="width: ${wish.status === 'Исполнено' ? '100%' : '0%'}"></div>
            </div>
            <span class="text-xs ${wish.status === 'Исполнено' ? 'text-green-500' : 'text-gray-500'}">${wish.status || 'Ожидает'}</span>
          </div>
        </div>
      </div>
      <div class="absolute top-2 right-2 flex space-x-1">
        <button class="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center edit-wish-btn" title="Редактировать" data-id="${wish.id}">
          <i class="fas fa-pen text-xs"></i>
        </button>
        <button class="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center delete-wish-btn" title="Удалить" data-id="${wish.id}">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `;
    list.appendChild(wishDiv);
  });

  list.querySelectorAll('.delete-wish-btn').forEach(btn => {
    btn.onclick = function() {
      const id = Number(this.dataset.id);
      if (confirm('Вы уверены, что хотите удалить это желание?')) {
          const wishes = getGiftHistory().filter(w => w.id !== id);
          setGiftHistory(wishes);
          updateGiftHistoryList();
          renderHomeWishlistPreview(); // Обновляем главный экран
      }
    };
  });

  list.querySelectorAll('.edit-wish-btn').forEach(btn => {
    btn.onclick = function() {
      const id = Number(this.dataset.id);
      showEditWishModal(id);
    };
  });
}

function renderAdviceOfTheDay() {
  const advice = getRandomAdvice();
  const adviceBlock = document.getElementById('adviceOfTheDay');
  if (!adviceBlock) return;
  
  let meta = [];
  if (advice.category) meta.push(advice.category);
  if (advice.price && advice.price > 0) {
    meta.push(advice.price.toLocaleString('ru-RU') + ' ₽');
  } else if (advice.category === 'Впечатление') {
    meta.push('Примерная цена: 2 000–5 000 ₽');
  }
  
  const metaStr = meta.length ? `<span class="text-xs bg-white bg-opacity-20 text-gray-800 rounded px-2 py-0.5">${meta.join(' • ')}</span>` : '';
  adviceBlock.innerHTML = `
    <div class="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-4 text-white mb-4 slide-up">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Совет дня</span>
        <i class="fas fa-wand-magic-sparkles"></i>
      </div>
      <div class="mb-3">
          <p class="text-sm font-medium">${advice.title}</p>
          ${metaStr ? `<div class="mt-1.5">${metaStr}</div>` : ''}
      </div>
      <button id="addAdviceToWishlistBtn" class="text-xs bg-white text-blue-500 px-3 py-1 rounded-full font-medium">Добавить в вишлист</button>
    </div>
  `;
  
  const btn = document.getElementById('addAdviceToWishlistBtn');
  if (btn) {
    if (isAdviceInWishlist(advice)) {
      btn.disabled = true;
      btn.textContent = 'Уже в вишлисте';
      btn.classList.add('opacity-60');
    } else {
      btn.onclick = function() {
        const wishes = getGiftHistory();
        wishes.push({
          id: Date.now(),
          title: advice.title,
          desc: 'Добавлено из Совета дня',
          date: '',
          event: 'Другое',
          status: 'Ожидает',
          private: false,
          category: advice.category,
          price: advice.price
        });
        setGiftHistory(wishes);
        updateGiftHistoryList();
        renderHomeWishlistPreview(); // Обновляем главный экран
        btn.disabled = true;
        btn.textContent = 'Добавлено!';
        btn.classList.add('opacity-60');
        hasUnreadNotifications = true;
        updateNotifDot();
      };
    }
  }
}

function updateMainScreenUser() {
  const profile = getProfileData();
  const nameEl = document.getElementById('userName');
  if (nameEl) nameEl.textContent = profile.firstName || '';
  const greetEl = document.getElementById('mainGreeting');
  if (greetEl) greetEl.textContent = `Привет, ${profile.firstName ? profile.firstName : 'друг'}!`;
  const initials = (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '');
  const profIcon = document.querySelector('header .w-8.h-8.rounded-full.bg-blue-500.text-white.flex.items-center.justify-center span');
  if (profIcon) profIcon.textContent = initials.toUpperCase() || 'П';
}

// =================================================================
// --- Уведомления ---
// =================================================================

let notifications = [];
let hasUnreadNotifications = true; 

function calculateDaysUntil(dateString) {
    const today = new Date();
    const birthday = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    // Устанавливаем год ДР на текущий год для корректного сравнения
    birthday.setFullYear(today.getFullYear());
    // Если день рождения в этом году уже прошел, смотрим следующий год
    if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = birthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function generateNotifications() {
    // Всегда генерируем уведомления с нуля, чтобы они были актуальными
    const generated = [];

    // --- 1. Напоминания о днях рождения (в ближайшие 30 дней) ---
    friendsData.forEach(friend => {
        const daysUntil = calculateDaysUntil(friend.birthday);
        if (daysUntil <= 30) {
            let daysText = daysUntil === 0 ? 'сегодня! 🎉' : (daysUntil === 1 ? 'завтра!' : `через ${daysUntil} дней`);
            generated.push({
                type: 'birthday',
                text: `День рождения у <strong>${friend.name}</strong> ${daysText}`,
                time: 'Напоминание',
                icon: 'fa-birthday-cake',
                friendId: friend.id,
            });
        }
    });

    // --- 2. Уведомления о подарках, которые я планирую дарить или подарил ---
    const myAllGifts = getMyReservedWishes();
    
    const myPlannedGifts = myAllGifts.filter(g => g.status !== 'Исполнено');
    myPlannedGifts.forEach(gift => {
        generated.push({
            type: 'plannedGift',
            text: `Вы планируете подарить <strong>${gift.title}</strong> для <strong>${gift.friendName}</strong>.`,
            time: 'Вы дарите',
            icon: 'fa-gift',
            friendId: gift.friendId,
        });
    });

    const myGivenGifts = myAllGifts.filter(g => g.status === 'Исполнено').slice(-2);
    myGivenGifts.forEach(gift => {
        generated.push({
            type: 'myGivenGift',
            text: `Вы подарили <strong>${gift.title}</strong> для <strong>${gift.friendName}</strong>.`,
            time: 'Недавно подарено',
            icon: 'fa-check-circle',
            friendId: gift.friendId,
        });
    });

    // --- 3. Уведомления о новых желаниях друзей (симуляция) ---
    // Показываем по последнему желанию от каждого друга для наглядности
    friendsData.forEach(friend => {
        if (friend.wishes && friend.wishes.length > 0) {
            const lastWish = friend.wishes[friend.wishes.length - 1];
            // Не показываем уведомление, если я уже дарю этот подарок или он исполнен
            const iAmGifting = lastWish.reservedBy === 'me' || lastWish.contributors.some(c => c.userId === 'me');
            if (!iAmGifting && lastWish.status !== 'Исполнено') {
                 generated.push({
                    type: 'newWish',
                    text: `<strong>${friend.name}</strong> добавил новое желание: <strong>${lastWish.title}</strong>.`,
                    time: 'Новое желание',
                    icon: 'fa-star',
                    friendId: friend.id,
                });
            }
        }
    });

    // --- 4. Уведомления о моих новых желаниях (2 последних) ---
    const myWishes = getGiftHistory();
    const myLatestWishes = myWishes.sort((a, b) => b.id - a.id).slice(0, 2);

    myLatestWishes.forEach(wish => {
        generated.push({
            type: 'myNewWish',
            text: `Вы добавили в вишлист: <strong>${wish.title}</strong>.`,
            time: 'Ваш вишлист',
            icon: 'fa-plus-circle',
        });
    });

    notifications = generated.reverse(); // Показать самые релевантные (новые желания, подарки) сверху
    return notifications;
}

function renderNotifications() {
    const container = document.getElementById('notifListContainer');
    if (!container) return;
    
    const notifs = notifications;

    if (notifs.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">У вас пока нет новых уведомлений.</p>`;
        document.getElementById('clearNotifsBtn').classList.add('hidden');
    } else {
        container.innerHTML = '';
        notifs.forEach(n => {
            const notifEl = document.createElement('div');
            notifEl.className = 'p-3 flex items-start space-x-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors';
            notifEl.onclick = () => handleNotificationClick(n);

            notifEl.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i class="fas ${n.icon}"></i>
                </div>
                <div class="flex-1">
                    <p class="text-sm leading-tight">${n.text}</p>
                    <p class="text-xs text-gray-400 mt-1">${n.time}</p>
                </div>
            `;
            container.appendChild(notifEl);
        });
        document.getElementById('clearNotifsBtn').classList.remove('hidden');
    }
}

function handleNotificationClick(notif) {
    if (notif.friendId) {
        showFriendWishlist(notif.friendId, 'homeScreen');
    } else if (notif.type === 'myNewWish') {
        showScreen('wishlistScreen');
    }
    // Скрываем модалку после клика
    hideModal('notifModal');
}

function updateNotifDot() {
    const dot = document.querySelector('header .relative span.bg-red-500');
    if (dot) {
        dot.style.display = hasUnreadNotifications && notifications.length > 0 ? 'block' : 'none';
    }
}


  function updateProfileUI() {
    const profile = getProfileData();
    const name = (profile.firstName || '') + (profile.lastName ? ' ' + profile.lastName : '');
    document.getElementById('profileName').textContent = name;
    const photoEl = document.getElementById('profilePhoto');
    const iconEl = document.getElementById('profilePhotoIcon');
    if (profile.photo) {
      photoEl.src = profile.photo;
      photoEl.classList.remove('hidden');
      iconEl.classList.add('hidden');
    } else {
      photoEl.classList.add('hidden');
      iconEl.classList.remove('hidden');
    }
  updateMainScreenUser(); // Обновляем инфо на главном экран
}

function updateLoveLanguageUI() {
  const arr = getLoveLanguageArray();
  let label = arr.filter(v => v !== 'Другое').join(' + ');
  if (arr.includes('Другое')) {
    const other = getLoveLanguageOther();
    label += (label ? ' + ' : '') + (other || 'Другое');
  }
  document.getElementById('loveLanguageLabel').childNodes[0].textContent = label || '—';
}

function renderUpcomingBirthdays() {
    const container = document.getElementById('birthdaysContainer');
    if (!container) return;

    container.innerHTML = '';

    // Для примера просто берем всех друзей. В будущем можно добавить логику сортировки по дате.
    const upcomingFriends = friendsData; 

    if (upcomingFriends.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">Нет ближайших дней рождения.</p>';
        return;
    }

    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    upcomingFriends.forEach(friend => {
        const bDay = new Date(friend.birthday);
        const day = bDay.getDate();
        const month = months[bDay.getMonth()];

        const birthdayEl = document.createElement('div');
        birthdayEl.className = 'flex-shrink-0 text-center cursor-pointer';
        birthdayEl.onclick = () => showFriendWishlist(friend.id);

        birthdayEl.innerHTML = `
            <div class="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-1">
                <i class="fas fa-birthday-cake text-pink-500"></i>
            </div>
            <p class="text-xs font-medium">${friend.name.split(' ')[0]}</p>
            <p class="text-xs text-gray-500">${day} ${month}</p>
        `;
        container.appendChild(birthdayEl);
    });
}


function renderAllBirthdays() {
    const container = document.getElementById('allBirthdaysListContainer');
    if (!container) return;

    const sortedFriends = [...friendsData].sort((a, b) => {
        const daysA = calculateDaysUntil(a.birthday);
        const daysB = calculateDaysUntil(b.birthday);
        return daysA - daysB;
    });
    
    container.innerHTML = '';
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    sortedFriends.forEach(friend => {
        const bDay = new Date(friend.birthday);
        const day = bDay.getDate();
        const month = months[bDay.getMonth()];
        const daysUntil = calculateDaysUntil(friend.birthday);
        let daysText;
        if (daysUntil === 0) {
            daysText = 'сегодня 🎉';
        } else if (daysUntil === 1) {
            daysText = 'завтра!';
      } else {
            daysText = `через ${daysUntil} дней`;
        }

        const friendEl = document.createElement('div');
        friendEl.className = 'bg-white rounded-xl p-3 shadow-sm flex items-center justify-between cursor-pointer slide-up hover:shadow-md transition-shadow';
        friendEl.onclick = () => showFriendWishlist(friend.id, 'birthdaysScreen');

        friendEl.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0"></div>
                <div>
                    <p class="font-medium">${friend.name}</p>
                    <p class="text-sm text-gray-500">${day} ${month}</p>
                </div>
            </div>
            <span class="text-sm font-medium text-blue-500">${daysText}</span>
        `;
        container.appendChild(friendEl);
    });
}


function renderFriendsList() {
  const container = document.getElementById('friendsListContainer');
  if (!container) return;

  container.innerHTML = ''; // Очищаем контейнер

  friendsData.forEach(friend => {
    const friendCard = document.createElement('div');
    friendCard.className = 'bg-white rounded-xl p-3 shadow-sm slide-up cursor-pointer';
    friendCard.onclick = () => showFriendWishlist(friend.id);
    
    const friendName = friend.name || 'Имя не указано';
    const wishesCount = friend.wishes ? friend.wishes.length : 0;
    
    friendCard.innerHTML = `
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0">
            <!-- Здесь может быть фото: <img src="${friend.photo}" /> -->
        </div>
        <div class="flex-1 min-w-0">
            <p class="font-medium truncate">${friendName}</p>
            <p class="text-xs text-gray-500 truncate">${wishesCount} желаний</p>
        </div>
        <i class="fas fa-chevron-right text-gray-400"></i>
      </div>
    `;
    container.appendChild(friendCard);
  });
}

function renderFriendWishes(friendId) {
    const friend = friendsData.find(f => f.id === friendId);
    if (!friend) return;

    const listContainer = document.getElementById('friendWishesGrid');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    listContainer.className = 'space-y-3';

    if (!friend.wishes || friend.wishes.length === 0) {
        listContainer.innerHTML = '<p class="text-center text-gray-500 py-8">У друга пока нет желаний</p>';
        return;
    }

    friend.wishes.forEach(wish => {
        // Если цена 0, то это простое резервирование
        if (wish.price === 0) {
            renderSimpleWish(listContainer, wish, friend);
      } else {
            // Иначе это подарок со стоимостью, который можно купить или скинуться
            renderPricedWish(listContainer, wish, friend);
        }
    });
}

function renderSimpleWish(container, wish, friend) {
    const wishCard = document.createElement('div');
    wishCard.className = 'bg-white rounded-xl p-3 shadow-sm flex items-center justify-between slide-up';
    
    let buttonHtml;

    if (wish.status === 'Исполнено') {
        const text = wish.reservedBy === 'me' ? 'Вы подарили' : 'Уже подарили';
        buttonHtml = `<div class="flex items-center space-x-2 text-green-600">
            <i class="fas fa-check-circle"></i>
            <span class="text-sm font-medium">${text}</span>
        </div>`;
        wishCard.innerHTML = `
            <div class="flex-1 min-w-0 mr-4">
              <p class="font-medium truncate text-gray-400">${wish.title}</p>
              <p class="text-sm text-gray-400">Бесценно</p>
            </div>
            <div class="flex-shrink-0">${buttonHtml}</div>
        `;
        container.appendChild(wishCard);
        return;
    }

    if (wish.reservedBy === 'me') {
        buttonHtml = `<div class="flex items-center space-x-2">
            <button class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium hover:bg-gray-300" onclick="toggleSimpleReservation(${friend.id}, ${wish.id}, 'cancel')">Отменить</button>
            <button class="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-600" onclick="markGiftAsGiven(${friend.id}, ${wish.id})">Подарил!</button>
        </div>`;
    } else if (wish.reservedBy) {
        buttonHtml = `<button class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium" disabled>Уже дарят</button>`;
    } else {
        buttonHtml = `<button class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium" onclick="toggleSimpleReservation(${friend.id}, ${wish.id}, 'reserve')">Я подарю</button>`;
    }
    
    wishCard.innerHTML = `
        <div class="flex-1 min-w-0 mr-4">
          <p class="font-medium truncate">${wish.title}</p>
          <p class="text-sm text-gray-500">Бесценно</p>
        </div>
        <div class="flex-shrink-0">${buttonHtml}</div>
    `;
    container.appendChild(wishCard);
}

function renderPricedWish(container, wish, friend) {
    const collectedAmount = wish.contributors.reduce((sum, c) => sum + c.amount, 0);

    if (wish.status === 'Исполнено') {
        const wishCard = document.createElement('div');
        wishCard.className = 'bg-white rounded-xl p-3 shadow-sm flex items-center justify-between slide-up';
        const text = (wish.reservedBy === 'me' || collectedAmount > 0) ? 'Вы подарили' : 'Уже подарили';
        const buttonHtml = `<div class="flex items-center space-x-2 text-green-600">
            <i class="fas fa-check-circle"></i>
            <span class="text-sm font-medium">${text}</span>
        </div>`;
        wishCard.innerHTML = `
            <div class="flex-1 min-w-0 mr-4">
              <p class="font-medium truncate text-gray-400">${wish.title}</p>
              <p class="text-sm text-gray-400">${wish.price.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div class="flex-shrink-0">${buttonHtml}</div>
        `;
        container.appendChild(wishCard);
        return;
    }

    // Состояние 1: Подарок полностью зарезервирован одним человеком
    if (wish.reservedBy) {
        const wishCard = document.createElement('div');
        wishCard.className = 'bg-white rounded-xl p-3 shadow-sm flex items-center justify-between slide-up';
        
        let buttonHtml;
        if (wish.reservedBy === 'me') {
             buttonHtml = `<div class="flex items-center space-x-2">
                <button class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium hover:bg-gray-300" onclick="toggleSimpleReservation(${friend.id}, ${wish.id}, 'cancel')">Отменить</button>
                <button class="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-600" onclick="markGiftAsGiven(${friend.id}, ${wish.id})">Подарил!</button>
            </div>`;
        } else {
            buttonHtml = `<button class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium" disabled>Уже дарят</button>`;
        }
        
        wishCard.innerHTML = `
            <div class="flex-1 min-w-0 mr-4">
              <p class="font-medium truncate">${wish.title}</p>
              <p class="text-sm text-gray-500">${wish.price.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div class="flex-shrink-0">${buttonHtml}</div>
        `;
        container.appendChild(wishCard);
        return;
    }

    // Состояния 2 и 3 (сбор или выбор) используют карточку блочного типа
    const wishCard = document.createElement('div');
    wishCard.className = 'bg-white rounded-xl p-4 shadow-sm slide-up';

    // Состояние 2: Идет сбор средств
    if (collectedAmount > 0) {
        const progress = wish.price > 0 ? (collectedAmount / wish.price) * 100 : 0;
        const iContributed = wish.contributors.some(c => c.userId === 'me');
        let buttonHtml;

        if (collectedAmount >= wish.price) {
            buttonHtml = `<button class="w-full mt-3 bg-green-500 text-white py-2 rounded-lg font-medium text-sm" disabled>Сбор завершен!</button>`;
        } else if (iContributed) {
            buttonHtml = `<button class="w-full mt-3 bg-blue-100 text-blue-600 py-2 rounded-lg font-medium text-sm" onclick="showContributionModal(${friend.id}, ${wish.id})">Добавить</button>`;
        } else {
            buttonHtml = `<button class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm" onclick="showContributionModal(${friend.id}, ${wish.id})">Скинуться</button>`;
        }

        wishCard.innerHTML = `
            <div class="flex items-center">
                <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">${wish.title}</p>
                    <div class="flex justify-between items-center mt-2">
                        <div class="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div class="bg-green-500 h-2 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <span class="text-xs text-gray-500 whitespace-nowrap">${collectedAmount.toLocaleString('ru-RU')} / ${wish.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
            </div>
            ${buttonHtml}
        `;
    } 
    // Состояние 3: Никто не резервировал и не скидывался - предлагаем выбор
    else {
        wishCard.innerHTML = `
            <div>
                <p class="font-medium truncate">${wish.title}</p>
                <p class="text-sm text-gray-500">${wish.price.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div class="flex space-x-2 mt-3">
                <button class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-medium text-sm" onclick="showContributionModal(${friend.id}, ${wish.id})">Скинуться</button>
                <button class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm" onclick="toggleSimpleReservation(${friend.id}, ${wish.id}, 'reserve')">Я подарю</button>
            </div>
        `;
    }

    container.appendChild(wishCard);
}

window.toggleSimpleReservation = (friendId, wishId, action) => {
    const friend = friendsData.find(f => f.id === friendId);
    if (!friend) return;
    const wish = friend.wishes.find(w => w.id === wishId);
    if (!wish) return;

    if (action === 'reserve') {
        wish.reservedBy = 'me';
    } else if (action === 'cancel') {
        wish.reservedBy = null;
    }
    renderFriendWishes(friendId);
    renderHomeGivingPreview();
    hasUnreadNotifications = true;
    updateNotifDot();
};

window.showContributionModal = (friendId, wishId) => {
    const friend = friendsData.find(f => f.id === friendId);
    const wish = friend.wishes.find(w => w.id === wishId);
    if (!friend || !wish) return;

    document.getElementById('contributionWishTitle').textContent = wish.title;
    document.getElementById('contributionWishPrice').textContent = wish.price.toLocaleString('ru-RU') + ' ₽';
    
    const form = document.getElementById('contributionForm');
    form.dataset.friendId = friendId;
    form.dataset.wishId = wishId;
    form.reset();

    document.getElementById('contributionModal').classList.remove('hidden');
    document.getElementById('contributionAmount').focus();
}

let currentGivingFilter = 'planned'; // 'planned' or 'given'

function getMyReservedWishes() {
    const myGifts = [];
    friendsData.forEach(friend => {
        friend.wishes.forEach(wish => {
            if (wish.reservedBy === 'me' || wish.contributors.some(c => c.userId === 'me')) {
                const myContribution = wish.contributors.find(c => c.userId === 'me')?.amount || 0;
                myGifts.push({
                    ...wish,
                    friendName: friend.name,
                    friendId: friend.id,
                    myContribution: myContribution,
                });
            }
        });
    });
    return myGifts;
}

window.markGiftAsGiven = function(friendId, wishId) {
    const friend = friendsData.find(f => f.id === friendId);
    if (!friend) return;
    
    const wish = friend.wishes.find(w => w.id === wishId);
    if (!wish) return;

    wish.status = 'Исполнено';
    
    // Перерисовываем UI
    renderGivingList();
    renderHomeGivingPreview();
    renderFriendWishes(friendId);
    hasUnreadNotifications = true;
    updateNotifDot();
}

function renderGivingList() {
    const container = document.getElementById('givingListContainer');
    if (!container) return;

    const allMyGifts = getMyReservedWishes();
    
    const filteredGifts = allMyGifts.filter(gift => {
        const isGiven = gift.status === 'Исполнено';
        if (currentGivingFilter === 'given') {
            return isGiven;
        }
        return !isGiven;
    });

    container.innerHTML = '';
    if (filteredGifts.length === 0) {
        const message = currentGivingFilter === 'planned' 
            ? 'Вы пока не планируете дарить подарки.' 
            : 'Здесь будут показаны подарки, которые вы уже подарили.';
        container.innerHTML = `<div class="text-gray-400 text-center py-8">${message}</div>`;
        return;
    }

    filteredGifts.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'bg-white rounded-xl p-3 shadow-sm slide-up flex items-center justify-between';
        
        const infoHtml = `
            <div class="flex-1 min-w-0 cursor-pointer" onclick="showFriendWishlist(${gift.friendId}, 'givingScreen')">
                <p class="font-medium truncate">${gift.title}</p>
                <p class="text-sm text-gray-500">для: <span class="font-medium text-gray-600">${gift.friendName}</span></p>
            </div>
        `;
        
        let buttonHtml = '';
        if (currentGivingFilter === 'planned') {
            buttonHtml = `<button onclick="markGiftAsGiven(${gift.friendId}, ${gift.id})" class="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-green-600">Подарил!</button>`;
        } else {
             buttonHtml = `
                <div class="text-center">
                    <i class="fas fa-check-circle text-green-500 text-lg"></i>
                </div>
             `;
        }
        
        giftCard.innerHTML = infoHtml + `<div class="flex-shrink-0 ml-4">${buttonHtml}</div>`;
        container.appendChild(giftCard);
    });
}

function updateGivingTabs() {
    const tabPlanned = document.getElementById('givingTabPlanned');
    const tabGiven = document.getElementById('givingTabGiven');
    if (!tabPlanned || !tabGiven) return;

    if (currentGivingFilter === 'planned') {
        tabPlanned.classList.add('bg-white', 'shadow', 'font-medium');
        tabPlanned.classList.remove('text-gray-500');
        tabGiven.classList.remove('bg-white', 'shadow', 'font-medium');
        tabGiven.classList.add('text-gray-500');
    } else {
        tabGiven.classList.add('bg-white', 'shadow', 'font-medium');
        tabGiven.classList.remove('text-gray-500');
        tabPlanned.classList.remove('bg-white', 'shadow', 'font-medium');
        tabPlanned.classList.add('text-gray-500');
    }
    renderGivingList();
}


function renderHomeGivingPreview() {
    const plannedGifts = getMyReservedWishes().filter(g => g.status !== 'Исполнено');
    const countEl = document.getElementById('homeGivingCount');
    const gridEl = document.getElementById('homeGivingGrid');

    if (!countEl || !gridEl) return;

    countEl.textContent = plannedGifts.length;
    gridEl.innerHTML = '';

    if (plannedGifts.length === 0) {
        gridEl.innerHTML = '<p class="text-gray-400 col-span-2 text-center">Вы пока ничего не дарите</p>';
        return;
    }

    const giftsToShow = plannedGifts.slice(-2);

    giftsToShow.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'bg-white rounded-xl p-3 shadow-sm slide-up cursor-pointer';
        giftCard.onclick = () => showFriendWishlist(gift.friendId, 'homeScreen');
        giftCard.innerHTML = `
            <div class="bg-gray-100 rounded-lg h-24 mb-2 flex items-center justify-center">
                <i class="fas fa-gift text-3xl text-gray-400"></i>
            </div>
            <p class="text-sm font-medium truncate">${gift.title}</p>
            <p class="text-xs text-gray-500 truncate">для: ${gift.friendName.split(' ')[0]}</p>
        `;
        gridEl.appendChild(giftCard);
    });
}


function renderHomeWishlistPreview() {
  const wishes = getGiftHistory();
  const countEl = document.getElementById('homeWishesCount');
  const gridEl = document.getElementById('homeWishesGrid');

  if (!countEl || !gridEl) return;

  // Обновляем счетчик
  countEl.textContent = wishes.length;

  // Очищаем контейнер
  gridEl.innerHTML = '';
  
  if (wishes.length === 0) {
    gridEl.innerHTML = '<p class="text-gray-400 col-span-2 text-center">У вас пока нет желаний</p>';
    return;
  }
  
  // Берем 2 последних желания
  const wishesToShow = wishes.slice(-2);

  wishesToShow.forEach(wish => {
    const wishCard = document.createElement('div');
    wishCard.className = 'bg-white rounded-xl p-3 shadow-sm slide-up cursor-pointer';
    wishCard.onclick = () => showEditWishModal(wish.id);
    
    // Простой вариант карточки без прогресса, т.к. его логики пока нет
    wishCard.innerHTML = `
      <div class="bg-gray-100 rounded-lg h-24 mb-2"></div>
      <p class="text-sm font-medium truncate">${wish.title}</p>
      <p class="text-xs text-gray-500">${wish.price > 0 ? wish.price.toLocaleString('ru-RU') + ' ₽' : 'Бесценно'}</p>
    `;
    gridEl.appendChild(wishCard);
  });
}

  function applyTheme() {
    const theme = getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }

function updateThemeToggleUI() {
    const theme = getTheme();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? 'Тёмная' : 'Светлая';
}

// =================================================================
// --- Глобальные функции навигации и модальных окон ---
// =================================================================

window.showScreen = function(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  const target = document.getElementById(screenId);
  if (target) target.classList.remove('hidden');
  updateActiveTab(screenId);

  // Animate the fish icon
  const fishIcon = document.getElementById('headerFishIcon');
  if (fishIcon) {
      fishIcon.classList.add('rotate-360');
      // Remove class after animation to allow re-triggering
      setTimeout(() => {
          fishIcon.classList.remove('rotate-360');
      }, 500); // Duration of animation in ms
  }
};

function updateActiveTab(screenId) {
  const tabs = document.querySelectorAll('nav button');
  tabs.forEach(tab => {
    tab.classList.remove('text-blue-500', 'tab-active');
    tab.classList.add('text-gray-500', 'hover:text-blue-500');
  });
  let targetTab;
  switch(screenId) {
    case 'homeScreen': targetTab = tabs[0]; break;
    case 'wishlistScreen': targetTab = tabs[1]; break;
    case 'friendsScreen': targetTab = tabs[2]; break;
    case 'aiAdvisorScreen': targetTab = tabs[3]; break;
    case 'profileScreen': targetTab = tabs[4]; break;
    case 'givingScreen': targetTab = tabs[5]; break; // Added givingScreen
  }
  if (targetTab) {
    targetTab.classList.remove('text-gray-500', 'hover:text-blue-500');
    targetTab.classList.add('text-blue-500', 'tab-active');
  }
}

window.showAddWishModal = function() {
  const form = document.getElementById('addWishForm');
  form.removeAttribute('data-editing-id');
  form.reset();

  document.getElementById('addWishModalTitle').textContent = 'Добавить желание';
  document.getElementById('addWishSubmitBtn').textContent = 'Сохранить желание';

  document.getElementById('addWishModal').classList.remove('hidden');
};

window.toggleNotifModal = function() {
    const modal = document.getElementById('notifModal');
    const isHidden = modal.classList.contains('hidden');
    
    if (isHidden) {
        generateNotifications(); // Генерируем свежий список уведомлений
        renderNotifications();
        hasUnreadNotifications = false; // Считаем, что все просмотрено
        updateNotifDot(); // Прячем точку
    }
    
    modal.classList.toggle('hidden');
};

window.hideModal = function(modalId) {
  document.getElementById(modalId).classList.add('hidden');
};

window.showFriendWishlist = function(friendId, returnScreen = 'friendsScreen') {
  const friend = friendsData.find(f => f.id === friendId);
  if (!friend) {
    showScreen(returnScreen); // Go back if friend not found
    return;
  }
  
  // Обновляем заголовок
  const titleEl = document.getElementById('friendWishlistTitle');
  if (titleEl) {
    titleEl.textContent = friend.name;
  }
  
  // Динамически обновляем кнопку "назад"
  const backButton = document.getElementById('friendWishlistBackBtn');
  if(backButton) {
      backButton.onclick = () => showScreen(returnScreen);
  }
  
  // Рендерим вишлист друга
  renderFriendWishes(friendId);
  
  // Показываем экран
  showScreen('friendWishlistScreen');
};

window.showEditWishModal = function(wishId) {
  const wishes = getGiftHistory();
  const wishToEdit = wishes.find(w => w.id === wishId);
  if (!wishToEdit) {
    alert('Ошибка: желание не найдено!');
    return;
  }

  // Заполняем форму данными
  document.getElementById('addWishTitle').value = wishToEdit.title;
  document.getElementById('addWishDesc').value = wishToEdit.desc || '';
  document.getElementById('addWishPrice').value = wishToEdit.price || '';
  document.getElementById('addWishCategory').value = wishToEdit.category || 'Вещь';
  document.getElementById('publicWish').checked = !wishToEdit.private;
  
  // Меняем заголовок и кнопку
  document.getElementById('addWishModalTitle').textContent = 'Редактировать желание';
  document.getElementById('addWishSubmitBtn').textContent = 'Сохранить изменения';
  
  // Сохраняем ID редактируемого элемента
  const form = document.getElementById('addWishForm');
  form.setAttribute('data-editing-id', wishId);

  // Показываем модальное окно
  document.getElementById('addWishModal').classList.remove('hidden');
};

window.showEditProfileModal = function() {
  const profile = getProfileData();
  document.getElementById('editProfileFirstName').value = profile.firstName || '';
  document.getElementById('editProfileLastName').value = profile.lastName || '';
  const preview = document.getElementById('editProfilePhotoPreview');
  const icon = document.getElementById('editProfilePhotoIcon');
  if (profile.photo) {
    preview.src = profile.photo;
    preview.classList.remove('hidden');
    icon.classList.add('hidden');
  } else {
    preview.classList.add('hidden');
    icon.classList.remove('hidden');
  }
  document.getElementById('editProfileModal').classList.remove('hidden');
};

window.showLoveLanguageModal = function() {
  try {
    const values = getLoveLanguageArray();
    const checkboxes = document.querySelectorAll('input[name="loveLanguage"]');
    checkboxes.forEach(ch => {
      ch.checked = values.includes(ch.value);
    });
    const otherInput = document.getElementById('loveLangOtherInput');
    const otherCheck = document.getElementById('loveLangOtherCheck');
    if (values.includes('Другое')) {
      otherInput.classList.remove('hidden');
      otherInput.value = getLoveLanguageOther();
    } else {
      otherInput.classList.add('hidden');
      otherInput.value = '';
    }
    document.getElementById('loveLanguageModal').classList.remove('hidden');
  } catch (e) {
    console.error('Ошибка при открытии модального окна Язык любви:', e);
  }
};

window.showSettingsModal = function() {
  updateThemeToggleUI();
  document.getElementById('settingsModal').classList.remove('hidden');
};

function updateActiveFilterButtons() {
  const filterButtons = document.querySelectorAll('.wish-filter-btn');
  filterButtons.forEach(btn => {
    if (btn.dataset.category === currentWishFilter) {
      // Активный стиль
      btn.classList.add('bg-blue-500', 'text-white');
      btn.classList.remove('bg-white', 'border-gray-200', 'text-gray-700');
    } else {
      // Неактивный стиль
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('bg-white', 'border-gray-200', 'text-gray-700');
    }
  });
}

// =================================================================
// --- Инициализация приложения ---
// =================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Проверка авторизации
  const user = window.getCurrentUser();
  if (user) {
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = user.first_name;
  } else {
    document.body.innerHTML = '<p>Пожалуйста, авторизуйтесь</p>';
    return; // Прекращаем выполнение, если не авторизован
  }

  // --- Навешивание обработчиков событий ---

  // Добавление нового желания
  const addWishForm = document.getElementById('addWishForm');
  if (addWishForm) {
    addWishForm.onsubmit = function(e) {
      e.preventDefault();
      
      const editingId = addWishForm.getAttribute('data-editing-id');

      // Собираем данные из формы
      const title = document.getElementById('addWishTitle').value.trim();
      const desc = document.getElementById('addWishDesc').value.trim();
      const price = parseFloat(document.getElementById('addWishPrice').value) || 0;
      const category = document.getElementById('addWishCategory').value;
      const isPrivate = !document.getElementById('publicWish').checked;

      if (!title) {
        alert('Пожалуйста, введите название желания.');
        return;
      }

      const wishes = getGiftHistory();

      if (editingId) {
        // --- РЕДАКТИРОВАНИЕ ---
        const wishIndex = wishes.findIndex(w => w.id === Number(editingId));
        if (wishIndex > -1) {
          wishes[wishIndex] = {
            ...wishes[wishIndex], // Сохраняем старые поля (id, status и т.д.)
            title: title,
            desc: desc,
            price: price,
            category: category,
            private: isPrivate,
          };
        }
      } else {
        // --- СОЗДАНИЕ ---
        const newWish = {
          id: Date.now(),
          title: title,
          desc: desc,
          price: price,
          category: category,
          status: 'Ожидает',
          private: isPrivate,
          date: '',
          event: 'Другое',
        };
        wishes.push(newWish);
      }

      setGiftHistory(wishes);

      updateGiftHistoryList();
      renderHomeWishlistPreview(); // Обновляем главный экран
      hideModal('addWishModal');
      addWishForm.reset();
      addWishForm.removeAttribute('data-editing-id');
      document.getElementById('addWishModalTitle').textContent = 'Добавить желание';
      document.getElementById('addWishSubmitBtn').textContent = 'Сохранить желание';
      hasUnreadNotifications = true;
      updateNotifDot();
    };
  }

  const clearNotifsBtn = document.getElementById('clearNotifsBtn');
  if (clearNotifsBtn) {
      clearNotifsBtn.onclick = () => {
          notifications = [];
          hasUnreadNotifications = false;
          renderNotifications();
          updateNotifDot();
      };
  }

  const showAllBirthdaysBtn = document.getElementById('showAllBirthdaysBtn');
    if (showAllBirthdaysBtn) {
        showAllBirthdaysBtn.onclick = () => {
            renderAllBirthdays();
            showScreen('birthdaysScreen');
        };
    }

  const contributionForm = document.getElementById('contributionForm');
    if (contributionForm) {
        contributionForm.onsubmit = function(e) {
            e.preventDefault();
            const friendId = Number(this.dataset.friendId);
            const wishId = Number(this.dataset.wishId);
            const amount = parseFloat(document.getElementById('contributionAmount').value);

            if (!amount || amount <= 0) {
                alert('Пожалуйста, введите корректную сумму.');
                return;
            }

            const friend = friendsData.find(f => f.id === friendId);
            if (!friend) return;
            const wish = friend.wishes.find(w => w.id === wishId);
            if (!wish) return;

            const existingContribution = wish.contributors.find(c => c.userId === 'me');
            if (existingContribution) {
                existingContribution.amount += amount;
            } else {
                wish.contributors.push({ userId: 'me', amount: amount });
            }

            hideModal('contributionModal');
            renderFriendWishes(friendId); // Обновляем вишлист друга
            renderHomeGivingPreview(); // Обновляем превью на главном
            renderGivingList(); // Обновляем список "Я дарю"
            hasUnreadNotifications = true;
            updateNotifDot();
        }
    }
  
  // Навигация с главного экрана в вишлист
  const homeWishesHeader = document.getElementById('homeWishesHeader');
  if (homeWishesHeader) {
      homeWishesHeader.onclick = function() {
          showScreen('wishlistScreen');
      };
  }

  const homeGivingHeader = document.getElementById('homeGivingHeader');
  if (homeGivingHeader) {
      homeGivingHeader.onclick = function() {
          showScreen('givingScreen');
          currentGivingFilter = 'planned';
          updateGivingTabs();
      };
  }

  // Фильтры вишлиста
  const filterContainer = document.getElementById('wishlistFilter');
  if (filterContainer) {
    filterContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('wish-filter-btn')) {
        const category = e.target.dataset.category;
        currentWishFilter = category;
        updateActiveFilterButtons();
        updateGiftHistoryList();
      }
    });
  }

  // Переключатели на экране "Я дарю"
  const givingTabPlanned = document.getElementById('givingTabPlanned');
  if (givingTabPlanned) {
      givingTabPlanned.onclick = () => {
          if (currentGivingFilter !== 'planned') {
              currentGivingFilter = 'planned';
              updateGivingTabs();
          }
      };
  }
  const givingTabGiven = document.getElementById('givingTabGiven');
  if (givingTabGiven) {
      givingTabGiven.onclick = () => {
          if (currentGivingFilter !== 'given') {
              currentGivingFilter = 'given';
              updateGivingTabs();
          }
      };
  }


  // Редактирование профиля
const editProfilePhotoInput = document.getElementById('editProfilePhoto');
if (editProfilePhotoInput) {
  editProfilePhotoInput.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        document.getElementById('editProfilePhotoPreview').src = ev.target.result;
        document.getElementById('editProfilePhotoPreview').classList.remove('hidden');
        document.getElementById('editProfilePhotoIcon').classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }
  };
}

const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
  editProfileForm.onsubmit = function(e) {
    e.preventDefault();
    const firstName = document.getElementById('editProfileFirstName').value.trim();
    const lastName = document.getElementById('editProfileLastName').value.trim();
    let photo = document.getElementById('editProfilePhotoPreview').src;
      if (!photo || photo.endsWith('/')) photo = ''; // Проверка на пустую src
    const profile = { firstName, lastName, photo };
    localStorage.setItem('profile', JSON.stringify(profile));
    updateProfileUI();
    hideModal('editProfileModal');
  };
}

  // Язык любви
document.querySelectorAll('input[name="loveLanguage"]').forEach(ch => {
  ch.addEventListener('change', function() {
    const checked = Array.from(document.querySelectorAll('input[name="loveLanguage"]:checked'));
    if (checked.length > 3) {
      this.checked = false;
      alert('Можно выбрать не более 3 вариантов');
    }
    const otherInput = document.getElementById('loveLangOtherInput');
    const otherCheck = document.getElementById('loveLangOtherCheck');
    if (otherCheck.checked) {
      otherInput.classList.remove('hidden');
      otherInput.focus();
    } else {
      otherInput.classList.add('hidden');
    }
  });
});

const loveLanguageForm = document.getElementById('loveLanguageForm');
if (loveLanguageForm) {
  loveLanguageForm.onsubmit = function(e) {
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll('input[name="loveLanguage"]:checked')).map(ch => ch.value);
    let other = '';
    if (checked.includes('Другое')) {
      other = document.getElementById('loveLangOtherInput').value.trim();
    }
    setLoveLanguageArray(checked, other);
    updateLoveLanguageUI();
    hideModal('loveLanguageModal');
  };
}

const detectLoveLanguageAI = document.getElementById('detectLoveLanguageAI');
if (detectLoveLanguageAI) {
  detectLoveLanguageAI.onclick = function() {
    setLoveLanguageArray(['Впечатления', 'Забота'], '');
    updateLoveLanguageUI();
    hideModal('loveLanguageModal');
    alert('AI определил ваш язык любви: Впечатления + Забота');
  };
}

  // Настройки
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.onclick = function() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
    updateThemeToggleUI();
    applyTheme();
  };
}

const exportDataBtn = document.getElementById('exportDataBtn');
if (exportDataBtn) {
  exportDataBtn.onclick = function() {
    const data = {
      profile: localStorage.getItem('profile'),
      loveLanguageArr: localStorage.getItem('loveLanguageArr'),
      giftHistory: localStorage.getItem('giftHistory'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fishlist-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };
}

const importDataInput = document.getElementById('importDataInput');
if (importDataInput) {
  importDataInput.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.profile) localStorage.setItem('profile', data.profile);
        if (data.loveLanguageArr) localStorage.setItem('loveLanguageArr', data.loveLanguageArr);
        if (data.giftHistory) localStorage.setItem('giftHistory', data.giftHistory);
        location.reload();
      } catch (err) {
        alert('Ошибка при импорте данных!');
      }
    };
    reader.readAsText(file);
  };
}
  
const resetDataBtn = document.getElementById('resetDataBtn');
if (resetDataBtn) {
  resetDataBtn.onclick = function() {
    if (confirm('Вы уверены, что хотите полностью сбросить профиль?')) {
      localStorage.clear();
      location.reload();
    }
  };
}

  // --- Первоначальная отрисовка UI ---
  generateNotifications();
  updateNotifDot();
  updateProfileUI();
  updateLoveLanguageUI();
  renderAdviceOfTheDay();
  applyTheme();
  updateGiftHistoryList(); // Первоначальная отрисовка вишлиста
  renderHomeWishlistPreview(); // Первоначальная отрисовка превью
  renderHomeGivingPreview(); // Первоначальная отрисовка превью "Я дарю"
  updateActiveFilterButtons(); // Устанавливаем стиль для фильтра по умолчанию
  renderFriendsList(); // Первоначальная отрисовка списка друзей
  renderUpcomingBirthdays(); // Первоначальная отрисовка дней рождения
  // renderDreamRadar(); // Больше не нужна при старте
  showScreen('homeScreen');
}); 


// =================================================================
// --- AI-Советчик и Тест "Язык Любви" ---
// =================================================================

const loveLanguageTest = {
    questions: [
        {
            text: "Какой сверхспособностью вы бы хотели обладать?",
            answers: [
                { text: "Телепортация, чтобы мгновенно оказываться в любой точке мира.", category: "adventure" },
                { text: "Способность понимать и говорить на всех языках.", category: "social" },
                { text: "Умение чинить любую вещь прикосновением.", category: "pragmatist" },
                { text: "Способность создавать произведения искусства одним усилием мысли.", category: "aesthete" },
                { text: "Умение исцелять эмоциональные раны и дарить спокойствие.", category: "nurturer" },
            ],
        },
        {
            text: "Вы нашли таинственную дверь в старой библиотеке. Куда она ведет?",
            answers: [
                { text: "В мастерскую забытого гения, полную чертежей и механизмов.", category: "pragmatist" },
                { text: "На вечную вечеринку, где всегда играе любимая музыка и ждут друзья.", category: "social" },
                { text: "В тихий, залитый солнцем сад, где время течет медленно.", category: "nurturer" },
                { text: "В зал с утраченными произведениями искусства.", category: "aesthete" },
                { text: "На тропу, ведущую к вершине неизведанной горы.", category: "adventure" },
            ],
        },
        {
            text: "Какой из этих вымышленных предметов вы бы добавили в свою коллекцию?",
            answers: [
                { text: "Карту, которая показывает не только путь, но и скрытые чудеса.", category: "adventure" },
                { text: "Самообновляющуюся книгу, в которой есть ответы на все вопросы.", category: "pragmatist" },
                { text: "Музыкальную шкатулку, мелодия которой идеально подходит под любое настроение.", category: "aesthete" },
                { text: "Скатерть-самобранку, чтобы в любой момент собрать друзей.", category: "social" },
                { text: "Неугасающий очаг, который согревает и тело, и душу.", category: "nurturer" },
            ],
        },
        {
            text: "Ваш идеальный дом — это...",
            answers: [
                { text: "Умный дом, где все автоматизировано и работает как часы.", category: "pragmatist" },
                { text: "Большой лофт с открытой планировкой, идеальный для вечеринок.", category: "social" },
                { text: "Дом на колесах, готовый в любой момент отправиться в путь.", category: "adventure" },
                { text: "Маленький, но идеально спроектированный дом с панорамными окнами и видом на лес.", category: "aesthete" },
                { text: "Уютный коттедж с камином, большим садом и мягкими креслами.", category: "nurturer" },
            ],
        },
        {
            text: "Внезапно освободился целый день. Как вы его проведете?",
            answers: [
                { text: "Попробую новый сложный рецепт, требующий точности и концентрации.", category: "aesthete" },
                { text: "Разберу, наконец, тот самый шкаф и оптимизирую хранение.", category: "pragmatist" },
                { text: "Позвоню друзьям и спонтанно организую встречу.", category: "social" },
                { text: "Проведу его в тишине, за медитацией, чтением или долгой ванной.", category: "nurturer" },
                { text: "Поеду в ближайший лес или парк исследовать незнакомые тропы.", category: "adventure" },
            ],
        },
        {
            text: "Какую документальную передачу вы бы посмотрели с наибольшим интересом?",
            answers: [
                { text: "О выживании в дикой природе.", category: "adventure" },
                { text: "О психологии социальных связей.", category: "social" },
                { text: "Об истории дизайна и архитектуры.", category: "aesthete" },
                { text: "О гениальных инженерных сооружениях.", category: "pragmatist" },
                { text: "О влиянии сна и питания на здоровье.", category: "nurturer" },
            ],
        },
    ],
    results: {
        adventure: {
            title: "Искатель Приключений",
            description: "Вы цените действие выше обладания, а новый опыт — лучшая инвестиция. Вас манит неизведанное, и лучший подарок для вас — это возможность выйти из зоны комфорта и получить яркие воспоминания.",
            gifts: [
                { title: "Сертификат на полет в аэротрубе", category: "Впечатление", price: 5000 },
                { title: "Качественный и вместительный походный рюкзак", category: "Вещь", price: 9000 },
                { title: "Годовая подписка на National Geographic", category: "Впечатление", price: 3000 },
                { title: "Водонепроницаемая экшн-камера", category: "Вещь", price: 15000 },
                { title: "Билеты на музыкальный фестиваль на открытом воздухе", category: "Впечатление", price: 7000 },
            ],
        },
        pragmatist: {
            title: "Стратег",
            description: "Вы цените логику, эффективность и качество. Лучший подарок для вас — это не красивая безделушка, а функциональная вещь, которая решает конкретную задачу, экономит ресурсы или прослужит долгие годы.",
            gifts: [
                { title: "Набор умных розеток для дома", category: "Вещь", price: 4000 },
                { title: "Подписка на менеджер паролей (e.g., 1Password)", category: "Вещь", price: 2500 },
                { title: "Лазерный дальномер для ремонта и планировки", category: "Вещь", price: 5000 },
                { title: "Курс по программированию или анализу данных", category: "Впечатление", price: 20000 },
                { title: "Качественная механическая клавиатура", category: "Вещь", price: 10000 },
            ],
        },
        nurturer: {
            title: "Хранитель Гармонии",
            description: "Вы тонко чувствуете атмосферу и цените моменты спокойствия и душевного тепла. Лучший подарок для вас — это проявление заботы, то, что помогает восстановить силы, создает уют и говорит 'я о тебе думаю'.",
            gifts: [
                { title: "Тяжелое одеяло для снятия стресса", category: "Вещь", price: 7000 },
                { title: "Умный сад для выращивания зелени на кухне", category: "Вещь", price: 8000 },
                { title: "Сертификат на флоатинг", category: "Впечатление", price: 4000 },
                { title: "Набор для заваривания чая (красивый чайник и редкие сорта)", category: "Вещь", price: 6000 },
                { title: "Пожертвование в благотворительный фонд от вашего имени", category: "Время", price: 5000 },
            ],
        },
        aesthete: {
            title: "Эстет",
            description: "Вы обладаете врожденным чувством прекрасного и видите красоту в деталях. Лучший подарок для вас — это вещь или опыт, которые доставляют визуальное и интеллектуальное удовольствие, а не просто выполняют функцию.",
            gifts: [
                { title: "Книга по истории искусства или фотографии от издательства Taschen", category: "Вещь", price: 6000 },
                { title: "Сертификат на индивидуальный пошив рубашки", category: "Впечатление", price: 15000 },
                { title: "Билеты в филармонию или оперу", category: "Впечатление", price: 7000 },
                { title: "Набор профессиональных акварельных красок", category: "Вещь", price: 5000 },
                { title: "Минималистичный проигрыватель винила", category: "Вещь", price: 18000 },
            ],
        },
        social: {
            title: "Душа Компании",
            description: "Ваша энергия и радость умножаются, когда вы делите их с другими. Лучший подарок для вас — тот, что создает повод собраться вместе, способствует общению и оставляет после себя общие шутки и воспоминания.",
            gifts: [
                { title: "Проектор для кинопросмотров с друзьями", category: "Вещь", price: 12000 },
                { title: "Набор для игры в Петанк или Крокет для выездов на природу", category: "Вещь", price: 4000 },
                { title: "Мастер-класс по приготовлению коктейлей для компании", category: "Впечатление", price: 10000 },
                { title: "Электрогриль для балконных вечеринок", category: "Вещь", price: 9000 },
                { title: "Сертификат на запись песни в профессиональной студии", category: "Впечатление", price: 8000 },
            ],
        },
    },
    scores: {},
    currentQuestion: 0,
};

window.startLoveLanguageTest = function() {
    loveLanguageTest.scores = { adventure: 0, pragmatist: 0, nurturer: 0, aesthete: 0, social: 0 };
    loveLanguageTest.currentQuestion = 0;
    showScreen('loveLanguageTestScreen');
    renderLLTestQuestion();
};

function renderLLTestQuestion() {
    const container = document.getElementById('llTestContainer');
    if (!container) return;

    const qIndex = loveLanguageTest.currentQuestion;
    const question = loveLanguageTest.questions[qIndex];

    const progress = ((qIndex + 1) / loveLanguageTest.questions.length) * 100;

    container.innerHTML = `
        <div class="mb-4">
            <p class="text-sm text-gray-500 mb-1">Вопрос ${qIndex + 1} из ${loveLanguageTest.questions.length}</p>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${progress}%"></div>
            </div>
        </div>
        <p class="font-medium mb-4">${question.text}</p>
        <div class="space-y-2">
            ${question.answers.map((answer, index) => `
                <button onclick="handleLLAnswer('${answer.category}')" class="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg p-3 transition-colors">
                    ${answer.text}
                </button>
            `).join('')}
        </div>
    `;
}

window.handleLLAnswer = function(category) {
    loveLanguageTest.scores[category]++;
    loveLanguageTest.currentQuestion++;

    if (loveLanguageTest.currentQuestion < loveLanguageTest.questions.length) {
        renderLLTestQuestion();
    } else {
        showLLTestResult();
    }
};

function showLLTestResult() {
    const scores = loveLanguageTest.scores;
    const topCategory = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const result = loveLanguageTest.results[topCategory];
    
    const container = document.getElementById('testResultContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-xl p-4 shadow-sm mb-4 text-center">
            <i class="fas fa-award text-4xl text-yellow-500 mb-2"></i>
            <h3 class="text-lg font-semibold">${result.title}</h3>
            <p class="text-sm text-gray-600">${result.description}</p>
        </div>
        <h4 class="font-semibold mb-2">Идеи подарков для вас:</h4>
        <div class="space-y-3" id="ll-suggestions">
            ${result.gifts.map((gift, index) => `
                <div class="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                    <div class="flex-1 min-w-0 mr-4">
                        <p class="font-medium truncate">${gift.title}</p>
                        <p class="text-sm text-gray-500">${gift.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <button id="add-sug-btn-${index}" onclick="addSuggestedGiftToWishlist(${index}, '${topCategory}')" class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-blue-600">Добавить</button>
                </div>
            `).join('')}
        </div>
    `;

    showScreen('testResultScreen');
}

window.addSuggestedGiftToWishlist = function(giftIndex, category) {
    const gift = loveLanguageTest.results[category].gifts[giftIndex];
    if (!gift) return;

    const wishes = getGiftHistory();
    wishes.push({
        id: Date.now(),
        title: gift.title,
        desc: 'Добавлено из AI-советника',
        date: '',
        event: 'Другое',
        status: 'Ожидает',
        private: false,
        category: gift.category,
        price: gift.price
    });
    setGiftHistory(wishes);
    
    const btn = document.getElementById(`add-sug-btn-${giftIndex}`);
    if (btn) {
        btn.textContent = 'Добавлено!';
        btn.disabled = true;
        btn.classList.add('bg-green-500', 'hover:bg-green-500');
        btn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    }

    renderHomeWishlistPreview();
    updateGiftHistoryList();
    hasUnreadNotifications = true;
    updateNotifDot();
} 

// =================================================================
// --- Радар мечты (Dream Radar) ---
// =================================================================

const ideaPool = {
    'Спорт': [
        { title: 'Массажный пистолет для мышц', category: 'Вещь', price: 7000 },
        { title: 'Сертификат в скалодром', category: 'Впечатление', price: 3000 },
        { title: 'Новые беговые кроссовки', category: 'Вещь', price: 12000 },
    ],
    'Гаджеты': [
        { title: 'Беспроводная зарядная станция 3-в-1', category: 'Вещь', price: 5000 },
        { title: "Подписка на 'Яндекс Плюс'", category: 'Впечатление', price: 2000 },
        { title: 'Умный ночник с разными режимами', category: 'Вещь', price: 4000 },
    ],
    'Книги': [
        { title: 'Сертификат в книжный магазин', category: 'Вещь', price: 3000 },
        { title: 'Подписка на сервис аудиокниг', category: 'Впечатление', price: 2500 },
        { title: 'Красивое коллекционное издание любимой книги', category: 'Вещь', price: 5000 },
    ],
    'Уют': [
        { title: 'Набор для ароматерапии с диффузором', category: 'Вещь', price: 4500 },
        { title: 'Электрический штопор для вина', category: 'Вещь', price: 3000 },
        { title: 'День в SPA-комплексе', category: 'Впечатление', price: 8000 },
    ],
    'Путешествия': [
        { title: 'Компактный и легкий пауэрбанк', category: 'Вещь', price: 4000 },
        { title: 'Стильный чехол для чемодана', category: 'Вещь', price: 2500 },
        { title: 'Фотоаппарат моментальной печати', category: 'Вещь', price: 9000 },
    ],
};

const interestKeywords = {
    'Спорт': ['спорт', 'зал', 'кроссовки', 'тренировк', 'бег', 'велосипед', 'йога', 'фитнес'],
    'Гаджеты': ['телефон', 'наушники', 'колонка', 'часы', 'ноутбук', 'планшет', 'камера', 'умный'],
    'Книги': ['книг', 'читать', 'издание', 'автор', 'роман'],
    'Уют': ['уют', 'дом', 'плед', 'кресло', 'свечи', 'декор', 'аромат', 'спа'],
    'Путешествия': ['путешеств', 'поездка', 'билет', 'отель', 'чемодан', 'тур'],
};

function analyzeWishlistForInterests() {
    const wishes = getGiftHistory();
    const interests = new Set();

    wishes.forEach(wish => {
        const title = wish.title.toLowerCase();
        for (const interest in interestKeywords) {
            if (interestKeywords[interest].some(keyword => title.includes(keyword))) {
                interests.add(interest);
            }
        }
        // Добавляем по категории, если она не "Вещь" или "Время" (более общие)
        if (['Впечатление', 'Уют', 'Спорт'].includes(wish.category)) {
             interests.add(wish.category);
        }
    });

    // Если интересов не найдено, предлагаем дефолтные
    if (interests.size === 0) {
        return ['Гаджеты', 'Книги', 'Спорт'];
    }

    return Array.from(interests);
}

function renderDreamRadar() {
    const container = document.getElementById('dreamRadarTags');
    if (!container) return;

    const interests = analyzeWishlistForInterests();
    container.innerHTML = '';

    interests.forEach(interest => {
        const tagButton = document.createElement('button');
        tagButton.className = 'radar-tag-btn text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors';
        tagButton.textContent = interest;
        tagButton.dataset.interest = interest;
        tagButton.onclick = () => {
            tagButton.classList.toggle('bg-blue-500');
            tagButton.classList.toggle('text-white');
            tagButton.classList.toggle('bg-gray-100');
            tagButton.classList.toggle('text-gray-700');
        };
        container.appendChild(tagButton);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateIdeasBtn');
    if (generateBtn) {
        generateBtn.onclick = showInterestSelectorModal;
    }

    const showIdeasBtn = document.getElementById('showGeneratedIdeasBtn');
    if(showIdeasBtn) {
        showIdeasBtn.onclick = () => {
            const selectedTags = Array.from(document.querySelectorAll('#interestModalTags .bg-blue-500'))
                                    .map(btn => btn.dataset.interest);
            
            if (selectedTags.length === 0) {
                alert('Пожалуйста, выберите хотя бы один интерес.');
                return;
            }

            hideModal('interestSelectorModal');
            renderGeneratedIdeas(selectedTags);
            showScreen('generatedIdeasScreen');
        };
    }
});

function showInterestSelectorModal() {
    const detectedInterests = analyzeWishlistForInterests();
    renderInterestModalTags(detectedInterests);
    document.getElementById('interestSelectorModal').classList.remove('hidden');
}

function renderInterestModalTags(detectedInterests = []) {
    const container = document.getElementById('interestModalTags');
    if (!container) return;

    const allInterests = Object.keys(ideaPool);
    container.innerHTML = '';

    allInterests.forEach(interest => {
        const tagButton = document.createElement('button');
        const isSelected = detectedInterests.includes(interest);
        
        tagButton.className = `radar-tag-btn text-sm px-4 py-2 rounded-lg border transition-colors ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`;
        tagButton.textContent = interest;
        tagButton.dataset.interest = interest;
        
        tagButton.onclick = () => {
            const selectedCount = container.querySelectorAll('.bg-blue-500').length;
            const isCurrentlySelected = tagButton.classList.contains('bg-blue-500');

            if (!isCurrentlySelected && selectedCount >= 3) {
                alert('Можно выбрать не более 3-х категорий.');
                return;
            }

            tagButton.classList.toggle('bg-blue-500');
            tagButton.classList.toggle('text-white');
            tagButton.classList.toggle('border-blue-500');
            tagButton.classList.toggle('bg-white');
            tagButton.classList.toggle('text-gray-800');
            tagButton.classList.toggle('border-gray-300');
        };
        container.appendChild(tagButton);
    });
}

function renderGeneratedIdeas(tags) {
    const container = document.getElementById('generatedIdeasListContainer');
    if (!container) return;

    let ideas = [];
    tags.forEach(tag => {
        if(ideaPool[tag]) {
            ideas.push(...ideaPool[tag]);
        }
    });
    
    // Перемешиваем и убираем дубликаты
    ideas = [...new Map(ideas.map(item => [item['title'], item])).values()];
    const shuffledIdeas = ideas.sort(() => 0.5 - Math.random()).slice(0, 5); // Показываем 5 случайных

    container.innerHTML = '';
    if (shuffledIdeas.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">К сожалению, по этим тегам идей не нашлось.</p>';
        return;
    }

    shuffledIdeas.forEach((idea, index) => {
        const ideaCard = document.createElement('div');
        ideaCard.className = 'bg-white rounded-xl p-3 shadow-sm flex items-center justify-between slide-up';
        ideaCard.innerHTML = `
            <div class="flex-1 min-w-0 mr-4">
                <p class="font-medium truncate">${idea.title}</p>
                <p class="text-sm text-gray-500">${idea.price > 0 ? idea.price.toLocaleString('ru-RU') + ' ₽' : 'Бесценно'}</p>
            </div>
            <button id="add-idea-btn-${index}" class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-medium whitespace-nowrap hover:bg-blue-600" 
                    onclick="addGeneratedIdeaToWishlist(${index}, '${idea.title}', '${idea.category}', ${idea.price})">
                Добавить
            </button>
        `;
        container.appendChild(ideaCard);
    });
}

window.addGeneratedIdeaToWishlist = function(index, title, category, price) {
    const wishes = getGiftHistory();
    wishes.push({
        id: Date.now(),
        title: title,
        desc: 'Добавлено из Радара мечты',
        status: 'Ожидает',
        private: false,
        category: category,
        price: price
    });
    setGiftHistory(wishes);
    
    const btn = document.getElementById(`add-idea-btn-${index}`);
    if (btn) {
        btn.textContent = 'Добавлено!';
        btn.disabled = true;
        btn.classList.add('bg-green-500', 'hover:bg-green-500');
        btn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    }
    
    renderHomeWishlistPreview();
    updateGiftHistoryList();
    hasUnreadNotifications = true;
    updateNotifDot();
};
  