"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "motion/react";
import {
  IconActivity,
  IconAlertTriangle,
  IconBell,
  IconChartBar,
  IconCheck,
  IconCircleCheck,
  IconCpu,
  IconDatabase,
  IconDownload,
  IconGauge,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconWifi,
  IconX,
} from "@tabler/icons-react";
import {
  calculateStatistics,
  createDemoData,
  downloadCsv,
  measurementStatus,
  type DemoData,
  type Measurement,
  type QualityEvent,
} from "@/lib/demo-data";
import { StatefulButton } from "@/components/ui/stateful-button";

type ModuleId =
  | "overview"
  | "live-measurements"
  | "instrument-management"
  | "spc-analytics"
  | "spc-reports"
  | "part-inspection-setup"
  | "alerts-quality-events"
  | "traceability"
  | "history-data-explorer"
  | "users-permissions"
  | "system-settings";

type Props = {
  activeSection: ModuleId;
  data: DemoData;
  setData: Dispatch<SetStateAction<DemoData>>;
  onNavigate: (section: ModuleId) => void;
  activeForStreaming: boolean;
};

const inputClass =
  "emerald-input min-h-10 w-full rounded-lg border px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-emerald-900";
const cardClass =
  "emerald-card rounded-2xl border p-4 md:p-5";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "PASS" || status === "Online" || status === "Resolved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : status === "FAIL" || status === "Offline" || status === "Critical"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
        : status === "INVALID" || status === "High" || status === "Open"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}>
      {status}
    </span>
  );
}

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-7">
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
          GAP-IT quality workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-emerald-50 md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        <IconAlertTriangle aria-hidden="true" className="size-3.5" />
        DEMO DATA — NO HARDWARE CONNECTED
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cardClass}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          {icon}
        </span>
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">{message}</p>;
}

