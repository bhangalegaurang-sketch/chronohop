import dinoImg from '../assets/dino.jpg';
import londonImg from '../assets/london.jpg';
import pyrImg from '../assets/pyramids.jpg';
import marsImg from '../assets/mars.jpg';

export interface TripDetail {
  id: string;
  title: string;
  shortTitle: string;
  era: string;
  location: string;
  heroHeadline: string;
  subtitle: string;
  image: string;
  basePrice: number;
  isFlagship?: boolean;
  telemetry: {
    adjectives: string;
    distance: string;
    eccentricity: string;
    inclination: string;
    coordinates: string;
    escapeVelocity: string;
    axialTilt: string;
    atmosphere: string;
    surfaceGravity: string;
    safetyStatus: string;
    chronoCoherence: string;
  };
  observations: string;
  seeAlso: string[];
}

export const TRIPS_CATALOG: Record<string, TripDetail> = {
  dino: {
    id: 'dino',
    title: 'Dinosaur Walk',
    shortTitle: 'Cretaceous',
    era: '65,000,000 BCE',
    location: 'Late Cretaceous Basin, North American Seaway',
    heroHeadline: 'Observe apex dinosaurs in their native late-Cretaceous habitat',
    subtitle: '65 million years prior to modern civilization in the subtropical Montana river delta',
    image: dinoImg,
    basePrice: 2000,
    isFlagship: true,
    telemetry: {
      adjectives: 'Late Cretaceous / Maastrichtian',
      distance: '65,000,000 Earth Years',
      eccentricity: '0.0167',
      inclination: '0.000° to timeline',
      coordinates: '44.8290° N, 105.4290° W',
      escapeVelocity: '11.186 km/s',
      axialTilt: '23.44° (Precession Shift)',
      atmosphere: '28.4% O₂ (Hyper-Oxygenated)',
      surfaceGravity: '1.00 G (Earth Standard)',
      safetyStatus: 'Class-A Archival Permit Verified',
      chronoCoherence: '99.98% Coherent'
    },
    observations: 'Guided observation of foraging Triceratops prorsus and Tyrannosaurus specimens across subtropical fern plains. Pressurized ChronoPod Mk IV with acoustic dampening ensures zero physical disruption or organic transfer.',
    seeAlso: [
      'Tyrannosaur Biomechanics',
      'Late Cretaceous Flora',
      'K-Pg Boundary Horizon',
      'ChronoPod Mk IV Shield',
      'Dual Return Beacon Mesh'
    ]
  },
  london: {
    id: 'london',
    title: 'Victorian London Gaslight',
    shortTitle: 'London 1895',
    era: '1895 CE · Late Autumn',
    location: 'Westminster & Thames Embankment, London, UK',
    heroHeadline: 'London in 1895: the cobblestone epicenter of the industrial world',
    subtitle: 'Late Victorian Britain during the golden era of steam, gaslight, and early science',
    image: londonImg,
    basePrice: 900,
    telemetry: {
      adjectives: 'Victorian / Late 19th Century',
      distance: '131 Earth Years',
      eccentricity: '0.0167',
      inclination: '0.000° to timeline',
      coordinates: '51.5007° N, 0.1246° W',
      escapeVelocity: '11.186 km/s',
      axialTilt: '23.44° to ecliptic',
      atmosphere: '20.8% O₂ (Coal Haze & Maritime Fog)',
      surfaceGravity: '1.00 G (Earth Standard)',
      safetyStatus: 'Class-A Archival Permit Verified',
      chronoCoherence: '100.00% Coherent'
    },
    observations: 'Walk the Thames Embankment beneath Victorian gaslamps as Big Ben marks the hour. Includes period-accurate woolen attire, hansom cab transport along Whitehall, and an evening historical briefing.',
    seeAlso: [
      'Victorian Architecture',
      'Industrial Thames Trade',
      'Hansom Cab Routes',
      'Gaslight Municipal Grid',
      'Atmospheric Bio-Filtration'
    ]
  },
  giza: {
    id: 'giza',
    title: 'Giza Pyramids Construction',
    shortTitle: 'Giza 2560 BCE',
    era: '2560 BCE · 4th Dynasty',
    location: 'Giza Plateau, Old Kingdom Egypt',
    heroHeadline: 'Witness the construction of the Great Pyramid of Khufu',
    subtitle: 'Old Kingdom Egypt during the peak mobilization of skilled builders along the Nile',
    image: pyrImg,
    basePrice: 1400,
    telemetry: {
      adjectives: 'Ancient Egyptian / 4th Dynasty',
      distance: '4,586 Earth Years',
      eccentricity: '0.0167',
      inclination: '0.000° to timeline',
      coordinates: '29.9792° N, 31.1342° E',
      escapeVelocity: '11.186 km/s',
      axialTilt: '23.95° (Historical Precession)',
      atmosphere: '20.9% O₂ (Arid Nile Basin)',
      surfaceGravity: '1.00 G (Earth Standard)',
      safetyStatus: 'Class-A Archival Permit Verified',
      chronoCoherence: '99.99% Coherent'
    },
    observations: 'Stationed on a shaded observation platform overlooking the construction ramps. Watch master stonemasons position 2.5-ton polished Tura limestone blocks with millimeter precision according to celestial alignments.',
    seeAlso: [
      'Khufu Horizon Geometry',
      'Tura Limestone Quarrying',
      'Nile Inundation Harbor',
      'Papyrus Logbooks of Merer',
      'ChronoPod Mk IV Shield'
    ]
  },
  mars: {
    id: 'mars',
    title: 'Mars Olympus Outpost',
    shortTitle: 'Mars 2154',
    era: '2154 CE · Red Planet Colony',
    location: 'Olympus Mons Caldera & Basin, Mars',
    heroHeadline: 'Explore humanity’s first self-sustaining settlement on Mars',
    subtitle: 'A working research colony nestled inside the volcanic shielding of Olympus Mons',
    image: marsImg,
    basePrice: 2400,
    telemetry: {
      adjectives: 'Martian Frontier / 22nd Century',
      distance: '249,261,000 km (Orbital Aphelion)',
      eccentricity: '0.0934',
      inclination: '1.850° to ecliptic',
      coordinates: '18.65° N, 226.2° E (Olympus Caldera)',
      escapeVelocity: '5.027 km/s',
      axialTilt: '25.19° to orbital plane',
      atmosphere: '95.3% CO₂ / Pressurized Biosphere Domes',
      surfaceGravity: '0.38 G (Martian Low-G)',
      safetyStatus: 'Deep-Space Certified Transit',
      chronoCoherence: '99.95% Coherent'
    },
    observations: 'Guided traverse across the iron oxide dust plains outside the central caldera. Includes low-gravity transit suit, access to the geothermal agricultural rings, and launch viewing from Olympus Spaceport Pad 2.',
    seeAlso: [
      'Olympus Caldera Geology',
      'Subsurface Geothermal Tap',
      'Low-Gravity Transit Suits',
      'Solar Storm Shielding',
      'Interplanetary Telemetry'
    ]
  }
};
