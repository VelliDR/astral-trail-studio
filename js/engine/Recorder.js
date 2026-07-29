import { state } from '../config.js';

export class Recorder {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.mediaRecorder = null;
        this.chunks = [];
    }

    toggleRecording(onStatusChange) {
        if (!state.isRecording) {
            this.startRecording(onStatusChange);
        } else {
            this.stopRecording(onStatusChange);
        }
    }

    startRecording(onStatusChange) {
        this.chunks = [];
        const stream = this.canvas.captureStream(30); // 30 FPS

        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) this.chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `astral-trail-${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
        };

        this.mediaRecorder.start();
        state.isRecording = true;
        if (onStatusChange) onStatusChange(true);
    }

    stopRecording(onStatusChange) {
        if (this.mediaRecorder && state.isRecording) {
            this.mediaRecorder.stop();
            state.isRecording = false;
            if (onStatusChange) onStatusChange(false);
        }
    }
}