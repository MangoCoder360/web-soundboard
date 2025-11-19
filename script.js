function init() {
    var gyros = Cookies.get('gyros');
    if (gyros === undefined) {
        Cookies.set('gyros', 0);
        gyros = 0;
    }
    document.getElementById('gyros-amount').innerText = gyros;
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
            alert('Not enough gyros to pull a new booster pack.');
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

var adInterval;
function openSlotsUi() {
    var shouldShowAd = Math.random() < 0.5; // 50% chance to show ad

    var adVideo = document.getElementById('ad-video');
    document.title = 'gambling addict';

    document.getElementById('slots-ui').contentDocument.location.reload(true);

    if (shouldShowAd) {
        document.getElementById('ad').style.display = 'block';
        adVideo.currentTime = 0;
        adVideo.play();
        adVideo.playbackRate = 2;

        setTimeout(() => {
            document.getElementById('slots-ui-container').style.display = 'flex';
            document.getElementById('ad').style.display = 'none';
            clearInterval(adInterval);
        }, adVideo.duration * 500 + 1000);

        adInterval = setInterval(() => {
            // display seconds remaining in the #ad-header
            var timeRemaining = Math.ceil((adVideo.duration - adVideo.currentTime) / 3);
            document.getElementById('ad-header').innerText = 'UNSKIPPABLE AD - ' + timeRemaining + 's remaining';
        }, 100);
    } else {
        document.getElementById('slots-ui-container').style.display = 'flex';
        playSteamUiSound('deck_ui_show_modal');
        return;
    }
}

function closeSlotsUi() {
    document.getElementById('slots-ui-container').style.display = 'none';
    init();

    document.title = 'gyros game';
    playSteamUiSound('deck_ui_hide_modal');
}

function playSteamUiSound(name) {
    var audio = document.getElementById('ui-sfx-player');
    audio.src = 'https://cdn.reuben.zip/steam-ui-sfx/' + name + '.wav';
    audio.play();
}