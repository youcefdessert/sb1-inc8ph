import { EventData, Observable, Page } from '@nativescript/core';
import { TimeBlock } from '../models/schedule';

export class BlockEditorViewModel extends Observable {
    private _block: TimeBlock;
    private _page: Page;

    colors = [
        { color: '#FF3B30' },  // Red
        { color: '#FF9500' },  // Orange
        { color: '#FFCC00' },  // Yellow
        { color: '#34C759' },  // Green
        { color: '#5856D6' }   // Blue
    ];

    colors2 = [
        { color: '#007AFF' },  // Blue
        { color: '#5856D6' },  // Purple
        { color: '#AF52DE' },  // Purple
        { color: '#8E8E93' },  // Gray
        { color: '#636366' }   // Dark Gray
    ];

    constructor(page: Page, block?: TimeBlock) {
        super();
        this._page = page;
        this._block = block || this.createNewBlock();
    }

    private createNewBlock(): TimeBlock {
        return {
            id: Date.now().toString(),
            title: '',
            startTime: new Date(),
            endTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
            color: '#34C759',
            location: ''
        };
    }

    get block(): TimeBlock {
        return this._block;
    }

    setDuration(args: EventData) {
        const duration = (args.object as any).text;
        const startTime = this._block.startTime;
        let minutes = 30;

        switch (duration) {
            case '5 min': minutes = 5; break;
            case '15 min': minutes = 15; break;
            case '30 min': minutes = 30; break;
            case '1 h': minutes = 60; break;
        }

        this._block.endTime = new Date(startTime.getTime() + minutes * 60000);
        this.notifyPropertyChange('block', this._block);
    }

    selectSubject(args: EventData) {
        const subject = (args.object as any).text;
        this._block.title = subject;
        this.notifyPropertyChange('block', this._block);
    }

    onColorSelect(args: EventData) {
        const color = (args.object as any).backgroundColor;
        this._block.color = color;
        this.notifyPropertyChange('block', this._block);
    }

    showDayPicker() {
        // Implement day picker dialog
    }

    showTimePicker() {
        // Implement time picker dialog
    }

    deleteBlock() {
        this._page.closeModal({ deleted: true });
    }

    save() {
        this._page.closeModal({ block: this._block });
    }

    close() {
        this._page.closeModal();
    }
}