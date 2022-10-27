/**
 * Класс по изменению параметров страницы
 */
export default class Customizator {

  /** Коиструктор костамизатора */
  constructor() {
    this.btnBLock = document.createElement('div');
    this.colorPicker = document.createElement('input');
    this.clear = document.createElement('div');
    this.scale = localStorage.getItem('scale') || 1;
    this.color = localStorage.getItem('color') || '#ffffff';

    this.btnBLock.addEventListener('click', (e) => this.onScaleChange(e));
    this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));
    this.clear.addEventListener('click', () => this.reset());
  }

  /**
   * Инизиализирует костамизатор (выводим на страницу панель для управления параметрами страницы)
   * @returns {void}
   */
  render() {
    this.injectStyle();
    this.setBgColor();
    this.setScale();

    let scaleInputS = document.createElement('input'),
        scaleInputM = document.createElement('input'),
        panel = document.createElement('div');

    panel.classList.add('panel');

    this.btnBLock.classList.add('scale');
    scaleInputS.classList.add('scale_btn');
    scaleInputM.classList.add('scale_btn');

    this.colorPicker.classList.add('color');

    this.clear.innerHTML = `&times;`;
    this.clear.classList.add('clear');

    scaleInputS.setAttribute('type', 'button');
    scaleInputM.setAttribute('type', 'button');
    scaleInputS.setAttribute('value', '1x');
    scaleInputM.setAttribute('value', '1.5x');
    this.colorPicker.setAttribute('type', 'color');
    this.colorPicker.setAttribute('value', '#ffffff');

    this.btnBLock.append(scaleInputS, scaleInputM);
    panel.append(this.btnBLock, this.colorPicker, this.clear);

    document.body.append(panel);
  }

  injectStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
        .panel {
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            top: 10px;
            right: 0;
            border: 1px solid rgba(0,0,0, .2);
            box-shadow: 0 0 20px rgba(0,0,0, .5);
            width: 300px;
            height: 60px;
            background-color: #fff;
        }
        .scale {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100px;
            height: 40px;
        }
        .scale_btn {
            display: block;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(0,0,0, .2);
            border-radius: 4px;
            font-size: 18px;
        }
        .color {
            width: 40px;
            height: 40px;
        }
        .clear {
            font-size: 30px;
            cursor: pointer;
        }
    `;
    document.querySelector('head').appendChild(style);
  }

  /**
   * Запомнить размер шрифта в localStorage
   * @param {object} e объект события
   * @returns {void}
   */
  onScaleChange(e) {
    this.scale = +e.target.value.replace(/x/g, '')
    localStorage.setItem('scale', this.scale);
    this.setScale();
  }

  /**
   * Устанавливает размер шрифта
   * @returns {void}
   */
  setScale() {

    /**
     * Функция рекурсии
     * @param {Element} element
     * @returns {void}
     * */
    const recursy = (element) => {
      element.childNodes.forEach((node) => {
        if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) {

          if (!node.parentElement.dataset.fz) {
            const value = window.getComputedStyle(node.parentElement).fontSize;
            node.parentElement.setAttribute('data-fz', value.replace(/\D/g, ''));
          }

          node.parentElement.style.fontSize = node.parentElement.dataset.fz * this.scale + 'px';
        } else {

          if (node.classList && !node.classList.contains('panel')) recursy(node);

        }
      });
    };

    recursy(document.body);
  }

  /**
   * Запомнить цвет в localStorage
   * @param {object} e объект события
   * @returns {void}
   */
  onColorChange(e) {
    this.color = e.target.value;
    localStorage.setItem('color', this.color);
    this.setBgColor();
  }

  /**
   * Устанавливает цвет
   * @returns {void}
   */
  setBgColor() {
    document.body.style.backgroundColor = this.color;
    this.colorPicker.value = this.color;
  }

  /**
   * Очистить localStorage
   * @returns {void}
   */
  reset() {
    localStorage.clear();

    this.scale = 1;
    this.color = '#ffffff';

    this.setBgColor();
    this.setScale();
  }
}