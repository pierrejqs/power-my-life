import { EQUIPMENT_CATALOG, type EquipmentItem } from "@/lib/data/equipment";
import { HOUSE_VISUAL, ROOF_SLOTS } from "@/lib/data/profiles";
import type { Equipment, PurchaseAvailability, UserProfile } from "@/lib/types/game";

export interface PurchaseState {
  budget: number;
  equipment: Equipment[];
  roofSlotsUsed: number;
  day: number;
  profile: UserProfile;
}

export interface AppliedPurchase {
  budget: number;
  equipment: Equipment[];
  roofSlotsUsed: number;
  batteryCapacity: number;
}

export function getEquipmentItem(equipmentId: string): EquipmentItem | undefined {
  return EQUIPMENT_CATALOG.find((item) => item.id === equipmentId);
}

export function getMaxRoofSlots(profile: UserProfile): number {
  return profile.houseType ? ROOF_SLOTS[profile.houseType] : 0;
}

export function getPurchaseAvailability(
  profile: UserProfile,
  equipment: Equipment[],
  budget: number,
  roofSlotsUsed: number,
  item: EquipmentItem
): PurchaseAvailability {
  if (!profile.houseType) {
    return { allowed: false, reason: "missing_profile" };
  }
  if (budget < item.cost) {
    return { allowed: false, reason: "insufficient_budget" };
  }
  if (item.unique && equipment.some((owned) => owned.id === item.id)) {
    return { allowed: false, reason: "unique_owned" };
  }
  if (item.requiresGarden && !HOUSE_VISUAL[profile.houseType].hasGarden) {
    return { allowed: false, reason: "needs_garden" };
  }
  if (item.type === "solar" && roofSlotsUsed >= getMaxRoofSlots(profile)) {
    return { allowed: false, reason: "roof_full" };
  }
  return { allowed: true };
}

export function applyEquipmentPurchase(state: PurchaseState, equipmentId: string): AppliedPurchase {
  const item = getEquipmentItem(equipmentId);
  const existingBattery = state.equipment.some((owned) => owned.type === "battery");

  if (!item) {
    return {
      budget: state.budget,
      equipment: state.equipment,
      roofSlotsUsed: state.roofSlotsUsed,
      batteryCapacity: existingBattery ? 10 : 0,
    };
  }

  const availability = getPurchaseAvailability(
    state.profile,
    state.equipment,
    state.budget,
    state.roofSlotsUsed,
    item
  );

  if (!availability.allowed) {
    return {
      budget: state.budget,
      equipment: state.equipment,
      roofSlotsUsed: state.roofSlotsUsed,
      batteryCapacity: existingBattery ? 10 : 0,
    };
  }

  const existing = state.equipment.find((owned) => owned.id === equipmentId);
  const nextEquipment = existing
    ? state.equipment.map((owned) =>
        owned.id === equipmentId ? { ...owned, count: owned.count + 1 } : owned
      )
    : [
        ...state.equipment,
        {
          id: item.id,
          name: item.name,
          type: item.type,
          count: 1,
          purchasedOnDay: state.day,
        },
      ];

  return {
    budget: state.budget - item.cost,
    equipment: nextEquipment,
    roofSlotsUsed: item.type === "solar" ? state.roofSlotsUsed + 1 : state.roofSlotsUsed,
    batteryCapacity: nextEquipment.some((owned) => owned.type === "battery") ? 10 : 0,
  };
}