function MeasurementRows({ rows, parts }: { rows: Measurement[]; parts: DemoData["parts"] }) {
  if (!rows.length) return <EmptyState message="No measurements match these filters." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] text-left text-xs">
        <thead className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-3 py-3 font-semibold">Timestamp</th>
            <th className="px-3 py-3 font-semibold">Measurement</th>
            <th className="px-3 py-3 font-semibold">Part / batch</th>
            <th className="px-3 py-3 font-semibold">Characteristic</th>
            <th className="px-3 py-3 text-right font-semibold">Value</th>
            <th className="px-3 py-3 text-right font-semibold">LSL – USL</th>
            <th className="px-3 py-3 font-semibold">Instrument</th>
            <th className="px-3 py-3 font-semibold">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => {
            const part = parts.find((candidate) => candidate.number === row.partNumber);
            return (
              <tr key={row.id} className="text-slate-700 dark:text-slate-200">
                <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-slate-400">
                  {formatTimestamp(row.timestamp)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-medium">{row.id}</td>
                <td className="px-3 py-3">
                  <span className="block font-medium">{row.partNumber}</span>
                  <span className="text-slate-500 dark:text-slate-400">{row.batchId}</span>
                </td>
                <td className="px-3 py-3">{row.characteristic}</td>
                <td className="px-3 py-3 text-right font-mono tabular-nums">
                  {row.value === null ? "—" : `${row.value.toFixed(3)} ${row.unit}`}
                </td>
                <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {part ? `${part.lsl.toFixed(2)} – ${part.usl.toFixed(2)}` : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3">{row.instrumentId}</td>
                <td className="px-3 py-3"><StatusPill status={row.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WorkspaceModule({
  activeSection,
  data,
  setData,
  onNavigate,
  activeForStreaming,
}: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [instrumentFilter, setInstrumentFilter] = useState("All");
  const [partFilter, setPartFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [traceQuery, setTraceQuery] = useState("");
  const [traceSearched, setTraceSearched] = useState(false);
  const [tracePart, setTracePart] = useState("All");
  const [traceStart, setTraceStart] = useState("");
  const [traceEnd, setTraceEnd] = useState("");
  const [expandedTraceId, setExpandedTraceId] = useState("");
  const [notice, setNotice] = useState("");
  const [eventNoteDrafts, setEventNoteDrafts] = useState<Record<string, string>>({});
  const [eventRootDrafts, setEventRootDrafts] = useState<Record<string, string>>({});
  const [eventActionDrafts, setEventActionDrafts] = useState<Record<string, string>>({});
  const [dashboardRange, setDashboardRange] = useState("24h");
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [instrumentStatusFilter, setInstrumentStatusFilter] = useState("All");
  const [expandedInstrument, setExpandedInstrument] = useState("");
  const [spcPartNumber, setSpcPartNumber] = useState("");
  const [eventDraft, setEventDraft] = useState({
    description: "",
    severity: "Medium" as QualityEvent["severity"],
    source: "",
  });
  const [partDraft, setPartDraft] = useState({
    number: "",
    name: "",
    characteristic: "Width",
    nominal: "",
    lsl: "",
    usl: "",
    unit: "mm",
  });
  const [settingsDraft, setSettingsDraft] = useState(data.settings);
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [reportType, setReportType] = useState("Daily quality summary");
  const [reports, setReports] = useState<string[]>([]);
  const [reportStart, setReportStart] = useState("");
  const [reportEnd, setReportEnd] = useState("");
  const [reportPart, setReportPart] = useState("All");
  const [instrumentDraft, setInstrumentDraft] = useState({ name: "", model: "" });

  const partByNumber = useMemo(
    () => new Map(data.parts.map((part) => [part.number, part])),
    [data.parts],
  );
  const filteredMeasurements = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.measurements
      .filter((item) => {
        const searchText = [
          item.id,
          item.partNumber,
          item.batchId,
          item.serialNumber,
          item.characteristic,
          item.instrumentId,
          item.operator,
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!normalized || searchText.includes(normalized)) &&
          (statusFilter === "All" || item.status === statusFilter) &&
          (instrumentFilter === "All" || item.instrumentId === instrumentFilter) &&
          (partFilter === "All" || item.partNumber === partFilter) &&
          (!startDate || item.timestamp.slice(0, 10) >= startDate) &&
          (!endDate || item.timestamp.slice(0, 10) <= endDate)
        );
      })
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  }, [data.measurements, endDate, instrumentFilter, partFilter, query, startDate, statusFilter]);
  const reportMeasurements = useMemo(
    () =>
      data.measurements.filter(
        (item) =>
          (reportPart === "All" || item.partNumber === reportPart) &&
          (!reportStart || item.timestamp.slice(0, 10) >= reportStart) &&
          (!reportEnd || item.timestamp.slice(0, 10) <= reportEnd),
      ),
    [data.measurements, reportEnd, reportPart, reportStart],
  );
  const reportPass = reportMeasurements.filter((item) => item.status === "PASS").length;
  const reportFail = reportMeasurements.filter((item) => item.status === "FAIL").length;
  const reportRate = reportPass + reportFail
    ? Math.round((reportPass / (reportPass + reportFail)) * 100)
    : 0;

  const passCount = data.measurements.filter((item) => item.status === "PASS").length;
  const failCount = data.measurements.filter((item) => item.status === "FAIL").length;
  const invalidCount = data.measurements.filter((item) => item.status === "INVALID").length;
  const validCount = passCount + failCount;
  const passRate = validCount ? Math.round((passCount / validCount) * 100) : 0;
  const openEvents = data.events.filter((event) => event.status !== "Resolved").length;
  const matchingInstruments = data.instruments.filter((instrument) => {
    const searchText = `${instrument.name} ${instrument.id} ${instrument.model} ${instrument.line} ${instrument.gatewayId}`.toLowerCase();
    return (
      (!instrumentSearch.trim() || searchText.includes(instrumentSearch.trim().toLowerCase())) &&
      (instrumentStatusFilter === "All" ||
        (instrumentStatusFilter === "Online" ? instrument.online : !instrument.online))
    );
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!activeForStreaming || !streaming || activeSection !== "live-measurements") return;
    const timer = window.setInterval(() => {
      setData((current) => {
        const availableParts = current.parts.filter((part) => part.active);
        const part = availableParts[current.measurements.length % Math.max(availableParts.length, 1)];
        if (!part) return current;
        const instruments = current.instruments.filter((instrument) => instrument.online);
        const instrument = instruments[current.measurements.length % Math.max(instruments.length, 1)];
        if (!instrument) return current;
        const sequence = current.measurements.length;
        const value =
          sequence % 29 === 0
            ? Number((part.usl + (part.usl - part.lsl) * 0.2).toFixed(3))
            : Number(
                (part.nominal + Math.sin(sequence * 1.91) * (part.usl - part.lsl) * 0.24).toFixed(3),
              );
        const timestamp = new Date().toISOString();
        const measurement: Measurement = {
          id: `ME-${String(10_000 + sequence)}`,
          timestamp,
          partNumber: part.number,
          batchId: `B-${String(260_100 + Math.floor(sequence / 12))}`,
          serialNumber: `SN-${String(70_000 + sequence)}`,
          characteristic: part.characteristic,
          value,
          unit: part.unit,
          instrumentId: instrument.id,
          operator: "A. Patel",
          status: measurementStatus(value, part),
        };
        const hasActiveEvent = current.events.some(
          (event) =>
            event.source === instrument.id &&
            event.type === "Out-of-tolerance measurement" &&
            event.status !== "Resolved",
        );
        const newEvent =
          measurement.status === "FAIL" && !hasActiveEvent
            ? [{
                id: `QE-${Date.now()}`,
                type: "Out-of-tolerance measurement",
                severity: "High" as const,
                description: `${measurement.characteristic} measured ${measurement.value} ${measurement.unit}, outside specification.`,
                timestamp,
                source: instrument.id,
                measurementId: measurement.id,
                status: "Open" as const,
                assignedTo: "Unassigned",
                notes: "",
              }]
            : [];
        return {
          ...current,
          measurements: [...current.measurements, measurement],
          events: [...newEvent, ...current.events],
        };
      });
    }, data.settings.demoIntervalSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [activeForStreaming, activeSection, data.settings.demoIntervalSeconds, setData, streaming]);

  useEffect(() => {
    setSettingsDraft(data.settings);
  }, [data.settings]);

  useEffect(() => {
    const updateTime = () => setLastUpdated(formatTimestamp(new Date().toISOString()));
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const exportMeasurements = (filename: string) => {
    const rows = filteredMeasurements.map((item) => {
      const part = partByNumber.get(item.partNumber);
      return {
        timestamp: item.timestamp,
        measurementId: item.id,
        partNumber: item.partNumber,
        serialNumber: item.serialNumber,
        batchId: item.batchId,
        characteristic: item.characteristic,
        value: item.value,
        unit: item.unit,
        nominal: part?.nominal ?? "",
        lsl: part?.lsl ?? "",
        usl: part?.usl ?? "",
        deviation: item.value === null || !part ? "" : Number((item.value - part.nominal).toFixed(3)),
        instrumentId: item.instrumentId,
        status: item.status,
      };
    });
    if (!downloadCsv(filename, rows)) setNotice("No matching records to export.");
  };

  const toggleInstrument = (id: string) => {
    setData((current) => {
      const instrument = current.instruments.find((item) => item.id === id);
      if (!instrument) return current;
      const reconnecting = !instrument.online;
      const events = reconnecting
        ? current.events.map((event) =>
            event.source === id &&
            event.type === "Instrument disconnected" &&
            event.status !== "Resolved"
              ? { ...event, status: "Resolved" as const }
              : event,
          )
        : current.events.some(
              (event) =>
                event.source === id &&
                event.type === "Instrument disconnected" &&
                event.status !== "Resolved",
            )
          ? current.events
          : [
              {
                id: `QE-${Date.now()}`,
                type: "Instrument disconnected",
                severity: "High" as const,
                description: `${instrument.name} was marked offline in the demo simulator.`,
                timestamp: new Date().toISOString(),
                source: id,
                measurementId: "",
                status: "Open" as const,
                assignedTo: "Unassigned",
                notes: "",
              },
              ...current.events,
            ];
      return {
        ...current,
        events,
        instruments: current.instruments.map((item) =>
          item.id === id
            ? { ...item, online: reconnecting, lastSeen: new Date().toISOString() }
            : item,
        ),
      };
    });
  };

  const addInstrument = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = instrumentDraft.name.trim();
    if (!name || !instrumentDraft.model.trim()) {
      setNotice("Enter an instrument name and model.");
      return;
    }
    const id = `INS-${String(data.instruments.length + 1).padStart(3, "0")}`;
    if (data.instruments.some((instrument) => instrument.id === id)) {
      setNotice("The next instrument ID already exists.");
      return;
    }
    setData((current) => ({
      ...current,
      instruments: [
        ...current.instruments,
        {
          id,
          name,
          manufacturer: "Demo device",
          model: instrumentDraft.model.trim(),
          type: "Laser displacement",
          line: current.settings.productionLine,
          gatewayId: current.gateways[0]?.id ?? "Unassigned",
          online: false,
          lastSeen: new Date().toISOString(),
          firmware: "Demo",
          calibrationDue: "Not configured",
        },
      ],
    }));
    setInstrumentDraft({ name: "", model: "" });
    setNotice(`${id} was added as an offline demo instrument.`);
  };

  const addPart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nominal = Number(partDraft.nominal);
    const lsl = Number(partDraft.lsl);
    const usl = Number(partDraft.usl);
    if (!partDraft.number.trim() || !partDraft.name.trim()) {
      setNotice("Enter a part number and name.");
      return;
    }
    if (![nominal, lsl, usl].every(Number.isFinite) || lsl > nominal || nominal > usl || lsl >= usl) {
      setNotice("Limits must be valid and satisfy LSL ≤ nominal ≤ USL.");
      return;
    }
    if (data.parts.some((part) => part.number === partDraft.number.trim())) {
      setNotice("That part number already exists.");
      return;
    }
    setData((current) => ({
      ...current,
      parts: [
        ...current.parts,
        {
          number: partDraft.number.trim(),
          name: partDraft.name.trim(),
          revision: "A",
          characteristic: partDraft.characteristic,
          nominal,
          lsl,
          usl,
          unit: partDraft.unit,
          active: true,
        },
      ],
    }));
    setPartDraft({ number: "", name: "", characteristic: "Width", nominal: "", lsl: "", usl: "", unit: "mm" });
    setNotice("Part created in the local demo workspace.");
  };

  const matchingTrace = data.measurements
    .filter((item) =>
      (!traceQuery.trim() ||
        [item.id, item.partNumber, item.serialNumber, item.batchId]
          .join(" ")
          .toLowerCase()
          .includes(traceQuery.trim().toLowerCase())) &&
      (tracePart === "All" || item.partNumber === tracePart) &&
      (!traceStart || item.timestamp.slice(0, 10) >= traceStart) &&
      (!traceEnd || item.timestamp.slice(0, 10) <= traceEnd),
    )
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  const traceRecords = traceSearched ? matchingTrace : [];

  const shell = (title: string, description: string, content: React.ReactNode) => (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl"
      initial={{ opacity: 0, y: 6 }}
      key={activeSection}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <PageIntro title={title} description={description} />
      {notice && (
        <div role="status" className="mb-4 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
          <span>{notice}</span>
          <button aria-label="Dismiss notification" className="rounded p-1" onClick={() => setNotice("")} type="button">
            <IconX aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
      {content}
    </motion.div>
  );

  switch (activeSection) {
    case "overview": {
      const rangeMs = dashboardRange === "24h"
        ? 24 * 60 * 60 * 1000
        : dashboardRange === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;
      const rangeLabel = dashboardRange === "24h" ? "24 hours" : dashboardRange === "7d" ? "7 days" : "30 days";
      const daily = hasMounted
        ? data.measurements.filter(
            (item) => Date.now() - new Date(item.timestamp).getTime() < rangeMs,
          )
        : [];
      const recent = [...data.measurements]
        .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
        .slice(0, 6);
      const latestEvents = [...data.events]
        .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
        .slice(0, 4);
      const volumeBuckets = Array.from({ length: 12 }, (_, index) => {
        if (!hasMounted) return 0;
        const bucketEnd = rangeMs * (index + 1) / 12;
        const bucketStart = rangeMs * index / 12;
        return data.measurements.filter((item) => {
          const age = Date.now() - new Date(item.timestamp).getTime();
          return age >= bucketStart && age < bucketEnd;
        }).length;
      });
      const maxBucket = Math.max(...volumeBuckets, 1);
      const trendPoints = volumeBuckets.map((value, index) =>
        `${32 + (index / Math.max(volumeBuckets.length - 1, 1)) * 660},${152 - (value / maxBucket) * 120}`,
      ).join(" ");
      const trendArea = `32,152 ${trendPoints} 692,152`;
      const activity = [
        ...latestEvents.map((event) => ({
          id: event.id,
          label: event.description,
          detail: `${event.severity} event · ${event.status}`,
          timestamp: event.timestamp,
          kind: "event" as const,
        })),
        ...recent.slice(0, 4).map((measurement) => ({
          id: measurement.id,
          label: `${measurement.characteristic} ${measurement.value ?? "Invalid"} ${measurement.unit}`,
          detail: `${measurement.partNumber} · ${measurement.instrumentId} · ${measurement.status}`,
          timestamp: measurement.timestamp,
          kind: "measurement" as const,
        })),
      ].sort((left, right) => right.timestamp.localeCompare(left.timestamp)).slice(0, 6);
      const totalStatus = Math.max(data.measurements.length, 1);
      const passAngle = (passCount / totalStatus) * 360;
      const failAngle = passAngle + (failCount / totalStatus) * 360;
      return shell("Overview Dashboard", "Quality operations at a glance. KPIs are calculated from the shared demo measurement and device data.", (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Metric label="Measurements today" value={daily.length} detail={`${data.measurements.length} total records`} icon={<IconActivity className="size-5" />} />
            <Metric label="Accepted readings" value={passCount} detail="Within specification limits" icon={<IconCircleCheck className="size-5" />} />
            <Metric label="Rejected readings" value={failCount} detail={`${invalidCount} invalid readings excluded`} icon={<IconAlertTriangle className="size-5" />} />
            <Metric label="Quality pass rate" value={`${passRate}%`} detail={`${passCount} pass / ${failCount} fail`} icon={<IconGauge className="size-5" />} />
            <Metric label="Active instruments" value={data.instruments.filter((item) => item.online).length} detail={`${data.instruments.length} registered · demo status`} icon={<IconCpu className="size-5" />} />
            <Metric label="Open quality events" value={openEvents} detail={`${data.events.length} total events`} icon={<IconBell className="size-5" />} />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
            <section className={cardClass}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">Production pulse</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Measurement trend</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Past {rangeLabel} · {daily.length} readings</p></div>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor="dashboard-date-range">Dashboard date range</label>
                  <select id="dashboard-date-range" aria-label="Dashboard date range" className={`${inputClass} min-h-9 w-auto py-1 text-xs`} onChange={(event) => setDashboardRange(event.target.value)} value={dashboardRange}>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                  </select>
                  <span className="hidden rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">Updated {lastUpdated || "—"}</span>
                </div>
              </div>
              <div className="h-44">
                {daily.length ? (
                  <svg aria-label={`${daily.length} measurements over the past ${rangeLabel}`} className="size-full overflow-visible" preserveAspectRatio="none" role="img" viewBox="0 0 724 170">
                    {[32, 72, 112, 152].map((yPosition) => <line key={yPosition} x1="32" x2="692" y1={yPosition} y2={yPosition} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray={yPosition === 152 ? undefined : "3 5"} />)}
                    <polygon points={trendArea} fill="#dbeafe" fillOpacity="0.72" />
                    <polyline fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={trendPoints} />
                    {volumeBuckets.map((value, index) => value > 0 && <circle key={index} cx={32 + (index / Math.max(volumeBuckets.length - 1, 1)) * 660} cy={152 - (value / maxBucket) * 120} r="3.5" fill="#2563eb" stroke="white" strokeWidth="2" />)}
                  </svg>
                ) : (
                  <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700">
                    No readings in this range.
                  </div>
                )}
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400"><span>{rangeLabel} ago</span><span>Now</span></div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-600" /> Measurements</span>
                <span>Peak bucket: {maxBucket}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800" onClick={() => onNavigate("live-measurements")} type="button">Open live monitor</button>
                <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => onNavigate("spc-analytics")} type="button">View SPC analysis</button>
              </div>
            </section>
            <section className={cardClass}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">Needs attention</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Recent quality events</h2></div>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">{openEvents} open</span>
              </div>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Prioritize current issues across the workspace</p>
              {latestEvents.length ? latestEvents.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-t border-slate-100 py-3 first:border-0 dark:border-slate-800">
                  <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-lg ${item.severity === "High" || item.severity === "Critical" ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300" : "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"}`}><IconAlertTriangle aria-hidden="true" className="size-3.5" /></span>
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium leading-5 text-slate-800 dark:text-slate-100">{item.description}</p><p className="mt-1 text-[11px] text-slate-500">{item.id} · {formatTimestamp(item.timestamp)}</p></div>
                  <StatusPill status={item.status} />
                </div>
              )) : <EmptyState message="No quality events." />}
              <button className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800" onClick={() => onNavigate("alerts-quality-events")} type="button">Go to event centre <span aria-hidden="true">→</span></button>
            </section>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <section className={cardClass}>
              <div className="flex items-start justify-between">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Quality mix</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Inspection results</h2></div>
                <span className="text-xs text-slate-500">{data.measurements.length} total</span>
              </div>
              <div className="mt-4 flex items-center gap-5">
                <div
                  aria-label={`${passCount} pass, ${failCount} fail, ${invalidCount} invalid`}
                  className="relative grid size-28 shrink-0 place-items-center rounded-full"
                  role="img"
                  style={{ background: `conic-gradient(#10b981 0 ${passCount / totalStatus * 100}%, #f43f5e ${passCount / totalStatus * 100}% ${(passCount + failCount) / totalStatus * 100}%, #f59e0b ${(passCount + failCount) / totalStatus * 100}% 100%)` }}
                >
                  <div className="grid size-[76px] place-items-center rounded-full bg-white text-center dark:bg-slate-900">
                    <div><p className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">{passRate}%</p><p className="text-[9px] font-semibold uppercase text-slate-400">Pass rate</p></div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-2 text-xs">
                  {[["Pass", passCount, "bg-emerald-500"], ["Fail", failCount, "bg-rose-500"], ["Invalid", invalidCount, "bg-amber-500"]].map(([label, count, color]) => (
                    <div className="flex items-center justify-between gap-3" key={label}>
                      <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className={`size-2 rounded-full ${color}`} />{label}</span>
                      <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[10px] text-slate-500"><span>Accepted to target</span><span>{passRate}%</span></div>
                <div aria-label={`Quality pass rate ${passRate}%`} className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-valuenow={passRate} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${passRate}%` }} />
                </div>
              </div>
            </section>
            <section className={cardClass}>
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">Device status</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Instruments</h2></div>
                <button className="text-[11px] font-semibold text-blue-700 hover:underline dark:text-blue-400" onClick={() => onNavigate("instrument-management")} type="button">View all</button>
              </div>
              <div className="mt-3 space-y-2">
                {data.instruments.slice(0, 3).map((instrument) => (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 dark:border-slate-800" key={instrument.id}>
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${instrument.online ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"}`}><IconCpu aria-hidden="true" className="size-4" /></span>
                    <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{instrument.name}</p><p className="text-[10px] text-slate-500">{instrument.id} · {formatTimestamp(instrument.lastSeen)}</p></div>
                    <StatusPill status={instrument.online ? "Online" : "Offline"} />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-400">Connection status is simulated demo data.</p>
            </section>
            <section className={cardClass}>
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-400">Workspace feed</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Recent activity</h2></div>
                <span className="text-[10px] text-slate-400">Latest 6</span>
              </div>
              {activity.length ? (
                <ol className="mt-3 space-y-3">
                  {activity.map((item) => (
                    <li className="flex gap-3" key={`${item.kind}-${item.id}`}>
                      <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full ${item.kind === "event" ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300" : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}`}>
                        {item.kind === "event" ? <IconBell aria-hidden="true" className="size-3.5" /> : <IconActivity aria-hidden="true" className="size-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">{item.label}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{item.detail}</p><time className="mt-0.5 block text-[10px] text-slate-400" dateTime={item.timestamp}>{formatTimestamp(item.timestamp)}</time></div>
                    </li>
                  ))}
                </ol>
              ) : <EmptyState message="No recent activity." />}
            </section>
          </div>
          <section className={cardClass}>
            <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Latest activity</p><h2 className="mt-1 font-semibold text-slate-900 dark:text-white">Recent measurements</h2></div><span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{data.measurements.length} records</span></div>
            <MeasurementRows rows={recent} parts={data.parts} />
          </section>
        </div>
      ));
    }
    case "live-measurements":
    case "history-data-explorer": {
      const live = activeSection === "live-measurements";
      const title = live ? "Live Measurements" : "History & Data Explorer";
      const description = live
        ? "Monitor simulated incoming readings. No physical measurement devices are connected."
        : "Search and export persistent historical readings from the shared workspace.";
      const latestMeasurement = filteredMeasurements[0];
      const latestPart = latestMeasurement
        ? partByNumber.get(latestMeasurement.partNumber)
        : undefined;
      const livePoints = filteredMeasurements
        .filter((item) => item.value !== null)
        .slice(0, 24)
        .reverse();
      const liveValues = livePoints.map((item) => item.value as number);
      const liveMin = latestPart ? latestPart.lsl - (latestPart.usl - latestPart.lsl) * 0.15 : Math.min(...liveValues, 0);
      const liveMax = latestPart ? latestPart.usl + (latestPart.usl - latestPart.lsl) * 0.15 : Math.max(...liveValues, 1);
      const liveX = (index: number) => 24 + index / Math.max(liveValues.length - 1, 1) * 652;
      const liveY = (value: number) => 136 - (value - liveMin) / Math.max(liveMax - liveMin, 0.001) * 112;
      const liveChartPoints = liveValues.map((value, index) => `${liveX(index)},${liveY(value)}`).join(" ");
      return shell(title, description, (
        <div className="space-y-4">
          {live && (
            <section className={cardClass}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`grid size-10 place-items-center rounded-xl ${streaming ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}><IconActivity aria-hidden="true" className="size-5" /></span>
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Latest reading · demo stream</p><p className="mt-1 text-xs text-slate-500">{latestMeasurement ? `${latestMeasurement.characteristic} · ${latestMeasurement.instrumentId} · ${formatTimestamp(latestMeasurement.timestamp)}` : "No measurement available"}</p></div>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ${streaming ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  <span className={`size-2 rounded-full ${streaming ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
                  {streaming ? "SIMULATED · RUNNING" : "SIMULATED · PAUSED"}
                </span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Most recent value</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="font-mono text-4xl font-semibold tabular-nums text-slate-950 dark:text-white">{latestMeasurement?.value?.toFixed(3) ?? "—"}</p>
                    <span className="text-sm font-semibold text-slate-500">{latestMeasurement?.unit ?? "unit"}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusPill status={latestMeasurement?.status ?? "No data"} />
                    <span className="text-[11px] text-slate-500">{latestPart ? `LSL ${latestPart.lsl} · Nominal ${latestPart.nominal} · USL ${latestPart.usl} ${latestPart.unit}` : "No specification available"}</span>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400">Instrument connection is simulated; no physical hardware is connected.</p>
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Recent readings</p><p className="text-[10px] text-slate-500">{latestPart?.characteristic ?? "Selected filters"} · limits shown separately</p></div>
                  <div className="h-36 w-full">
                    {liveValues.length ? (
                      <svg aria-label="Recent measurement trend with specification limits" className="size-full overflow-visible" preserveAspectRatio="none" role="img" viewBox="0 0 700 150">
                        {latestPart && <><line x1="24" x2="676" y1={liveY(latestPart.usl)} y2={liveY(latestPart.usl)} stroke="#ef4444" strokeDasharray="5 4" /><line x1="24" x2="676" y1={liveY(latestPart.nominal)} y2={liveY(latestPart.nominal)} stroke="#2563eb" strokeDasharray="4 4" /><line x1="24" x2="676" y1={liveY(latestPart.lsl)} y2={liveY(latestPart.lsl)} stroke="#ef4444" strokeDasharray="5 4" /></>}
                        {liveValues.length > 1 && <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={liveChartPoints} />}
                        {liveValues.map((value, index) => <circle key={livePoints[index].id} cx={liveX(index)} cy={liveY(value)} r="3" fill={latestPart && (value < latestPart.lsl || value > latestPart.usl) ? "#e11d48" : "#2563eb"} />)}
                      </svg>
                    ) : <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 dark:border-slate-700">No numeric readings match these filters.</div>}
                  </div>
                  {latestPart && <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-slate-500"><span><i className="mr-1 inline-block w-4 border-t border-dashed border-rose-500" />LSL / USL</span><span><i className="mr-1 inline-block w-4 border-t border-dashed border-blue-600" />Nominal</span></div>}
                </div>
              </div>
            </section>
          )}
          <section className={cardClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <label className="relative min-w-[220px] flex-1">
                  <IconSearch aria-hidden="true" className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input aria-label="Search measurements" className={`${inputClass} pl-9`} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, part, batch, instrument…" value={query} />
                </label>
                <select aria-label="Filter by measurement status" className={`${inputClass} w-auto min-w-32`} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                  <option>All</option><option>PASS</option><option>FAIL</option><option>INVALID</option>
                </select>
                <select aria-label="Filter by instrument" className={`${inputClass} w-auto min-w-36`} onChange={(event) => setInstrumentFilter(event.target.value)} value={instrumentFilter}>
                  <option value="All">All instruments</option>{data.instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.id}</option>)}
                </select>
                <select aria-label="Filter by part" className={`${inputClass} w-auto min-w-28`} onChange={(event) => setPartFilter(event.target.value)} value={partFilter}>
                  <option value="All">All parts</option>{data.parts.map((part) => <option key={part.number} value={part.number}>{part.number}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {live && <button aria-pressed={streaming} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white ${streaming ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`} onClick={() => setStreaming((value) => !value)} type="button">{streaming ? <><IconActivity className="size-4" /> Pause stream</> : <><IconActivity className="size-4" /> Start stream</>}</button>}
                <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200" onClick={() => exportMeasurements(live ? "gap-it-live-measurements.csv" : "gap-it-measurement-history.csv")} type="button"><IconDownload className="size-4" /> CSV</button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{filteredMeasurements.length} matching records</span>
              <span>{passCount} pass</span><span>{failCount} fail</span><span>{invalidCount} invalid</span>
              {live && <span className="inline-flex items-center gap-1.5"><span className={`size-2 rounded-full ${streaming ? "animate-pulse bg-emerald-500" : "bg-slate-300"}`} />{streaming ? `Simulated stream · ${data.settings.demoIntervalSeconds}s interval` : "Stream paused"}</span>}
            </div>
            {!live && <div className="mt-3 grid gap-2 sm:grid-cols-2"><label className="text-xs font-medium text-slate-500">From date<input aria-label="History start date" className={`${inputClass} mt-1`} onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} /></label><label className="text-xs font-medium text-slate-500">To date<input aria-label="History end date" className={`${inputClass} mt-1`} onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} /></label></div>}
          </section>
          <section className={`${cardClass} p-2 md:p-4`}><MeasurementRows rows={filteredMeasurements.slice(0, 100)} parts={data.parts} /></section>
        </div>
      ));
    }
    case "instrument-management":
      return shell("Instrument and Gateway Management", "Review demo device records, their simulated connection state, calibration dates, and assigned gateways.", (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Registered instruments" value={data.instruments.length} detail="Demo inventory" icon={<IconCpu className="size-5" />} />
            <Metric label="Connected" value={data.instruments.filter((item) => item.online).length} detail="Simulated status only" icon={<IconWifi className="size-5" />} />
            <Metric label="Gateways" value={data.gateways.length} detail={`${data.gateways.filter((item) => item.online).length} online`} icon={<IconDatabase className="size-5" />} />
          </div>
          <section className={cardClass}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900 dark:text-white">Instruments</h2>
              <div className="flex flex-wrap gap-2">
                <label className="relative">
                  <IconSearch aria-hidden="true" className="absolute left-3 top-3 size-4 text-slate-400" />
                  <input aria-label="Search instruments" className={`${inputClass} w-52 pl-9`} onChange={(event) => setInstrumentSearch(event.target.value)} placeholder="Search devices…" value={instrumentSearch} />
                </label>
                <select aria-label="Filter instruments by status" className={`${inputClass} w-auto min-w-28`} onChange={(event) => setInstrumentStatusFilter(event.target.value)} value={instrumentStatusFilter}>
                  <option>All</option><option>Online</option><option>Offline</option>
                </select>
              </div>
              <form className="flex flex-wrap gap-2" onSubmit={addInstrument}>
                <input aria-label="New instrument name" className={`${inputClass} w-44`} onChange={(event) => setInstrumentDraft({ ...instrumentDraft, name: event.target.value })} placeholder="Instrument name" value={instrumentDraft.name} />
                <input aria-label="New instrument model" className={`${inputClass} w-36`} onChange={(event) => setInstrumentDraft({ ...instrumentDraft, model: event.target.value })} placeholder="Model" value={instrumentDraft.model} />
                <button className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800" type="submit"><IconPlus className="size-4" /> Register</button>
              </form>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 dark:border-slate-800"><tr>{["Instrument", "Type / model", "Line", "Gateway", "Calibration due", "Status", "Action"].map((name) => <th key={name} className="px-3 py-3 font-semibold">{name}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{matchingInstruments.map((item) => <tr key={item.id}>
                <td className="px-3 py-3"><span className="block font-semibold text-slate-800 dark:text-slate-100">{item.name}</span><span className="text-slate-500">{item.id} · {item.manufacturer}</span></td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{item.type}<span className="block text-slate-500">{item.model} · FW {item.firmware}</span></td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{item.line}</td><td className="px-3 py-3 text-slate-700 dark:text-slate-300">{item.gatewayId}</td>
                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{item.calibrationDue}{item.calibrationDue !== "Not configured" && item.calibrationDue < new Date().toISOString().slice(0, 10) && <span className="mt-1 block text-[10px] font-semibold text-rose-600">Calibration overdue</span>}</td><td className="px-3 py-3"><StatusPill status={item.online ? "Online" : "Offline"} /></td>
                <td className="px-3 py-3"><div className="flex items-center gap-2"><button aria-expanded={expandedInstrument === item.id} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-slate-800" onClick={() => setExpandedInstrument(expandedInstrument === item.id ? "" : item.id)} type="button">{expandedInstrument === item.id ? "Hide details" : "Details"}</button><button className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200" onClick={() => toggleInstrument(item.id)} type="button">{item.online ? "Simulate offline" : "Simulate reconnect"}</button></div></td>
              </tr>)}</tbody>
            </table></div>
            {!matchingInstruments.length && <EmptyState message="No instruments match the selected search and status filter." />}
            {expandedInstrument && data.instruments.filter((item) => item.id === expandedInstrument).map((item) => (
              <aside aria-label={`${item.name} device details`} className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/30" key={item.id}>
                <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900 dark:text-white">{item.name} · {item.id}</h3><p className="mt-1 text-xs text-slate-500">{item.manufacturer} {item.model} · {item.type}</p></div><StatusPill status={item.online ? "Online" : "Offline"} /></div>
                <div className="mt-3 grid gap-3 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-4"><span>Production line <b className="mt-1 block text-slate-900 dark:text-white">{item.line}</b></span><span>Gateway <b className="mt-1 block text-slate-900 dark:text-white">{item.gatewayId}</b></span><span>Last communication <b className="mt-1 block text-slate-900 dark:text-white">{formatTimestamp(item.lastSeen)}</b></span><span>Calibration due <b className="mt-1 block text-slate-900 dark:text-white">{item.calibrationDue}</b></span></div>
              </aside>
            ))}
          </section>
          <section className={cardClass}>
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Calibration and device records</h2>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Demo instruments and gateway values are sample records only. No physical hardware, network connection, calibration source, or diagnostic command has been verified. The reconnect action only changes this browser’s simulated status.</p>
          </section>
          <section className={cardClass}>
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Gateways</h2>
            <div className="grid gap-3 md:grid-cols-2">{data.gateways.map((gateway) => <div key={gateway.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex items-center justify-between"><div><p className="font-semibold text-slate-900 dark:text-white">{gateway.name}</p><p className="text-xs text-slate-500">{gateway.id} · {gateway.protocol}</p></div><StatusPill status={gateway.online ? "Online" : "Offline"} /></div><div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500"><span>Address<br /><b className="text-slate-700 dark:text-slate-200">{gateway.address}</b></span><span>Messages<br /><b className="text-slate-700 dark:text-slate-200">{gateway.messageCount.toLocaleString()}</b></span><span>Errors<br /><b className="text-slate-700 dark:text-slate-200">{gateway.errors}</b></span></div></div>)}</div>
          </section>
        </div>
      ));
    case "spc-analytics": {
      const part = data.parts.find((item) => item.number === spcPartNumber) ?? data.parts[0];
      const values = data.measurements
        .filter((item) => item.partNumber === part?.number && item.value !== null)
        .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
        .map((item) => item.value as number);
      const stats = calculateStatistics(values);
      const sortedValues = [...values].sort((left, right) => left - right);
      const median = sortedValues.length
        ? sortedValues.length % 2
          ? sortedValues[(sortedValues.length - 1) / 2]
          : (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
        : null;
      const movingRanges = values.slice(1).map((value, index) => Math.abs(value - values[index]));
      const cp = stats && part && stats.standardDeviation > 0
        ? (part.usl - part.lsl) / (6 * stats.standardDeviation)
        : null;
      const cpk = stats && part && stats.standardDeviation > 0
        ? Math.min(part.usl - stats.mean, stats.mean - part.lsl) / (3 * stats.standardDeviation)
        : null;
      const movingRangeMean =
        movingRanges.length
          ? movingRanges.reduce((sum, value) => sum + value, 0) / movingRanges.length
          : 0;
      const movingRangeUcl = movingRangeMean * 3.267;
      const movingRangeAxisMax = Math.max(...movingRanges, movingRangeUcl, 0.001);
      const movingRangeY = (value: number) => 144 - (value / movingRangeAxisMax) * 120;
      const ucl = stats && values.length > 1 ? stats.mean + 2.66 * movingRangeMean : null;
      const lcl = stats && values.length > 1 ? stats.mean - 2.66 * movingRangeMean : null;
      const points = values.slice(-40);
      const axisMin = Math.min(part?.lsl ?? 0, lcl ?? 0);
      const axisMax = Math.max(part?.usl ?? 1, ucl ?? 1);
      const axisPadding = (axisMax - axisMin) * 0.15 || 1;
      const minAxis = axisMin - axisPadding;
      const maxAxis = axisMax + axisPadding;
      const y = (value: number) => 176 - ((value - minAxis) / (maxAxis - minAxis)) * 150;
      const x = (index: number) => 42 + (index / Math.max(points.length - 1, 1)) * 690;
      const histogram = Array.from({ length: 8 }, (_, index) => {
        const width = (maxAxis - minAxis) / 8;
        return values.filter(
          (value) =>
            value >= minAxis + width * index &&
            (index === 7 ? value <= minAxis + width * (index + 1) : value < minAxis + width * (index + 1)),
        ).length;
      });
      const histogramMax = Math.max(...histogram, 1);
      return shell("SPC Analytics", "Individuals and moving-range charts, statistics, and capability estimates for a selected part. Capability is calculated only with specification limits and at least 30 valid observations.", (
        <div className="space-y-4">
          <section className={cardClass}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-900 dark:text-white">{part ? `${part.number} · ${part.characteristic} · Individuals chart` : "Individuals chart"}</h2><p className="text-xs text-slate-500 dark:text-slate-400">{part?.unit ?? "unit"} · n={points.length} latest observations · illustrative demo analysis</p></div><label className="text-xs font-medium text-slate-500">Part<select aria-label="SPC analysis part" className={`${inputClass} mt-1 min-w-32`} onChange={(event) => setSpcPartNumber(event.target.value)} value={part?.number ?? ""}>{data.parts.map((candidate) => <option key={candidate.number} value={candidate.number}>{candidate.number} · {candidate.name}</option>)}</select></label><span className="text-xs text-slate-500">Specification limits ≠ control limits</span></div>
            <div className="mt-4 overflow-x-auto"><svg aria-label="Individuals control chart with specification boundaries" className="min-w-[700px]" role="img" viewBox="0 0 760 210">
              {ucl !== null && <line x1="42" x2="735" y1={y(ucl)} y2={y(ucl)} stroke="#8b5cf6" strokeDasharray="3 4" />}
              {lcl !== null && <line x1="42" x2="735" y1={y(lcl)} y2={y(lcl)} stroke="#8b5cf6" strokeDasharray="3 4" />}
              <line x1="42" x2="735" y1={y(part?.usl ?? maxAxis)} y2={y(part?.usl ?? maxAxis)} stroke="#ef4444" strokeDasharray="5 4" /><line x1="42" x2="735" y1={y(part?.nominal ?? 0)} y2={y(part?.nominal ?? 0)} stroke="#2563eb" strokeDasharray="4 4" /><line x1="42" x2="735" y1={y(part?.lsl ?? minAxis)} y2={y(part?.lsl ?? minAxis)} stroke="#ef4444" strokeDasharray="5 4" />
              {ucl !== null && <text x="4" y={y(ucl) - 4} fill="#8b5cf6" fontSize="10">UCL</text>}
              {lcl !== null && <text x="4" y={y(lcl) - 4} fill="#8b5cf6" fontSize="10">LCL</text>}
              <text x="4" y={y(part?.usl ?? maxAxis) - 4} fill="#ef4444" fontSize="10">USL</text><text x="4" y={y(part?.nominal ?? 0) - 4} fill="#2563eb" fontSize="10">Nominal</text><text x="4" y={y(part?.lsl ?? minAxis) - 4} fill="#ef4444" fontSize="10">LSL</text>
              {points.length > 1 && <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={points.map((value, index) => `${x(index)},${y(value)}`).join(" ")} />}
              {points.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r="3.2" fill={value < (part?.lsl ?? -Infinity) || value > (part?.usl ?? Infinity) ? "#dc2626" : value < (lcl ?? -Infinity) || value > (ucl ?? Infinity) ? "#8b5cf6" : "#2563eb"} />)}
              <line x1="42" x2="735" y1="180" y2="180" stroke="#cbd5e1" /><text x="42" y="199" fill="#64748b" fontSize="10">Earlier observations</text><text x="680" y="199" fill="#64748b" fontSize="10">Latest</text>
            </svg></div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500"><span><i className="mr-1 inline-block w-4 border-t border-dashed border-rose-500" />LSL / USL · specification</span><span><i className="mr-1 inline-block w-4 border-t border-dashed border-violet-500" />LCL / UCL · control</span><span><i className="mr-1 inline-block w-4 border-t border-dashed border-blue-600" />Nominal</span></div>
          </section>
          <section className={cardClass}><div className="mb-3"><h2 className="font-semibold text-slate-900 dark:text-white">Moving range chart</h2><p className="text-xs text-slate-500 dark:text-slate-400">Absolute difference between consecutive readings · MR̄={movingRangeMean.toFixed(4)} {part?.unit ?? ""}</p></div>
            {movingRanges.length ? <svg aria-label="Moving range chart of consecutive reading differences" className="h-40 w-full overflow-visible" preserveAspectRatio="none" role="img" viewBox="0 0 760 170">
             {[24, 64, 104, 144].map((yPosition) => <line key={yPosition} x1="42" x2="735" y1={yPosition} y2={yPosition} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 5" />)}
             <line x1="42" x2="735" y1={movingRangeY(movingRangeUcl)} y2={movingRangeY(movingRangeUcl)} stroke="#8b5cf6" strokeDasharray="3 4" />
             <line x1="42" x2="735" y1={movingRangeY(movingRangeMean)} y2={movingRangeY(movingRangeMean)} stroke="#2563eb" strokeDasharray="4 4" />
             {movingRanges.length > 1 && <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" points={movingRanges.slice(-40).map((value, index, shown) => `${42 + index / Math.max(shown.length - 1, 1) * 693},${movingRangeY(value)}`).join(" ")} />}
             {movingRanges.slice(-40).map((value, index, shown) => <circle aria-label={`Moving range ${index + 1}: ${value.toFixed(4)}`} key={index} cx={42 + index / Math.max(shown.length - 1, 1) * 693} cy={movingRangeY(value)} r="3" fill={value > movingRangeUcl ? "#e11d48" : "#8b5cf6"} />)}
             <text x="4" y={movingRangeY(movingRangeUcl) - 4} fill="#8b5cf6" fontSize="10">UCL</text><text x="4" y={movingRangeY(movingRangeMean) - 4} fill="#2563eb" fontSize="10">MR̄</text><text x="4" y={movingRangeY(0) - 4} fill="#64748b" fontSize="10">LCL</text>
            </svg> : <EmptyState message="At least two valid readings are needed to calculate moving ranges." />}
            {movingRanges.length > 0 && <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-slate-500"><span><i className="mr-1 inline-block w-4 border-t border-dashed border-violet-500" />UCL = 3.267 × MR̄</span><span><i className="mr-1 inline-block w-4 border-t border-dashed border-blue-600" />MR̄</span><span>LCL = 0</span></div>}
          </section>
          <section className={cardClass}><div className="mb-4"><h2 className="font-semibold text-slate-900 dark:text-white">Measurement distribution</h2><p className="text-xs text-slate-500 dark:text-slate-400">Histogram of {values.length} valid {part?.number ?? "part"} readings · fixed-width bins</p></div><div className="flex h-32 items-end gap-2">{histogram.map((count, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-[10px] text-slate-500">{count || ""}</span><div className="w-full rounded-t bg-violet-500/80" style={{ height: `${Math.max((count / histogramMax) * 82, 2)}%` }} /></div>)}</div><div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>{minAxis.toFixed(2)} {part?.unit ?? ""}</span><span>{maxAxis.toFixed(2)} {part?.unit ?? ""}</span></div></section>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            <Metric label="Sample count" value={stats?.count ?? 0} detail="Valid observations" icon={<IconDatabase className="size-5" />} />
            <Metric label="Mean" value={stats?.mean.toFixed(3) ?? "—"} detail={part?.unit ?? "unit"} icon={<IconActivity className="size-5" />} />
            <Metric label="Median" value={median?.toFixed(3) ?? "—"} detail={part?.unit ?? "unit"} icon={<IconChartBar className="size-5" />} />
            <Metric label="Std. deviation" value={stats?.standardDeviation.toFixed(4) ?? "—"} detail="Sample standard deviation" icon={<IconGauge className="size-5" />} />
            <Metric label="Cp / Cpk" value={stats && stats.count >= 30 && cp !== null && cpk !== null ? `${cp.toFixed(2)} / ${cpk.toFixed(2)}` : "Insufficient data"} detail={stats && stats.count < 30 ? "Requires ≥30 valid observations" : `Using ${part?.number ?? "part"} specifications`} icon={<IconCircleCheck className="size-5" />} />
          </div>
          <section className={cardClass}><h2 className="font-semibold text-slate-900 dark:text-white">Calculation method</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Individuals use the sample mean and sample standard deviation (n − 1). Cp = (USL − LSL) / 6s; Cpk = min(USL − mean, mean − LSL) / 3s. Values are informational for this demo and are not a validated production study. No control limits are presented as specification limits.</p></section>
        </div>
      ));
    }
    case "spc-reports": {
      const templates = ["Daily quality summary", "Part inspection report", "Batch inspection report", "SPC control chart report", "Process capability report", "Instrument performance report", "Out-of-tolerance report", "Quality events report"];
      return shell("SPC Reports", "Create a report preview from the current shared workspace records and export its filtered data as CSV.", (
        <div className="space-y-4">
          <section className={cardClass}><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Report template<select className={`${inputClass} mt-1`} onChange={(event) => setReportType(event.target.value)} value={reportType}>{templates.map((name) => <option key={name}>{name}</option>)}</select></label><label className="text-xs font-medium text-slate-500">From date<input aria-label="Report start date" className={`${inputClass} mt-1`} onChange={(event) => setReportStart(event.target.value)} type="date" value={reportStart} /></label><label className="text-xs font-medium text-slate-500">To date<input aria-label="Report end date" className={`${inputClass} mt-1`} onChange={(event) => setReportEnd(event.target.value)} type="date" value={reportEnd} /></label><label className="text-xs font-medium text-slate-500">Part<select className={`${inputClass} mt-1`} onChange={(event) => setReportPart(event.target.value)} value={reportPart}><option value="All">All parts</option>{data.parts.map((part) => <option key={part.number}>{part.number}</option>)}</select></label><button className="inline-flex min-h-10 items-center justify-center gap-2 self-end rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800" onClick={() => { setReports((items) => [`${reportType} · ${reportMeasurements.length} records · ${new Date().toLocaleString()}`, ...items]); setNotice(`Report preview generated with ${reportMeasurements.length} matching records.`); }} type="button"><IconCheck className="size-4" /> Generate preview</button></div></section>
          <section className={cardClass}><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">GAP-IT · Quality Operations</p><h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{reportType}</h2><p className="mt-1 text-xs text-slate-500">Generated {new Date().toLocaleString()} · {reportMeasurements.length} filtered demo records{reportPart !== "All" ? ` · ${reportPart}` : ""}</p></div><button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200" onClick={() => { const rows = reportMeasurements.map((item) => { const part = partByNumber.get(item.partNumber); return { timestamp: item.timestamp, measurementId: item.id, partNumber: item.partNumber, batchId: item.batchId, characteristic: item.characteristic, value: item.value, unit: item.unit, nominal: part?.nominal ?? "", lsl: part?.lsl ?? "", usl: part?.usl ?? "", status: item.status }; }); if (!downloadCsv("gap-it-spc-report.csv", rows)) setNotice("No report records to export."); }} type="button"><IconDownload className="size-4" /> Export report CSV</button></div><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"><Metric label="Sample size" value={reportMeasurements.length} detail="Filtered records" icon={<IconDatabase className="size-5" />} /><Metric label="Pass" value={reportPass} detail="Within specification" icon={<IconCircleCheck className="size-5" />} /><Metric label="Fail" value={reportFail} detail="Outside specification" icon={<IconAlertTriangle className="size-5" />} /><Metric label="Pass rate" value={`${reportRate}%`} detail="Excludes invalid readings" icon={<IconGauge className="size-5" />} /></div><div className="mt-4"><MeasurementRows rows={reportMeasurements.slice(0, 8)} parts={data.parts} /></div></section>
          <section className={cardClass}><h2 className="font-semibold text-slate-900 dark:text-white">Report history</h2>{reports.length ? reports.map((report, index) => <p key={`${report}-${index}`} className="border-t border-slate-100 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">{report}</p>) : <EmptyState message="Generated previews will appear here during this session." />}</section>
        </div>
      ));
    }
    case "part-inspection-setup":
      return shell("Part and Inspection Setup", "Maintain part revisions and characteristic specifications. Existing measurement records retain their historical values.", (
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <section className={cardClass}><h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Part catalogue · active revision</h2><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="border-b border-slate-200 text-[10px] uppercase text-slate-500 dark:border-slate-800"><tr>{["Part", "Revision", "Characteristic", "Nominal", "LSL", "USL", "Status"].map((x) => <th key={x} className="px-2 py-3 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{data.parts.map((part) => <tr key={part.number}><td className="px-2 py-3"><b className="text-slate-800 dark:text-slate-100">{part.number}</b><span className="block text-slate-500">{part.name}</span></td><td className="px-2 py-3 text-slate-700 dark:text-slate-300">{part.revision}</td><td className="px-2 py-3 text-slate-700 dark:text-slate-300">{part.characteristic}</td><td className="px-2 py-3 font-mono">{part.nominal} {part.unit}</td><td className="px-2 py-3 font-mono">{part.lsl}</td><td className="px-2 py-3 font-mono">{part.usl}</td><td className="px-2 py-3"><StatusPill status={part.active ? "Active" : "Inactive"} /></td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-slate-500">Inspection plans and immutable historical revisions require a backend before multi-user production use.</p></section>
          <section className={cardClass}><h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Add a demo part</h2><form className="space-y-3" onSubmit={addPart}><div className="grid grid-cols-2 gap-2"><input aria-label="Part number" className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, number: e.target.value })} placeholder="Part number" value={partDraft.number} /><input aria-label="Part name" className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, name: e.target.value })} placeholder="Name" value={partDraft.name} /></div><input aria-label="Characteristic name" className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, characteristic: e.target.value })} placeholder="Characteristic" value={partDraft.characteristic} /><label className="block text-xs font-medium text-slate-500">Measurement unit<select aria-label="Measurement unit" className={`${inputClass} mt-1`} onChange={(e) => setPartDraft({ ...partDraft, unit: e.target.value })} value={partDraft.unit}>{["mm", "cm", "m", "in", "°C", "°F", "N", "kg"].map((unit) => <option key={unit}>{unit}</option>)}</select></label><div className="grid grid-cols-3 gap-2"><input aria-label={`Nominal value (${partDraft.unit})`} className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, nominal: e.target.value })} placeholder="Nominal" step="any" type="number" value={partDraft.nominal} /><input aria-label={`Lower specification limit (${partDraft.unit})`} className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, lsl: e.target.value })} placeholder="LSL" step="any" type="number" value={partDraft.lsl} /><input aria-label={`Upper specification limit (${partDraft.unit})`} className={inputClass} onChange={(e) => setPartDraft({ ...partDraft, usl: e.target.value })} placeholder="USL" step="any" type="number" value={partDraft.usl} /></div><p className="text-[11px] text-slate-500">Limits are validated: LSL ≤ nominal ≤ USL. Units are recorded with the part specification.</p><button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800" type="submit"><IconPlus className="size-4" /> Add part</button></form></section>
        </div>
      ));
    case "alerts-quality-events":
      return shell("Alerts and Quality Events", "Track measurement-related demo events. Status, assignment, and investigation notes are saved with the local demo workspace.", (
        <div className="space-y-4">
        <section className={cardClass}>
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Create quality event</h2>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={(formEvent) => {
            formEvent.preventDefault();
            const description = eventDraft.description.trim();
            if (!description) {
              setNotice("Enter a description before creating the quality event.");
              return;
            }
            const timestamp = new Date().toISOString();
            const qualityEvent: QualityEvent = {
              id: `QE-${Date.now()}`,
              type: "Quality event",
              severity: eventDraft.severity,
              description,
              timestamp,
              source: eventDraft.source || "Manual entry",
              measurementId: "",
              status: "Open",
              assignedTo: "Unassigned",
              notes: "",
              rootCause: "",
              correctiveActions: [],
              statusHistory: [{ status: "Open", timestamp }],
            };
            setData((current) => ({ ...current, events: [qualityEvent, ...current.events] }));
            setEventDraft({ description: "", severity: "Medium", source: "" });
            setNotice(`${qualityEvent.id} was created in the local demo workspace.`);
          }}>
            <label className="text-xs font-medium text-slate-500 md:col-span-2">Description<textarea aria-label="New event description" className={`${inputClass} mt-1 min-h-16 py-2`} onChange={(event) => setEventDraft({ ...eventDraft, description: event.target.value })} placeholder="Describe the quality concern…" value={eventDraft.description} /></label>
            <label className="text-xs font-medium text-slate-500">Severity<select aria-label="New event severity" className={`${inputClass} mt-1`} onChange={(event) => setEventDraft({ ...eventDraft, severity: event.target.value as QualityEvent["severity"] })} value={eventDraft.severity}>{["Critical", "High", "Medium", "Low"].map((severity) => <option key={severity}>{severity}</option>)}</select></label>
            <label className="text-xs font-medium text-slate-500">Source instrument (optional)<select aria-label="Event source instrument" className={`${inputClass} mt-1`} onChange={(event) => setEventDraft({ ...eventDraft, source: event.target.value })} value={eventDraft.source}><option value="">Manual entry</option>{data.instruments.map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name} · {instrument.id}</option>)}</select></label>
            <div className="md:col-span-2"><button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800" type="submit"><IconPlus className="size-4" /> Create event</button></div>
          </form>
        </section>
        <section className={cardClass}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900 dark:text-white">{openEvents} active events</h2>
            <span className="text-xs text-slate-500">Open → Acknowledged → Investigating → Resolved</span>
          </div>
          {data.events.length ? (
            <div className="space-y-3">
              {data.events.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-[220px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <b className="text-sm text-slate-900 dark:text-white">{item.id}</b>
                        <StatusPill status={item.severity} />
                        <StatusPill status={item.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.description}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.type} · {item.source} · {formatTimestamp(item.timestamp)} {item.measurementId && `· ${item.measurementId}`}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Acknowledged", "Investigating", "Resolved"].map((status) => (
                        <button key={status} disabled={item.status === "Resolved"} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200" onClick={() => {
                          if (status === "Resolved" && !window.confirm(`Resolve ${item.id}? Confirm investigation and corrective actions are complete.`)) return;
                          setData((current) => ({ ...current, events: current.events.map((event) => event.id === item.id ? { ...event, status: status as typeof event.status, assignedTo: event.assignedTo === "Unassigned" ? "A. Patel" : event.assignedTo, statusHistory: [...(event.statusHistory ?? [{ status: event.status, timestamp: event.timestamp }]), { status: status as typeof event.status, timestamp: new Date().toISOString() }] } : event) }));
                        }} type="button">{status}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Event timeline</p>
                    <ol aria-label={`Status timeline for ${item.id}`} className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                      {(item.statusHistory ?? [{ status: item.status, timestamp: item.timestamp }]).map((step, index) => (
                        <li className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300" key={`${step.status}-${step.timestamp}-${index}`}>
                          <span className={`size-2 rounded-full ${step.status === "Resolved" ? "bg-emerald-500" : step.status === "Open" ? "bg-blue-500" : "bg-violet-500"}`} />
                          <span className="font-semibold">{step.status}</span><time className="text-slate-400" dateTime={step.timestamp}>{formatTimestamp(step.timestamp)}</time>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-[220px_1fr]">
                    <label className="text-xs font-medium text-slate-500">Assigned user
                      <select aria-label={`Assign ${item.id}`} className={`${inputClass} mt-1`} onChange={(event) => setData((current) => ({ ...current, events: current.events.map((record) => record.id === item.id ? { ...record, assignedTo: event.target.value } : record) }))} value={item.assignedTo}>
                        <option>Unassigned</option>
                        {data.users.filter((user) => user.active).map((user) => <option key={user.id}>{user.name}</option>)}
                      </select>
                    </label>
                    <div className="text-xs font-medium text-slate-500">
                      <label htmlFor={`notes-${item.id}`}>Investigation notes</label>
                      <textarea
                        id={`notes-${item.id}`}
                        aria-label={`Notes for ${item.id}`}
                        className={`${inputClass} mt-1 min-h-10 py-2`}
                        onChange={(event) =>
                          setEventNoteDrafts((drafts) => ({
                            ...drafts,
                            [item.id]: event.target.value,
                          }))
                        }
                        placeholder="Add a note to the event history…"
                        value={eventNoteDrafts[item.id] ?? item.notes}
                      />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-normal">
                          Saves to this local demo event; no external message is sent.
                        </span>
                        <StatefulButton
                          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                          onClick={async () => {
                            const note = (eventNoteDrafts[item.id] ?? item.notes).trim();
                            await new Promise<void>((resolve) =>
                              window.setTimeout(resolve, 400),
                            );
                            setData((current) => ({
                              ...current,
                              events: current.events.map((record) => {
                                if (record.id !== item.id) return record;
                                const actions = (eventActionDrafts[item.id] ?? (record.correctiveActions ?? []).join("\n"))
                                  .split("\n")
                                  .map((action) => action.trim())
                                  .filter(Boolean);
                                return {
                                  ...record,
                                  notes: note,
                                  rootCause: (eventRootDrafts[item.id] ?? record.rootCause ?? "").trim(),
                                  correctiveActions: actions,
                                  correctiveActionCompleted: actions.map((_, index) => record.correctiveActions?.[index] === actions[index] ? (record.correctiveActionCompleted?.[index] ?? false) : false),
                                };
                              }),
                            }));
                            setEventNoteDrafts((drafts) => ({
                              ...drafts,
                              [item.id]: note,
                            }));
                            setEventActionDrafts((drafts) => ({
                              ...drafts,
                              [item.id]: (eventActionDrafts[item.id] ?? (item.correctiveActions ?? []).join("\n"))
                                .split("\n")
                                .map((action) => action.trim())
                                .filter(Boolean)
                                .join("\n"),
                            }));
                          }}
                          successLabel="Saved locally"
                        >
                          Send note
                        </StatefulButton>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-slate-500">Root cause
                      <textarea aria-label={`Root cause for ${item.id}`} className={`${inputClass} mt-1 min-h-16 py-2`} onChange={(event) => setEventRootDrafts((drafts) => ({ ...drafts, [item.id]: event.target.value }))} placeholder="Document the identified cause…" value={eventRootDrafts[item.id] ?? item.rootCause ?? ""} />
                    </label>
                    <label className="text-xs font-medium text-slate-500">Corrective actions · one per line
                      <textarea aria-label={`Corrective actions for ${item.id}`} className={`${inputClass} mt-1 min-h-16 py-2`} onChange={(event) => setEventActionDrafts((drafts) => ({ ...drafts, [item.id]: event.target.value }))} placeholder={"Contain affected product\nCorrect process cause\nVerify effectiveness"} value={eventActionDrafts[item.id] ?? (item.correctiveActions ?? []).join("\n")} />
                    </label>
                  </div>
                  {(item.correctiveActions?.length ?? 0) > 0 && <ul aria-label={`Corrective action checklist for ${item.id}`} className="mt-2 space-y-1">{item.correctiveActions?.map((action, index) => <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300" key={`${index}-${action}`}><input aria-label={`Action ${index + 1} complete for ${item.id}`} checked={item.correctiveActionCompleted?.[index] ?? false} onChange={(event) => setData((current) => ({ ...current, events: current.events.map((record) => record.id === item.id ? { ...record, correctiveActionCompleted: (record.correctiveActions ?? []).map((_, actionIndex) => actionIndex === index ? event.target.checked : (record.correctiveActionCompleted?.[actionIndex] ?? false)) } : record) }))} type="checkbox" /><span className={item.correctiveActionCompleted?.[index] ? "line-through opacity-60" : ""}>{action}</span></li>)}</ul>}
                </article>
              ))}
            </div>
          ) : <EmptyState message="No quality events have been generated." />}
        </section>
        </div>
      ));
    case "traceability":
      return shell("Traceability", "Search by part, batch, serial, or measurement ID to inspect connected production and quality records.", (
        <div className="space-y-4">
          <form className={`${cardClass} grid gap-3 sm:grid-cols-2 xl:grid-cols-5`} onSubmit={(event) => { event.preventDefault(); setTraceSearched(true); }}>
            <label className="relative xl:col-span-2"><IconSearch aria-hidden="true" className="absolute left-3 top-3 size-4 text-slate-400" /><input aria-label="Part, serial, batch, or measurement ID" className={`${inputClass} pl-9`} onChange={(event) => setTraceQuery(event.target.value)} placeholder="Part, batch, serial or measurement ID" value={traceQuery} /></label>
            <label className="text-xs font-medium text-slate-500">Part<select aria-label="Traceability part filter" className={`${inputClass} mt-1`} onChange={(event) => setTracePart(event.target.value)} value={tracePart}><option value="All">All parts</option>{data.parts.map((part) => <option key={part.number} value={part.number}>{part.number}</option>)}</select></label>
            <label className="text-xs font-medium text-slate-500">From date<input aria-label="Traceability start date" className={`${inputClass} mt-1`} onChange={(event) => setTraceStart(event.target.value)} type="date" value={traceStart} /></label>
            <label className="text-xs font-medium text-slate-500">To date<input aria-label="Traceability end date" className={`${inputClass} mt-1`} onChange={(event) => setTraceEnd(event.target.value)} type="date" value={traceEnd} /></label>
            <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-5">
              <button className="min-h-10 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Search records</button>
              <button className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={() => { setTraceQuery(""); setTracePart("All"); setTraceStart(""); setTraceEnd(""); setTraceSearched(false); setExpandedTraceId(""); }} type="button">Clear filters</button>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={() => { if (!downloadCsv("gap-it-traceability.csv", traceRecords.map((item) => ({ timestamp: item.timestamp, measurementId: item.id, partNumber: item.partNumber, batchId: item.batchId, serialNumber: item.serialNumber, characteristic: item.characteristic, value: item.value, unit: item.unit, instrumentId: item.instrumentId, operator: item.operator, status: item.status })))) setNotice("Search traceability records before exporting."); }} type="button"><IconDownload className="size-4" /> Export CSV</button>
            </div>
          </form>
          {traceSearched && <section className={cardClass}>
            {traceRecords.length ? <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold text-slate-900 dark:text-white">{traceRecords.length} matching measurement records</h2><span className="text-xs text-slate-500">Select a row to view its trace details</span></div>
              <div className="space-y-2">{traceRecords.slice(0, 100).map((item) => {
                const part = partByNumber.get(item.partNumber);
                const instrument = data.instruments.find((device) => device.id === item.instrumentId);
                const event = data.events.find((qualityEvent) => qualityEvent.measurementId === item.id);
                const expanded = expandedTraceId === item.id;
                return <article key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-800">
                  <button aria-expanded={expanded} className="flex min-h-14 w-full flex-wrap items-center justify-between gap-2 p-4 text-left" onClick={() => setExpandedTraceId(expanded ? "" : item.id)} type="button">
                    <span><b className="text-sm text-slate-900 dark:text-white">{item.id} · {item.partNumber} · {item.serialNumber}</b><span className="ml-3 text-xs text-slate-500">{formatTimestamp(item.timestamp)}</span></span><span className="flex items-center gap-3"><span className="font-mono text-xs text-slate-700 dark:text-slate-300">{item.value ?? "INVALID"} {item.unit}</span><StatusPill status={item.status} /></span>
                  </button>
                  {expanded && <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800"><div className="grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-4"><span>Batch: <b>{item.batchId}</b></span><span>Characteristic: <b>{item.characteristic}</b></span><span>Specification: <b>{part ? `${part.lsl}–${part.usl} ${part.unit}` : "—"}</b></span><span>Part revision: <b>{part?.revision ?? "—"}</b></span><span>Instrument: <b>{instrument?.name ?? item.instrumentId}</b></span><span>Gateway: <b>{instrument?.gatewayId ?? "—"}</b></span><span>Operator: <b>{item.operator}</b></span><span>Quality event: <b>{event?.id ?? "None"}</b></span></div></div>}
                </article>;
              })}</div>
            </> : <EmptyState message="No records found. Try a part number, batch ID, serial number, measurement ID, or a wider date range." />}
          </section>}
        </div>
      ));
    case "users-permissions":
      return shell("Users and Permissions", "Manage simulated demo accounts and roles. UI role labels are not authentication or backend access control.", (
        <div className="space-y-4"><section className={cardClass}><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-slate-200 text-[10px] uppercase text-slate-500 dark:border-slate-800"><tr>{["User", "Email", "Role", "Account", "Action"].map((x) => <th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{data.users.map((user) => <tr key={user.id}><td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{user.name}</td><td className="px-3 py-3 text-slate-600 dark:text-slate-300">{user.email}</td><td className="px-3 py-3"><select aria-label={`Role for ${user.name}`} className={`${inputClass} min-h-9 w-48`} onChange={(event) => setData((current) => ({ ...current, users: current.users.map((item) => item.id === user.id ? { ...item, role: event.target.value as typeof item.role } : item) }))} value={user.role}>{["Administrator", "Quality Engineer", "Operator", "Viewer"].map((role) => <option key={role}>{role}</option>)}</select></td><td className="px-3 py-3"><StatusPill status={user.active ? "Active" : "Disabled"} /></td><td className="px-3 py-3"><button className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={() => setData((current) => ({ ...current, users: current.users.map((item) => item.id === user.id ? { ...item, active: !item.active } : item) }))} type="button">{user.active ? "Disable" : "Enable"}</button></td></tr>)}</tbody></table></div><p className="mt-3 text-xs leading-5 text-slate-500">Passwords and real authentication are not stored in this frontend-only demo. Enforce authorization in a trusted backend before deployment with real users.</p></section><section className={cardClass}><h2 className="font-semibold text-slate-900 dark:text-white">Demo permission matrix</h2><div className="mt-3 grid grid-cols-[1.4fr_repeat(4,1fr)] gap-2 text-center text-[11px]"><b className="text-left">Module</b>{["Admin", "Engineer", "Operator", "Viewer"].map((x) => <b key={x}>{x}</b>)}{["Dashboard", "Live measurement", "Inspection setup", "SPC & reports", "Users & settings"].map((label, row) => <div key={label} className="contents"><span className="py-1 text-left text-slate-600 dark:text-slate-300">{label}</span>{Array.from({ length: 4 }, (_, col) => <span key={col} className="text-emerald-600">{col <= (row === 4 ? 0 : row === 2 || row === 3 ? 1 : 3) ? "✓" : "—"}</span>)}</div>)}</div></section></div>
      ));
    case "system-settings":
      return shell("System Settings", "Update local demo workspace preferences. Hardware, notification, integration, and security settings are not connected to live services.", (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><form className={`${cardClass} space-y-4`} onSubmit={(event) => { event.preventDefault(); if (!settingsDraft.plantName.trim() || !settingsDraft.productionLine.trim() || settingsDraft.decimalPrecision < 0 || settingsDraft.decimalPrecision > 6 || settingsDraft.demoIntervalSeconds < 1) { setNotice("Review required fields, precision (0–6), and a valid demo interval."); return; } setData((current) => ({ ...current, settings: settingsDraft })); setSettingsDirty(false); setNotice("Workspace preferences saved locally."); }}><h2 className="font-semibold text-slate-900 dark:text-white">General and measurement preferences</h2><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Plant name<input className={`${inputClass} mt-1`} onChange={(e) => { setSettingsDraft({ ...settingsDraft, plantName: e.target.value }); setSettingsDirty(true); }} value={settingsDraft.plantName} /></label><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Production line<input className={`${inputClass} mt-1`} onChange={(e) => { setSettingsDraft({ ...settingsDraft, productionLine: e.target.value }); setSettingsDirty(true); }} value={settingsDraft.productionLine} /></label><div className="grid gap-3 sm:grid-cols-3"><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Timezone<select className={`${inputClass} mt-1`} onChange={(e) => { setSettingsDraft({ ...settingsDraft, timezone: e.target.value }); setSettingsDirty(true); }} value={settingsDraft.timezone}><option>Asia/Kolkata</option><option>UTC</option><option>America/Chicago</option><option>Europe/London</option></select></label><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Decimal precision<input className={`${inputClass} mt-1`} max="6" min="0" onChange={(e) => { setSettingsDraft({ ...settingsDraft, decimalPrecision: Number(e.target.value) }); setSettingsDirty(true); }} type="number" value={settingsDraft.decimalPrecision} /></label><label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Demo interval (seconds)<input className={`${inputClass} mt-1`} min="1" onChange={(e) => { setSettingsDraft({ ...settingsDraft, demoIntervalSeconds: Number(e.target.value) }); setSettingsDirty(true); }} type="number" value={settingsDraft.demoIntervalSeconds} /></label></div><div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"><button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={!settingsDirty} type="submit"><IconCheck className="size-4" /> Save changes</button><button className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={() => { setSettingsDraft(data.settings); setSettingsDirty(false); }} type="button">Cancel</button><button className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" onClick={() => { const defaults = createDemoData().settings; setSettingsDraft(defaults); setSettingsDirty(true); }} type="button">Reset defaults</button></div></form><section className={cardClass}><h2 className="font-semibold text-slate-900 dark:text-white">Appearance</h2><p className="mt-1 text-xs text-slate-500">Light or dark theme for this workspace.</p><div className="mt-3 flex gap-2">{(["light", "dark"] as const).map((theme) => <button key={theme} aria-pressed={settingsDraft.theme === theme} className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize ${settingsDraft.theme === theme ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`} onClick={() => { setSettingsDraft({ ...settingsDraft, theme }); setSettingsDirty(true); }} type="button">{theme}</button>)}</div><h3 className="mt-6 font-semibold text-slate-900 dark:text-white">Demo data</h3><p className="mt-1 text-xs leading-5 text-slate-500">Reset removes locally saved demo edits and restores deterministic sample records.</p><button className="mt-3 inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300" onClick={() => { if (!window.confirm("Reset all locally saved GAP-IT demo data?")) return; setData(createDemoData()); setSettingsDirty(false); setNotice("Demo data has been reset."); }} type="button"><IconRefresh className="size-4" /> Reset demo workspace</button><div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><b>Integrations not connected</b><br />Hardware protocols, notifications, API/webhooks, ERP/MES, authentication, and backups are demo placeholders only.</div></section></div>
      ));
    default:
      return shell("GAP-IT", "Workspace", <EmptyState message="This workspace module is not available." />);
  }
}
