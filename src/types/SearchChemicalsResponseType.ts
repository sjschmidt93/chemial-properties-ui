interface Chemical {
  inchi_key: string;
  iupac_name: string;
  name: string;
  synonyms: string[];
}

interface Measurement {
  type: string;
  value: number;
  metadata: {
    misc?: {
      [key: string]: any;
      substance_temperature?: number;
      water_temperature?: number;
      temperature?: number;
      pressure?: number;
      range?: {
        max: number;
        mean: number;
        min: number;
      };
      measurement_type?: string; // 'closed cup' | 'open cup';
    };
  };
}

interface Property {
  type: string; // 'specific_gravity' | 'vapor_pressure' | 'boiling_point' | 'melting_point' | 'flash_point';
  aggregate?: number;
  all_measurements: Measurement[];
}

export interface SearchChemicalsResponse {
  chemical: Chemical;
  properties: Property[];
}
