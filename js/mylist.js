const MyListManager = (() => {
  const STORAGE_KEY = CONFIG.STORAGE_KEYS.MY_LIST;
  const listeners = [];

  function getList() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : ['m1', 'm3', 'm17'];
    } catch (e) {
      return ['m1', 'm3', 'm17'];
    }
  }

  function saveList(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      notifyListeners(list);
    } catch (e) {
    }
  }

  function isInList(id) {
    const list = getList();
    return list.includes(id);
  }

  async function toggle(id) {
    let list = getList();
    const exists = list.includes(id);
    const movie = await MovieAPI.getMovieById(id);
    const movieTitle = movie ? movie.title : 'Title';

    if (exists) {
      list = list.filter(item => item !== id);
      saveList(list);
      showToast(`Removed from My List`, false);
    } else {
      list.unshift(id);
      saveList(list);
      showToast(`Added "${movieTitle}" to My List`, true);
    }

    updateUIElements(id, !exists);
    return !exists;
  }

  function updateUIElements(movieId, isAdded) {
    const buttons = document.querySelectorAll(`[data-mylist-btn="${movieId}"]`);
    buttons.forEach(btn => {
      if (isAdded) {
        btn.classList.add('active');
        btn.title = 'Remove from My List';
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      } else {
        btn.classList.remove('active');
        btn.title = 'Add to My List';
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        `;
      }
    });
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notifyListeners(list) {
    listeners.forEach(fn => fn(list));
  }

  function showToast(message, isSuccess = true) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon ${isSuccess ? 'success' : ''}">
        ${isSuccess ? `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ` : `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `}
      </div>
      <div class="toast-msg">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  return {
    getList,
    isInList,
    toggle,
    updateUIElements,
    subscribe,
    showToast
  };
})();

window.MyListManager = MyListManager;
