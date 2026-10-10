export type QualityStatus = "PASS" | "FAIL" | "INVALID";

export type Gateway = {
  id: string;
  name: string;
  protocol: string;
  address: string;
  online: boolean;
  lastHeartbeat: string;
  messageCount: number;
  errors: number;
};

export type Instrument = {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  line: string;
  gatewayId: string;
  online: boolean;
  lastSeen: string;
  firmware: string;
  calibrationDue: string;
};

export type Part = {
  number: string;
  name: string;
  revision: string;
  characteristic: string;
  nominal: number;
  lsl: number;
  usl: number;
  unit: string;
  active: boolean;
};

export type Measurement = {
  id: string;
  timestamp: string;
  partNumber: string;
  batchId: string;
  serialNumber: string;
  characteristic: string;
  value: number | null;
  unit: string;
  instrumentId: string;
  operator: string;
  status: QualityStatus;
};

export type QualityEvent = {
  id: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  timestamp: string;
  source: string;
  measurementId: string;
  status: "Open" | "Acknowledged" | "Investigating" | "Resolved";
  assignedTo: string;
  notes: string;
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Quality Engineer" | "Operator" | "Viewer";
  active: boolean;
};

export type WorkspaceSettings = {
  plantName: string;
  productionLine: string;
  timezone: string;
  decimalPrecision: number;
  demoIntervalSeconds: number;
  theme: "light" | "dark";
};

export type DemoData = {
  gateways: Gateway[];
  instruments: Instrument[];
  parts: Part[];
  measurements: Measurement[];
  events: QualityEvent[];
  users: DemoUser[];
  settings: WorkspaceSettings;
};

const now = Date.UTC(2026, 9, 10, 15, 45);
const isoMinutesAgo = (minutes: number) =>
  new Date(now - minutes * 60_000).toISOString();

export function measurementStatus(
  value: number | null,
  part: Part | undefined,
): QualityStatus {
  if (value === null || !Number.isFinite(value) || !part) return "INVALID";
  return value >= part.lsl && value <= part.usl ? "PASS" : "FAIL";
}

