/**
 * ARISE - Main Application Module
 */

const App = {
  elements: {},

  init() {
    console.log('ARISE System Initializing...');
    Storage.init(); i18n.init(); Character.init(); Quests.init(); Shadows.init();
    Rewards.init(); Shop.init(); Dungeon.init(); History.init(); Achievements.init();

    // Check daily reward
    this.checkAchievements();
    const dailyStatus = Character.checkDailyLogin();
    if (dailyStatus.canClaim) {
      setTimeout(() => {
        this.showStreakModal();
      }, 1500);
    }

    this.cacheElements(); this.setupEventListeners(); this.renderAll(); this.registerServiceWorker();

    // Auth listeners
    if (window.SupabaseClient) {
      window.addEventListener('arise-password-recovery', () => {
        console.log('Password recovery event received!');
        App.showNewPasswordModal();
      });

      window.SupabaseClient.init();
      window.SupabaseClient.checkSession().then(isLoggedIn => {
        if (!isLoggedIn) {
          App.showAuthModal();
        } else {
          App.showNotification('ARISE!', 'Добро пожаловать, Охотник!', 'success');
        }
      });

      App.checkPasswordRecovery();
    } else {
      console.warn('SupabaseClient not available, running in offline mode');
    }

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
          <div class="quest-item-progress ${isCompleted ? 'completed' : ''}">${progress} / ${quest.target}${i18n.t(quest.unit) || quest.unit || ''}</div>
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

    // Use dynamic asset
    if (Dungeon.getBossAsset) {
      this.elements.bossImage.innerHTML = Dungeon.getBossAsset(raid.rank, raid.currentHp, raid.boss.maxHp);
    } else {
      this.elements.bossImage.innerHTML = raid.boss.image;
    }

    // Boss Speech Bubble Logic
    setTimeout(() => {
      const bubble = document.getElementById('boss-bubble');
      if (bubble) {
        // Critical: Only show if HP is full (Start of fight)
        const isFullHp = Number(raid.currentHp) >= Number(raid.boss.maxHp);

        if (isFullHp) {
          const quote = Dungeon.getBossQuote(raid.rank);
          if (quote) {
            bubble.textContent = quote;
            bubble.classList.add('visible');
          } else {
            bubble.classList.remove('visible');
          }
        } else {
          bubble.classList.remove('visible');
        }
      }
    }, 200);

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

    // Update Surrender/Claim button
    // Ensure we select the button regardless of its current class
    const actionBtn = document.getElementById('raid-action-btn');

    if (actionBtn) {
      // Remove old event listeners by cloning the node
      const newBtn = actionBtn.cloneNode(true);
      actionBtn.parentNode.replaceChild(newBtn, actionBtn);

      if (raid.currentHp <= 0) {
        newBtn.onclick = () => {
          const rewards = Dungeon.claimVictory();
          SoundManager.play('levelup');
          this.showNotification(i18n.t('victory'), `${i18n.t('gained')}: ${rewards.xp} XP, ${rewards.gold} Gold`, 'success');
          History.add('RAID_WIN', `Defeated Boss. Gained ${rewards.gold} G`);
          this.checkAchievements(); this.renderProfile(); this.renderDungeons();
        };
        newBtn.querySelector('span').textContent = "ЗАБРАТЬ НАГРАДУ";
        newBtn.className = "btn btn-primary";
        newBtn.style.opacity = "1";
      } else {
        newBtn.onclick = () => App.surrenderRaid();
        newBtn.querySelector('span').textContent = i18n.t('leaveDungeon');
        newBtn.className = "btn btn-danger";
        newBtn.style.opacity = "1";
      }
    }
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
        // Updated flow: Wait, show boss defeated, then show modal
        this.renderDungeons();
        setTimeout(() => {
          App.showVictoryModal();
        }, 1500);
      } else { this.renderDungeons(); }
    }
  },

  showVictoryModal() {
    const raid = Dungeon.activeRaid;
    if (!raid) return;

    const rank = raid.rank;
    // Calculate rewards (copied logic from claimVictory to show preview)
    const xp = Dungeon.bosses[rank].hp * 2;
    const gold = Dungeon.bosses[rank].hp;

    document.getElementById('victory-boss-name').textContent = raid.boss.name + " DEFEATED";
    document.getElementById('victory-xp').textContent = xp;
    document.getElementById('victory-gold').textContent = gold;

    const btn = document.getElementById('victory-claim-btn');
    btn.onclick = () => {
      const rewards = Dungeon.claimVictory();
      SoundManager.play('levelup');
      App.showNotification(i18n.t('victory'), `${i18n.t('gained')}: ${rewards.xp} XP, ${rewards.gold} Gold`, 'success');
      History.add('RAID_WIN', `Defeated Boss. Gained ${rewards.gold} G`);
      App.checkAchievements(); App.renderProfile(); App.renderDungeons();

      document.getElementById('victory-modal').classList.remove('active');
      SoundManager.play('click');
    };

    document.getElementById('victory-modal').classList.add('active');
    SoundManager.play('complete'); // or victory sound
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
    else {
      [...journal].reverse().forEach(entry => {
        const item = document.createElement('div'); item.className = 'journal-entry';
        item.innerHTML = `<div class="journal-time">${new Date(entry.timestamp).toLocaleString()}</div><div>${entry.details}</div>`;
        this.elements.journalList.appendChild(item);
      });
    }
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
    const navKeys = ['navProfile', 'navQuests', 'navRewards', 'navShop', 'navGates', 'navHistory'];
    document.querySelectorAll('.nav-item').forEach((item, index) => {
      const label = item.querySelector('.nav-label');
      if (label && navKeys[index]) label.textContent = i18n.t(navKeys[index]);
    });
    document.querySelector('.quest-panel-title').textContent = i18n.t('questTitle');
    document.querySelector('.quest-subtitle').innerHTML = i18n.t('questSubtitle');
    document.querySelector('.quest-goals-title').textContent = i18n.t('questGoals');
    document.querySelector('.warning-banner').innerHTML = i18n.t('questWarning');
    document.querySelector('.warning-banner').innerHTML = i18n.t('questWarning');

    // Update IDs for titles
    if (document.getElementById('title-shop')) document.getElementById('title-shop').textContent = i18n.t('shopTitle');
    if (document.getElementById('title-dungeons')) document.getElementById('title-dungeons').textContent = i18n.t('dungeonsTitle');
    if (document.getElementById('title-history')) document.getElementById('title-history').textContent = i18n.t('historyTitle');
    if (document.getElementById('title-achievements')) document.getElementById('title-achievements').textContent = i18n.t('historyAchievements');

    this.renderProfile(); this.renderShop(); this.renderDungeons(); this.renderHistory(); this.renderAchievements();
  },

  buyItem(itemId) {
    if (itemId === 'shadow_extract') {
      const result = Shop.buyItem(itemId);
      if (result.success) {
        const extract = Shadows.extract();
        SoundManager.play('rankup'); // Placeholder sound
        this.showNotification('SHADOW EXTRACTION', `ARISE! You obtained: ${extract.template.name}`, 'success');
        // TODO: Show a proper modal with animation
        this.renderProfile();
        History.add('SHADOW', `Extracted: ${extract.template.name}`);
        this.checkAchievements();
      } else {
        SoundManager.play('undo');
        this.showNotification('SHOP', result.message, 'error');
      }
      return;
    }

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
  },

  // === AUTH METHODS ===
  showAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
  },

  hideAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
  },

  showLoginForm() {
    document.getElementById('auth-form-login').style.display = 'block';
    document.getElementById('auth-form-register').style.display = 'none';
    document.getElementById('auth-form-forgot').style.display = 'none';
    document.getElementById('auth-modal-title').textContent = 'ВХОД В СИСТЕМУ';
  },

  showRegisterForm() {
    document.getElementById('auth-form-login').style.display = 'none';
    document.getElementById('auth-form-register').style.display = 'block';
    document.getElementById('auth-form-forgot').style.display = 'none';
    document.getElementById('auth-modal-title').textContent = 'РЕГИСТРАЦИЯ';
  },

  showForgotPasswordForm() {
    document.getElementById('auth-form-login').style.display = 'none';
    document.getElementById('auth-form-register').style.display = 'none';
    document.getElementById('auth-form-forgot').style.display = 'block';
    document.getElementById('auth-modal-title').textContent = 'ВОССТАНОВЛЕНИЕ';
    document.getElementById('auth-forgot-error').style.display = 'none';
    document.getElementById('auth-forgot-success').style.display = 'none';
  },

  async handleForgotPassword() {
    const email = document.getElementById('auth-forgot-email').value;
    const errorEl = document.getElementById('auth-forgot-error');
    const successEl = document.getElementById('auth-forgot-success');

    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    if (!email) {
      errorEl.textContent = 'Введите email';
      errorEl.style.display = 'block';
      return;
    }

    const result = await SupabaseClient.resetPassword(email);

    if (result.success) {
      successEl.textContent = 'Письмо отправлено! Проверьте папку СПАМ.';
      successEl.style.display = 'block';
      SoundManager.play('complete');
    } else {
      errorEl.textContent = result.error || 'Ошибка отправки';
      errorEl.style.display = 'block';
    }
  },


  async handleLogin() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if (!email || !password) {
      errorEl.textContent = 'Заполните все поля';
      errorEl.style.display = 'block';
      return;
    }

    const result = await SupabaseClient.signIn(email, password);

    if (result.success) {
      localStorage.setItem('arise_user_password', password);
      this.hideAuthModal();
      this.renderAll();
      this.showNotification('ARISE!', 'Добро пожаловать обратно, Охотник!', 'success');
      SoundManager.play('levelup');
    } else {
      errorEl.textContent = result.error || 'Ошибка входа';
      errorEl.style.display = 'block';
    }
  },

  async handleRegister() {
    const hunterName = document.getElementById('auth-hunter-name').value || 'HUNTER';
    const email = document.getElementById('auth-reg-email').value;
    const password = document.getElementById('auth-reg-password').value;
    const errorEl = document.getElementById('auth-reg-error');

    if (!email || !password) {
      errorEl.textContent = 'Заполните все поля';
      errorEl.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      errorEl.textContent = 'Пароль минимум 6 символов';
      errorEl.style.display = 'block';
      return;
    }

    const result = await SupabaseClient.signUp(email, password, hunterName);

    if (result.success) {
      localStorage.setItem('arise_user_password', password);
      this.hideAuthModal();
      this.showNotification('ARISE!', 'Охотник зарегистрирован! Проверьте email для подтверждения.', 'success');
      SoundManager.play('rankup');

    } else {
      errorEl.textContent = result.error || 'Ошибка регистрации';
      errorEl.style.display = 'block';
    }
  },

  async handleLogout() {
    await SupabaseClient.signOut();
    this.showAuthModal();
    this.showNotification('SYSTEM', 'Вы вышли из системы', 'info');
  },

  async syncToCloud() {
    if (SupabaseClient.isLoggedIn()) {
      await SupabaseClient.saveProfile();
    }
  },

  // === ACCOUNT MODAL METHODS ===
  passwordVisible: false,

  showAccountModal() {
    if (!SupabaseClient.isLoggedIn()) {
      this.showAuthModal();
      return;
    }
    this.renderAccountData();
    document.getElementById('account-modal').classList.add('active');
    SoundManager.play('click');
  },

  closeAccountModal() {
    document.getElementById('account-modal').classList.remove('active');
  },

  renderAccountData() {
    const user = SupabaseClient.user;
    const profile = SupabaseClient.profile;

    // Email
    document.getElementById('account-email').textContent = user?.email || '—';

    // Password (from localStorage) - now as input
    const savedPassword = localStorage.getItem('arise_user_password') || '';
    const passwordInput = document.getElementById('account-password');
    passwordInput.value = savedPassword;
    passwordInput.type = 'password';
    this.passwordVisible = false;
    document.getElementById('password-toggle-btn').textContent = '👁️';

    // Nickname
    document.getElementById('account-nickname').value = Character.data.name || 'HUNTER';

    // Registration date
    const createdAt = user?.created_at ? new Date(user.created_at) : null;
    if (createdAt) {
      document.getElementById('account-created').textContent = createdAt.toLocaleDateString();

      // Play time (days since registration)
      const daysSinceReg = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      document.getElementById('account-playtime').textContent = daysSinceReg + ' ' + (i18n.currentLang === 'ru' ? 'дн.' : 'days');
    } else {
      document.getElementById('account-created').textContent = '—';
      document.getElementById('account-playtime').textContent = '—';
    }

    // Stats
    document.getElementById('account-total-xp').textContent = Character.data.totalXp || 0;
    document.getElementById('account-quests').textContent = Quests.getCompletedCount ? Quests.getCompletedCount() : (profile?.quests_completed || 0);
    document.getElementById('account-best-streak').textContent = Character.data.bestStreak || 0;
  },

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('account-password');
    passwordInput.type = this.passwordVisible ? 'text' : 'password';

    const btn = document.getElementById('password-toggle-btn');
    btn.textContent = this.passwordVisible ? '🙈' : '👁️';
    SoundManager.play('click');
  },

  savePassword() {
    const password = document.getElementById('account-password').value;
    if (password) {
      localStorage.setItem('arise_user_password', password);
      this.showNotification('SYSTEM', i18n.currentLang === 'ru' ? 'Пароль сохранён!' : 'Password saved!', 'success');
      SoundManager.play('complete');
    }
  },

  // === STREAK MODAL ===
  showStreakModal() {
    const status = Character.checkDailyLogin();
    const streakDisplay = status.canClaim ? status.streak : Character.data.streak;

    document.getElementById('modal-streak-count').textContent = streakDisplay;

    const grid = document.getElementById('streak-grid');
    grid.innerHTML = '';

    const rewards = [100, 200, 300, 400, 500, 600, 1000];
    const daysStr = i18n.currentLang === 'ru' ? 'День' : 'Day';

    for (let i = 0; i < 7; i++) {
      const dayNum = i + 1;
      const reward = rewards[i];
      const el = document.createElement('div');
      el.className = 'streak-item';

      let stateClass = '';
      if (streakDisplay > dayNum) {
        stateClass = 'claimed';
      } else if (streakDisplay === dayNum) {
        if (status.canClaim) {
          stateClass = 'active';
        } else {
          stateClass = 'active claimed';
        }
      } else if (dayNum === 7 && streakDisplay >= 7) {
        if (status.canClaim) stateClass = 'active';
        else stateClass = 'active claimed';
      }

      if (stateClass) el.className += ` ${stateClass}`;

      el.innerHTML = `
            <div class="streak-day">${daysStr} ${dayNum}</div>
            <div class="streak-icon-small">💰</div>
            <div class="streak-reward">${reward}</div>
        `;
      grid.appendChild(el);
    }

    // Claim Button
    let btnContainer = document.getElementById('streak-claim-container');
    if (!btnContainer) {
      btnContainer = document.createElement('div');
      btnContainer.id = 'streak-claim-container';
      btnContainer.style.marginTop = '20px';
      btnContainer.style.textAlign = 'center';
      grid.parentNode.appendChild(btnContainer);
    }

    if (status.canClaim) {
      btnContainer.innerHTML = `
            <button class="btn btn-primary" onclick="App.claimReward()" style="padding: 15px 40px; font-size: 1.2rem; width: 100%; box-shadow: 0 0 15px var(--color-accent-cyan);">
                ${i18n.currentLang === 'ru' ? 'ЗАБРАТЬ НАГРАДУ' : 'CLAIM REWARD'}
            </button>
        `;
    } else {
      btnContainer.innerHTML = `
            <div style="color: var(--color-accent-green); font-weight: bold; font-family: var(--font-display); font-size: 1.1rem;">
                ✓ ${i18n.currentLang === 'ru' ? 'НАГРАДА ПОЛУЧЕНА' : 'REWARD CLAIMED'}
            </div>
            <div style="color: var(--color-text-secondary); font-size: 0.9rem; margin-top: 5px;">
                ${i18n.currentLang === 'ru' ? 'Приходите завтра!' : 'Come back tomorrow!'}
            </div>
        `;
    }

    document.getElementById('streak-modal').classList.add('active');
    SoundManager.play('click');
  },

  closeStreakModal() {
    document.getElementById('streak-modal').classList.remove('active');
    SoundManager.play('click');
  },

  claimReward() {
    const result = Character.claimDailyReward();
    if (result) {
      SoundManager.play('levelup');
      this.showStreakModal();
      this.renderProfile();

      const msg = i18n.currentLang === 'ru'
        ? `Получено +${result.reward} золота!`
        : `Received +${result.reward} Gold!`;

      this.showNotification('SYSTEM', msg, 'success');
    }
  },

  async saveNickname() {
    const newName = document.getElementById('account-nickname').value.trim() || 'HUNTER';
    Character.data.name = newName;
    Character.save();

    if (SupabaseClient.isLoggedIn()) {
      await SupabaseClient.updateHunterName(newName);
    }

    this.renderProfile();
    this.showNotification('SYSTEM', i18n.currentLang === 'ru' ? 'Никнейм сохранён!' : 'Nickname saved!', 'success');
    SoundManager.play('complete');
  },

  // === PASSWORD RESET METHODS ===
  checkPasswordRecovery() {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      const sb = window.supabase?.createClient ?
        window.supabase.createClient('https://jjxwjgqduyanrhgttkzx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqeHdqZ3FkdXlhbnJoZ3R0a3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTg3NzcsImV4cCI6MjA4NDU5NDc3N30.2bUMrkN8cGdpVgW-q1OVEk9bSDBCQOjGXZ6Fdw2m3aI') : null;

      if (sb) {
        sb.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            this.showNewPasswordModal();
          }
        });
      }

      setTimeout(() => {
        this.showNewPasswordModal();
      }, 1000);
    }
  },

  showNewPasswordModal() {
    document.getElementById('new-password-modal').classList.add('active');
    document.getElementById('new-password-error').style.display = 'none';
    document.getElementById('new-password-input').value = '';
    document.getElementById('new-password-confirm').value = '';
  },

  closeNewPasswordModal() {
    document.getElementById('new-password-modal').classList.remove('active');
    window.history.replaceState(null, '', window.location.pathname);
  },

  async handleSetNewPassword() {
    const password = document.getElementById('new-password-input').value;
    const confirm = document.getElementById('new-password-confirm').value;
    const errorEl = document.getElementById('new-password-error');

    errorEl.style.display = 'none';

    if (!password || !confirm) {
      errorEl.textContent = 'Заполните оба поля';
      errorEl.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      errorEl.textContent = 'Пароль минимум 6 символов';
      errorEl.style.display = 'block';
      return;
    }

    if (password !== confirm) {
      errorEl.textContent = 'Пароли не совпадают';
      errorEl.style.display = 'block';
      return;
    }

    const result = await SupabaseClient.updatePassword(password);

    if (result.success) {
      localStorage.setItem('arise_user_password', password);
      this.closeNewPasswordModal();
      this.showNotification('SYSTEM', 'Пароль успешно изменён!', 'success');
      SoundManager.play('levelup');
    } else {
      errorEl.textContent = result.error || 'Ошибка сохранения';
      errorEl.style.display = 'block';
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    Storage.init(); i18n.init(); Character.init(); Quests.init(); Shadows.init();
    Rewards.init(); Shop.init(); Dungeon.init(); History.init(); Achievements.init();

    // Initialize Supabase and check auth
    let isLoggedIn = false;
    if (window.SupabaseClient) {
      window.addEventListener('arise-password-recovery', () => {
        console.log('Password recovery event received!');
        App.showNewPasswordModal();
      });

      window.SupabaseClient.init();
      isLoggedIn = await window.SupabaseClient.checkSession();
    } else {
      console.warn('SupabaseClient not available, running in offline mode');
    }

    App.cacheElements();
    App.setupEventListeners();
    App.renderAll();
    App.registerServiceWorker();

    if (window.SupabaseClient) {
      App.checkPasswordRecovery();
    }

    if (!isLoggedIn && window.SupabaseClient) {
      App.showAuthModal();
    } else if (isLoggedIn) {
      App.showNotification('ARISE!', 'Добро пожаловать, Охотник!', 'success');

      // Auto-check daily login after brief delay ensuring load
      setTimeout(() => {
        const dailyStatus = Character.checkDailyLogin();
        // If we can claim, show modal
        if (dailyStatus.canClaim) {
          App.showStreakModal();
        }
      }, 1000);
    }
  } catch (err) {
    console.error('CRITICAL:', err);
    App.cacheElements();
    App.setupEventListeners();
  }
});
