import { initials } from "@/lib/initials";

const orbits = ["orbit-a", "orbit-b"];

/**
 * The two tilted rings with their travelling dots. The orb draws this twice: once behind
 * the sphere in full, and once in front showing only the near half of each ring, so the
 * rings appear to pass behind the sphere and come round in front of it.
 */
function Rings({ front = false }: { front?: boolean }) {
  return (
    <div className={`orb-rings ${front ? "orb-rings-front" : ""}`}>
      {orbits.map((orbit) => (
        <div key={orbit} className={`orbit ${orbit}`}>
          <div className="orbit-half">
            <div className="orbit-spin">
              <span className="orbit-dot" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * A glowing violet sphere carrying the owner's initials, with two orbiting rings. It stands
 * where a portrait would go. Pure CSS (see .orb in globals.css) and purely decorative, so
 * screen readers skip it. Size it with width and height classes; the initials take their
 * size from the sphere, so they fit whatever size the orb is given.
 */
export function Orb({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`orb ${className ?? ""}`}>
      <div className="orb-glow" />
      <Rings />
      <div className="orb-core">
        <span className="orb-initials font-display font-bold">{initials}</span>
      </div>
      <Rings front />
    </div>
  );
}