export function createDemoData(): DemoData {
  const gateways: Gateway[] = [
    {
      id: "GW-001",
      name: "Assembly gateway",
      protocol: "OPC UA",
      address: "192.168.1.21",
      online: true,
      lastHeartbeat: isoMinutesAgo(1),
      messageCount: 18_420,
      errors: 2,
    },
    {
      id: "GW-002",
      name: "Finishing gateway",
      protocol: "Modbus TCP",
      address: "192.168.1.22",
      online: true,
      lastHeartbeat: isoMinutesAgo(2),
      messageCount: 12_806,
      errors: 0,
    },
  ];
  const instruments: Instrument[] = [
    {
      id: "INS-001",
      name: "Width laser A",
      manufacturer: "Demo Metrology",
      model: "LM-240",
      type: "Laser displacement",
      line: "Assembly 1",
      gatewayId: "GW-001",
      online: true,
      lastSeen: isoMinutesAgo(1),
      firmware: "2.4.1",
      calibrationDue: "2026-12-15",
    },
    {
      id: "INS-002",
      name: "Width laser B",
      manufacturer: "Demo Metrology",
      model: "LM-240",
      type: "Laser displacement",
      line: "Assembly 1",
      gatewayId: "GW-001",
      online: true,
      lastSeen: isoMinutesAgo(2),
      firmware: "2.4.1",
      calibrationDue: "2026-11-20",
    },
    {
      id: "INS-003",
      name: "Height probe C",
      manufacturer: "Precision Works",
      model: "HP-90",
      type: "Digital probe",
      line: "Finishing",
      gatewayId: "GW-002",
      online: true,
      lastSeen: isoMinutesAgo(1),
      firmware: "1.8.0",
      calibrationDue: "2026-10-28",
    },
    {
      id: "INS-004",
      name: "Reference gauge",
      manufacturer: "Precision Works",
      model: "RG-12",
      type: "Digital gauge",
      line: "Inspection",
      gatewayId: "GW-002",
      online: false,
      lastSeen: isoMinutesAgo(72),
      firmware: "1.6.2",
      calibrationDue: "2026-08-31",
    },
  ];
  const parts: Part[] = [
    {
      number: "P001",
      name: "Mounting bracket",
      revision: "C",
      characteristic: "Width",
      nominal: 24.25,
      lsl: 24,
      usl: 24.5,
      unit: "mm",
      active: true,
    },
    {
      number: "P002",
      name: "Rotor housing",
      revision: "A",
      characteristic: "Diameter",
      nominal: 52,
      lsl: 51.7,
      usl: 52.3,
      unit: "mm",
      active: true,
    },
    {
      number: "P003",
      name: "Valve stem",
      revision: "B",
      characteristic: "Length",
      nominal: 81.5,
      lsl: 81.1,
      usl: 81.9,
      unit: "mm",
      active: true,
    },
  ];
  const measurements = Array.from({ length: 120 }, (_, index) => {
    const part = parts[index % parts.length];
    const drift = Math.sin(index * 1.7) * (part.usl - part.lsl) * 0.28;
    const outOfSpec = index % 29 === 0;
    const invalid = index === 17;
    const value = invalid
      ? null
      : Number(
          (
            part.nominal +
            drift +
            (outOfSpec
              ? index % 2 === 0
                ? (part.usl - part.nominal) * 1.3
                : (part.lsl - part.nominal) * 1.3
              : 0)
          ).toFixed(3),
        );
    return {
      id: `ME-${String(10_000 + index)}`,
      timestamp: isoMinutesAgo((119 - index) * 12),
      partNumber: part.number,
      batchId: `B-${String(260_100 + Math.floor(index / 12))}`,
      serialNumber: `SN-${String(70_000 + index)}`,
      characteristic: part.characteristic,
      value,
      unit: part.unit,
      instrumentId: instruments[index % 3].id,
      operator: ["A. Patel", "M. Chen", "S. Kumar"][index % 3],
      status: measurementStatus(value, part),
    } satisfies Measurement;
  });
  const failed = measurements.filter((measurement) => measurement.status === "FAIL");
  const events: QualityEvent[] = failed.slice(0, 3).map((measurement, index) => ({
    id: `QE-${String(3001 + index)}`,
    type: "Out-of-tolerance measurement",
    severity: index === 0 ? "High" : "Medium",
    description: `${measurement.characteristic} measured ${measurement.value} ${measurement.unit}, outside specification.`,
    timestamp: measurement.timestamp,
    source: measurement.instrumentId,
    measurementId: measurement.id,
    status: index === 0 ? "Open" : "Acknowledged",
    assignedTo: index === 0 ? "Unassigned" : "A. Patel",
    notes: "",
  }));

  return {
    gateways,
    instruments,
    parts,
    measurements,
    events,
    users: [
      { id: "U-001", name: "Quality Team", email: "quality@example.demo", role: "Administrator", active: true },
      { id: "U-002", name: "A. Patel", email: "apatel@example.demo", role: "Quality Engineer", active: true },
      { id: "U-003", name: "M. Chen", email: "mchen@example.demo", role: "Operator", active: true },
      { id: "U-004", name: "Read-only Demo", email: "viewer@example.demo", role: "Viewer", active: true },
    ],
    settings: {
      plantName: "GAP-IT Demo Plant",
      productionLine: "Assembly 1",
      timezone: "Asia/Kolkata",
      decimalPrecision: 3,
      demoIntervalSeconds: 5,
      theme: "light",
    },
  };
}

export function calculateStatistics(values: number[]) {
  if (!values.length) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const sorted = [...values].sort((left, right) => left - right);
  const variance =
    values.length > 1
      ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        (values.length - 1)
      : 0;
  const standardDeviation = Math.sqrt(variance);
  return {
    count: values.length,
    mean,
    median:
      values.length % 2
        ? sorted[Math.floor(values.length / 2)]
        : (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2,
    minimum: sorted[0],
    maximum: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
    standardDeviation,
  };
}

export function downloadCsv(filename: string, rows: Record<string, string | number | null>[]) {
  if (!rows.length) return false;
  const headers = Object.keys(rows[0]);
  const quote = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [
    headers.map(quote).join(","),
    ...rows.map((row) => headers.map((header) => quote(row[header])).join(",")),
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
