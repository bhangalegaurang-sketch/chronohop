import dinoImg from '../assets/dino.jpg';
import londonImg from '../assets/london.jpg';
import pyrImg from '../assets/pyramids.jpg';

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
  details: {
    period: string;
    howFarBack: string;
    tripLength: string;
    whatYoullSee: string;
    climate: string;
    pace: string;
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
    details: {
      period: 'Late Cretaceous',
      howFarBack: '66 million years ago',
      tripLength: '30-minute guided walk',
      whatYoullSee: 'Triceratops herds, a T. rex at a distance',
      climate: 'Warm and humid, river delta',
      pace: 'Easy walking, guide-led'
    },
    observations: 'Guided observation of foraging Triceratops prorsus and Tyrannosaurus specimens across subtropical fern plains. You watch from a quiet, enclosed viewing shelter, so nothing in the past is disturbed.',
    seeAlso: [
      'Tyrannosaur Biomechanics',
      'Late Cretaceous Flora',
      'K-Pg Boundary Horizon',
      'Viewing Shelter',
      'Guide Safety Briefing'
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
    details: {
      period: 'Victorian, late 19th century',
      howFarBack: '131 years ago',
      tripLength: '30-minute guided walk',
      whatYoullSee: 'Big Ben, gaslit streets, hansom cabs',
      climate: 'Cool, foggy autumn evening',
      pace: 'Easy walking, guide-led'
    },
    observations: 'Walk the Thames Embankment beneath Victorian gaslamps as Big Ben marks the hour. Includes period-accurate woolen attire, hansom cab transport along Whitehall, and an evening historical briefing.',
    seeAlso: [
      'Victorian Architecture',
      'Industrial Thames Trade',
      'Hansom Cab Routes',
      'Gaslight Municipal Grid',
      'Victorian Street Food'
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
    details: {
      period: 'Old Kingdom Egypt, 4th Dynasty',
      howFarBack: 'About 4,600 years ago',
      tripLength: '30-minute guided visit',
      whatYoullSee: 'Builders hauling limestone up the ramps',
      climate: 'Hot and dry, Nile valley',
      pace: 'Mostly standing, shaded platform'
    },
    observations: 'Stationed on a shaded observation platform overlooking the construction ramps. Watch master stonemasons position 2.5-ton polished Tura limestone blocks with millimeter precision lined up with the sun and stars.',
    seeAlso: [
      'Khufu Horizon Geometry',
      'Tura Limestone Quarrying',
      'Nile Inundation Harbor',
      'Papyrus Logbooks of Merer',
      'Viewing Shelter'
    ]
  }
};
