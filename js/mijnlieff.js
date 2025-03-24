class Action {
  constructor(piece, idx) {
    this.piece = piece;
    this.idx = idx;
  }

  toString() {
    let symbol = "";
    if (this.piece === 0 || this.piece === 4) {
      symbol = "Straight";
    } else if (this.piece === 1 || this.piece === 5) {
      symbol = "Diagonal";
    } else if (this.piece === 2 || this.piece === 6) {
      symbol = "Pusher";
    } else if (this.piece === 3 || this.piece === 7) {
      symbol = "Puller";
    }
    return symbol + " " + this.idx;
  }
}
class Game {
  constructor(o) {
    if (o instanceof Game) {
      this.nPlayers = o.nPlayers;
      this.currentTurn = o.currentTurn;
      this.currentPlayer = o.currentPlayer;
      this.winner = o.winner;
      this.board = o.board.slice();
      this.pieces = o.pieces.slice();
      this.lastMove = o.lastMove.slice();
    } else {
      this.nPlayers = 2;
      this.currentTurn = 1;
      this.currentPlayer = 1;
      this.winner = -1;
      this.board = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      this.pieces = [2, 2, 2, 2, 2, 2, 2, 2];
      this.lastMove = [-1, -1];
    }
  }

  copyGame() {
    return new Game(this)
  }

  toString() {
    return "";
  }

  isGameOver() {
    return this.winner >= 0;
  }

  allActions() {
    return this.getPossibleActions(this.currentPlayer);
  }

  doAction(a) {
    let pOppCount = 0;
    let si = this.currentPlayer === 1 ? 4 : 0;
    for (let j = 0; j < 4; j++) {
      if (this.pieces[si + j] > 0) {
        pOppCount++;
      }
    }
    if (a.piece === -1) {
      if (pOppCount > 0) {
        this.lastMove = [-1, -1];
        this.currentTurn++;
        this.currentPlayer = (this.currentPlayer % 2) + 1;
        return;
      } else {
        this.winner = this.getWinner();
        return;
      }
    }
    this.board[a.idx] = a.piece;
    this.pieces[a.piece] -= 1;
    this.lastMove = [a.piece, a.idx];

    if (pOppCount === 0) {
      this.winner = this.getWinner();
      return;
    }

    let pCount = 0;
    for (let j = 0; j < 8; j++) {
      pCount += this.pieces[j];
    }
    if (pCount === 0) {
      this.winner = this.getWinner();
    } else {
      this.currentTurn++;
      this.currentPlayer = (this.currentPlayer % 2) + 1;
    }
  }

