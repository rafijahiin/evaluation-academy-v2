"use client";
import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";

const MAP_W = 900;
const MAP_H = 460;

const PRIORITY_COUNTRIES: { name: string; coords: [number, number] }[] = [
  { name: "Bangladesh",      coords: [90.4, 23.7] },
  { name: "Afghanistan",     coords: [67.7, 33.9] },
  { name: "Pakistan",        coords: [69.3, 30.4] },
  { name: "Indonesia",       coords: [113.9, -0.8] },
  { name: "Philippines",     coords: [121.8, 12.9] },
  { name: "Myanmar",         coords: [95.9, 21.9] },
  { name: "Vietnam",         coords: [108.3, 14.1] },
  { name: "Cambodia",        coords: [104.9, 12.6] },
  { name: "Nepal",           coords: [84.1, 28.4] },
  { name: "Yemen",           coords: [48.5, 15.6] },
  { name: "Iraq",            coords: [43.7, 33.2] },
  { name: "Syria",           coords: [38.0, 34.8] },
  { name: "Egypt",           coords: [30.8, 26.8] },
  { name: "Sudan",           coords: [30.2, 12.9] },
  { name: "South Sudan",     coords: [31.3, 6.9] },
  { name: "Ethiopia",        coords: [40.5, 9.1] },
  { name: "Kenya",           coords: [37.9, 0.0] },
  { name: "Uganda",          coords: [32.3, 1.4] },
  { name: "Tanzania",        coords: [34.9, -6.4] },
  { name: "Mozambique",      coords: [35.5, -18.7] },
  { name: "Madagascar",      coords: [46.9, -18.8] },
  { name: "Malawi",          coords: [34.3, -13.3] },
  { name: "Zambia",          coords: [27.8, -13.1] },
  { name: "Zimbabwe",        coords: [29.2, -19.0] },
  { name: "DRC",             coords: [21.7, -4.0] },
  { name: "Nigeria",         coords: [8.7, 9.1] },
  { name: "Niger",           coords: [8.1, 17.6] },
  { name: "Chad",            coords: [18.7, 15.5] },
  { name: "Mali",            coords: [-4.0, 17.6] },
  { name: "Burkina Faso",    coords: [-1.6, 12.2] },
  { name: "Senegal",         coords: [-14.5, 14.5] },
  { name: "Somalia",         coords: [46.2, 5.2] },
  { name: "Haiti",           coords: [-72.3, 18.5] },
  { name: "Guatemala",       coords: [-90.2, 15.8] },
  { name: "Honduras",        coords: [-86.2, 15.2] },
  { name: "Colombia",        coords: [-74.3, 4.6] },
  { name: "Peru",            coords: [-75.0, -9.2] },
  { name: "Bolivia",         coords: [-63.6, -16.3] },
  { name: "Mongolia",        coords: [103.8, 46.9] },
  { name: "Ukraine",         coords: [31.2, 48.4] },
  { name: "Lao PDR",         coords: [102.5, 19.9] },
  { name: "Timor-Leste",     coords: [125.7, -8.9] },
  { name: "Papua N. Guinea", coords: [143.9, -6.3] },
];

/**
 * World map rendered from world-atlas TopoJSON via d3-geo.
 *
 * Strategy:
 *   - Client-side fetch of /world-110m.json after mount (keeps SSR clean
 *     and avoids bundling 100 KB of geometry into the page payload)
 *   - geoEqualEarth projection — a modern, area-accurate world projection
 *     that gives a familiar overall shape without Mercator's distortion
 *   - Each country fills with a dot pattern → recognisable silhouette
 *     in editorial halftone style
 *   - Markers placed via the same projection so they align exactly
 *     with country geometry
 */
export function WorldMap() {
  const [features, setFeatures] = useState<Feature<Geometry>[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/world-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        // Topology has `objects.countries`; extract as a FeatureCollection.
        // topojson-client's types are union-shaped — cast through unknown.
        const fc = feature(
          topo,
          topo.objects.countries,
        ) as unknown as FeatureCollection<Geometry>;
        setFeatures(fc.features);
      })
      .catch(() => {
        /* fail quietly — map is decorative */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(165)
        .translate([MAP_W / 2, MAP_H / 2 - 10]),
    [],
  );
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      height="auto"
      style={{ display: "block" }}
      aria-hidden
    >
      <defs>
        <pattern
          id="map-dots"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.85" fill="rgba(253, 207, 179, 0.55)" />
        </pattern>
      </defs>

      {/* countries */}
      {features?.map((f, i) => {
        const d = pathGen(f);
        if (!d) return null;
        return (
          <path
            key={i}
            d={d}
            fill="url(#map-dots)"
            stroke="rgba(253, 207, 179, 0.10)"
            strokeWidth={0.4}
          />
        );
      })}

      {/* priority country markers — only render once map features have loaded
          so the projection matches the visible countries */}
      {features &&
        PRIORITY_COUNTRIES.map((country, idx) => {
          const projected = projection(country.coords);
          if (!projected) return null;
          const [x, y] = projected;
          return (
            <g key={country.name}>
              {/* Pulsing halo: animate r + opacity as SVG attributes (not CSS
                  transform) so the pulse stays anchored to (cx, cy) regardless
                  of viewport size. Animating scale on an SVG circle drifts
                  because transform-origin doesn't map to SVG user units. */}
              <m.circle
                cx={x}
                cy={y}
                fill="var(--teal)"
                initial={{ r: 3, opacity: 0.5 }}
                animate={{ r: [3, 8.5, 3], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: (idx % 8) * 0.32,
                  ease: "easeOut",
                }}
              />
              <circle
                cx={x}
                cy={y}
                r={2.6}
                fill="var(--teal)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={0.7}
              />
            </g>
          );
        })}
    </svg>
  );
}
