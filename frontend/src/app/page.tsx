"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
        setCurrentDate(data.date);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="text-center">
        <p>The date is {currentDate} and the time is {currentTime}.</p>
      </header>
    </div>
  );
}