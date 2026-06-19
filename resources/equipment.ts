export interface EquipmentItem {
  id: string
  name: string
  description: string
  type: 'solar' | 'battery' | 'windmill' | 'thermostat' | 'led' | 'offpeak'
  cost: number
  unique: boolean           // ne peut être acheté qu'une fois
  requiresGarden: boolean   // éolienne = maison uniquement
  icon: string              // emoji pour UI rapide
  modelPath?: string        // asset 3D sur la scène
}

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  {
    id: 'solar-panel',
    name: 'Panneau solaire',
    description: 'Produit 1,5-3 kWh/jour selon la région et la météo.',
    type: 'solar',
    cost: 800,
    unique: false,
    requiresGarden: false,
    icon: '🌞',
    modelPath: '/models/solar-panel.glb',
  },
  {
    id: 'battery',
    name: 'Batterie domestique',
    description: 'Stocke jusqu'à 10 kWh. Indispensable pour la nuit.',
    type: 'battery',
    cost: 2000,
    unique: true,
    requiresGarden: false,
    icon: '🔋',
    modelPath: '/models/battery.glb',
  },
  {
    id: 'windmill',
    name: 'Micro-éolienne',
    description: 'Produit 2 kWh/jour de base, x2 par temps venteux.',
    type: 'windmill',
    cost: 1500,
    unique: true,
    requiresGarden: true,
    icon: '🌬️',
    modelPath: '/models/windmill.glb',
  },
  {
    id: 'thermostat',
    name: 'Thermostat intelligent',
    description: 'Réduit la consommation de chauffage/clim de 15%.',
    type: 'thermostat',
    cost: 300,
    unique: true,
    requiresGarden: false,
    icon: '🌡️',
  },
  {
    id: 'led',
    name: 'Ampoules LED',
    description: 'Réduit la consommation d'éclairage de 5%.',
    type: 'led',
    cost: 100,
    unique: true,
    requiresGarden: false,
    icon: '💡',
  },
  {
    id: 'offpeak',
    name: 'Heures creuses',
    description: 'Décale la conso la nuit. -10% sur la consommation totale.',
    type: 'offpeak',
    cost: 0,
    unique: true,
    requiresGarden: false,
    icon: '⚡',
  },
]
