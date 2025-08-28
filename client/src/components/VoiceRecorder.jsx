
import React, { useState, useRef } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use mp4 instead of webm
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mp4' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.mp4');
       console.log(blob.size)
        
        


        try {
          setLoading(true);
          setError('');
          const response = await fetch('/api/stt', {
            method: 'POST',
            body: formData,
          });
         
          const result = await response.json();
          console.log(result)
          if (!response.ok) {
            setError(result.error || 'Transcription failed.');
          } else {
            setTranscript(result.transcript || '[Empty]');
          }
        } catch (err) {
          setError('Error uploading audio: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      mediaRecorderRef.current = mediaRecorder;
    } catch (err) {
      setError('Mic access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded text-center space-y-4">
      <h2 className="text-2xl font-semibold">🎤 Voice Transcription</h2>

      {recording ? (
        <button
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Start Recording
        </button>
      )}

      {loading && <p className="text-gray-600 animate-pulse">Transcribing...</p>}

      {transcript && (
        <div className="bg-gray-100 p-3 rounded border text-left">
          <h3 className="font-semibold mb-1">Transcript:</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}

      {error && (
        <p className="text-red-600 font-medium">⚠️ {error}</p>
      )}
    </div>
  );
};

export default VoiceRecorder;
