export const KD_ACADEMY_SPRITES = {
  playerBases: [
    {
      id: 'fighter-local',
      title: 'Guild Fighter',
      src: '/kdacademy/assets/sprites/Fighter2_Idle_local.png',
      source: 'Local project asset pack',
      license: 'Project local asset',
      frameCount: 1,
      frameSize: [32, 32],
      usage: ['loading', 'avatar', 'npc']
    },
    {
      id: 'mage-local',
      title: 'Arcane Mage',
      src: '/kdacademy/assets/sprites/Mage1_local.png',
      source: 'Local project asset pack',
      license: 'Project local asset',
      frameCount: 1,
      frameSize: [32, 32],
      usage: ['avatar', 'npc', 'job']
    },
    {
      id: 'rpg-cc0',
      title: 'CC0 RPG Sheet',
      src: '/kdacademy/assets/sprites/rpg_16x16_cc0.png',
      source: 'OpenGameArt 16x16 8-bit RPG character set',
      sourceUrl: 'https://lpc.opengameart.org/content/16x16-8-bit-rpg-character-set',
      license: 'CC0',
      frameCount: 8,
      frameSize: [16, 16],
      usage: ['avatar', 'npc', 'world']
    }
  ],
  npcSprites: [
    {
      id: 'guildmaster-local',
      title: 'Guildmaster',
      src: '/kdacademy/assets/sprites/Guildmaster_local.png',
      source: 'Local project asset pack',
      license: 'Project local asset',
      frameCount: 1,
      frameSize: [32, 32]
    }
  ],
  backgrounds: {
    sky: '/kdacademy/assets/backgrounds/sky.png',
    far: '/kdacademy/assets/backgrounds/background.png',
    mid: '/kdacademy/assets/backgrounds/midground.png',
    front: '/kdacademy/assets/backgrounds/foreground.png'
  },
  worldTiles: [
    {
      id: 'punyworld-overworld',
      src: '/kdacademy/assets/tiles/punyworld-overworld-tileset_cc0.png',
      source: 'OpenGameArt Punyworld Overworld Tileset',
      sourceUrl: 'https://opengameart.org/content/punyworld-overworld-tileset',
      license: 'CC0'
    },
    {
      id: 'punyworld-dungeon',
      src: '/kdacademy/assets/tiles/punyworld-dungeon-tileset_cc0.png',
      source: 'OpenGameArt Punyworld Dungeon Tileset',
      sourceUrl: 'https://opengameart.org/content/punyworld-dungeon-tileset',
      license: 'CC0'
    },
    {
      id: 'walls-local',
      src: '/kdacademy/assets/tiles/walls_local.png',
      source: 'Local project asset pack',
      license: 'Project local asset'
    },
    {
      id: 'interior-local',
      src: '/kdacademy/assets/tiles/interior_objects_local.png',
      source: 'Local project asset pack',
      license: 'Project local asset'
    }
  ],
  ui: {
    buttons: '/kdacademy/assets/ui/Buttons.png',
    mainMenu: '/kdacademy/assets/ui/Main_menu.png',
    characterPanel: '/kdacademy/assets/ui/character_panel.png',
    levels: '/kdacademy/assets/ui/Levels.png'
  }
};

export function getSpriteById(spriteId) {
  return KD_ACADEMY_SPRITES.playerBases.find((sprite) => sprite.id === spriteId) || KD_ACADEMY_SPRITES.playerBases[0];
}
