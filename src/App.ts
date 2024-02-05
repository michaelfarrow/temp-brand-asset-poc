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
  private timeDisplay: HTMLInputElement;
  private instuctionsAction: HTMLSpanElement;

  private mousePos: [number, number] = [0, 0];
  private mousePosCurrent: [number, number] = [0, 0];

  constructor() {
    this.instuctionsAction = document.getElementById(
      'instructions-action'
    ) as HTMLSpanElement;

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

    this.timeDisplay = document.createElement('input');
    this.timeDisplay.id = 'time';
    this.timeDisplay.readOnly = true;
    this.timeDisplay.addEventListener(`focus`, () => this.timeDisplay.select());

    // document.body.appendChild(this.timeDisplay);

    window.addEventListener('hashchange', this.hashChange.bind(this));
    window.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('mousemove', this.mouseMove.bind(this));

    this.update(0);
  }

  private hashChange() {
    const startTime = window.location.hash.replace(/^#/, '');

    if (startTime.length) {
      const time = Number(startTime) || 0;
      this.pausedTime = time;
      this.paused = true;
      this.updatePlayPause();
    }
  }

  private keyUp(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyF':
        this.fullScreen = !this.fullScreen;
        break;

      case 'Space':
        this.paused = !this.paused;
        if (this.paused) {
          this.pausedTime = this.time - this.timeDiff;
          window.location.hash = `#${Math.round(this.pausedTime)}`;
        } else {
          this.timeDiff = this.time - this.pausedTime;
          window.location.hash = '';
        }
        this.updatePlayPause();
        break;
    }
  }

  private mouseMove = (e: MouseEvent): void => {
    this.mousePos = [e.clientX, e.clientY];
  };

  private resize = (): void => {
    this.view.onWindowResize(window.innerWidth, window.innerHeight);
  };

  private updatePlayPause() {
    this.instuctionsAction.innerText = this.paused ? 'play' : 'pause';
  }

  private update = (t: number): void => {
    requestAnimationFrame(this.update);

    this.time = t;
    this.mousePosCurrent = [
      this.mousePosCurrent[0] +
        (this.mousePos[0] - this.mousePosCurrent[0]) / 10,
      this.mousePosCurrent[1] +
        (this.mousePos[1] - this.mousePosCurrent[1]) / 10,
    ];

    const timeAdjusted = this.time - this.timeDiff;
    const currentTime = Math.round(
      this.paused ? this.pausedTime : timeAdjusted
    );

    this.timeDisplay.value = String(currentTime);
    this.timeDisplay.style.display =
      this.paused && !this.fullScreen ? 'block' : 'none';

    this.view.update(
      this.time / 1000,
      currentTime / 1000,
      this.mousePosCurrent
    );

    if (this.stats) {
      this.stats.update();
    }

    if (this.controls) {
      this.controls.update();
    }
  };
}

const app = new App();
