// TODO: Student implementation - Part 2: DAL for time logs
import { db, TimeLog, NewTimeLog } from '../db/database.js';

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<TimeLog> {
  const timeLog: NewTimeLog = {
    ticket_id: ticketId,
    user_id: userId,
    hours,
  };

  return await db
    .insertInto('time_logs')
    .values(timeLog)
    .returningAll()
    .executeTakeFirstOrThrow();

  // TODO: Student implementation
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  // TODO: Student implementation
  const result = await db
    .selectFrom('time_logs')
    .select((eb) => eb.fn.sum<number>('hours').as('total_hours'))
    .where('ticket_id', '=', ticketId)
    .executeTakeFirst();

  return Number(result?.total_hours ?? 0);
}
