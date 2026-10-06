function init() {
    var gyros = Cookies.get('gyros');
    if (gyros === undefined) {
        Cookies.set('gyros', 0);
        gyros = 0;
    }
    document.getElementById('gyros-amount').innerText = gyros;
}

function playSound(source, button) {
    const SOUND_COST = 5;
    var gyros = Cookies.get('gyros');

    if (gyros !== undefined) {
        gyros = parseInt(gyros);
        if (gyros < SOUND_COST) {
            alert('Not enough gyros to play this sound.');
            return;
        } else {
            gyros -= SOUND_COST;
            Cookies.set('gyros', gyros);
            document.getElementById('gyros-amount').innerText = gyros;
        }
    }

    var audio = new Audio(source);
    var activeSounds = Number(button.dataset.activeSounds || 0) + 1;
    var hasFinished = false;

    button.dataset.activeSounds = activeSounds;
    button.classList.add('is-playing');

    function finishSound() {
        if (hasFinished) {
            return;
        }
        hasFinished = true;
        activeSounds = Number(button.dataset.activeSounds || 1) - 1;
        if (activeSounds <= 0) {
            delete button.dataset.activeSounds;
            button.classList.remove('is-playing');
        } else {
            button.dataset.activeSounds = activeSounds;
        }
    }

    audio.addEventListener('ended', finishSound, { once: true });
    audio.addEventListener('error', finishSound, { once: true });
    audio.play().catch(finishSound);
}

function getMoreGyros() {
    playSteamUiSound('deck_ui_launch_game');
    document.body.style.display = 'none';
    Cookies.set('minigame-allowed', "true");
    setTimeout(() => {
        window.open("/minigames/balls-game.html");
    }, 500);
}

function pullNewBoosterPack() {
    var gyros = Cookies.get('gyros');
    if (gyros !== undefined) {
        gyros = parseInt(gyros);
        if (gyros >= 50) {
            gyros -= 50;
            Cookies.set('gyros', gyros);
            document.getElementById('gyros-amount').innerText = gyros;
            //alert('You pulled a new booster pack!');
            //addToInventory();
        } else {
            alert('Not enough gyros to pull a booster pack.');
        }
    }
}

function addToInventory() {
    var inventory = Cookies.get('inventory');
    if (inventory === undefined) {
        inventory = [];
    } else {
        inventory = JSON.parse(inventory);
    }
    inventory.push('booster pack');
    Cookies.set('inventory', JSON.stringify(inventory));
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    var inventory = Cookies.get('inventory');
    if (inventory !== undefined) {
        inventory = JSON.parse(inventory);
        var inventoryDiv = document.getElementById('inventory');
        inventoryDiv.innerHTML = '';
        inventory.forEach(function(item) {
            var itemDiv = document.createElement('div');
            itemDiv.innerText = item;
            inventoryDiv.appendChild(itemDiv);
        });
    }
}

const AD_OPTIONS = ["biohazard.mp4", "death.mp4", "experiment.mp4", "gaslighting.mp4", "hole.mp4", "lizard.mp4", "marathon.mp4", "monster.mp4", "watermelon.mp4"];
var adInterval;
function openSlotsUi() {
    var shouldShowAd = Math.random() < 0.5; // chance to show ad

    document.title = 'gambling addict';

    document.getElementById('slots-ui').contentDocument.location.reload(true);

    if (shouldShowAd) {
        var selectedAd = AD_OPTIONS[Math.floor(Math.random() * AD_OPTIONS.length)];
        
        showAdvertisement(selectedAd, 'UNSKIPPABLE AD');
    } else {
        playSteamUiSound('deck_ui_show_modal');
    }

    document.getElementById('slots-ui-container').style.display = 'flex';
}

function closeSlotsUi() {
    document.getElementById('slots-ui-container').style.display = 'none'; 
    init();

    document.title = 'gyros game';
    playSteamUiSound('deck_ui_hide_modal');
    
    //showAdvertisement('the_end.mp4', 'GOODBYE');
}

function playSteamUiSound(name) {
    var audio = document.getElementById('ui-sfx-player');
    audio.src = 'https://cdn.reuben.zip/steam-ui-sfx/' + name + '.wav';
    audio.play();
}

function showAdvertisement(videoFilename, headerText) {
    var adVideo = document.getElementById('ad-video');
    adVideo.src = '/videos/' + videoFilename;
    document.getElementById('ad').style.display = 'block';
    adVideo.currentTime = 0;
    adVideo.play();
    adVideo.playbackRate = 2;

    setTimeout(() => {
        setTimeout(() => {
            document.getElementById('ad').style.display = 'none';
            clearInterval(adInterval);
        }, adVideo.duration * 500 - 2000);
    }, 3000);

    adInterval = setInterval(() => {
        // display seconds remaining in #ad-header
        var timeRemaining = Math.ceil((adVideo.duration - adVideo.currentTime) / 3);
        document.getElementById('ad-header').innerText = headerText + ' - ' + timeRemaining + 's remaining';
    }, 100);
}