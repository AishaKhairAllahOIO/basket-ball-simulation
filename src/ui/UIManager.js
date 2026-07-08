export class UIManager {
  constructor() {
    this.elements = {
      score: document.getElementById("ui-score"),
      attempts: document.getElementById("ui-attempts"),
      made: document.getElementById("ui-made"),
    };

    this.stats = { score: 0, attempts: 0, made: 0 };
  }

  recordAttempt() {
    this.stats.attempts += 1;
    this._updateScoreBoard();
  }

  recordMade(points = 2) {
    this.stats.made += 1;
    this.stats.score += points;
    this._updateScoreBoard();
  }

  _updateScoreBoard() {
    this.elements.score.innerText = this.stats.score
      .toString()
      .padStart(2, "0");
    this.elements.attempts.innerText = this.stats.attempts;
    this.elements.made.innerText = this.stats.made;
  }
}
