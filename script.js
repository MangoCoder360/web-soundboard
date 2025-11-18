function init() {
    var gyros = Cookies.get('gyros');
    if (gyros === undefined) {
        Cookies.set('gyros', 0);
        gyros = 0;
    }
    document.getElementById('gyros-amount').innerText = gyros;
}

function getMoreGyros() {
    var gyros = Cookies.get('gyros');
    if (gyros !== undefined) {
        var randomAmount = Math.floor(Math.random() * 10) + 1;
        gyros = parseInt(gyros) + randomAmount;
        Cookies.set('gyros', gyros);
        document.getElementById('gyros-amount').innerText = gyros;
        document.title = 'you got ' + randomAmount + ' gyros!!!!!';
    }
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

function openSlotsUi() {
    document.getElementById('slots-ui').contentDocument.location.reload(true);
    setTimeout(() => {
        document.getElementById('slots-ui-container').style.display = 'flex';
    }, 80);

    document.title = 'gambling addict';
}

function closeSlotsUi() {
    document.getElementById('slots-ui-container').style.display = 'none';
    init();

    document.title = 'gyros game';
}