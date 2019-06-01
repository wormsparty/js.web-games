﻿import {Engine} from '../common/engine';
import {Tileset} from './tileset';
import {TextureLoader} from './textureloader';
import {Level} from './level';
import {Editor} from './editor';

export class Game {
  public pressed: Map<string, boolean>;
  public tilesize = 16;

  public readonly engine: Engine;
  private readonly textureLoader: TextureLoader;
  private tilesets: Map<string, Tileset>;

  private readonly editor: Editor;
  private level: Level;

  fps: number;

  constructor(enableEditor: boolean) {
    let width = 256;
    let height = 224;

    if (enableEditor) {
      this.editor = new Editor();
      width += this.editor.outerWidth();
      height += this.editor.outerHeight();
    } else {
      this.editor = null;
    }

    this.level = new Level();

    this.engine = new Engine(
      'canvas',
      width,
      height,
      6,
      'wonder',
      true,
      this.tilesize);

    this.pressed = new Map([
      ['ArrowUp', false],
      ['ArrowDown', false],
      ['ArrowLeft', false],
      ['ArrowRight', false],
      ['Enter', false],
      [' ', false],
      ['Shift', false],
      ['Escape', false],
    ]);

    this.textureLoader = new TextureLoader();
    this.fps = 30;
  }
  loop() {
    const allTilesetsLoaded = () => {
      this.updateAndDraw();
    };

    this.textureLoader.setLoadedFunction(allTilesetsLoaded);

    this.tilesets = new Map<string, Tileset>();
    this.tilesets.set('tiles', new Tileset('../../assets/tileset.png', this.textureLoader));
    this.tilesets.set('foes', new Tileset('../../assets/foes.png', this.textureLoader));

    if (this.editor != null) {
      this.editor.setHandles(this.engine, this.tilesets, this.tilesize);
    }

    this.level.setHandles(this.engine, this.tilesets, this.tilesize);

    this.textureLoader.waitLoaded();
  }
  updateAndDraw() {
    setInterval(() => {
      this.doUpdate();
      this.draw();
    }, 1000 / this.fps);
  }
  draw(): void {
    this.engine.clear('#888888');

    if (!this.textureLoader.isInitialized) {
      this.engine.textCentered('Loading...', 40, '#FFFFFF');
    } else {
      if (this.editor != null) {
        this.editor.draw();
      }

      this.level.draw(this.editor);
    }
  }
  doUpdate(): void {
    if (this.pressed.get('ArrowUp')) {
      this.level.shiftTop--;
    }

    if (this.pressed.get('ArrowDown')) {
      this.level.shiftTop++;
    }

    if (this.pressed.get('ArrowLeft')) {
      this.level.shiftLeft--;
    }

    if (this.pressed.get('ArrowRight')) {
      this.level.shiftLeft++;
    }
  }
  resize(width, height): void {
    this.engine.resize(width, height);
    this.draw();
  }
  setMousePos(x, y) {
    if (this.engine !== undefined && this.engine != null) {
      this.engine.setMousePos(x, y);
      this.level.onMouseMove(this.editor);
    }
  }
  mouseDown(x, y) {
    this.engine.click(x, y);

    if (this.editor == null || !this.editor.onClick()) {
      this.level.mouseDown(this.editor);
    }
  }
  mouseUp() {
    this.level.mouseUp();
  }
}
