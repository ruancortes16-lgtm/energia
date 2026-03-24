export type Indicator = {
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "warning" | "critical" | "neutral";
};

export type ChartPoint = {
  label: string;
  consumption: number;
};

export type Peak = {
  id: number;
  meter_name: string;
  consumption_kwh: number;
  recorded_at: string;
  severity: "low" | "medium" | "high";
};

export type DashboardOverview = {
  daily_consumption: number;
  weekly_consumption: number;
  monthly_consumption: number;
  active_alerts: number;
  indicators: Indicator[];
  chart: ChartPoint[];
  peaks: Peak[];
};

export type Reading = {
  id: number;
  meter_name: string;
  consumption_kwh: number;
  recorded_at: string;
  latitude: number;
  longitude: number;
  notes?: string | null;
  created_at: string;
};

export type Alert = {
  id: number;
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  triggered_at: string;
  resolved: boolean;
  reading_id?: number | null;
};

export type Limits = {
  id: number;
  daily_limit_kwh: number;
  weekly_limit_kwh: number;
  monthly_limit_kwh: number;
  peak_threshold_multiplier: number;
  updated_at: string;
};

export type ReadingPayload = {
  meter_name: string;
  consumption_kwh: number;
  recorded_at: string;
  latitude: number;
  longitude: number;
  notes?: string;
};

export type LimitsPayload = {
  daily_limit_kwh: number;
  weekly_limit_kwh: number;
  monthly_limit_kwh: number;
  peak_threshold_multiplier: number;
};
