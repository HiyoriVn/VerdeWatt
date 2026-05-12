import { useEffect, useState } from "react";
import { getSessions } from "../../services/api";

import EVSessionCard from "./EVSessionCard";

export default function ChargingSessionsView() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSessions();
      setSessions(data);
    }

    load();
  }, []);

  return (
    <div className="card-grid">
      {sessions.map((session) => (
        <EVSessionCard
          key={session.id}
          session={session}
        />
      ))}
    </div>
  );
}