  getPossibleCells() {
    var as = [];
    if (this.currentTurn === 1) {
      var firstMove = [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15];
      for (let j = 0; j < firstMove.length; j++) {
        as.push(firstMove[j]);
      }
    } else {
      if (this.lastMove[0] === -1) {
        for (var i = 0; i < this.board.length; i++) {
          if (this.board[i] === -1) {
            as.push(i);
          }
        }
      } else {
        let type = this.lastMove[0] % 4;
        if (type === 0) {
          let x = parseInt(this.lastMove[1] / 4);
          let y = this.lastMove[1] % 4;
          for (let i = 1; i < 4; i++) {
            let nextY = y - i;
            if (nextY >= 0) {
              if (this.board[x * 4 + nextY] === -1) {
                as.push(x * 4 + nextY);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextY = y + i;
            if (nextY < 4) {
              if (this.board[x * 4 + nextY] === -1) {
                as.push(x * 4 + nextY);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            if (nextX >= 0) {
              if (this.board[nextX * 4 + y] === -1) {
                as.push(nextX * 4 + y);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            if (nextX < 4) {
              if (this.board[nextX * 4 + y] === -1) {
                as.push(nextX * 4 + y);
              }
            } else {
              break;
            }
          }
        } else if (type === 1) {
          let x = parseInt(this.lastMove[1] / 4);
          let y = this.lastMove[1] % 4;
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            let nextY = y - i;
            if (nextX >= 0 && nextY >= 0) {
              if (this.board[nextX * 4 + nextY] === -1) {
                as.push(nextX * 4 + nextY);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            let nextY = y + i;
            if (nextX >= 0 && nextY < 4) {
              if (this.board[nextX * 4 + nextY] === -1) {
                as.push(nextX * 4 + nextY);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            let nextY = y - i;
            if (nextX < 4 && nextY >= 0) {
              if (this.board[nextX * 4 + nextY] === -1) {
                as.push(nextX * 4 + nextY);
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            let nextY = y + i;
            if (nextX < 4 && nextY < 4) {
              if (this.board[nextX * 4 + nextY] === -1) {
                as.push(nextX * 4 + nextY);
              }
            } else {
              break;
            }
          }
        } else if (type === 2) {
          for (let i = 0; i < 16; i++) {
            if (this.board[i] === -1) {
              let x = parseInt(i / 4);
              let y = i % 4;
              let lastX = parseInt(this.lastMove[1] / 4);
              let lastY = this.lastMove[1] % 4;
              let offsetX = Math.abs(x - lastX);
              let offsetY = Math.abs(y - lastY);
              if (offsetX > 1 || offsetY > 1) {
                as.push(i);
              }
            }
          }
        } else if (type === 3) {
          for (let i = 0; i < 16; i++) {
            if (this.board[i] === -1) {
              let x = parseInt(i / 4);
              let y = i % 4;
              let lastX = parseInt(this.lastMove[1] / 4);
              let lastY = this.lastMove[1] % 4;
              let offsetX = Math.abs(x - lastX);
              let offsetY = Math.abs(y - lastY);
              if (offsetX <= 1 && offsetY <= 1) {
                as.push(i);
              }
            }
          }
        }
      }
    };
    return as;
  }

  getPossibleActions(side) {
    var as = [];
    let si = side === 1 ? 0 : 4;
    if (this.currentTurn === 1) {
      var firstMove = [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < firstMove.length; j++) {
          as.push(new Action(i, firstMove[j]));
        }
      }
    } else {
      if (this.lastMove[0] === -1) {
        for (var i = 0; i < this.board.length; i++) {
          if (this.board[i] === -1) {
            for (let j = 0; j < 4; j++) {
              if (this.pieces[si + j] > 0) {
                as.push(new Action(si + j, i));
              }
            }
          }
        }
      } else {
        let type = this.lastMove[0] % 4;
        if (type === 0) {
          let x = parseInt(this.lastMove[1] / 4);
          let y = this.lastMove[1] % 4;
          for (let i = 1; i < 4; i++) {
            let nextY = y - i;
            if (nextY >= 0) {
              if (this.board[x * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, x * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextY = y + i;
            if (nextY < 4) {
              if (this.board[x * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, x * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            if (nextX >= 0) {
              if (this.board[nextX * 4 + y] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + y));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            if (nextX < 4) {
              if (this.board[nextX * 4 + y] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + y));
                  }
                }
              }
            } else {
              break;
            }
          }
        } else if (type === 1) {
          let x = parseInt(this.lastMove[1] / 4);
          let y = this.lastMove[1] % 4;
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            let nextY = y - i;
            if (nextX >= 0 && nextY >= 0) {
              if (this.board[nextX * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x - i;
            let nextY = y + i;
            if (nextX >= 0 && nextY < 4) {
              if (this.board[nextX * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            let nextY = y - i;
            if (nextX < 4 && nextY >= 0) {
              if (this.board[nextX * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
          for (let i = 1; i < 4; i++) {
            let nextX = x + i;
            let nextY = y + i;
            if (nextX < 4 && nextY < 4) {
              if (this.board[nextX * 4 + nextY] === -1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, nextX * 4 + nextY));
                  }
                }
              }
            } else {
              break;
            }
          }
        } else if (type === 2) {
          for (let i = 0; i < 16; i++) {
            if (this.board[i] === -1) {
              let x = parseInt(i / 4);
              let y = i % 4;
              let lastX = parseInt(this.lastMove[1] / 4);
              let lastY = this.lastMove[1] % 4;
              let offsetX = Math.abs(x - lastX);
              let offsetY = Math.abs(y - lastY);
              if (offsetX > 1 || offsetY > 1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, i));
                  }
                }
              }
            }
          }
        } else if (type === 3) {
          for (let i = 0; i < 16; i++) {
            if (this.board[i] === -1) {
              let x = parseInt(i / 4);
              let y = i % 4;
              let lastX = parseInt(this.lastMove[1] / 4);
              let lastY = this.lastMove[1] % 4;
              let offsetX = Math.abs(x - lastX);
              let offsetY = Math.abs(y - lastY);
              if (offsetX <= 1 && offsetY <= 1) {
                for (let j = 0; j < 4; j++) {
                  if (this.pieces[si + j] > 0) {
                    as.push(new Action(si + j, i));
                  }
                }
              }
            }
          }
        }
        if (as.length === 0) {
          let pCount = [0, 0];
          for (let i = 0; i < 4; i++) {
            if (this.pieces[i] > 0) {
              pCount[0]++;
            }
            if (this.pieces[4 + i] > 0) {
              pCount[1]++;
            }
          }
          if (pCount[(side + 1) % 2] > 0) {
            as.push(new Action(-1, -1));
          }
        }
      }
    };
    return as;
  }

  getWinner() {
    let winner = 0;
    let score = [0, 0];
    let lines3 = [
      [1, 6, 11], [4, 9, 14], [2, 5, 8], [7, 10, 13]
    ];
    let lines43 = [
      [0, 1, 2, 3], [0, 1, 2], [1, 2, 3],
      [4, 5, 6, 7], [4, 5, 6], [5, 6, 7],
      [8, 9, 10, 11], [8, 9, 10], [9, 10, 11],
      [12, 13, 14, 15], [12, 13, 14], [13, 14, 15],
      [0, 4, 8, 12], [0, 4, 8], [4, 8, 12],
      [1, 5, 9, 13], [1, 5, 9], [5, 9, 13],
      [2, 6, 10, 14], [2, 6, 10], [6, 10, 14],
      [3, 7, 11, 15], [3, 7, 11], [7, 11, 15],
      [0, 5, 10, 15], [0, 5, 10], [5, 10, 15],
      [3, 6, 9, 12], [3, 6, 9], [6, 9, 12],
    ];
    for (let i = 0; i < lines43.length; i += 3) {
      let l4 = lines43[i];
      if (this.board[l4[0]] > -1 && this.board[l4[1]] > -1 && this.board[l4[2]] > -1 && this.board[l4[3]] > -1 &&
        parseInt(this.board[l4[0]] / 4) === parseInt(this.board[l4[1]] / 4) &&
        parseInt(this.board[l4[0]] / 4) === parseInt(this.board[l4[2]] / 4) &&
        parseInt(this.board[l4[0]] / 4) === parseInt(this.board[l4[3]] / 4)) {
        score[parseInt(this.board[l4[0]] / 4)] += 2;
      } else {
        let l31 = lines43[i + 1];
        if (this.board[l31[0]] > -1 && this.board[l31[1]] > -1 && this.board[l31[2]] > -1 &&
          parseInt(this.board[l31[0]] / 4) === parseInt(this.board[l31[1]] / 4) &&
          parseInt(this.board[l31[0]] / 4) === parseInt(this.board[l31[2]] / 4)) {
          score[parseInt(this.board[l31[0]] / 4)] += 1;
        }
        let l32 = lines43[i + 2];
        if (this.board[l32[0]] > -1 && this.board[l32[1]] > -1 && this.board[l32[2]] > -1 &&
          parseInt(this.board[l32[0]] / 4) === parseInt(this.board[l32[1]] / 4) &&
          parseInt(this.board[l32[0]] / 4) === parseInt(this.board[l32[2]] / 4)) {
          score[parseInt(this.board[l32[0]] / 4)] += 1;
        }
      }
    }
    for (let i = 0; i < lines3.length; i++) {
      let l3 = lines3[i];
      if (this.board[l3[0]] > -1 && this.board[l3[1]] > -1 && this.board[l3[2]] > -1 &&
        parseInt(this.board[l3[0]] / 4) === parseInt(this.board[l3[1]] / 4) &&
        parseInt(this.board[l3[0]] / 4) === parseInt(this.board[l3[2]] / 4)) {
        score[parseInt(this.board[l3[0]] / 4)] += 1;
      }
    }

    if (score[0] > score[1]) {
      winner = 1;
    } else if (score[0] < score[1]) {
      winner = 2;
    }

    return winner;
  }
}
class MCTSNode {
  constructor(g, a) {
    this.player = g.currentPlayer;
    this.action = a;
    this.count = 0;
    this.values = new Array(g.nPlayers).fill(0.0);
    this.children = null;

    this.cumSearchDepth = 0;
    this.cumGameDepth = 0;
  }

  toString() {
    return this.action.toString() + "  " + ((1.0 * this.values[this.player - 1]) / this.count).toFixed(2) + "  (" + this.values[this.player - 1] + "/" + this.count + ")";
  }

  selectChild(c) {
    let sa = null;
    let sv;
    for (let i = 0; i < this.children.length; i++) {
      const a = this.children[i];
      const v = (1.0 * a.values[a.player - 1]) / (1 + a.count) + c * Math.sqrt(Math.log(1 + this.count) / (1 + a.count)) + Math.random() * 1e-6;
      if (sa == null || v > sv) {
        sa = a;
        sv = v;
      }
    }
    return sa;
  }

  updateValues(rewards) {
    this.count++;
    for (let i = 0; i < this.values.length; i++) {
      this.values[i] += rewards[i];
    }
  }
}
class MCTSPlayer {
  constructor(config) {
    this.nTrials = config.nTrials;
    this.c = config.c === undefined ? 1.0 : config.c;
    this.rewardsFunc = config.rewardsFunc === undefined ?
      (g) => {
        if (g.winner > 0) {
          const rewards = new Array(g.nPlayers).fill(0.0);
          if (g.winner <= g.nPlayers) {
            rewards[g.winner - 1] = 1.0;
          }
          return rewards;
        } else {
          return new Array(g.nPlayers).fill(0.5);
        }
      } : config.rewardsFunc;
  }

  startThinking(g, nt) {
    const state = {
      game: g,
      turn: g.currentTurn,
      root: new MCTSNode(g, null),
      best: null,
      time: 0,
      avgSearchDepth: 0,
      avgGameDepth: 0,
      avgBranchingFactor: 0
    };

    const root = state.root;
    root.cumSearchDepth = 0;
    root.cumGameDepth = 0;
    root.parentNodeCount = 0;
    root.totalNodeCount = 1;

    if (!root.children) {
      root.children = g.allActions().map(a => new MCTSNode(g, a));
      root.parentNodeCount += 1;
      root.totalNodeCount += root.children.length;
    }

    const t0 = root.count;
    const t1 = Math.min(this.nTrials, root.count + nt);
    const time0 = Date.now();

    for (let t = t0; t < t1; t++) {
      let tg = g.copyGame();
      const vns = [root];

      let n = root.selectChild(this.c);
      vns.push(n);
      tg.doAction(n.action);
      let depth = 1;

      while (!tg.isGameOver() && n.children) {
        n = n.selectChild(this.c);
        vns.push(n);
        tg.doAction(n.action);
        depth += 1;
      }

      if (!tg.isGameOver()) {
        n.children = tg.allActions().map(a => new MCTSNode(tg, a));
        root.parentNodeCount += 1;
        root.totalNodeCount += n.children.length;
        n = n.selectChild(this.c);
        vns.push(n);
        tg.doAction(n.action);
        depth += 1;
      }

      const searchDepth = depth;

      while (!tg.isGameOver()) {
        const rp_as = tg.allActions();
        root.parentNodeCount += 1;
        root.totalNodeCount += rp_as.length;
        const rp_a = rp_as[Math.floor(Math.random() * rp_as.length)];
        tg.doAction(rp_a);
        depth += 1;
      }

      const gameDepth = depth;

      const rewards = this.rewardsFunc(tg);
      vns.forEach(node => node.updateValues(rewards));

      root.cumSearchDepth += searchDepth;
      root.cumGameDepth += gameDepth;
    }

    state.time += Date.now() - time0;

    if (root.count > 0) {
      state.avgSearchDepth = (1.0 * root.cumSearchDepth) / root.count;
      state.avgGameDepth = (1.0 * root.cumGameDepth) / root.count;
      state.avgBranchingFactor = (1.0 * (root.totalNodeCount - 1)) / root.parentNodeCount;
    }

    if (root.children.length > 0) {
      state.best = root.selectChild(0);
    }

    if (this.searchCallback) {
      this.searchCallback(state);
    }

    return state;
  }
}