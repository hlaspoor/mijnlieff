var maxTrials = 200000;
var g, p;
var selectedPiece = null;

var audioContext = null;
var pickupBuffer = null;
var dropBuffer = null;
var gameOverBuffer = null;

function throttle(fn, delay) {
    if (fn._id) {
        clearTimeout(fn._id);
    }
    fn._id = window.setTimeout(() => {
        fn();
        fn._id = null;
    }, delay);
}

function loadSound(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer));
}

function playSound(buffer) {
    if (!buffer) return;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

$(() => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadSound('sounds/pickup.mp3').then(buffer => pickupBuffer = buffer);
    loadSound('sounds/drop.mp3').then(buffer => dropBuffer = buffer);
    loadSound('sounds/gameover.mp3').then(buffer => gameOverBuffer = buffer);

    $(document).on('keyup', (e) => {
        if (e.keyCode === 32 || e.key === ' ') {
            e.preventDefault();
            if (!g.isGameOver()) {
                startThinking();
            }
        }
    });

    newGame();
});

function newGame() {
    g = new Game();
    p = new MCTSPlayer({ nTrials: maxTrials, c: 1.414 });
    p.searchCallback = function (state) {
        if (state.best) {
            g.doAction(state.best.action);
            renderBoard();
            if (!g.isGameOver()) {
                $("#msg").html((g.currentPlayer === 1 ? "Blue" : "Red") + "'s turn to move.");
                renderHints();
                playSound(dropBuffer);
            } else {
                showGameOver();
            }
        }
    };

    $("#msg").html("Blue's turn to move.");

    if (selectedPiece !== null) {
        selectedPiece.removeClass('selected');
        selectedPiece = null;
    }
    renderBoard();
    renderHints();
}

function showGameOver() {
    $("#msg").html("Game over, " + (g.winner === 1 ? "Blue wins!" : (g.winner === 2 ? "Red wins!" : "Draw!")));
    playSound(gameOverBuffer);
}

function renderHints() {
    $('.dot-indicator').remove();
    $('.has-dot').removeClass('has-dot');

    let cells = g.getPossibleCells();
    for (let i = 0; i < 16; i++) {
        $("#c" + i).off("click");
    }
    if (cells.length > 0) {
        cells.forEach(cell => {
            const dot = $('<div>').addClass('dot-indicator');
            dot.css('background-color', g.currentPlayer === 2 ? '#da0016' : '#2c69a9');
            $("#c" + cell).append(dot);
            $("#c" + cell).addClass('has-dot');
            $("#c" + cell).on("click", () => {
                if (selectedPiece !== null) {
                    g.doAction({ piece: parseInt(selectedPiece.attr("id").substring(1)), idx: cell });
                    selectedPiece.removeClass('selected');
                    selectedPiece = null;

                    playSound(dropBuffer);

                    renderBoard();
                    renderHints();
                    if (g.isGameOver()) {
                        showGameOver();
                    } else {
                        $("#msg").html((g.currentPlayer === 1 ? "Blue" : "Red") + "'s turn to move.");
                    }
                }
            });
        });
    } else {
        if (!g.isGameOver()) {
            g.doAction({ piece: -1, idx: -1 });
            renderBoard();
            renderHints();
            if (g.isGameOver()) {
                showGameOver();
            } else {
                $("#msg").html((g.currentPlayer === 1 ? "Blue" : "Red") + "'s turn to move.");
            }
        } else {
            showGameOver();
        }
    }
}

function renderBoard() {
    let b = g.board;
    for (let i = 0; i < 16; i++) {
        $("#c" + i).empty();
        if (b[i] === 0) {
            $("#c" + i).append('<div class="blue-square plus-mark"></div>');
        } else if (b[i] === 1) {
            $("#c" + i).append('<div class="blue-square x-mark"></div>');
        } else if (b[i] === 2) {
            $("#c" + i).append('<div class="blue-square big-circle-mark"></div>');
        } else if (b[i] === 3) {
            $("#c" + i).append('<div class="blue-square circle-mark"></div>');
        } else if (b[i] === 4) {
            $("#c" + i).append('<div class="red-square plus-mark"></div>');
        } else if (b[i] === 5) {
            $("#c" + i).append('<div class="red-square x-mark"></div>');
        } else if (b[i] === 6) {
            $("#c" + i).append('<div class="red-square big-circle-mark"></div>');
        } else if (b[i] === 7) {
            $("#c" + i).append('<div class="red-square circle-mark"></div>');
        }
    }

    let si = g.currentPlayer === 1 ? 0 : 4;
    for (let i = 0; i < 8; i++) {
        $("#p" + i).css("cursor", "default");
        $("#p" + i).off("click");
        if (i >= si && i < si + 4 && g.pieces[i] > 0 && !g.isGameOver()) {
            $("#p" + i).css("cursor", "pointer");
            $("#p" + i).on("click", () => {
                if (selectedPiece !== null) {
                    let id = parseInt(selectedPiece.attr("id").substring(1));
                    if (id === i) {
                        selectedPiece.removeClass('selected');
                        selectedPiece = null;
                    } else {
                        selectedPiece.removeClass('selected');
                        selectedPiece = $("#p" + i);
                        selectedPiece.addClass('selected');

                        playSound(pickupBuffer);
                    }
                } else {
                    selectedPiece = $("#p" + i);
                    selectedPiece.addClass('selected');

                    playSound(pickupBuffer);
                }
            });
        }
        $("#p" + i + "> .number-indicator").html(g.pieces[i]);
        if (g.pieces[i] == 0) {
            $("#p" + i + "> .blue-square").css("display", "none");
            $("#p" + i + "> .red-square").css("display", "none");
            $("#p" + i + "> .number-indicator").css("display", "none");
        } else {
            $("#p" + i + "> .blue-square").css("display", "block");
            $("#p" + i + "> .red-square").css("display", "block");
            $("#p" + i + "> .number-indicator").css("display", "block");
        }
    }
}

function doThinking() {
    g.currentActions = g.allActions();
    if (!g.isGameOver()) {
        p.startThinking(g, maxTrials);
    } else {
        showGameOver();
    }
}

function startThinking() {
    $("#msg").html("Thinking...");
    throttle(doThinking, 500);
}
