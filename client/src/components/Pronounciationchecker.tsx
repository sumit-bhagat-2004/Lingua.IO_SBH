import { useState, useRef } from "react";

const PronunciationChecker = () => {
  const [expectedText, setExpectedText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [differences, setDifferences] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('expected_text', expectedText);
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:6500/evaluate-pronunciation/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setTranscript(result.transcript);
      setDifferences(result.differences);
    };
  };

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Pronunciation Checker</h1>

      <input
        type="text"
        placeholder="Enter expected sentence"
        value={expectedText}
        onChange={(e) => setExpectedText(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {isRecording ? 'Stop' : 'Start'} Recording
      </button>

      {transcript && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Transcribed:</h2>
          <p className="border p-2 rounded bg-gray-100">{transcript}</p>
        </div>
      )}

      {differences.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Mismatches:</h3>
          <ul className="list-disc pl-5">
            {differences.map((diff, idx) => (
              <li key={idx}>
                <strong>{diff.type}:</strong> Expected <em>{diff.expected.join(" ")}</em>, Got <em>{diff.actual.join(" ")}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PronunciationChecker;