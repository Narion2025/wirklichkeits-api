
import React, { useEffect, useState } from "react";

export default function LiveDashboard() {
  const [dataTimestamp, setDataTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataTimestamp(new Date()); // Trigger re-render every 30s
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Live Dashboard – Ta-mi-gotchi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">🎯 Aktives Miro-Board (live eingebettet)</h2>
          <iframe
            src="https://miro.com/app/live-embed/uXjVIA_QiNA=/?moveToViewport=-968,-587,1990,1029&embedId=938693481430"
            width="100%"
            height="480"
            frameBorder="0"
            allow="fullscreen; clipboard-read; clipboard-write"
            className="rounded-xl"
            title="MiroBoard"
          />
        </div>

        <div className="border rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">🧠 Sprintstatus & Letzte Aktivität</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Stand:</strong> {dataTimestamp?.toLocaleTimeString()}</li>
            <li>Inkrement 0: Architektur – <span className="text-green-600">aktiv</span></li>
            <li>Inkrement 1: Avatar-Interaktion – <span className="text-yellow-500">im Aufbau</span></li>
            <li>Letztes Mapping: <a className="text-blue-600 underline" href="/mnt/data/Ta_mi_gotchi_Team_to_Task_Mapping.csv">Team→Task CSV</a></li>
            <li>Miro Tasks: <a className="text-blue-600 underline" href="/mnt/data/Ta_mi_gotchi_Swimlane_Miro_Board.csv">Swimlane CSV</a></li>
          </ul>
        </div>
      </div>

      <div className="border rounded-2xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">🔄 Dieses Dashboard aktualisiert sich automatisch alle 30 Sekunden.</h2>
        <p className="text-sm text-gray-500">Bitte lasse es im Hintergrund geöffnet oder auf einem zweiten Screen sichtbar laufen.</p>
      </div>
    </div>
  );
}
