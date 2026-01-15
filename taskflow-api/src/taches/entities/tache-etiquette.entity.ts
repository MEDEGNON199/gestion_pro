import { Entity, PrimaryColumn } from 'typeorm';

@Entity('taches_etiquettes')
export class TacheEtiquette {
  @PrimaryColumn('uuid')
  tache_id: string;

  @PrimaryColumn('uuid')
  etiquette_id: string;
}