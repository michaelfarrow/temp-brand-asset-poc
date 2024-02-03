/*
 * App.ts
 * ===========
 * Entry from Webpack, generates Three.js View
 */

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import View from './webgl/View7';

class App {
  private paused: boolean = false;
  private fullScreen: boolean = false;
  private time: number = 0;
  private timeDiff: number = 0;
  private pausedTime: number = 0;
  private view: View;
  private stats?: Stats;
  private controls?: OrbitControls;
  private timeDisplay: HTMLDivElement;

  private mousePos: [number, number] = [0, 0];

  constructor() {
    this.hashChange();

    const canvasBox = <HTMLCanvasElement>(
      document.getElementById('webgl-canvas')
    );

    this.view = new View(canvasBox);

    if (this.view.enableStats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }

    if (this.view.enableControls) {
      this.controls = new OrbitControls(this.view.getCamera(), canvasBox);
    }

    this.view.start();

    this.timeDisplay = document.createElement('div');
    this.timeDisplay.id = 'time';
    document.body.appendChild(this.timeDisplay);

    window.addEventListener('hashchange', this.hashChange.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('mousemove', this.mouseMove.bind(this));
    canvasBox.addEventListener('click', this.click.bind(this));

    this.update(0);
  }

  private hashChange() {
    const startTime = window.location.hash.replace(/^#/, '');

    if (startTime.length) {
      const time = Number(startTime) || 0;
      this.pausedTime = time;
      this.paused = true;
    }
  }

  private keyUp(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'f') {
      this.fullScreen = !this.fullScreen;
    }
  }

  private click() {
    this.paused = !this.paused;

    if (this.paused) {
      this.pausedTime = this.time - this.timeDiff;
    } else {
      this.timeDiff = this.time - this.pausedTime;
    }
  }

  private mouseMove = (e: MouseEvent): void => {
    this.mousePos = [e.clientX, e.clientY];
  };

  private resize = (): void => {
    this.view.onWindowResize(window.innerWidth, window.innerHeight);
  };

  private update = (t: number): void => {
    requestAnimationFrame(this.update);

    this.time = t;

    const timeAdjusted = this.time - this.timeDiff;
    const currentTime = Math.round(
      this.paused ? this.pausedTime : timeAdjusted
    );

    this.timeDisplay.innerText = String(currentTime);
    this.timeDisplay.style.display =
      this.paused && !this.fullScreen ? 'block' : 'none';
    this.view.update(7 + currentTime / 1000, this.mousePos);

    // this.view.update(t / 5000 + this.mouseSeed);
    // this.view.update(this.mouseSeed * 10);
    if (this.stats) {
      this.stats.update();
    }

    if (this.controls) {
      this.controls.update();
    }
  };
}

const app = new App();
