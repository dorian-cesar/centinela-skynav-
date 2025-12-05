import { TrackerNormalizedPayload } from '../../domain/models';

export class StateComparer {
  private detectDuplicates(current: TrackerNormalizedPayload[]): void {
    const seen = new Map<string, TrackerNormalizedPayload[]>();

    for (const item of current) {
      const key = `${item.imei}-${item.fechaHora}`;
      const list = seen.get(key) ?? [];
      list.push(item);
      seen.set(key, list);
    }

    for (const [key, list] of seen) {
      if (list.length > 1) {
        console.warn('[StateComparer] Datos duplicados detectados para:', key, list);
      }
    }
  }

  getUpdated(
    previous: TrackerNormalizedPayload[],
    current: TrackerNormalizedPayload[]
  ): TrackerNormalizedPayload[] {
    this.detectDuplicates(current);
    
    const updated: TrackerNormalizedPayload[] = [];

    current.forEach((element, index) => {
      const prev = previous[index];
      if (!prev || prev.fechaHora !== element.fechaHora) {
        updated.push(element);
      }
    });

    return updated;
  }
}
