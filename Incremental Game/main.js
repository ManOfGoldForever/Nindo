var gameData = {
  bamboo: 0,
  bambooPerClick: 1,
  bambooPerClickCost: 10,
  processedBamboo: 0,
  yen: 0,
  yenPerSamurai: 100,
  samuraiCount: 0,
  sharpenSwordLevel: 1,
  farmerLevel: 0,
  carpenterLevel: 0,
  managerCount: 0,
  managerSaleLimit: 1,
  lastTick: Date.now(),
  lastSave: Date.now(), // Track last save time
  saveInterval: 15000, // Auto-save every 15 seconds
  formatType: 'default'
};

function update(id, content) {
  let element = document.getElementById(id);
  if (element) {
    element.innerHTML = content;
  }
}

function sliceBamboo() {
  gameData.bamboo += gameData.bambooPerClick;
  updateUI();
}

function sharpenSword() {
  if (gameData.bamboo >= gameData.bambooPerClickCost) {
    gameData.bamboo -= gameData.bambooPerClickCost;
    gameData.bambooPerClick += 1;
    gameData.sharpenSwordLevel += 1;
    gameData.bambooPerClickCost *= 2;
    updateUI();
  }
}

function processBamboo() {
  if (gameData.bamboo >= 10) {
    gameData.bamboo -= 10;
    gameData.processedBamboo += 1;
    updateUI();
  }
}

function sellBamboo() {
  if (gameData.processedBamboo > 0) {
    gameData.yen += gameData.processedBamboo * 5; // 5 yen per processed bamboo
    gameData.processedBamboo = 0; // Reset processed bamboo after selling
    updateUI();
  }
}

function hireSamurai() {
  if (gameData.yen >= gameData.yenPerSamurai) {
    gameData.yen -= gameData.yenPerSamurai;
    gameData.samuraiCount += 1;
    gameData.yenPerSamurai *= 2;
    updateUI();
  }
}

function hireFarmer() {
  if (gameData.yen >= 200) {
    gameData.yen -= 200;
    gameData.farmerLevel += 1;
    updateUI();
  }
}

function hireCarpenter() {
  if (gameData.yen >= 300) {
    gameData.yen -= 300;
    gameData.carpenterLevel += 1;
    updateUI();
  }
}

function hireManager() {
  if (gameData.yen >= 500) {
    gameData.yen -= 500;
    gameData.managerCount += 1;
    gameData.managerSaleLimit = gameData.managerCount;
    if (gameData.managerCount === 1) {
      startAutoSelling();
    }
    updateUI();
  }
}

function startAutoSelling() {
  setInterval(() => {
    if (gameData.processedBamboo > 0) {
      let sellAmount = Math.min(gameData.processedBamboo, gameData.managerSaleLimit);
      gameData.yen += sellAmount * 5;
      gameData.processedBamboo -= sellAmount;
      updateUI();
    }
  }, 1000); // Auto-sell every second
}

function saveGame() {
  localStorage.setItem('nindoSave', JSON.stringify(gameData));
}

function loadGame() {
  var saveGame = JSON.parse(localStorage.getItem('nindoSave'));
  if (saveGame) {
    gameData = Object.assign(gameData, saveGame);
    updateUI();
    if (gameData.managerCount > 0) {
      startAutoSelling();
    }
  }
}

function format(number) {
  switch (gameData.formatType) {
    case "scientific":
      return number.toExponential(2);
    case "engineering":
      return number.toPrecision(3);
    default:
      return number.toLocaleString();
  }
}

function tab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}

function resetGame() {
  if (confirm("Are you sure you want to reset your game?")) {
    localStorage.removeItem('nindoSave');
    gameData = {
      bamboo: 0,
      bambooPerClick: 1,
      bambooPerClickCost: 10,
      processedBamboo: 0,
      yen: 0,
      yenPerSamurai: 100,
      samuraiCount: 0,
      sharpenSwordLevel: 1,
      farmerLevel: 0,
      carpenterLevel: 0,
      managerCount: 0,
      managerSaleLimit: 1, 
      lastTick: Date.now(),
      lastSave: Date.now(),
      saveInterval: 15000,
      formatType: 'default'
    };
    updateUI();
  }
}

function updateUI() {
  update("bambooCollected", format(gameData.bamboo) + " Bamboo Collected");
  update("bambooProcessed", format(gameData.processedBamboo) + " Bamboo Processed");
  update("yenEarned", format(gameData.yen) + " Yen Earned");
  update("sharpenSwordUpgrade", "Sharpen Sword: Level " + gameData.sharpenSwordLevel);
  update("samuraiStatus", "Samurai: Level " + gameData.samuraiCount); // Added Samurai status
  update("farmerStatus", "Farmer: Level " + gameData.farmerLevel);
  update("carpenterStatus", "Carpenter: Level " + gameData.carpenterLevel);
  update("managerCount", "Managers: " + gameData.managerCount);
}

function autoSaveTimerUpdate() {
  const timeLeft = Math.max(0, gameData.saveInterval - (Date.now() - gameData.lastSave));
  const seconds = Math.floor(timeLeft / 1000);
  update("autoSaveTimer", `Next Auto-Save In: ${seconds.toString().padStart(2, '0')}:00`);
}

function autoSave() {
  if (Date.now() - gameData.lastSave >= gameData.saveInterval) {
    saveGame();
    gameData.lastSave = Date.now();
  }
}

setInterval(() => {
  autoSave();
  autoSaveTimerUpdate();
}, 1000);

window.onload = function () {
  loadGame();
  tab('bambooCollectionMenu'); // Show the bamboo collection menu by default
};
