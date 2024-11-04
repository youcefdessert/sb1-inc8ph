import { Sqlite } from '@nativescript/sqlite';
import { TimeBlock, Schedule } from '../models/schedule';

export class DatabaseService {
    private db: Sqlite;

    async init() {
        this.db = await new Sqlite('calendar.db');
        await this.createTables();
    }

    private async createTables() {
        await this.db.execSQL(`
            CREATE TABLE IF NOT EXISTS schedules (
                id TEXT PRIMARY KEY,
                name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await this.db.execSQL(`
            CREATE TABLE IF NOT EXISTS blocks (
                id TEXT PRIMARY KEY,
                schedule_id TEXT,
                title TEXT,
                start_time DATETIME,
                end_time DATETIME,
                color TEXT,
                location TEXT,
                description TEXT,
                FOREIGN KEY(schedule_id) REFERENCES schedules(id)
            )
        `);
    }

    async saveBlock(block: TimeBlock) {
        await this.db.execSQL(`
            INSERT OR REPLACE INTO blocks (
                id, schedule_id, title, start_time, end_time, 
                color, location, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            block.id,
            block.scheduleId,
            block.title,
            block.startTime.toISOString(),
            block.endTime.toISOString(),
            block.color,
            block.location || '',
            block.description || ''
        ]);
    }

    async deleteBlock(blockId: string) {
        await this.db.execSQL('DELETE FROM blocks WHERE id = ?', [blockId]);
    }

    async saveSchedule(schedule: Schedule) {
        await this.db.execSQL(
            'INSERT OR REPLACE INTO schedules (id, name) VALUES (?, ?)',
            [schedule.id, schedule.name]
        );
    }

    async getSchedules(): Promise<Schedule[]> {
        return await this.db.all('SELECT * FROM schedules ORDER BY created_at DESC');
    }

    async getBlocks(scheduleId: string): Promise<TimeBlock[]> {
        const rows = await this.db.all(
            'SELECT * FROM blocks WHERE schedule_id = ? ORDER BY start_time',
            [scheduleId]
        );
        
        return rows.map(row => ({
            ...row,
            startTime: new Date(row.start_time),
            endTime: new Date(row.end_time)
        }));
    }
}