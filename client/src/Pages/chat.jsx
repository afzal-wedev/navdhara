import { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

// PDF Worker setup
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorker;


function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [started, setStarted] = useState(false);
  const userId = "user123"; // 👈 Later replace with logged-in userId

  // Extract text from uploaded PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      setResumeText(text);
      alert("✅ Resume text extracted!");
    };
    reader.readAsArrayBuffer(file);
  };

  // Start Interview
  const startInterview = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/start-interview", {
        resumeText,
        userId
      });
      setMessages([{ role: "assistant", content: res.data.reply }]);
      setStarted(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Send chat message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/interview", {
        userId,
        message: input
      });

      const aiReply = res.data.reply;
      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (err) {
        console.log(err.message)
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4 flex flex-col">
        <h1 className="text-xl font-bold text-center mb-4">🤖 AI HR Interview</h1>

        {!started ? (
          <div className="space-y-3">
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            <button
              onClick={startInterview}
              disabled={!resumeText}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <>
            {/* Chat Box */}
            <div className="flex-1 overflow-y-auto mb-3 border p-3 rounded-lg bg-gray-50 h-96">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`my-2 p-2 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black mr-auto"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex">
              <input
                type="text"
                className="flex-1 border p-2 rounded-l-lg outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your response..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
