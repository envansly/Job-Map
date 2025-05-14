async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 39.7684, lng: -86.1581 }
  });

  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS0-Ykz6E_azPMrbifCY0GleRJ43COt02J-qD7q-It8acqRGpxf-xy8unbVIwPPPyz5Pw96ehZvtYIu/pub?gid=0&single=true&output=csv");
  const data = await response.text();
  const rows = data.split("\n").slice(1);

  const locationGroups = {};

  for (const row of rows) {
    const cols = row.split(",");

    const workOrder = cols[14];
    const projectType = cols[15];
    const locationCount = cols[18];
    const status = cols[30];
    const lat = parseFloat(cols[26]);
    const lng = parseFloat(cols[27]);

    if (!isNaN(lat) && !isNaN(lng)) {
      const key = `${lat},${lng}`;

      if (!locationGroups[key]) {
        locationGroups[key] = [];
      }

      locationGroups[key].push({
        workOrder,
        projectType,
        locationCount,
        status
      });
    }
  }

  for (const key in locationGroups) {
    const [lat, lng] = key.split(",").map(parseFloat);
    const jobs = locationGroups[key];

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: `Jobs at ${lat}, ${lng}`
    });

    const content = jobs.map(job => `
      <div style="padding: 6px 0; border-bottom: 1px solid #ccc;">
        <strong>${job.workOrder}</strong><br>
        <small>${job.projectType}</small><br>
        <small>Locations: ${job.locationCount}</small><br>
        <small>Status: ${job.status}</small>
      </div>
    `).join("");

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-size: 14px; line-height: 1.4; max-height: 300px; overflow-y: auto;">
          ${content}
        </div>
      `
    });

    marker.addListener("mouseover", () => {
      infoWindow.open(map, marker);
      google.maps.event.addListenerOnce(infoWindow, 'domready', function () {
        const closeButton = document.querySelector('.gm-ui-hover-effect');
        if (closeButton) closeButton.style.display = 'none';
      });
    });

    marker.addListener("mouseout", () => {
      infoWindow.close();
    });
  }
}

window.onload = initMap;
