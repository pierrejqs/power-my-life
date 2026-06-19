import { EDF_PRICE_KWH, RTE_CARBON_INTENSITY_G_KWH } from "@/lib/data/profiles";
import type { Region } from "@/lib/types/game";

const NUMBER_FORMATTER = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const EURO_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function kwhToCO2(kwh: number, region: Region): number {
  return Math.round(kwh * RTE_CARBON_INTENSITY_G_KWH[region]);
}

export function kwhToEuros(kwh: number): number {
  return Math.round(kwh * EDF_PRICE_KWH * 100) / 100;
}

export function formatKwh(kwh: number): string {
  return `${NUMBER_FORMATTER.format(kwh)} kWh`;
}

export function formatCO2(grams: number): string {
  return `${NUMBER_FORMATTER.format(grams / 1000)} kg CO2`;
}

export function formatEuros(euros: number): string {
  return EURO_FORMATTER.format(euros);
}
