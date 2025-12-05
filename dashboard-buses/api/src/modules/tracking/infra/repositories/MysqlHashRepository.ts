import { HashRepository } from '../../domain/ports';
import { TrackerHash } from '../../domain/models';
import { mysqlPool } from '../../../../shared/infra/db/mysql';

export class MysqlHashRepository implements HashRepository {
  async getHashByCredentials(user: string, password: string): Promise<TrackerHash | null> {
    const [rows] = await mysqlPool.query(
      'SELECT hash FROM masgps.hash WHERE user = ? AND pasw = ? LIMIT 1',
      [user, password]
    );

    const r = Array.isArray(rows) ? (rows[0] as any) : null;
    if (!r) return null;

    return { hash: r.hash as string };
  }
}
