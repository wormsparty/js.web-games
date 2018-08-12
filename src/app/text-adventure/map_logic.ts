import * as consts from './const';

export class Pos {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other_pos: Pos) {
    return this.x === other_pos.x && this.y === other_pos.y;
  }
}

export class TeleportPos {
  x: number;
  y: number;
  id: number;

  constructor(x: number, y: number, id: number) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  equals(other_pos: TeleportPos) {
    return this.x === other_pos.x && this.y === other_pos.y;
  }
}

export class LevelMap {
  private static teleport_symbols: Array<string> = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  private static item_symbols: Array<string> = [ '{', '}', '[', ']', '(', ')', '&', '%', '!', '?', '*', '$'];

  map: string;
  meta: string;
  teleport_map: Map<string, string>;
  tile2color: Map<string, string>;
  texts: Map<string, Pos>;
  teleports: Map<string, Array<TeleportPos>>;
  teleport_count: Map<string, number>;
  pnj_positions: Map<string, Array<Pos>>;
  item_positions: Map<string, Array<Pos>>;
  start: Pos;

  constructor(map: string, meta: string, teleport_map: Map<string, string>, tile2color: Map<string, string>, texts: Map<string, Pos>) {
    this.map = map;
    this.meta = meta;
    this.teleport_map = teleport_map;
    this.tile2color = tile2color;
    this.texts = texts;
    this.teleports = new Map<string, Array<TeleportPos>>();
    this.teleport_count = new Map<string, number>();
    this.pnj_positions = new Map<string, Array<Pos>>();
    this.item_positions = new Map<string, Array<Pos>>();
    this.start = new Pos(0, 0);
  }

  parse(name: string): void {
    const visual_map: Array<string> = this.map.split('\n');
    const meta_map: Array<string> = this.meta.split('\n');

    if (visual_map.length !== consts.map_lines) {
      console.log('La carte V ' + name + ' n\'a pas exactement ' + consts.map_lines + ' lignes (' + visual_map.length + ')');
    }

    if (meta_map.length !== consts.map_lines) {
      console.log('La carte M ' + name + ' n\'a pas exactement ' + consts.map_lines + ' lignes (' + meta_map.length + ')');
    }

    for (let i = 0; i < consts.map_lines; i++) {
      if (visual_map[i].length !== consts.char_per_line) {
        console.log('V ' + name + ' l.' + i + ' n\'a pas exactement ' + consts.char_per_line + ' chars (' + visual_map[i].length + ')');
      }

      if (meta_map[i].length !== consts.char_per_line) {
        console.log('M ' + name + ' l.' + i + ' n\'a pas exactement ' + consts.char_per_line + ' chars (' + meta_map[i].length + ')');
      }
    }

    for (let y = 0; y < consts.map_lines; y++) {
      for (let x = 0; x < consts.char_per_line; x++) {
        const chr = meta_map[y][x];

        if (chr === '#') {
          if (visual_map[y][x] !== '#') {
            console.log('Les murs ne marchent pas en (' + x + ', ' + y + '), carte = ' + name);
          }
        }  else if (LevelMap.teleport_symbols.indexOf(chr) > -1) {
          if (!this.teleports.has(chr)) {
            this.teleports.set(chr, []);
            this.teleport_count.set(chr, 0);
          }

          this.teleports.get(chr).push(new TeleportPos(x, y, this.teleport_count.get(chr)));
          this.teleport_count.set(chr, this.teleport_count.get(chr) + 1);
        } else if (LevelMap.item_symbols.indexOf(chr) > -1) {
          if (!this.item_positions.has(chr)) {
            this.item_positions.set(chr, []);
          }

          this.item_positions.get(chr).push(new Pos(x, y));
        } else if (chr !== ' ' && chr !== undefined) {
          if (chr === '@') {
            this.start = new Pos(x, y);
          } else {
            if (!this.pnj_positions.has(chr)) {
              this.pnj_positions.set(chr, []);
            }

            this.pnj_positions.get(chr).push(new Pos(x, y));
          }
        }
      }
    }
  }
  get_symbol_at(x: number, y: number): string {
    return this.map[y * (consts.char_per_line + 1) + x];
  }
}

export class ScreenMap {
  map: string;

  constructor(map: string) {
    this.map = map;
  }

  parse(name: string) {
    const splitted_map = this.map.split('\n');

    if (splitted_map.length !== consts.map_lines) {
      console.log(name + ' n\'a pas exactement ' + consts.map_lines + ' lines (' + splitted_map.length + ')');
    }

    for (let i = 0 ; i < consts.map_lines; i++) {
      if (splitted_map[i].length !== consts.char_per_line) {
        console.log('L.' + i + ' de ' + name + ' n\'a pas exactement ' + consts.char_per_line + ' chars (' + splitted_map[i].length + ')');
      }
    }
  }
}