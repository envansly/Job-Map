async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 39.7684, lng: -86.1581 }, // Center of Indiana
  });

  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS0-Ykz6E_azPMrbifCY0GleRJ43COt02J-qD7q-It8acqRGpxf-xy8unbVIwPPPyz5Pw96ehZvtYIu/pub?gid=0&single=true&output=csv");
  const data = await response.text();

  const rows = data.split("\n").slice(1); // skip header row

  for (const row of rows) {
    const cols = row.split(",");

    const workOrder = cols[14];       // Column O
    const projectType = cols[15];     // Column P
    const locationCount = cols[18];   // Column S
    const status = cols[30];          // Column AE
    const lat = parseFloat(cols[26]); // Column AA
    const lng = parseFloat(cols[27]); // Column AB

    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: workOrder,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-size: 14px; line-height: 1.4;">
            <strong>${workOrder}</strong><br>
            <small>${projectType}</small><br>
            <small>Locations: ${locationCount}</small><br>
            <small>Status: ${status}</small>
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
}

window.onload = initMap;