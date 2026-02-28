document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/__stats/data");
  const data = await res.json();

  // ====== ОБЩИЕ МЕТРИКИ ======
  const totalTime = data.sessions.reduce((a, s) => a + ((s.end || Date.now()) - s.start), 0) / 60000;

  const avgSession = totalTime / (data.sessions.length || 1);

  document.getElementById("totalTime").innerText = totalTime.toFixed(0) + " мин";

  document.getElementById("avgSession").innerText = avgSession.toFixed(0) + " мин";

  document.getElementById("buildAvg").innerText = (data.builds.reduce((a, b) => a + b.time, 0) / (data.builds.length || 1)).toFixed(0) + " мс";

  // ====== ТОП ФАЙЛОВ ======

  const sortedFiles = Object.entries(data.files).sort((a, b) => b[1] - a[1]);

  const ctx = document.getElementById("filesChart");

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sortedFiles.map((f) => f[0]),
      datasets: [
        {
          label: "Изменения",
          data: sortedFiles.map((f) => f[1]),
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          min: 0,
          max: 7,
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.00000000000001,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    },
  });

  // ====== СЕССИИ ПО ДНЯМ ======

  const sessionByDate = {};

  data.sessions.forEach((s) => {
    const duration = (s.end || Date.now()) - s.start;
    sessionByDate[s.date] = (sessionByDate[s.date] || 0) + duration;
  });

  new Chart(document.getElementById("sessionsChart"), {
    type: "line",
    data: {
      labels: Object.keys(sessionByDate),
      datasets: [
        {
          label: "Минуты",
          data: Object.values(sessionByDate).map((ms) => ms / 60000),
          fill: true,
          tension: 0.3,
        },
      ],
    },
  });

  // ====== ВРЕМЯ СБОРКИ ======

  const buildLabels = data.builds.map((b, i) => {
    return `${b.date}`;
  });

  const buildTimes = data.builds.map((b) => b.time);

  new Chart(document.getElementById("buildChart"), {
    type: "line",
    data: {
      labels: buildLabels,
      datasets: [
        {
          label: "Время сборки (мс)",
          data: buildTimes,
          tension: 0.3,
          pointRadius: 6,
        },
      ],
    },
  });
});
