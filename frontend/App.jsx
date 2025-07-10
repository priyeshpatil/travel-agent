import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    destination: "",
    dates: "",
    budget: "",
    preferences: "",
    group: "",
  });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prompt = `
      I want to travel to ${form.destination} from ${form.dates}. 
      My budget is ${form.budget}. 
      I enjoy ${form.preferences}. 
      I’m traveling ${form.group}.
      Please generate a travel itinerary with estimated costs, activities, and hotel suggestions.
    `;

    const res = await fetch("http://localhost:8000/api/travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.reply || data.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">AI Travel Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
        <input name="destination" placeholder="Destination" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="dates" placeholder="Dates (e.g. Oct 10–20)" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="budget" placeholder="Budget (e.g. $2500)" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="preferences" placeholder="Preferences (e.g. food, culture, nature)" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="group" placeholder="Who you're traveling with (e.g. solo, family)" onChange={handleChange} className="w-full p-2 rounded border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Generating..." : "Plan My Trip"}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-3xl whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
