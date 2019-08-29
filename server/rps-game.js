

class RpsGame {
    constructor(p1, p2) {
        this._players = [p1, p2];
        this._turns = [null, null];
        this._scores = [0,0];

        this._sendToPlayers('Rock Paper Scissors Starts!');

        this._players.forEach((player, idx) => {
            player.on('turn', (turn) => {
               this._onTurn(idx, turn);
            });
        })
    }

    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('message', msg);
    }

    _sendToPlayers(msg) {
        this._players.forEach((player) => {
            player.emit('message', msg);
        });
    }

    _updateScores(playerIndex) {
        console.log(this);
        const otherIndex = (playerIndex + 1) % 2;
        this._players[playerIndex].emit('you', `You: ${this._scores[playerIndex]} points`);
        this._players[playerIndex].emit('opp', `Opponent: ${this._scores[otherIndex]} points`);
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn;
        this._sendToPlayer(playerIndex, `You selected ${turn}`);

        this._checkGameOver();
    }

    _checkGameOver() {
        const turns = this._turns;

        if (turns[0] && turns[1]) {
            this._sendToPlayers('Game over, ' + turns.join(' : '));
            this._getGameResult();
            this._turns = [null, null];
            this._sendToPlayers('Next Round!!!');
        }
    }

    _getGameResult() {
        const p0 = this._decodeTurn(this._turns[0]);
        const p1 = this._decodeTurn(this._turns[1]);

        const distance = (p1 - p0 + 3) % 3;

        switch (distance) {
            case 0:
                this._sendToPlayers('Draw!');
                break;
            case 1:
                this._sendWinMessage(this._players[0], this._players[1]);
                this._scores[0] += 1;
                break;
            case 2:
                this._sendWinMessage(this._players[1], this._players[0]);
                this._scores[1] += 1;
                break;
        }

        this._players.forEach((player, idx) => this._updateScores(idx));
    }

    _sendWinMessage(winner, loser) {
        winner.emit('message', 'You won!');
        loser.emit('message', 'You lost.');
    }

    _decodeTurn(turn) {
        return ['rock', 'scissors', 'paper'].indexOf(turn);
    }
}

module.exports = RpsGame;