'use client';

import { useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { AudioLines } from 'lucide-react';

export default function VoiceForm() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            aria-label="voice-record"
            variant="outline"
            className="rounded-full">
            <AudioLines />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Dream Audio</DialogTitle>
            <DialogDescription>
              Record your dream via audio. Click submit when you are done.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </form>
    </Dialog>
  );
}
