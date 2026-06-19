export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  type: "solar" | "battery" | "windmill" | "thermostat" | "led" | "offpeak";
  cost: number;
  unique: boolean;
  requiresGarden: boolean;
  icon: string;
  modelPath?: string;
}

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  {
    id: "solar-panel",
    name: "Panneau solaire",
    description: "Produit entre 1,5 et 3 kWh par jour selon la region et la meteo.",
    type: "solar",
    cost: 800,
    unique: false,
    requiresGarden: false,
    icon: "☀️",
    modelPath: "/models/solar-panel.glb",
  },
  {
    id: "battery",
    name: "Batterie domestique",
    description: "Stocke jusqu'a 10 kWh pour lisser le passage jour-nuit.",
    type: "battery",
    cost: 2000,
    unique: true,
    requiresGarden: false,
    icon: "🔋",
    modelPath: "/models/battery.glb",
  },
  {
    id: "windmill",
    name: "Micro-eolienne",
    description: "Produit 2 kWh par jour en base et plus quand le vent se leve.",
    type: "windmill",
    cost: 1500,
    unique: true,
    requiresGarden: true,
    icon: "🌬️",
    modelPath: "/models/windmill.glb",
  },
  {
    id: "thermostat",
    name: "Thermostat intelligent",
    description: "Reduit les depenses de chauffage et de climatisation de 15%.",
    type: "thermostat",
    cost: 300,
    unique: true,
    requiresGarden: false,
    icon: "🌡️",
  },
  {
    id: "led",
    name: "Ampoules LED",
    description: "Baisse la consommation d'eclairage de 5% sans friction.",
    type: "led",
    cost: 100,
    unique: true,
    requiresGarden: false,
    icon: "💡",
  },
  {
    id: "offpeak",
    name: "Heures creuses",
    description: "Decale la consommation et reduit la demande totale de 10%.",
    type: "offpeak",
    cost: 0,
    unique: true,
    requiresGarden: false,
    icon: "⚡",
  },
];
