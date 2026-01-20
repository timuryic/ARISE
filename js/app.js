/**
 * ARISE - Main Application Module
 */

const App = {
  elements: {},

  init() {
    console.log('ARISE System Initializing...');
    Storage.init(); i18n.init(); Character.init(); Quests.init();
    Rewards.init(); Shop.init(); Dungeon.init(); History.init(); Achievements.init();
    this.checkAchievements();
    const dailyReward = Character.checkDailyLogin();
    if (dailyReward) {
      setTimeout(() => {
        this.showNotification(i18n.t('dailyLogin'), `${i18n.t('streakReward')}: ${dailyReward.gold} Gold!`, 'success');
        SoundManager.play('levelup');
      }, 1000);
    }
    this.cacheElements(); this.setupEventListeners(); this.renderAll(); this.registerServiceWorker();
    document.addEventListener('click', () => { SoundManager.init(); SoundManager.play('click'); }, { once: true });
    console.log('ARISE System Online.');
  },

  cacheElements() {
    this.elements = {
      screens: document.querySelectorAll('.screen'), navItems: document.querySelectorAll('.nav-item'),
      playerLevel: document.getElementById('player-level'), playerTitle: document.getElementById('player-rank-badge'),
      playerName: document.getElementById('player-name'), playerGold: document.getElementById('gold-amount'),
      currentXp: document.getElementById('current-xp'), maxXp: document.getElementById('max-xp'),
      xpBar: document.getElementById('xp-bar'), statStr: document.getElementById('stat-str'),
      statVit: document.getElementById('stat-vit'), statAgi: document.getElementById('stat-agi'),
      statInt: document.getElementById('stat-int'), statSen: document.getElementById('stat-sen'),
      streakCount: document.getElementById('streak-count'), rankIcon: document.getElementById('rank-icon'),
      rankName: document.getElementById('rank-name'), rankDescription: document.getElementById('rank-description'),
      nextRankName: document.getElementById('next-rank-name'), levelsToNext: document.getElementById('levels-to-next'),
      avatarContainer: document.getElementById('avatar-container'), avatarGlow: document.getElementById('avatar-glow'),
      avatarImage: document.getElementById('avatar-image'), questList: document.getElementById('quest-list'),
      rewardsGrid: document.getElementById('rewards-grid'), shopGrid: document.getElementById('shop-grid'),
      dungeonGatesView: document.getElementById('dungeon-gates-view'),
      dungeonRaidView: document.getElementById('dungeon-raid-view'), gatesGrid: document.getElementById('gates-grid'),
      keyCount: document.getElementById('key-count'), bossName: document.getElementById('boss-name'),
      bossImage: document.getElementById('boss-image'), bossHpFill: document.getElementById('boss-hp-fill'),
      bossHpText: document.getElementById('boss-hp-text'), raidQuestList: document.getElementById('raid-quest-list'),
      questEditorList: document.getElementById('quest-editor-list'), journalList: document.getElementById('journal-list'),
      rewardModal: document.getElementById('reward-modal'), levelupModal: document.getElementById('levelup-modal'),
      rankupModal: document.getElementById('rankup-modal'), editQuestModal: document.getElementById('edit-quest-modal'),
      modalTitle: document.getElementById('modal-title'), modalSubtitle: document.getElementById('modal-subtitle'),
      modalContent: document.getElementById('modal-content'), modalIcon: document.getElementById('modal-icon'),
      modalDownload: document.getElementById('modal-download')
    };
  },

  setupEventListeners() {
    if (this.elements.navItems) {
      this.elements.navItems.forEach(item => {
        item.addEventListener('click', () => { this.navigateTo(item.getAttribute('data-screen')); });
      });
    }
    window.addEventListener('popstate', (e) => { if (e.state && e.state.screen) this.navigateTo(e.state.screen, false); });
    document.querySelectorAll('.close-modal').forEach(btn => { btn.onclick = () => this.closeModal(); });
    const logo = document.querySelector('.app-logo');
    if (logo) { logo.style.cursor = 'pointer'; logo.onclick = () => this.navigateTo('profile'); }
  },

  navigateTo(screenId, addToHistory = true) {
    SoundManager.play('click');
    if (!this.elements.screens) this.cacheElements();
    this.elements.screens.forEach(screen => {
      screen.classList.remove('active');
      if (screen.id === `screen-${screenId}`) screen.classList.add('active');
    });
    this.elements.navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-screen') === screenId) item.classList.add('active');
    });
    if (screenId === 'profile') this.renderProfile();
    if (screenId === 'quests') this.renderQuests();
    if (screenId === 'rewards') this.renderRewards();
    if (screenId === 'shop') this.renderShop();
    if (screenId === 'dungeons') this.renderDungeons();
    if (screenId === 'settings') this.renderSettings();
    if (screenId === 'history') this.renderHistory();
    if (addToHistory) history.pushState({ screen: screenId }, '', `#${screenId}`);
    this.closeModal(); window.scrollTo(0, 0);
  },

  renderAll() {
    this.renderProfile(); this.renderQuests(); this.renderRewards();
    this.renderShop(); this.renderDungeons(); this.renderHistory(); this.renderAchievements();
  },

  renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Achievements.list.forEach(ach => {
      const isUnlocked = Achievements.isUnlocked(ach.id);
      const details = i18n.t('achievements')[ach.id] || { title: ach.id, desc: '...' };
      const el = document.createElement('div');
      el.className = `achievement-badge ${ach.tier} ${isUnlocked ? '' : 'locked'}`;
      el.textContent = ach.icon;
      el.setAttribute('data-title', `${details.title}: ${details.desc}`);
      grid.appendChild(el);
    });
  },

  renderProfile() {
    const data = Character.data; const rank = Character.getRank(); const nextRank = Character.getNextRank();
    this.elements.playerLevel.textContent = data.level;
    this.elements.playerTitle.textContent = rank.name;
    this.elements.playerName.textContent = data.name;
    if (this.elements.playerGold) this.elements.playerGold.textContent = data.gold || 0;
    this.elements.currentXp.textContent = data.xp;
    this.elements.maxXp.textContent = Character.getXpForLevel(data.level);
    this.elements.xpBar.style.width = `${Character.getXpProgress()}%`;
    this.elements.statStr.textContent = data.stats.str;
    this.elements.statVit.textContent = data.stats.vit;
    this.elements.statAgi.textContent = data.stats.agi;
    this.elements.statInt.textContent = data.stats.int;
    this.elements.statSen.textContent = data.stats.sen;
    this.elements.streakCount.textContent = data.streak;
    this.elements.rankName.textContent = rank.name;
    this.elements.rankName.style.color = rank.color;
    this.elements.rankDescription.textContent = rank.description;
    this.elements.playerTitle.style.borderColor = rank.color;
    this.elements.playerTitle.style.color = rank.color;
    if (nextRank) {
      document.getElementById('next-rank-name').textContent = nextRank.name;
      document.getElementById('levels-to-next').textContent = Character.getLevelsToNextRank();
      document.querySelector('.rank-progress').style.display = 'block';
    } else { document.querySelector('.rank-progress').style.display = 'none'; }
    this.elements.avatarGlow.style.background = `radial-gradient(circle, ${rank.glowColor} 0%, transparent 70%)`;
    this.elements.avatarContainer.style.borderColor = rank.color;
    this.elements.avatarImage.src = rank.avatar || 'assets/hunter-avatar.png';
  },

  renderQuests() {
    const activeQuests = Quests.getDailyQuests();
    this.elements.questList.innerHTML = '';
    activeQuests.forEach(quest => {
      const progress = quest.current || 0;
      const isCompleted = progress >= quest.target;
      const item = document.createElement('div');
      item.className = `quest-item ${isCompleted ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="quest-item-name">${quest.icon} ${i18n.getQuestName(quest)}</div>
        <div class="quest-item-right">
          <div class="quest-item-progress ${isCompleted ? 'completed' : ''}">${progress} / ${quest.target}${quest.unit || ''}</div>
          <div class="quest-checkbox ${isCompleted ? 'checked' : ''}" onclick="App.handleQuestClick('${quest.id}')">${isCompleted ? '✓' : ''}</div>
        </div>`;
      this.elements.questList.appendChild(item);
    });
  },

  handleQuestClick(questId) {
    const result = Quests.toggleQuest(questId);
    if (!result) return;
    this.renderQuests();
    if (result.completed) {
      SoundManager.play('complete');
      this.showNotification('QUEST COMPLETED', `+${result.xpChange} XP`, 'success');
      if (result.characterUpdate) {
        if (result.characterUpdate.leveledUp) {
          setTimeout(() => SoundManager.play('levelup'), 500);
          this.showLevelUpModal(result.characterUpdate.newLevel);
          History.add('LEVEL_UP', `Reached Level ${result.characterUpdate.newLevel}`);
        }
        if (result.characterUpdate.rankChanged) {
          setTimeout(() => SoundManager.play('rankup'), 1000);
          this.showRankUpModal(result.characterUpdate.newRank);
          History.add('RANK_UP', `Promoted to ${result.characterUpdate.newRank.name}`);
        }
      }
      History.add('QUEST', `Completed: ${i18n.getQuestName(Quests.getQuest(questId))}`);
      this.checkAchievements();
    } else { SoundManager.play('undo'); }
    this.renderProfile();
  },

  renderRewards() {
    const list = Rewards.getAllRewards();
    this.elements.rewardsGrid.innerHTML = '';
    list.forEach(reward => {
      const isLocked = !Rewards.isUnlocked(reward.id);
      const card = document.createElement('div');
      card.className = `reward-card ${isLocked ? 'locked' : ''}`;
      card.onclick = () => { SoundManager.play('click'); this.showRewardDetail(reward.id); };
      card.innerHTML = `<div class="reward-icon">${reward.icon}</div><div class="reward-title">${reward.title}</div><div class="reward-condition">${reward.conditionText}</div>`;
      this.elements.rewardsGrid.appendChild(card);
    });
  },

  renderShop() {
    const items = Shop.getItems();
    if (!this.elements.shopGrid) return;
    this.elements.shopGrid.innerHTML = '';
    items.forEach(item => {
      const details = i18n.t('shopItems')[item.nameKey] || { name: item.id, desc: '...' };
      const card = document.createElement('div');
      card.className = 'shop-item-card';
      card.innerHTML = `<div class="shop-item-icon">${item.icon}</div><div class="shop-item-name">${details.name}</div><div class="shop-item-desc">${details.desc}</div><div class="shop-item-price">${item.price} G</div><button class="buy-btn" onclick="App.buyItem('${item.id}')" ${!item.available ? 'disabled' : ''}>${item.available ? i18n.t('buy') : i18n.t('soldOut')}</button>`;
      this.elements.shopGrid.appendChild(card);
    });
  },

  renderDungeons() {
    if (!this.elements.dungeonGatesView) return;
    if (this.elements.keyCount) this.elements.keyCount.textContent = Character.data.keys || 0;
    if (Dungeon.isActive()) {
      this.elements.dungeonGatesView.style.display = 'none';
      this.elements.dungeonRaidView.style.display = 'block';
      this.renderRaidView();
    } else {
      this.elements.dungeonGatesView.style.display = 'block';
      this.elements.dungeonRaidView.style.display = 'none';
      this.renderGatesView();
    }
  },

  renderGatesView() {
    const grid = this.elements.gatesGrid; grid.innerHTML = '';
    const gates = [
      { id: 'e', rank: 'E', diff: 'Easy', minLevel: 1 }, { id: 'd', rank: 'D', diff: 'Normal', minLevel: 10 },
      { id: 'c', rank: 'C', diff: 'Hard', minLevel: 20 }, { id: 'b', rank: 'B', diff: 'Expert', minLevel: 40 },
      { id: 'a', rank: 'A', diff: 'Master', minLevel: 60 }, { id: 's', rank: 'S', diff: 'Nightmare', minLevel: 80 }
    ];
    gates.forEach(gate => {
      const isLocked = Character.data.level < gate.minLevel;
      const color = Dungeon.bosses[gate.id].color;
      const card = document.createElement('div');
      card.className = 'gate-card'; card.style.borderColor = color;
      if (isLocked) { card.style.opacity = '0.3'; card.style.pointerEvents = 'none'; }
      card.innerHTML = `<div class="gate-rank" style="color: ${color}">${gate.rank}</div><div class="gate-diff">${i18n.t('diff')[gate.diff.toLowerCase()] || gate.diff}</div><div style="font-size: 0.7em; margin-top: 5px; color: #888">LVL ${gate.minLevel}+</div>`;
      card.onclick = () => this.enterGate(gate.id);
      grid.appendChild(card);
    });
  },

  renderRaidView() {
    const raid = Dungeon.activeRaid; if (!raid) return;
    this.elements.bossName.textContent = raid.boss.name;
    this.elements.bossImage.innerHTML = raid.boss.image;
    const hpPercent = (raid.currentHp / raid.boss.maxHp) * 100;
    this.elements.bossHpFill.style.width = `${hpPercent}%`;
    this.elements.bossHpText.textContent = `${raid.currentHp} / ${raid.boss.maxHp}`;
    const list = this.elements.raidQuestList; list.innerHTML = '';
    raid.quests.forEach(q => {
      const item = document.createElement('div');
      item.className = `raid-quest-item ${q.completed ? 'completed' : ''}`;
      item.innerHTML = `<div><div style="font-weight: bold; color: var(--color-accent-red)">${q.text}</div><div style="font-size: 0.8em; color: #aaa">${i18n.t('damageToBoss')}: ${q.damage}</div></div><button class="raid-quest-btn" onclick="App.completeRaidQuest('${q.id}')">${q.completed ? i18n.t('completed') : i18n.t('complete')}</button>`;
      list.appendChild(item);
    });
  },

  enterGate(rankId) {
    const result = Dungeon.startRaid(rankId);
    if (result.success) {
      SoundManager.play('rankup'); this.renderDungeons();
      this.showNotification(i18n.t('raidStarted'), i18n.t('raidDesc'), 'info');
      History.add('RAID', `Entered gate: ${rankId.toUpperCase()}-Rank`);
    } else { SoundManager.play('undo'); this.showNotification('ERROR', result.message, 'error'); }
  },

  completeRaidQuest(questId) {
    const result = Dungeon.completeQuest(questId);
    if (result && result.success) {
      SoundManager.play('click');
      this.showNotification(i18n.t('attack'), `${i18n.t('damageDealt')}: ${result.damage}`, 'success');
      if (result.victory) {
        setTimeout(() => {
          const rewards = Dungeon.claimVictory();
          SoundManager.play('levelup');
          this.showNotification(i18n.t('victory'), `${i18n.t('gained')}: ${rewards.xp} XP, ${rewards.gold} Gold`, 'success');
          History.add('RAID_WIN', `Defeated Boss. Gained ${rewards.gold} G`);
          this.checkAchievements(); this.renderProfile(); this.renderDungeons();
        }, 500);
      } else { this.renderDungeons(); }
    }
  },

  showRewardDetail(rewardId) {
    const reward = Rewards.getReward(rewardId); if (!reward) return;
    const isUnlocked = Rewards.isUnlocked(rewardId);
    this.elements.modalIcon.textContent = reward.icon;
    this.elements.modalTitle.textContent = reward.category.toUpperCase();
    this.elements.modalSubtitle.textContent = reward.title;
    if (isUnlocked) {
      this.elements.modalContent.innerHTML = reward.content;
      if (reward.downloadUrl) { this.elements.modalDownload.innerHTML = `<a href="${reward.downloadUrl}" class="download-link" download><span>📥 Скачать</span></a>`; }
      else { this.elements.modalDownload.innerHTML = ''; }
    } else {
      this.elements.modalContent.innerHTML = `<p style="color: var(--color-accent-red)">⚠️ ДОСТУП ОГРАНИЧЕН. Условие: ${reward.conditionText}</p>`;
      this.elements.modalDownload.innerHTML = '';
    }
    this.elements.rewardModal.classList.add('active');
  },

  renderSettings() {
    const quests = QuestEditor.getQuests();
    this.elements.questEditorList.innerHTML = '';
    quests.forEach(quest => {
      const item = document.createElement('div');
      item.className = 'quest-editor-item';
      item.innerHTML = `<div style="font-size: 1.5rem;">${quest.icon}</div><div class="quest-editor-info"><div class="quest-editor-name">${i18n.getQuestName(quest)}</div><div class="quest-editor-details">Цель: ${quest.target}${quest.unit || ''} | +1 ${quest.stat.toUpperCase()}</div></div><button class="edit-quests-btn" onclick="App.showEditQuestModal('${quest.id}')">✏️</button>`;
      this.elements.questEditorList.appendChild(item);
    });
    const addBtn = document.getElementById('add-quest-btn');
    if (addBtn) addBtn.textContent = i18n.t('settingsAdd');
    const journal = QuestEditor.getJournal();
    this.elements.journalList.innerHTML = '';
    if (journal.length === 0) { this.elements.journalList.innerHTML = '<p class="text-muted">История изменений пуста</p>'; }
    else { [...journal].reverse().forEach(entry => {
      const item = document.createElement('div'); item.className = 'journal-entry';
      item.innerHTML = `<div class="journal-time">${new Date(entry.timestamp).toLocaleString()}</div><div>${entry.details}</div>`;
      this.elements.journalList.appendChild(item);
    }); }
  },

  showEditQuestModal(questId) {
    const quest = QuestEditor.getQuests().find(q => q.id === questId); if (!quest) return;
    document.getElementById('edit-modal-title').textContent = i18n.t('settingsEdit');
    document.getElementById('edit-quest-id').value = quest.id;
    document.getElementById('edit-quest-name').value = i18n.getQuestName(quest);
    document.getElementById('edit-quest-target').value = quest.target;
    document.getElementById('edit-quest-unit').value = quest.unit || '';
    document.getElementById('edit-quest-stat').value = quest.stat;
    this.renderIconPicker(quest.icon);
    document.getElementById('delete-quest-btn').style.display = 'block';
    this.elements.editQuestModal.classList.add('active');
  },

  showAddQuestModal() {
    document.getElementById('edit-modal-title').textContent = i18n.t('settingsNew');
    document.getElementById('edit-quest-id').value = '';
    document.getElementById('edit-quest-name').value = '';
    document.getElementById('edit-quest-target').value = '10';
    document.getElementById('edit-quest-unit').value = '';
    document.getElementById('edit-quest-stat').value = 'str';
    this.renderIconPicker('💪');
    document.getElementById('delete-quest-btn').style.display = 'none';
    this.elements.editQuestModal.classList.add('active');
  },

  renderIconPicker(selectedIcon) {
    const picker = document.getElementById('icon-picker'); picker.innerHTML = '';
    QuestEditor.icons.forEach(icon => {
      const el = document.createElement('div');
      el.className = `icon-choice ${icon === selectedIcon ? 'selected' : ''}`;
      el.textContent = icon;
      el.onclick = () => { document.querySelectorAll('.icon-choice').forEach(c => c.classList.remove('selected')); el.classList.add('selected'); this.tempSelectedIcon = icon; };
      picker.appendChild(el);
    });
    this.tempSelectedIcon = selectedIcon;
  },

  saveQuestEdit() {
    const id = document.getElementById('edit-quest-id').value;
    const data = { nameRu: document.getElementById('edit-quest-name').value || 'Без названия', icon: this.tempSelectedIcon, target: parseInt(document.getElementById('edit-quest-target').value) || 1, unit: document.getElementById('edit-quest-unit').value, xp: 10, stat: document.getElementById('edit-quest-stat').value };
    if (id) { QuestEditor.updateQuest(id, data); } else { QuestEditor.addQuest(data); }
    this.closeEditModal(); this.renderSettings(); this.renderQuests();
  },

  deleteCurrentQuest() {
    const id = document.getElementById('edit-quest-id').value;
    if (id && confirm('Удалить этот квест?')) { QuestEditor.deleteQuest(id); this.closeEditModal(); this.renderSettings(); this.renderQuests(); }
  },

  resetQuests() { if (confirm('Сбросить все квесты?')) { QuestEditor.resetToDefaults(); this.renderSettings(); this.renderQuests(); } },

  showLevelUpModal(level) {
    document.getElementById('new-level').textContent = level;
    document.getElementById('stat-points-gained').textContent = Character.getStatPointsForLevel(level);
    this.elements.levelupModal.classList.add('active');
  },

  showRankUpModal(rank) {
    document.getElementById('rankup-icon').textContent = '⚔️';
    document.getElementById('rankup-name').textContent = rank.name;
    document.getElementById('rankup-name').style.color = rank.color;
    document.getElementById('rankup-description').textContent = rank.description;
    if (this.elements.rankupModal) this.elements.rankupModal.classList.add('active');
  },

  renderHistory() {
    const list = document.getElementById('history-list'); if (!list) return;
    list.innerHTML = '';
    const logs = History.getLogs();
    if (logs.length === 0) { list.innerHTML = '<div class="text-center text-muted">История пуста</div>'; return; }
    logs.forEach(log => {
      const item = document.createElement('div'); item.className = `history-item ${log.type}`;
      const date = new Date(log.timestamp);
      item.innerHTML = `<div class="history-details">${log.details}</div><div class="history-time">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
      list.appendChild(item);
    });
  },

  closeModal() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); },
  closeLevelUpModal() { if (this.elements.levelupModal) this.elements.levelupModal.classList.remove('active'); },
  closeRankUpModal() { if (this.elements.rankupModal) this.elements.rankupModal.classList.remove('active'); },
  closeEditModal() { if (this.elements.editQuestModal) this.elements.editQuestModal.classList.remove('active'); },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(r => console.log('SW registered:', r)).catch(e => console.log('SW failed:', e));
      });
    }
  },

  toggleSound() {
    const isMuted = SoundManager.toggleMute();
    const btn = document.getElementById('sound-toggle');
    if (isMuted) { btn.textContent = '🔇'; btn.classList.add('muted'); }
    else { btn.textContent = '🔊'; btn.classList.remove('muted'); SoundManager.play('click'); }
  },

  toggleLanguage() {
    SoundManager.play('click'); const newLang = i18n.toggle();
    document.getElementById('lang-toggle').textContent = newLang === 'ru' ? 'EN' : 'RU';
    this.updateLanguage();
  },

  updateLanguage() {
    const navKeys = ['navProfile', 'navQuests', 'navRewards', 'navHistory'];
    document.querySelectorAll('.nav-item').forEach((item, index) => {
      const label = item.querySelector('.nav-label');
      if (label && navKeys[index]) label.textContent = i18n.t(navKeys[index]);
    });
    document.querySelector('.quest-panel-title').textContent = i18n.t('questTitle');
    document.querySelector('.quest-subtitle').innerHTML = i18n.t('questSubtitle');
    document.querySelector('.quest-goals-title').textContent = i18n.t('questGoals');
    document.querySelector('.warning-banner').innerHTML = i18n.t('questWarning');
    this.renderProfile(); this.renderShop(); this.renderDungeons(); this.renderHistory(); this.renderAchievements();
  },

  buyItem(itemId) {
    const result = Shop.buyItem(itemId);
    if (result.success) {
      SoundManager.play('complete'); this.showNotification('SHOP', result.message, 'success');
      this.renderProfile();
      if (this.elements.keyCount) this.elements.keyCount.textContent = Character.data.keys || 0;
      History.add('SHOP', `Bought item: ${itemId}`); this.checkAchievements();
    } else { SoundManager.play('undo'); this.showNotification('SHOP', result.message, 'error'); }
  },

  checkAchievements() {
    const newUnlocks = Achievements.check();
    if (newUnlocks && newUnlocks.length > 0) {
      newUnlocks.forEach(ach => { setTimeout(() => { SoundManager.play('complete'); this.showNotification(i18n.t('achievementUnlocked'), `${ach.icon} ${ach.title}`, 'success'); }, 500); });
    }
  },

  surrenderRaid() { if (confirm('Вы уверены? Ключ будет потерян.')) { Dungeon.failRaid('Surrendered'); this.renderDungeons(); } },

  showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    const alert = document.createElement('div'); alert.className = `system-alert ${type}`;
    alert.innerHTML = `<div class="system-alert-header"><span class="system-alert-title">SYSTEM</span><span class="system-alert-time">${new Date().toLocaleTimeString()}</span></div><div class="system-alert-body"><strong>${title}</strong><br>${message}</div>`;
    container.appendChild(alert);
    setTimeout(() => { alert.style.animation = 'slideOut 0.3s ease-in forwards'; setTimeout(() => alert.remove(), 300); }, 3000);
  }
};

document.addEventListener('DOMContentLoaded', () => { try { App.init(); } catch (err) { console.error('CRITICAL:', err); App.cacheElements(); App.setupEventListeners(); } });
