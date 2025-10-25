import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  audioBlob: Blob | null;
  audioUrl: string | null;
  onRecordingComplete: (blob: Blob, url: string) => void;
  onDelete: () => void;
}

export function VoiceRecorder({
  audioBlob,
  audioUrl,
  onRecordingComplete,
  onDelete,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onRecordingComplete(blob, url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}

      <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-lg border">
        {!audioUrl ? (
          <>
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-destructive' : 'bg-primary'
              }`}
            >
              {isRecording ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-6 h-6 bg-white rounded"
                />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )}
            </motion.div>

            {isRecording && (
              <div className="text-2xl font-mono font-bold text-destructive">
                {formatTime(recordingTime)}
              </div>
            )}

            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-gradient-hero'}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground">
              Click to {isRecording ? 'stop' : 'start'} recording your craft story
            </p>
          </>
        ) : (
          <>
            <div className="w-full flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: isPlaying ? '100%' : '0%' }}
                  transition={{ duration: audioRef.current?.duration || 0 }}
                />
              </div>

              <Button variant="destructive" size="icon" className="rounded-full" onClick={onDelete}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">Recording saved successfully</p>
          </>
        )}
      </div>
    </div>
  );
}
