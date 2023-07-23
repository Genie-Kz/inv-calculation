{
  let individualValueInput = document.querySelector(".input-area");
  let explanationContainer = document.querySelector(".explanation");

  individualValueInput.addEventListener("change", function (e) {
    //個体値入力欄が変更された場合にのみ処理を実行
    if (e.target.type !== "number") {
      return;
    }

    let hp = document.querySelector('input[name="hp"]');
    let mp = document.querySelector('input[name="mp"]');
    let attack = document.querySelector('input[name="attack"]');
    let defense = document.querySelector('input[name="defense"]');
    let speed = document.querySelector('input[name="speed"]');
    let wisdom = document.querySelector('input[name="wisdom"]');



    let currentInv = new IndividualValue(
      hp.value,
      mp.value,
      attack.value,
      defense.value,
      speed.value,
      wisdom.value
    );
    currentInv.normalize();

    let correctedHp = document.querySelector('td.correction-value[data-stats="hp"]');
    let correctedMp = document.querySelector('td.correction-value[data-stats="mp"]');
    let correctedAttack = document.querySelector('td.correction-value[data-stats="attack"]');
    let correctedDefense = document.querySelector('td.correction-value[data-stats="defense"]');
    let correctedSpeed = document.querySelector('td.correction-value[data-stats="speed"]');
    let correctedWisdom = document.querySelector('td.correction-value[data-stats="wisdom"]');

    correctedHp.textContent = currentInv.hp;
    correctedMp.textContent = currentInv.mp;
    correctedAttack.textContent = currentInv.attack;
    correctedDefense.textContent = currentInv.defense;
    correctedSpeed.textContent = currentInv.speed;
    correctedWisdom.textContent = currentInv.wisdom;

  });

  class IndividualValue {
    static get MAX_INV_VALUE() {
      return 100;
    }
    static get MIN_INV_VALUE() {
      return -100;
    }

    invStrings = ['HP', 'MP', '攻撃力', '守備力', '素早さ', '賢さ'];
    highInvShortStrings = ['H', 'M', 'A', 'D', 'S', 'W'];
    lowInvShortStrings = ['h', 'm', 'a', 'd', 's', 'w'];

    constructor(hp, mp, attack, defense, speed, wisdom) {
      this.individualValues = [
        Number.parseInt(hp) || 0,
        Number.parseInt(mp) || 0,
        Number.parseInt(attack) || 0,
        Number.parseInt(defense) || 0,
        Number.parseInt(speed) || 0,
        Number.parseInt(wisdom) || 0,
      ];
    }

    addList(message) {
      let aExplanation = document.createElement('li');
      aExplanation.innerHTML = message;
      explanationContainer.appendChild(aExplanation);
    }

    clearList() {
      while (explanationContainer.firstChild) {
        explanationContainer.firstChild.remove();
      }
    }

    normalize() {
      this.clearList();

      this.addList(`個体値の合計は${this.totalIndividualValue}です。`)

      if (this.totalIndividualValue === 0) {
        this.addList(`個体値の合計が0のため個体値補正はありません。`);
        return;
      }
      while (this.totalIndividualValue !== 0) {
        let preTotal = this.totalIndividualValue;
        if (this.totalIndividualValue > 0) {
          let max = this.individualValues.reduce((result, elem) =>
            Math.max(result, elem)
          );
          let maxInvIndex = this.individualValues.findIndex(
            (val) => val == max
          );

          let highestInv = this.invStrings[maxInvIndex];

          if (
            this.individualValues[maxInvIndex] - this.totalIndividualValue >=
            IndividualValue.MIN_INV_VALUE
          ) {
            this.individualValues[maxInvIndex] -= this.totalIndividualValue;
            this.addList(`最も個体値が高く個体値補正を受ける優先度の高い${highestInv}の個体値から${preTotal}を引き個体値が<br>${this.toString()}になります。`);
          } else {
            let correction = this.individualValues[maxInvIndex] + 100
            this.individualValues[maxInvIndex] = IndividualValue.MIN_INV_VALUE;
            this.addList(`最も個体値が高く個体値補正を受ける優先度の高い${highestInv}から個体値から${preTotal}を引くと-100を下回ってしまうため、-100になるように${correction}引き、個体値が<br>${this.toString()}になります。`);
            debugger;
          }
        } else {
          let min = this.individualValues.reduce((result, elem) =>
            Math.min(result, elem)
          );
          let minInvIndex = this.individualValues.findIndex(
            (val) => val == min
          );

          let lowestInv = this.invStrings[minInvIndex];

          if (
            this.individualValues[minInvIndex] - this.totalIndividualValue <=
            IndividualValue.MAX_INV_VALUE
          ) {
            this.individualValues[minInvIndex] -= this.totalIndividualValue;
            this.addList(`最も個体値が低く個体値補正を受ける優先度の高い${lowestInv}の個体値に${-preTotal}を足し個体値が<br>${this.toString()}になります。`);

          } else {
            let correction = -(this.individualValues[minInvIndex]) + 100
            this.individualValues[minInvIndex] = IndividualValue.MAX_INV_VALUE;
            this.addList(`最も個体値が低く個体値補正を受ける優先度の高い${lowestInv}から個体値に${-preTotal}を足すと-100を下回ってしまうため、-100になるように${correction}足し、個体値が<br><strong>${this.toString()}</strong>になります。`);
          }
        }

        this.addList(`個体値の合計は${this.totalIndividualValue}です。`)

      }
    }

    get totalIndividualValue() {
      return this.individualValues.reduce((result, elem) => result + elem);
    }

    isAllInvZero() {
      return this.individualValues.every(inv => inv == 0);
    }

    get hp() {
      return this.individualValues[0];
    }
    get mp() {
      return this.individualValues[1];
    }
    get attack() {
      return this.individualValues[2];
    }
    get defense() {
      return this.individualValues[3];
    }
    get speed() {
      return this.individualValues[4];
    }
    get wisdom() {
      return this.individualValues[5];
    }

    convertShortInvStrings() {
      let shortInvStrings = [];
      this.individualValues.forEach((inv, index) => {
        if (inv == IndividualValue.MAX_INV_VALUE) {
          shortInvStrings.push(this.highInvShortStrings[index]);
        } else if (inv == IndividualValue.MIN_INV_VALUE) {
          shortInvStrings.push(this.lowInvShortStrings[index]);
        } else if (inv == 0) {
          shortInvStrings.push('');
        } else {

        }
      });
      return shortInvStrings;
    }

    toString() {

      if (this.isAllInvZero()) {
        return "<strong>0</strong>";
      }

      let shortInvStrings = this.convertShortInvStrings();

      let hp = shortInvStrings[0];
      let mp = shortInvStrings[1];
      let attack = shortInvStrings[2];
      let defense = shortInvStrings[3];
      let speed = shortInvStrings[4];
      let wisdom = shortInvStrings[5];

      return `<strong>${hp}${mp}${attack}${defense}${speed}${wisdom}</strong>`;
    }
  }


}
